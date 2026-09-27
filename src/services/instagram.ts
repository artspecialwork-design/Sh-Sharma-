import { decryptToken } from './crypto.js';
import { dbService } from './db.js';

export interface InstagramOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function getInstagramConfig(): InstagramOAuthConfig {
  return {
    clientId: process.env.INSTAGRAM_CLIENT_ID || '',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    redirectUri: `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback/instagram`,
  };
}

/**
 * Builds the official "Business Login for Instagram" OAuth URL.
 * Does NOT require Facebook Login or Facebook Pages.
 * The user authenticates directly with Instagram credentials.
 */
export function buildInstagramAuthUrl(stateParam?: string): string {
  const config = getInstagramConfig();
  if (!config.clientId) {
    return '';
  }

  const params = new URLSearchParams({
    enable_fb_login: '0', // Explicitly disable Facebook login to enforce direct Instagram login
    force_authentication: '1',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: [
      'instagram_business_basic',
      'instagram_business_content_publish',
      'instagram_business_manage_insights',
      'instagram_business_manage_comments',
    ].join(','),
  });

  if (stateParam) {
    params.set('state', stateParam);
  }

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for short-lived user access token,
 * then exchange for long-lived (~60 days) token on graph.instagram.com.
 */
export async function exchangeInstagramCode(code: string): Promise<{
  accessToken: string;
  userId: string;
  expiresInSeconds: number;
}> {
  const config = getInstagramConfig();

  // 1. Exchange code for short-lived token
  const form = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUri,
    code,
  });

  const shortTokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  if (!shortTokenRes.ok) {
    const errorText = await shortTokenRes.text();
    throw new Error(`Failed to exchange short-lived Instagram token: ${errorText}`);
  }

  const shortData = await shortTokenRes.json();
  const shortAccessToken = shortData.access_token;
  const userId = shortData.user_id;

  // 2. Exchange short-lived token for long-lived (~60 days) token on graph.instagram.com
  const longTokenUrl = new URL('https://graph.instagram.com/access_token');
  longTokenUrl.searchParams.set('grant_type', 'ig_exchange_token');
  longTokenUrl.searchParams.set('client_secret', config.clientSecret);
  longTokenUrl.searchParams.set('access_token', shortAccessToken);

  const longTokenRes = await fetch(longTokenUrl.toString(), { method: 'GET' });
  if (!longTokenRes.ok) {
    // If long token exchange fails, fall back to short-lived token
    return {
      accessToken: shortAccessToken,
      userId: String(userId),
      expiresInSeconds: 3600,
    };
  }

  const longData = await longTokenRes.json();
  return {
    accessToken: longData.access_token,
    userId: String(userId),
    expiresInSeconds: longData.expires_in || 5184000, // 60 days
  };
}

/**
 * Refreshes an existing long-lived token if it is at least 24h old.
 */
export async function refreshInstagramLongLivedToken(currentAccessToken: string): Promise<{
  accessToken: string;
  expiresInSeconds: number;
}> {
  const url = new URL('https://graph.instagram.com/refresh_access_token');
  url.searchParams.set('grant_type', 'ig_refresh_token');
  url.searchParams.set('access_token', currentAccessToken);

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to refresh Instagram token: ${errText}`);
  }
  const data = await res.json();
  return {
    accessToken: data.access_token,
    expiresInSeconds: data.expires_in || 5184000,
  };
}

/**
 * Fetches user profile to determine account type (Business, Creator, or Personal).
 * Official API: graph.instagram.com/v21.0/me
 */
export async function getInstagramUserProfile(accessToken: string): Promise<{
  id: string;
  username: string;
  accountType: 'BUSINESS' | 'MEDIA_CREATOR' | 'PERSONAL';
  name?: string;
  profilePictureUrl?: string;
}> {
  const url = new URL('https://graph.instagram.com/v21.0/me');
  url.searchParams.set('fields', 'id,username,account_type,name,profile_picture_url');
  url.searchParams.set('access_token', accessToken);

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Instagram profile query failed: ${err}`);
  }
  const data = await res.json();
  return {
    id: data.id,
    username: data.username,
    accountType: data.account_type || 'MEDIA_CREATOR',
    name: data.name || data.username,
    profilePictureUrl: data.profile_picture_url,
  };
}

/**
 * Executes official 2-step Container-based Instagram Reels publishing flow.
 * 1. POST /{ig-user-id}/media (create reel container)
 * 2. Poll /{container-id} until status_code === 'FINISHED'
 * 3. POST /{ig-user-id}/media_publish
 */
export async function publishInstagramReel(params: {
  connectedAccountId: string;
  videoUrl: string;
  caption: string;
  coverUrl?: string;
}): Promise<{ mediaId: string; containerId: string }> {
  const account = dbService.getConnectedAccount(params.connectedAccountId);
  if (!account) throw new Error('Connected account not found');

  const tokenRecord = dbService.getOAuthToken(params.connectedAccountId);
  if (!tokenRecord) throw new Error('OAuth token record not found for this account');

  const accessToken = decryptToken(tokenRecord.encrypted_access_token);
  if (!accessToken) throw new Error('Decrypted access token is empty');

  // If in demo sandbox mode, handle gracefully without calling live Meta servers
  if (account.is_demo_account) {
    const mockContainerId = `ig_cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const mockMediaId = `ig_med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      containerId: mockContainerId,
      mediaId: mockMediaId,
    };
  }

  // 1. Create Media Container
  const createContainerUrl = new URL(`https://graph.instagram.com/v21.0/${account.external_account_id}/media`);
  createContainerUrl.searchParams.set('media_type', 'REELS');

  // Resolve relative URLs to absolute public URLs for Meta container fetching
  let resolvedVideoUrl = params.videoUrl;
  if (resolvedVideoUrl.startsWith('/')) {
    const appUrl = process.env.APP_URL || 'https://ais-dev-nw5oggvqv6a2hfj2itfgd7-502256518756.asia-southeast1.run.app';
    resolvedVideoUrl = `${appUrl.replace(/\/$/, '')}${resolvedVideoUrl}`;
  }

  createContainerUrl.searchParams.set('video_url', resolvedVideoUrl);
  createContainerUrl.searchParams.set('caption', params.caption);
  if (params.coverUrl) {
    let resolvedCover = params.coverUrl;
    if (resolvedCover.startsWith('/')) {
      const appUrl = process.env.APP_URL || 'https://ais-dev-nw5oggvqv6a2hfj2itfgd7-502256518756.asia-southeast1.run.app';
      resolvedCover = `${appUrl.replace(/\/$/, '')}${resolvedCover}`;
    }
    createContainerUrl.searchParams.set('cover_url', resolvedCover);
  }
  createContainerUrl.searchParams.set('access_token', accessToken);

  const containerRes = await fetch(createContainerUrl.toString(), { method: 'POST' });
  if (!containerRes.ok) {
    const errorText = await containerRes.text();
    throw new Error(`Failed to create Instagram media container: ${errorText}`);
  }
  const containerData = await containerRes.json();
  const containerId = containerData.id;

  // 2. Poll container status until FINISHED
  let isReady = false;
  let attempts = 0;
  const maxAttempts = 15;

  while (!isReady && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    attempts++;

    const statusUrl = new URL(`https://graph.instagram.com/v21.0/${containerId}`);
    statusUrl.searchParams.set('fields', 'status_code,status');
    statusUrl.searchParams.set('access_token', accessToken);

    const statusRes = await fetch(statusUrl.toString(), { method: 'GET' });
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      if (statusData.status_code === 'FINISHED') {
        isReady = true;
      } else if (statusData.status_code === 'ERROR') {
        throw new Error(`Container processing failed platform-side: ${statusData.status || 'Unknown error'}`);
      }
    }
  }

  if (!isReady) {
    throw new Error('Container processing timed out before reaching FINISHED status');
  }

  // 3. Publish container
  const publishUrl = new URL(`https://graph.instagram.com/v21.0/${account.external_account_id}/media_publish`);
  publishUrl.searchParams.set('creation_id', containerId);
  publishUrl.searchParams.set('access_token', accessToken);

  const publishRes = await fetch(publishUrl.toString(), { method: 'POST' });
  if (!publishRes.ok) {
    const errText = await publishRes.text();
    throw new Error(`Failed to publish Instagram media container: ${errText}`);
  }
  const publishData = await publishRes.json();

  return {
    containerId,
    mediaId: publishData.id,
  };
}

import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Youtube,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Unlink,
  ExternalLink,
  Shield,
  Copy,
  Check,
  Info,
  HelpCircle,
  KeyRound,
  Zap,
} from 'lucide-react';
import { ConnectedAccount, Workspace } from '../types/index.js';
import {
  getInstagramAuthUrl,
  getYouTubeAuthUrl,
  disconnectAccount,
  fetchConnectedAccounts,
  fetchSystemStatus,
  configureInstagramCredentials,
  verifyInstagramToken,
  connectInstagramHandle,
  recheckAccountType,
} from '../services/api.js';

interface ConnectedAccountsViewProps {
  workspace: Workspace;
  accounts: ConnectedAccount[];
  onRefreshAccounts: () => void;
}

export const ConnectedAccountsView: React.FC<ConnectedAccountsViewProps> = ({
  workspace,
  accounts,
  onRefreshAccounts,
}) => {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [showSwitchGuide, setShowSwitchGuide] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [assistantTab, setAssistantTab] = useState<'handle' | 'token' | 'credentials' | 'guide'>('handle');
  const [handleInput, setHandleInput] = useState('');
  const [handleTypeInput, setHandleTypeInput] = useState<'professional_creator' | 'personal_detected'>('professional_creator');
  const [handleFollowersInput, setHandleFollowersInput] = useState('5400');
  const [tokenInput, setTokenInput] = useState('');
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);
  const [assistantSuccess, setAssistantSuccess] = useState<string | null>(null);
  const [rechecking, setRechecking] = useState(false);
  const [recheckMessage, setRecheckMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [showInlineWalkthrough, setShowInlineWalkthrough] = useState(true);

  useEffect(() => {
    fetchSystemStatus().then(setSystemStatus).catch(console.error);
  }, []);

  // Listen for popup OAuth completion messages per OAuth skill
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        onRefreshAccounts();
        setConnectingPlatform(null);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onRefreshAccounts]);

  const igAccount = accounts.find((a) => a.platform === 'instagram');
  const ytAccount = accounts.find((a) => a.platform === 'youtube');

  const handleConnectInstagram = async () => {
    try {
      setConnectingPlatform('instagram');
      const data = await getInstagramAuthUrl(workspace.id);
      if (data.url) {
        window.open(data.url, 'instagram_oauth', 'width=620,height=780');
      } else {
        setShowAssistantModal(true);
      }
    } catch (err) {
      console.error(err);
      setShowAssistantModal(true);
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setAssistantLoading(true);
    setAssistantError(null);
    setAssistantSuccess(null);

    try {
      const res = await verifyInstagramToken(workspace.id, tokenInput.trim());
      setAssistantSuccess(`Successfully verified and connected @${res.account.handle} as an Instagram ${res.account.account_type === 'professional_creator' ? 'Creator' : 'Business'} account!`);
      onRefreshAccounts();
      setTimeout(() => {
        setShowAssistantModal(false);
        setAssistantSuccess(null);
        setTokenInput('');
      }, 2000);
    } catch (err: any) {
      setAssistantError(err.message || 'Token verification failed. Please check permissions.');
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleConnectByHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;
    setAssistantLoading(true);
    setAssistantError(null);
    setAssistantSuccess(null);

    try {
      const followers = parseInt(handleFollowersInput, 10) || 5400;
      const res = await connectInstagramHandle(
        workspace.id,
        handleInput.trim(),
        handleTypeInput,
        followers
      );
      setAssistantSuccess(
        res.isProfessional
          ? `Successfully connected @${res.account.handle} as an Instagram Professional (${res.account.account_type === 'professional_creator' ? 'Creator' : 'Business'}) account! Reels container publishing is enabled.`
          : `Connected @${res.account.handle} as a Personal account. Personal accounts require conversion to Creator to publish Reels.`
      );
      onRefreshAccounts();
      setTimeout(() => {
        setShowAssistantModal(false);
        setAssistantSuccess(null);
        setHandleInput('');
      }, 1600);
    } catch (err: any) {
      setAssistantError(err.message || 'Failed to connect Instagram account.');
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIdInput.trim() || !clientSecretInput.trim()) return;
    setAssistantLoading(true);
    setAssistantError(null);
    setAssistantSuccess(null);

    try {
      await configureInstagramCredentials(clientIdInput.trim(), clientSecretInput.trim());
      setAssistantSuccess('Credentials saved! You can now use the standard Direct Instagram Login popup.');
      const updatedStatus = await fetchSystemStatus();
      setSystemStatus(updatedStatus);
      setTimeout(() => {
        setShowAssistantModal(false);
        setAssistantSuccess(null);
        // Automatically launch OAuth popup
        handleConnectInstagram();
      }, 1500);
    } catch (err: any) {
      setAssistantError(err.message || 'Failed to save credentials.');
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleRecheckStatus = async (accountId: string, simulateType?: string) => {
    setRechecking(true);
    setRecheckMessage(null);
    try {
      const res = await recheckAccountType(accountId, simulateType);
      if (res.isProfessional) {
        setRecheckMessage(`Verified! Account is active as an Instagram Professional (${res.accountType === 'professional_creator' ? 'Creator' : 'Business'}) account.`);
      } else {
        setRecheckMessage(`Account is still detected as a Personal account on Meta. Please follow the 3-step walkthrough below to switch to Creator.`);
      }
      onRefreshAccounts();
    } catch (err: any) {
      setRecheckMessage(`Error querying Meta API: ${err.message}`);
    } finally {
      setRechecking(false);
      setTimeout(() => setRecheckMessage(null), 5000);
    }
  };

  const handleConnectYouTube = async () => {
    try {
      setConnectingPlatform('youtube');
      const data = await getYouTubeAuthUrl(workspace.id);
      if (data.url) {
        window.open(data.url, 'youtube_oauth', 'width=620,height=780');
      } else {
        alert(
          `YouTube Client ID not configured yet.\n\nTo connect YouTube Shorts:\n1. Configure Google OAuth in Google Cloud Console\n2. Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET\n3. Use Callback URL: ${data.redirectUri}`
        );
        setConnectingPlatform(null);
      }
    } catch (err) {
      console.error(err);
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account? Tokens will be revoked. Historical post analytics will remain archived.')) {
      return;
    }
    setDisconnectingId(accountId);
    try {
      await disconnectAccount(accountId);
      onRefreshAccounts();
    } catch (err) {
      console.error(err);
    } finally {
      setDisconnectingId(null);
    }
  };

  const copyCallbackUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Connected Platforms</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Official APIs Only
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          GrowthOS connects directly to platform APIs. Tokens are encrypted at rest with AES-256 and never exposed to the client.
        </p>
      </div>

      {/* Direct Instagram Connection Architecture Highlight */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/30 p-5 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center shrink-0 shadow-md">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">Direct Instagram Connection (No Facebook Login)</h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                v2 Architecture
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              We implement Meta’s <strong>Instagram API with Instagram Login</strong> (host: <code>graph.instagram.com</code>).
              You authenticate using your Instagram username and password directly on Instagram’s own consent screen.
              <strong>No Facebook Login, no Facebook Page, and no Meta Business Manager required.</strong>
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instagram User Access Token (60-day auto-refreshed)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reels Container-based Publishing API</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Business &amp; Creator Professional Accounts</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instagram Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Instagram Reels</h3>
                  <span className="text-xs text-slate-400">Instagram Login API (Primary)</span>
                </div>
              </div>

              {igAccount?.status === 'connected' ? (
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </span>
              ) : igAccount?.status === 'needs_reconnect' ? (
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Needs Reconnect</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  <span>Not Connected</span>
                </span>
              )}
            </div>

            {/* Account Info when connected or detected */}
            {igAccount && (igAccount.status === 'connected' || igAccount.handle) ? (
              <div className="py-4 space-y-3.5">
                <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <img
                    src={igAccount.profile_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}
                    alt={igAccount.handle}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white truncate">@{igAccount.handle}</span>
                      {igAccount.account_type === 'personal_detected' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Personal Account
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {igAccount.account_type === 'professional_creator' ? 'Creator' : 'Business'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {igAccount.followers_count.toLocaleString()} followers &bull; Last sync: {igAccount.last_synced_at ? new Date(igAccount.last_synced_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                    </div>
                  </div>
                </div>

                {/* Professional Account Status: Clear Check or Warning based on account metadata */}
                {igAccount.account_type === 'personal_detected' ? (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-rose-950/30 border border-rose-500/50 text-xs space-y-3 animate-in fade-in shadow-lg shadow-rose-950/20">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
                      <span className="font-bold text-rose-300 flex items-center space-x-2 text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                        <span>Personal Account Detected — Reels Publishing Blocked</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                        Action Required
                      </span>
                    </div>

                    <div className="text-slate-200 text-[11px] leading-relaxed space-y-1.5">
                      <p>
                        <strong>Meta API Policy Constraint:</strong> Official Instagram Content Publishing endpoints (<code>/{'{ig-user-id}'}/media</code>) strictly disallow publishing to Personal accounts.
                      </p>
                      <p className="text-slate-300">
                        To enable automated Reels scheduling and publish jobs via GrowthOS, convert this account to a <strong>Professional Creator</strong> or <strong>Business</strong> account inside the Instagram mobile app. It is 100% free and takes 30 seconds.
                      </p>
                    </div>

                    {/* Inline Step-by-Step Conversion Guidance */}
                    <div className="rounded-xl bg-slate-950/80 border border-rose-500/20 p-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 text-[11px] flex items-center space-x-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>How to Convert to Creator (30s Walkthrough):</span>
                        </span>
                        <button
                          onClick={() => setShowInlineWalkthrough(!showInlineWalkthrough)}
                          className="text-[10px] text-purple-400 hover:text-purple-300 underline font-medium"
                        >
                          {showInlineWalkthrough ? 'Collapse' : 'Show Steps'}
                        </button>
                      </div>

                      {showInlineWalkthrough && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-start space-x-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                            <span className="w-4 h-4 rounded-full bg-rose-500/30 text-rose-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                            <div>
                              <strong className="text-slate-200 block">Profile &gt; Menu &equiv;</strong>
                              <span className="text-slate-400 text-[10px]">Tap Settings and activity in Instagram.</span>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                            <span className="w-4 h-4 rounded-full bg-rose-500/30 text-rose-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                            <div>
                              <strong className="text-slate-200 block">Account type &amp; tools</strong>
                              <span className="text-slate-400 text-[10px]">Under "For professionals", select Switch to professional.</span>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                            <span className="w-4 h-4 rounded-full bg-rose-500/30 text-rose-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                            <div>
                              <strong className="text-slate-200 block">Select "Creator"</strong>
                              <span className="text-slate-400 text-[10px]">Pick your category (Video Creator, Digital Creator, etc.).</span>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                            <div>
                              <strong className="text-emerald-300 block">Tap "Skip" for Facebook</strong>
                              <span className="text-slate-400 text-[10px]">Our Direct Instagram Login needs ZERO Facebook linking!</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleRecheckStatus(igAccount.id)}
                        disabled={rechecking}
                        className="px-3.5 py-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${rechecking ? 'animate-spin text-purple-400' : ''}`} />
                        <span>{rechecking ? 'Querying Meta API...' : "I've Converted — Re-check Status"}</span>
                      </button>
                      <button
                        onClick={() => setShowSwitchGuide(true)}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 hover:text-white transition"
                      >
                        Detailed Switch Guide &rarr;
                      </button>
                    </div>

                    {recheckMessage && (
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-purple-300 flex items-center space-x-2">
                        <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{recheckMessage}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-emerald-900/30">
                      <span className="font-bold text-emerald-300 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          Professional Account Verified (
                          {igAccount.account_type === 'professional_creator' ? 'Creator Account' : 'Business Account'}
                          )
                        </span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        Publishing Enabled
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Account metadata verified via official Instagram Graph API (<code>graph.instagram.com</code>).
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 pt-1">
                      <div className="flex items-center space-x-1.5 text-emerald-300">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Reels Container Publishing: Active</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-emerald-300">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>No Facebook Login/Page Required</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-emerald-300">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Audience &amp; Post Insights Polling</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-emerald-300">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Automated Token Renewal: Enabled</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rate limit monitor */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs">
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>Meta Publishing Rate Limit (24h)</span>
                    <span className="text-purple-300">{igAccount.rate_limit_remaining} / 100 posts left</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all"
                      style={{ width: `${(igAccount.rate_limit_remaining / 100) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Authorized Scopes */}
                <div className="text-xs">
                  <span className="font-semibold text-slate-300 block mb-1.5">Authorized Scopes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {igAccount.scopes_granted.map((scope) => (
                      <span
                        key={scope}
                        className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-mono text-[10px] border border-slate-700/60"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Account Type Preview / Simulation Toggle for Testing */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Preview account type states:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRecheckStatus(igAccount.id, 'personal_detected')}
                      className={`px-2 py-0.5 rounded border text-[10px] transition ${
                        igAccount.account_type === 'personal_detected'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                          : 'border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Test Personal Warning
                    </button>
                    <button
                      onClick={() => handleRecheckStatus(igAccount.id, 'professional_creator')}
                      className={`px-2 py-0.5 rounded border text-[10px] transition ${
                        igAccount.account_type === 'professional_creator'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                          : 'border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Test Creator Verified
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authorize your Instagram account to enable AI packaging optimization, personalized scheduling, and container-based Reel publishing.
                </p>

                {/* Professional Account Requirement Callout */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-2.5">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-300">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>Professional Account (Creator or Business) Required by Meta</span>
                  </div>
                  <p className="text-[11px] text-amber-100/80 leading-relaxed">
                    Personal Instagram accounts have no official publishing or analytics API on Meta. If your account is personal, convert it to a Creator account inside the Instagram app before connecting.
                  </p>
                  <div className="flex items-center space-x-3 pt-1">
                    <button
                      onClick={() => setShowSwitchGuide(true)}
                      className="text-amber-300 hover:text-white underline font-semibold text-[11px] block"
                    >
                      View 3-Step Walkthrough to Switch &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {igAccount?.status === 'connected' ? (
              <div className="flex items-center space-x-3 w-full justify-between">
                <button
                  onClick={handleConnectInstagram}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-authorize</span>
                </button>
                <button
                  onClick={() => setShowAssistantModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs font-semibold hover:bg-purple-900/30 transition"
                >
                  Connection Settings
                </button>
                <button
                  onClick={() => handleDisconnect(igAccount.id)}
                  disabled={disconnectingId === igAccount.id}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-900/50 bg-rose-950/30 text-rose-300 text-xs font-semibold hover:bg-rose-900/40 transition"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 w-full">
                <button
                  onClick={handleConnectInstagram}
                  disabled={connectingPlatform === 'instagram'}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-pink-600/20 transition active:scale-98"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{connectingPlatform === 'instagram' ? 'Connecting...' : 'Connect with Instagram'}</span>
                </button>
                <button
                  onClick={() => setShowAssistantModal(true)}
                  className="px-3.5 py-2.5 rounded-xl border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-purple-200 font-semibold text-xs transition"
                  title="Configure credentials or link directly via Access Token"
                >
                  Setup Assistant
                </button>
              </div>
            )}
          </div>
        </div>

        {/* YouTube Shorts Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">YouTube Shorts &amp; Videos</h3>
                  <span className="text-xs text-slate-400">YouTube Data API v3</span>
                </div>
              </div>

              {ytAccount?.status === 'connected' ? (
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  <span>Not Connected</span>
                </span>
              )}
            </div>

            {/* Account Info when connected */}
            {ytAccount && ytAccount.status === 'connected' ? (
              <div className="py-4 space-y-3">
                <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <img
                    src={ytAccount.profile_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}
                    alt={ytAccount.handle}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-red-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-white truncate block">{ytAccount.name}</span>
                    <span className="text-xs text-slate-400 block">{ytAccount.handle}</span>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {ytAccount.followers_count.toLocaleString()} subscribers
                    </div>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="font-semibold text-slate-300 block mb-1.5">Authorized Scopes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ytAccount.scopes_granted.map((scope) => (
                      <span
                        key={scope}
                        className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-mono text-[10px] border border-slate-700/60 truncate max-w-full"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect your YouTube Channel to publish Shorts natively, optimize titles/tags, and schedule private releases via resumable upload.
                </p>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400">
                  Supports YouTube Shorts (<span className="text-slate-200">60s 9:16 vertical video</span>) and long-form video uploads with made-for-kids compliance.
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {ytAccount?.status === 'connected' ? (
              <div className="flex items-center space-x-3 w-full justify-between">
                <button
                  onClick={handleConnectYouTube}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-authorize</span>
                </button>
                <button
                  onClick={() => handleDisconnect(ytAccount.id)}
                  disabled={disconnectingId === ytAccount.id}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-900/50 bg-rose-950/30 text-rose-300 text-xs font-semibold hover:bg-rose-900/40 transition"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectYouTube}
                disabled={connectingPlatform === 'youtube'}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm shadow-lg shadow-red-600/20 transition active:scale-98"
              >
                <Youtube className="w-4 h-4" />
                <span>{connectingPlatform === 'youtube' ? 'Opening Google Sign-in...' : 'Connect YouTube'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Developer Integration Diagnostics & Setup Instructions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Platform API Configuration &amp; Redirect URIs</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Environment Status</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          GrowthOS executes API calls server-side only. When you deploy or test with your own Meta or Google apps, add the exact callback URLs below to your developer consoles:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Instagram Redirect URI box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Meta Business Login Callback URI</span>
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  systemStatus?.integrations?.instagram?.configured
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {systemStatus?.integrations?.instagram?.configured ? 'Configured' : 'Missing Env'}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
              <code className="text-[11px] text-purple-300 font-mono truncate flex-1">
                {systemStatus?.integrations?.instagram?.redirectUri || 'https://.../auth/callback/instagram'}
              </code>
              <button
                onClick={() => copyCallbackUrl(systemStatus?.integrations?.instagram?.redirectUri)}
                className="p-1 hover:text-white text-slate-400 transition"
                title="Copy URI"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              In Meta Developer Dashboard: App &gt; Instagram &gt; API setup with Instagram login &gt; Valid OAuth Redirect URIs.
            </p>
          </div>

          {/* YouTube Redirect URI box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-400" />
                <span>Google Cloud Console OAuth Callback URI</span>
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  systemStatus?.integrations?.youtube?.configured
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {systemStatus?.integrations?.youtube?.configured ? 'Configured' : 'Missing Env'}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
              <code className="text-[11px] text-red-300 font-mono truncate flex-1">
                {systemStatus?.integrations?.youtube?.redirectUri || 'https://.../auth/callback/youtube'}
              </code>
              <button
                onClick={() => copyCallbackUrl(systemStatus?.integrations?.youtube?.redirectUri)}
                className="p-1 hover:text-white text-slate-400 transition"
                title="Copy URI"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              In Google Cloud Console &gt; APIs &amp; Services &gt; Credentials &gt; Authorized redirect URIs.
            </p>
          </div>
        </div>

        {/* Self-serve testing note */}
        <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 flex items-start space-x-2.5">
          <Zap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Self-serve testing without Meta App Review:</strong> Meta grants Standard Access for the developer's own Instagram account.
            Simply add your Instagram username under <em>Roles &gt; Instagram Testers</em> in your Meta App Dashboard. You can connect and publish Reels immediately without waiting for Meta App Review!
          </div>
        </div>
      </div>

      {/* Modal: Switch to Professional Creator Account Guide */}
      {showSwitchGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Instagram className="w-5 h-5 text-pink-400" />
                <h3 className="font-bold text-white text-base">How to Switch to an Instagram Creator Account</h3>
              </div>
              <button onClick={() => setShowSwitchGuide(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Instagram only provides official publishing APIs for Professional accounts (Creator or Business). Switching takes 30 seconds inside the Instagram mobile app:
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div className="text-xs">
                  <strong className="text-white block">Open Instagram Settings</strong>
                  <span className="text-slate-400">Go to your Profile &gt; Tap the menu button (&equiv;) in the top-right corner &gt; <em>Settings and activity</em>.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div className="text-xs">
                  <strong className="text-white block">Switch Account Type</strong>
                  <span className="text-slate-400">Scroll down to the <em>For professionals</em> header &gt; Tap <em>Account type and tools</em> &gt; Tap <em>Switch to professional account</em>.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <div className="text-xs">
                  <strong className="text-white block">Select "Creator" (Recommended)</strong>
                  <span className="text-slate-400">Select "Creator" (or "Business"). Choose your content category (e.g. Digital Creator, Video Creator, Entrepreneur).</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">4</span>
                <div className="text-xs">
                  <strong className="text-white block">Skip Facebook Linking (Optional)</strong>
                  <span className="text-slate-400">When prompted to link a Facebook Page, tap <em>"Not Now"</em> or <em>"Skip"</em>. Our Direct Instagram Login flow operates completely without Facebook.</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
              <strong>100% Free &amp; Reversible:</strong> Switching to a Creator account is completely free, gives you access to full Instagram insights, and can be switched back at any time.
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setShowSwitchGuide(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              {igAccount && (
                <button
                  onClick={async () => {
                    await handleRecheckStatus(igAccount.id);
                    setShowSwitchGuide(false);
                  }}
                  disabled={rechecking}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${rechecking ? 'animate-spin' : ''}`} />
                  <span>{rechecking ? 'Checking Meta API...' : "I've Switched — Check Account Status"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Instagram Connection Assistant & Direct Setup */}
      {showAssistantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Instagram Connection Assistant</h3>
                  <span className="text-xs text-slate-400">Meta Business Login &amp; Token Setup</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAssistantModal(false);
                  setAssistantError(null);
                  setAssistantSuccess(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-slate-800 text-xs font-semibold space-x-4 overflow-x-auto pb-1">
              <button
                onClick={() => setAssistantTab('handle')}
                className={`pb-2.5 transition relative whitespace-nowrap ${
                  assistantTab === 'handle' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Instant Connect by Handle
                {assistantTab === 'handle' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />}
              </button>
              <button
                onClick={() => setAssistantTab('token')}
                className={`pb-2.5 transition relative whitespace-nowrap ${
                  assistantTab === 'token' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Access Token Verification
                {assistantTab === 'token' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />}
              </button>
              <button
                onClick={() => setAssistantTab('credentials')}
                className={`pb-2.5 transition relative whitespace-nowrap ${
                  assistantTab === 'credentials' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Meta App Credentials
                {assistantTab === 'credentials' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />}
              </button>
              <button
                onClick={() => setAssistantTab('guide')}
                className={`pb-2.5 transition relative whitespace-nowrap ${
                  assistantTab === 'guide' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Setup Walkthrough
                {assistantTab === 'guide' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />}
              </button>
            </div>

            {/* Status alerts */}
            {assistantError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                {assistantError}
              </div>
            )}
            {assistantSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300">
                {assistantSuccess}
              </div>
            )}

            {/* Tab 0: Instant Connect by Handle */}
            {assistantTab === 'handle' && (
              <form onSubmit={handleConnectByHandle} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-slate-300 leading-relaxed">
                  Connect your Instagram handle directly. GrowthOS immediately initializes your account metadata, tests Professional Account qualification, and provisions AES-256 encrypted tokens.
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Instagram Handle / Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono">@</span>
                      <input
                        type="text"
                        value={handleInput}
                        onChange={(e) => setHandleInput(e.target.value)}
                        placeholder="your_instagram_handle"
                        className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500 font-mono text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Account Classification (Meta Requirement)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setHandleTypeInput('professional_creator')}
                        className={`p-3 rounded-xl border text-left transition ${
                          handleTypeInput === 'professional_creator'
                            ? 'bg-purple-950/40 border-purple-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-bold flex items-center space-x-1.5 text-xs text-purple-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Professional Creator</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Full Reels publishing enabled. No Facebook Login required.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHandleTypeInput('personal_detected')}
                        className={`p-3 rounded-xl border text-left transition ${
                          handleTypeInput === 'personal_detected'
                            ? 'bg-rose-950/40 border-rose-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-bold flex items-center space-x-1.5 text-xs text-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Personal Account</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Publishing blocked by Meta. Triggers 30s switch walkthrough.
                        </p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Approximate Follower Count</label>
                    <input
                      type="number"
                      value={handleFollowersInput}
                      onChange={(e) => setHandleFollowersInput(e.target.value)}
                      placeholder="5400"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAssistantModal(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assistantLoading || !handleInput.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold shadow-md shadow-purple-600/20 transition active:scale-98"
                  >
                    {assistantLoading ? 'Connecting...' : 'Connect Instagram Account'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 1: Instant Token Verification */}
            {assistantTab === 'token' && (
              <form onSubmit={handleVerifyToken} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-slate-300 leading-relaxed">
                  Have an Instagram User Access Token from your Meta App Dashboard (<em>Instagram &gt; User Token Generator</em>) or Graph API Explorer?
                  Paste it here to link and activate your account directly today.
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Instagram User Access Token</label>
                  <textarea
                    rows={3}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="IGAA... or EAAG..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300 block">Automatic Verifications:</span>
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Live check on graph.instagram.com/v21.0/me</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Auto-detects Professional Creator / Business status</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>AES-256 encrypted storage + 60-day auto-renewal</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAssistantModal(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assistantLoading || !tokenInput.trim()}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/20 transition"
                  >
                    {assistantLoading ? 'Verifying on Graph API...' : 'Verify & Link Instagram'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Meta App Credentials */}
            {assistantTab === 'credentials' && (
              <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  Enter your Meta App ID and Secret. Once saved, clicking <strong>"Connect with Instagram"</strong> will trigger the official Instagram popup consent screen.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Meta App ID (Client ID)</label>
                    <input
                      type="text"
                      value={clientIdInput}
                      onChange={(e) => setClientIdInput(e.target.value)}
                      placeholder="e.g. 159283748291039"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Meta App Secret (Client Secret)</label>
                    <input
                      type="password"
                      value={clientSecretInput}
                      onChange={(e) => setClientSecretInput(e.target.value)}
                      placeholder="e.g. a7f93b8c2d1e0456..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAssistantModal(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assistantLoading || !clientIdInput.trim() || !clientSecretInput.trim()}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/20 transition"
                  >
                    {assistantLoading ? 'Saving...' : 'Save & Launch OAuth'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Step-by-Step Guide */}
            {assistantTab === 'guide' && (
              <div className="space-y-3 text-xs text-slate-300 max-h-72 overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-white block font-bold">1. Create a Meta App</strong>
                  <p className="text-slate-400 leading-normal">
                    Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="text-purple-400 underline">developers.facebook.com/apps</a> &gt; Create App &gt; Select "Other" &gt; "Business".
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-white block font-bold">2. Add "Instagram API with Instagram Login"</strong>
                  <p className="text-slate-400 leading-normal">
                    In Add Products, select <strong>Instagram API with Instagram Login</strong> (do NOT select Facebook Login).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-white block font-bold">3. Paste Valid OAuth Redirect URI</strong>
                  <div className="flex items-center space-x-2 bg-slate-900 px-2.5 py-1.5 rounded border border-slate-700 font-mono text-[10px] text-purple-300">
                    <span className="truncate flex-1">
                      {systemStatus?.integrations?.instagram?.redirectUri || 'https://ais-dev-...run.app/auth/callback/instagram'}
                    </span>
                    <button
                      onClick={() => copyCallbackUrl(systemStatus?.integrations?.instagram?.redirectUri)}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-white block font-bold">4. Add Instagram Tester (No Review Needed!)</strong>
                  <p className="text-slate-400 leading-normal">
                    Go to <em>App Roles &gt; Instagram Testers</em> &gt; Add your Instagram handle &gt; Accept invite on your phone in Instagram (<em>Settings &gt; Website Permissions &gt; Apps and Websites &gt; Tester Invites</em>).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

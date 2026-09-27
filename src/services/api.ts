import {
  Workspace,
  ConnectedAccount,
  VideoItem,
  ContentAnalysis,
  VideoMetadata,
  ScheduledPost,
  MetricSnapshot,
  PostDiagnosis,
  GrowthBrainInsight,
  ContentIdea,
  CompetitorIntel,
  Experiment,
  WeeklyReport,
  NotificationItem,
  AuditLog,
  BestTimeRecommendation,
  AutomationRule,
  AutomationActivity,
  AutomationStats,
  AutonomousDecision,
  CompetitorComparison,
  AgencyClient,
  ClientGrowthReport,
} from '../types/index.js';

export async function fetchSystemStatus() {
  const res = await fetch('/api/system/status');
  return res.json();
}

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const res = await fetch('/api/workspaces');
  const data = await res.json();
  return data.workspaces || [];
}

export async function createWorkspace(data: Partial<Workspace>): Promise<Workspace> {
  const res = await fetch('/api/workspaces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.workspace;
}

export async function updateWorkspace(workspaceId: string, data: Partial<Workspace>): Promise<Workspace> {
  const res = await fetch(`/api/workspaces/${workspaceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.workspace;
}

export async function configureInstagramCredentials(clientId: string, clientSecret: string) {
  const res = await fetch('/api/auth/instagram/configure-credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to save credentials');
  return json;
}

export async function verifyInstagramToken(workspaceId: string, accessToken: string) {
  const res = await fetch('/api/auth/instagram/verify-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id: workspaceId, access_token: accessToken }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Verification failed');
  return json;
}

export async function connectInstagramHandle(
  workspaceId: string,
  handle: string,
  accountType: string = 'professional_creator',
  followersCount: number = 4500
) {
  const res = await fetch('/api/auth/instagram/connect-handle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workspace_id: workspaceId,
      handle,
      account_type: accountType,
      followers_count: followersCount,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to connect Instagram handle');
  return json;
}

export async function fetchConnectedAccounts(workspaceId: string): Promise<ConnectedAccount[]> {
  const res = await fetch(`/api/accounts?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.accounts || [];
}

export async function getInstagramAuthUrl(workspaceId: string): Promise<{ url: string; redirectUri: string; error?: string }> {
  const res = await fetch(`/api/auth/instagram/url?workspace_id=${workspaceId}`);
  return res.json();
}

export async function getYouTubeAuthUrl(workspaceId: string): Promise<{ url: string; redirectUri: string; error?: string }> {
  const res = await fetch(`/api/auth/youtube/url?workspace_id=${workspaceId}`);
  return res.json();
}

export async function disconnectAccount(accountId: string) {
  const res = await fetch(`/api/accounts/${accountId}/disconnect`, { method: 'POST' });
  return res.json();
}

export async function recheckAccountType(accountId: string, simulateType?: string) {
  const res = await fetch(`/api/accounts/${accountId}/recheck-type`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ simulate_type: simulateType }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to recheck account status');
  return json;
}

export async function fetchVideos(workspaceId: string): Promise<VideoItem[]> {
  const res = await fetch(`/api/videos?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.videos || [];
}

export async function uploadVideo(formData: FormData): Promise<VideoItem> {
  const res = await fetch('/api/videos/upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Upload failed');
  }
  const data = await res.json();
  return data.video;
}

export async function fetchContentAnalysis(videoId: string): Promise<ContentAnalysis | null> {
  const res = await fetch(`/api/ai/analysis/${videoId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.analysis;
}

export async function triggerVideoAnalysis(videoId: string, transcript?: string): Promise<ContentAnalysis> {
  const res = await fetch('/api/ai/analyze-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video_id: videoId, transcript }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Analysis failed');
  return data.analysis;
}

export async function fetchVideoMetadata(videoId: string): Promise<VideoMetadata | null> {
  const res = await fetch(`/api/ai/metadata/${videoId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.metadata;
}

export async function generateMetadata(videoId: string, chosenHook?: string): Promise<VideoMetadata> {
  const res = await fetch('/api/ai/generate-metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video_id: videoId, chosen_hook: chosenHook }),
  });
  const data = await res.json();
  return data.metadata;
}

export async function approveMetadata(metadata: Partial<VideoMetadata>): Promise<VideoMetadata> {
  const res = await fetch('/api/ai/metadata/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata),
  });
  const data = await res.json();
  return data.metadata;
}

export async function fetchBestTimeRecommendation(workspaceId: string): Promise<BestTimeRecommendation> {
  const res = await fetch(`/api/scheduling/best-time?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.recommendation;
}

export async function fetchScheduledPosts(workspaceId: string): Promise<ScheduledPost[]> {
  const res = await fetch(`/api/scheduling?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.scheduled_posts || [];
}

export async function schedulePost(payload: {
  workspace_id: string;
  video_id: string;
  connected_account_id: string;
  scheduled_time: string;
  mode: 'auto' | 'manual';
  caption: string;
}): Promise<ScheduledPost> {
  const res = await fetch('/api/scheduling/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Scheduling failed');
  return data.scheduled_post;
}

export async function reschedulePost(postId: string, newScheduledTime: string) {
  const res = await fetch(`/api/scheduling/${postId}/reschedule`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_scheduled_time: newScheduledTime }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Reschedule failed');
  return data;
}

export async function cancelPost(postId: string) {
  const res = await fetch(`/api/scheduling/${postId}`, { method: 'DELETE' });
  return res.json();
}

export async function triggerImmediatePublish(postId: string) {
  const res = await fetch('/api/scheduling/publish-now', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId }),
  });
  return res.json();
}

export async function fetchAnalyticsOverview(workspaceId: string) {
  const res = await fetch(`/api/analytics/overview?workspace_id=${workspaceId}`);
  return res.json();
}

export async function fetchMetricSnapshots(postId: string): Promise<MetricSnapshot[]> {
  const res = await fetch(`/api/analytics/snapshots/${postId}`);
  const data = await res.json();
  return data.snapshots || [];
}

export async function fetchPostDiagnosis(postId: string): Promise<PostDiagnosis | null> {
  const res = await fetch(`/api/analytics/diagnosis/${postId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.diagnosis;
}

export async function generatePostDiagnosis(postId: string): Promise<PostDiagnosis> {
  const res = await fetch('/api/ai/diagnose-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId }),
  });
  const data = await res.json();
  return data.diagnosis;
}

export async function fetchGrowthBrain(workspaceId: string): Promise<GrowthBrainInsight | null> {
  const res = await fetch(`/api/ai/growth-brain?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.growth_brain || null;
}

export async function fetchContentIdeas(workspaceId: string): Promise<ContentIdea[]> {
  const res = await fetch(`/api/ideas?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.ideas || [];
}

export async function generateContentIdeas(workspaceId: string, category?: string): Promise<ContentIdea[]> {
  const res = await fetch('/api/ideas/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id: workspaceId, category }),
  });
  const data = await res.json();
  return data.ideas || [];
}

export async function fetchCompetitors(workspaceId: string): Promise<CompetitorIntel[]> {
  const res = await fetch(`/api/competitors?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.competitors || [];
}

export async function addCompetitor(workspaceId: string, handle: string, platform: 'instagram' | 'youtube') {
  const res = await fetch('/api/competitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id: workspaceId, handle, platform }),
  });
  return res.json();
}

export async function fetchExperiments(workspaceId: string): Promise<Experiment[]> {
  const res = await fetch(`/api/experiments?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.experiments || [];
}

export async function createExperiment(payload: any): Promise<Experiment> {
  const res = await fetch('/api/experiments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.experiment;
}

export async function fetchWeeklyReports(workspaceId: string): Promise<WeeklyReport[]> {
  const res = await fetch(`/api/reports/weekly?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.reports || [];
}

export async function fetchNotifications(workspaceId: string): Promise<NotificationItem[]> {
  const res = await fetch(`/api/notifications?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.notifications || [];
}

export async function markNotificationRead(notifId: string) {
  const res = await fetch(`/api/notifications/${notifId}/read`, { method: 'POST' });
  return res.json();
}

export async function fetchAuditLogs(workspaceId: string): Promise<AuditLog[]> {
  const res = await fetch(`/api/audit-logs?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.audit_logs || [];
}

// ==========================================
// Automation Rules & Activities API
// ==========================================
export async function fetchAutomationRules(workspaceId: string): Promise<AutomationRule[]> {
  const res = await fetch(`/api/automation/rules?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.rules || [];
}

export async function createAutomationRule(payload: Partial<AutomationRule>): Promise<AutomationRule> {
  const res = await fetch('/api/automation/rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create automation rule');
  return data.rule;
}

export async function updateAutomationRule(ruleId: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
  const res = await fetch(`/api/automation/rules/${ruleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update automation rule');
  return data.rule;
}

export async function deleteAutomationRule(ruleId: string): Promise<boolean> {
  const res = await fetch(`/api/automation/rules/${ruleId}`, { method: 'DELETE' });
  const data = await res.json();
  return data.success;
}

export async function fetchAutomationActivities(workspaceId: string): Promise<AutomationActivity[]> {
  const res = await fetch(`/api/automation/activities?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.activities || [];
}

export async function fetchAutomationStats(workspaceId: string): Promise<AutomationStats> {
  const res = await fetch(`/api/automation/stats?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.stats;
}

export async function triggerAutomationSimulation(payload: {
  workspace_id: string;
  trigger_type: string;
  user_handle: string;
  content: string;
  post_id?: string;
  post_title?: string;
}) {
  const res = await fetch('/api/automation/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Simulation trigger failed');
  return data;
}

// ==========================================
// Autonomous Decisions API
// ==========================================
export async function fetchAutonomousDecisions(workspaceId: string): Promise<AutonomousDecision[]> {
  const res = await fetch(`/api/decisions?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.decisions || [];
}

export async function executeAutonomousDecision(decisionId: string): Promise<{ decision: AutonomousDecision; success: boolean }> {
  const res = await fetch(`/api/decisions/${decisionId}/execute`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to execute decision');
  return data;
}

export async function dismissAutonomousDecision(decisionId: string): Promise<{ decision: AutonomousDecision; success: boolean }> {
  const res = await fetch(`/api/decisions/${decisionId}/dismiss`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to dismiss decision');
  return data;
}

export async function generateAiDecisions(workspaceId: string): Promise<AutonomousDecision[]> {
  const res = await fetch('/api/decisions/generate-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id: workspaceId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate decisions');
  return data.decisions || [];
}

export async function fetchCompetitorComparisons(workspaceId: string): Promise<{ comparisons: CompetitorComparison[]; my_account_handle: string }> {
  const res = await fetch(`/api/competitors/comparison?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data;
}

// ==========================================
// Agency Clients API
// ==========================================
export async function fetchAgencyClients(workspaceId: string): Promise<AgencyClient[]> {
  const res = await fetch(`/api/clients?workspace_id=${workspaceId}`);
  const data = await res.json();
  return data.clients || [];
}

export async function createAgencyClient(payload: Partial<AgencyClient>): Promise<AgencyClient> {
  const res = await fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add client');
  return data.client;
}

export async function updateAgencyClient(clientId: string, updates: Partial<AgencyClient>): Promise<AgencyClient> {
  const res = await fetch(`/api/clients/${clientId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update client');
  return data.client;
}

export async function deleteAgencyClient(clientId: string): Promise<boolean> {
  const res = await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
  const data = await res.json();
  return data.success;
}

export async function fetchClientGrowthReport(clientId: string, workspaceId: string): Promise<ClientGrowthReport> {
  const res = await fetch(`/api/clients/${clientId}/report?workspace_id=${workspaceId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate report');
  return data.report;
}


export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'client-viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  avatar_url?: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  niche: 'Tech & AI' | 'Finance & Investing' | 'Fitness & Wellness' | 'E-commerce & SaaS' | 'Lifestyle & Travel' | 'Creator Economy' | 'Education & Career';
  primary_platform: 'instagram' | 'youtube' | 'both';
  target_audience: string;
  country: string;
  timezone: string; // IANA tz e.g. "America/New_York"
  language: string;
  growth_goal: 'Reach' | 'Followers' | 'Engagement' | 'Leads' | 'Sales';
  posting_frequency: 'Daily' | '3-4 times/week' | '1-2 times/week' | 'Twice daily';
  is_demo: boolean; // Crucial: separate DB flag for demo/sandbox data
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
}

export type PlatformType = 'instagram' | 'youtube';
export type ConnectionStatus = 'connected' | 'needs_reconnect' | 'not_connected';
export type AccountType = 'professional_business' | 'professional_creator' | 'personal_detected' | 'channel';

export interface ConnectedAccount {
  id: string;
  workspace_id: string;
  platform: PlatformType;
  external_account_id: string;
  handle: string;
  name: string;
  profile_image_url: string;
  account_type: AccountType;
  status: ConnectionStatus;
  scopes_granted: string[];
  last_synced_at: string;
  followers_count: number;
  rate_limit_remaining: number; // e.g., 100 API posts per 24h for IG
  rate_limit_reset_at?: string;
  is_demo_account: boolean;
  connection_notes?: string;
}

export interface OAuthToken {
  id: string;
  connected_account_id: string;
  encrypted_access_token: string;
  encrypted_refresh_token?: string;
  expires_at: string;
  token_type: string;
  is_long_lived: boolean;
  last_refreshed_at?: string;
}

export type UploadStatus = 'queued' | 'processing' | 'ready' | 'failed';

export interface ProcessingStep {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  duration_ms?: number;
  error?: string;
  details?: string;
}

export interface VideoItem {
  id: string;
  workspace_id: string;
  title: string;
  original_filename: string;
  file_size_bytes: number;
  storage_url: string;
  duration_seconds: number;
  resolution: string; // e.g. "1080x1920"
  aspect_ratio: '9:16' | '16:9' | '1:1';
  codec: string;
  upload_status: UploadStatus;
  processing_steps: ProcessingStep[];
  created_at: string;
}

export type QualitativeScoreLabel = 'Strong' | 'Moderate' | 'Needs improvement';

export interface ScoreDetail {
  label: QualitativeScoreLabel;
  why: string;
  fix: string;
  timestamp_evidence: string;
}

export interface HookAlternative {
  angle: 'Curiosity' | 'Problem/Pain' | 'Contrarian' | 'Data-driven' | 'Story' | 'Direct benefit';
  hook_text: string;
  explanation: string;
}

export interface ContentAnalysis {
  id: string;
  video_id: string;
  workspace_id: string;
  hook_strength: ScoreDetail;
  clarity: ScoreDetail;
  topic_relevance: ScoreDetail;
  retention_potential: ScoreDetail;
  shareability: ScoreDetail;
  save_potential: ScoreDetail;
  follow_conversion_potential: ScoreDetail;
  cta_quality: ScoreDetail;
  pacing: ScoreDetail;
  content_structure: ScoreDetail;
  detected_language: string;
  topic_classification: string[];
  cta_detected: boolean;
  cta_type?: string;
  pacing_cuts_per_minute: number;
  transcript_text: string;
  first_3s_retention_risk: 'Low' | 'Medium' | 'High';
  hook_alternatives: HookAlternative[];
  generated_at: string;
}

export interface VideoMetadata {
  id: string;
  video_id: string;
  short_caption: string;
  long_caption: string;
  cta: string;
  hashtags: string[];
  youtube_title: string;
  youtube_description: string;
  youtube_tags: string[];
  approved_at?: string;
  approved_by?: string;
}

export type ScheduleMode = 'auto' | 'manual';
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface BestTimeRecommendation {
  recommended_window_start: string; // ISO string
  recommended_window_end: string;   // ISO string
  display_window: string;           // e.g. "Today, 6:00 – 6:45 PM"
  confidence: ConfidenceLevel;
  comparable_post_count: number;
  reason: string;
  is_personalized: boolean;
  historical_delta_pct: number; // e.g. +28% vs rolling median
}

export interface ScheduledPost {
  id: string;
  workspace_id: string;
  video_id: string;
  connected_account_id: string;
  scheduled_time: string; // ISO string
  mode: ScheduleMode;
  status: PostStatus;
  confidence: ConfidenceLevel;
  recommendation_reason?: string;
  idempotency_key: string;
  caption_used: string;
  publish_attempts: number;
  last_error?: string;
  platform_container_id?: string;
  published_media_id?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  is_demo: boolean;
}

export interface MetricSnapshot {
  id: string;
  scheduled_post_id: string;
  snapshot_offset: '1h' | '6h' | '24h' | '48h' | '7d';
  captured_at: string;
  views: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  watch_time_seconds: number;
  avg_watch_time_seconds: number;
  profile_visits: number;
  follows_generated: number;
  engagement_rate: number;
}

export interface PostDiagnosis {
  id: string;
  scheduled_post_id: string;
  headline: string;
  comparison_to_median: string;
  shares_analysis: string;
  retention_analysis: string;
  follow_conversion_analysis: string;
  key_takeaways: string[];
  generated_at: string;
}

export interface GrowthBrainInsight {
  id: string;
  workspace_id: string;
  best_topics: { topic: string; performance_delta: string }[];
  weak_topics: { topic: string; reason: string }[];
  best_hooks: { hook_angle: string; retention_boost: string }[];
  optimal_formats: { duration_range: string; format: string; note: string }[];
  best_windows: { day: string; time: string; confidence: ConfidenceLevel }[];
  actionable_recommendations: string[];
  based_on_post_count: number;
  updated_at: string;
}

export interface ContentIdea {
  id: string;
  workspace_id: string;
  category: 'Education' | 'Storytelling' | 'Entertainment' | 'Authority' | 'Case studies' | 'Experiments' | 'Trending opportunities';
  hook: string;
  core_idea: string;
  suggested_format: string;
  cta: string;
  target_audience: string;
  why_it_works: string;
  created_at: string;
}

export interface CompetitorIntel {
  id: string;
  workspace_id: string;
  platform: PlatformType;
  handle: string;
  name: string;
  followers_count: number;
  posting_frequency: string;
  key_themes: string[];
  public_engagement_estimate: string;
  gaps_and_opportunities: string;
  last_analyzed_at: string;
}

export interface Experiment {
  id: string;
  workspace_id: string;
  hypothesis: string;
  variable: string; // e.g. "Hook length under 2s vs 4s+"
  baseline: string; // e.g. "Average 3s retention 42%"
  test_period: string; // e.g. "14 days / 6 posts"
  success_metric: string; // e.g. "3-Second Retention Rate"
  status: 'Draft' | 'Running' | 'Completed';
  sample_size: number;
  observed_difference?: string;
  limitations?: string;
  result_classification?: 'Supported' | 'Inconclusive' | 'Not supported';
  conclusion?: string;
  created_at: string;
}

export interface WeeklyReport {
  id: string;
  workspace_id: string;
  period_start: string;
  period_end: string;
  summary: {
    total_published: number;
    reach_change_pct: number;
    followers_change_pct: number;
    top_performing_post_id?: string;
    weakest_performing_post_id?: string;
    best_window_observed: string;
    best_hook_angle: string;
    suggested_experiments: string[];
    executive_takeaway: string;
  };
  created_at: string;
}

export interface NotificationItem {
  id: string;
  workspace_id: string;
  type: 'upload_done' | 'analysis_ready' | 'scheduled' | 'publish_success' | 'publish_failed' | 'needs_reconnect' | 'report_ready';
  title: string;
  message: string;
  read: boolean;
  link_section?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  workspace_id: string;
  actor_name: string;
  actor_role: WorkspaceRole;
  action: 'schedule' | 'reschedule' | 'publish' | 'cancel' | 'disconnect' | 'connect' | 'approve_metadata' | 'create_experiment' | 'execute_decision' | 'trigger_automation';
  target_type: 'video' | 'post' | 'connection' | 'metadata' | 'experiment' | 'automation' | 'decision' | 'client';
  target_id: string;
  details: string;
  created_at: string;
}

// ==========================================
// AUTO-ENGAGEMENT & DIRECT MESSAGE ENGINE
// ==========================================
export type AutomationTriggerType = 'comment' | 'follow' | 'like' | 'keyword' | 'question';
export type AutomationActionType = 'reply_comment' | 'send_dm' | 'both';

export interface AutomationRule {
  id: string;
  workspace_id: string;
  name: string;
  trigger_type: AutomationTriggerType;
  keywords: string[]; // e.g. ["thankyou", "hi", "how", "link", "info", "price", "audit"]
  action_type: AutomationActionType;
  comment_template?: string; // e.g. "Hi @{username}! Thanks for watching! Just sent the details to your DM 📥"
  dm_template?: string;      // e.g. "Hey @{username}! Thanks for following! Here is your free Creator Growth Checklist: https://growthos.ai/guide"
  is_ai_powered: boolean;    // If true, Gemini analyzes comment/question and crafts a personalized answer
  ai_personality: string;    // e.g. "Helpful, authoritative, warm creator expert"
  delay_seconds: number;     // Humanized jitter to avoid spam filters (default 5-15s)
  is_active: boolean;
  executions_count: number;
  created_at: string;
}

export interface AutomationActivity {
  id: string;
  workspace_id: string;
  rule_id?: string;
  trigger_type: AutomationTriggerType;
  user_handle: string;
  user_avatar?: string;
  post_id?: string;
  post_title?: string;
  trigger_content: string; // The comment text, follow notification, or like
  comment_reply_sent?: string;
  dm_sent?: string;
  is_ai_generated: boolean;
  status: 'sent' | 'queued' | 'safety_rate_limited';
  timestamp: string;
}

export interface AutomationStats {
  total_comments_handled: number;
  total_dms_sent: number;
  total_greetings_sent: number;
  total_questions_answered: number;
  safety_rate_limit_status: 'Optimal' | 'Caution' | 'Throttled';
  daily_dm_quota_used: number; // e.g. 42 / 100 max safe API DMs
  hours_saved_vs_manual: number;
}

// ==========================================
// COMPETITOR INTELLIGENCE & AUTONOMOUS DECISION ENGINE
// ==========================================
export type DecisionCategory = 'content_strategy' | 'schedule_timing' | 'competitor_counter' | 'engagement_loop';
export type DecisionStatus = 'pending' | 'auto_executed' | 'manual_executed' | 'dismissed';

export interface AutonomousDecision {
  id: string;
  workspace_id: string;
  category: DecisionCategory;
  title: string;
  description: string;
  reason: string;
  source_metric: string;
  competitor_handle?: string;
  expected_impact: string; // e.g. "+35% 3-Second Retention", "+500 Followers/week"
  confidence: ConfidenceLevel;
  status: DecisionStatus;
  suggested_action_label: string; // e.g. "Auto-Draft Counter Reel", "Apply Schedule Shift"
  action_payload?: {
    type: 'create_idea' | 'reschedule' | 'enable_rule' | 'custom';
    data?: any;
  };
  created_at: string;
  executed_at?: string;
}

export interface CompetitorComparison {
  competitor_id: string;
  competitor_handle: string;
  competitor_name: string;
  my_followers: number;
  competitor_followers: number;
  follower_difference: number;
  growth_velocity_pct: number;
  engagement_rate_comparison: string;
  posting_cadence_comparison: string;
  top_viral_hook: string;
  gap_to_exploit: string;
  last_analyzed: string;
}

// ==========================================
// CLIENT AGENCY & MONETIZATION HUB
// ==========================================
export type ClientTier = 'Starter Autopilot' | 'Growth Accelerator' | 'Full Agency Domination';
export type ClientStatus = 'active' | 'onboarding' | 'paused';

export interface AgencyClient {
  id: string;
  workspace_id: string;
  name: string;
  handle: string;
  avatar_url: string;
  niche: string;
  platform: 'instagram' | 'youtube' | 'both';
  monthly_retainer: number; // e.g. 499, 999, 2500 USD
  package_tier: ClientTier;
  status: ClientStatus;
  posts_delivered: number;
  posts_target: number;
  follower_growth_pct: number;
  comments_automated: number;
  dms_sent: number;
  next_billing_date: string;
  created_at: string;
}

export interface ClientGrowthReport {
  id: string;
  client_id: string;
  client_name: string;
  client_handle: string;
  period_label: string;
  total_reach: number;
  followers_gained: number;
  follower_growth_pct: number;
  engagement_rate: string;
  top_post_title: string;
  top_post_views: number;
  auto_comments_handled: number;
  auto_dms_delivered: number;
  roi_multiple: string; // e.g. "4.2x Client Retainer Value"
  highlights?: string[];
  generated_at: string;
}

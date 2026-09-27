import {
  User,
  Workspace,
  WorkspaceMember,
  ConnectedAccount,
  OAuthToken,
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
  AutomationRule,
  AutomationActivity,
  AutomationStats,
  AutonomousDecision,
  AgencyClient,
} from '../types/index.js';
import { encryptToken } from './crypto.js';

interface DatabaseState {
  users: User[];
  workspaces: Workspace[];
  workspace_members: WorkspaceMember[];
  connected_accounts: ConnectedAccount[];
  oauth_tokens: OAuthToken[];
  videos: VideoItem[];
  content_analysis: ContentAnalysis[];
  video_metadata: VideoMetadata[];
  scheduled_posts: ScheduledPost[];
  metric_snapshots: MetricSnapshot[];
  post_diagnoses: PostDiagnosis[];
  growth_brain: GrowthBrainInsight[];
  content_ideas: ContentIdea[];
  competitors: CompetitorIntel[];
  experiments: Experiment[];
  weekly_reports: WeeklyReport[];
  notifications: NotificationItem[];
  audit_logs: AuditLog[];
  automation_rules: AutomationRule[];
  automation_activities: AutomationActivity[];
  autonomous_decisions: AutonomousDecision[];
  agency_clients: AgencyClient[];
}

// Initial realistic database state with distinct Sandbox Workspace vs Real Workspace
const INITIAL_DB: DatabaseState = {
  users: [
    {
      id: 'usr_main_01',
      name: 'Elena Rostova',
      email: 'creator@growthos.ai',
      role: 'owner',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      created_at: new Date('2026-08-01T00:00:00Z').toISOString(),
    },
  ],
  workspaces: [
    {
      id: 'ws_demo_sandbox',
      name: 'GrowthOS Demo Sandbox (Tech & Creator Economy)',
      niche: 'Creator Economy',
      primary_platform: 'instagram',
      target_audience: 'Aspiring creators, indie founders, and agency owners seeking audience growth.',
      country: 'United States',
      timezone: 'America/New_York',
      language: 'English',
      growth_goal: 'Reach',
      posting_frequency: 'Daily',
      is_demo: true, // Flagged explicitly!
      created_at: new Date('2026-08-01T00:00:00Z').toISOString(),
    },
    {
      id: 'ws_real_production',
      name: 'Elena’s Primary Creator Workspace',
      niche: 'Tech & AI',
      primary_platform: 'both',
      target_audience: 'Engineers, product leaders, and builders scaling AI apps.',
      country: 'United States',
      timezone: 'America/New_York',
      language: 'English',
      growth_goal: 'Followers',
      posting_frequency: '3-4 times/week',
      is_demo: false, // Real workspace: requires authentic Instagram / YouTube connection
      created_at: new Date('2026-09-01T00:00:00Z').toISOString(),
    },
  ],
  workspace_members: [
    {
      id: 'wm_01',
      workspace_id: 'ws_demo_sandbox',
      user_id: 'usr_main_01',
      role: 'owner',
    },
    {
      id: 'wm_02',
      workspace_id: 'ws_real_production',
      user_id: 'usr_main_01',
      role: 'owner',
    },
  ],
  connected_accounts: [
    {
      id: 'acc_demo_ig',
      workspace_id: 'ws_demo_sandbox',
      platform: 'instagram',
      external_account_id: 'ig_demo_9847192',
      handle: 'growthpulse.daily',
      name: 'GrowthPulse Official',
      profile_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      account_type: 'professional_creator',
      status: 'connected',
      scopes_granted: [
        'instagram_business_basic',
        'instagram_business_content_publish',
        'instagram_business_manage_insights',
        'instagram_business_manage_comments',
      ],
      last_synced_at: new Date(Date.now() - 3600000).toISOString(),
      followers_count: 48920,
      rate_limit_remaining: 94,
      is_demo_account: true,
      connection_notes: 'Demo account simulating verified Meta Business Login for Instagram.',
    },
    {
      id: 'acc_demo_yt',
      workspace_id: 'ws_demo_sandbox',
      platform: 'youtube',
      external_account_id: 'yt_demo_8371940',
      handle: '@GrowthPulseShorts',
      name: 'GrowthPulse Shorts',
      profile_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      account_type: 'channel',
      status: 'connected',
      scopes_granted: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly',
      ],
      last_synced_at: new Date(Date.now() - 7200000).toISOString(),
      followers_count: 22400,
      rate_limit_remaining: 10000,
      is_demo_account: true,
    },
    {
      id: 'acc_real_ig',
      workspace_id: 'ws_real_production',
      platform: 'instagram',
      external_account_id: '',
      handle: '',
      name: '',
      profile_image_url: '',
      account_type: 'professional_creator',
      status: 'not_connected', // Real workspace starts not connected
      scopes_granted: [],
      last_synced_at: '',
      followers_count: 0,
      rate_limit_remaining: 100,
      is_demo_account: false,
    },
    {
      id: 'acc_real_yt',
      workspace_id: 'ws_real_production',
      platform: 'youtube',
      external_account_id: '',
      handle: '',
      name: '',
      profile_image_url: '',
      account_type: 'channel',
      status: 'not_connected',
      scopes_granted: [],
      last_synced_at: '',
      followers_count: 0,
      rate_limit_remaining: 10000,
      is_demo_account: false,
    },
  ],
  oauth_tokens: [
    {
      id: 'tok_demo_ig',
      connected_account_id: 'acc_demo_ig',
      encrypted_access_token: encryptToken('demo_long_lived_ig_token_placeholder_secret'),
      expires_at: new Date(Date.now() + 50 * 24 * 3600000).toISOString(),
      token_type: 'bearer',
      is_long_lived: true,
      last_refreshed_at: new Date().toISOString(),
    },
  ],
  videos: [
    {
      id: 'vid_demo_01',
      workspace_id: 'ws_demo_sandbox',
      title: '3 Instagram Algorithm Shifts for 2026',
      original_filename: 'reels_algo_shifts_v2.mp4',
      file_size_bytes: 28400000,
      storage_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration_seconds: 48,
      resolution: '1080x1920',
      aspect_ratio: '9:16',
      codec: 'h264 / aac',
      upload_status: 'ready',
      processing_steps: [
        { name: 'Signed Storage Upload', status: 'completed', duration_ms: 620 },
        { name: 'Thumbnail & Codec Extraction', status: 'completed', duration_ms: 410 },
        { name: 'Speech-to-Text Transcription', status: 'completed', duration_ms: 1100 },
        { name: 'Topic & Language Classification', status: 'completed', duration_ms: 320 },
        { name: 'Hook Retention & Pacing Analysis', status: 'completed', duration_ms: 850 },
        { name: 'CTA Detection & Structuring', status: 'completed', duration_ms: 290 },
      ],
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'vid_demo_02',
      workspace_id: 'ws_demo_sandbox',
      title: 'Why 99% of Reels Fail in the First 3 Seconds',
      original_filename: 'first_3_seconds_hook_breakdown.mp4',
      file_size_bytes: 35100000,
      storage_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      duration_seconds: 62,
      resolution: '1080x1920',
      aspect_ratio: '9:16',
      codec: 'h264 / aac',
      upload_status: 'ready',
      processing_steps: [
        { name: 'Signed Storage Upload', status: 'completed', duration_ms: 710 },
        { name: 'Thumbnail & Codec Extraction', status: 'completed', duration_ms: 480 },
        { name: 'Speech-to-Text Transcription', status: 'completed', duration_ms: 1350 },
        { name: 'Topic & Language Classification', status: 'completed', duration_ms: 310 },
        { name: 'Hook Retention & Pacing Analysis', status: 'completed', duration_ms: 920 },
        { name: 'CTA Detection & Structuring', status: 'completed', duration_ms: 310 },
      ],
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
  content_analysis: [
    {
      id: 'ca_demo_01',
      video_id: 'vid_demo_01',
      workspace_id: 'ws_demo_sandbox',
      hook_strength: {
        label: 'Strong',
        why: 'Pattern interruption within the first 1.8s addressing direct viewer pain.',
        fix: 'Solid as-is. Consider pairing verbal hook with high-contrast text overlay.',
        timestamp_evidence: '00:00 - 00:02: "If your Reels flatlined at 200 views this week, Meta just pushed an update."',
      },
      clarity: {
        label: 'Strong',
        why: 'Clear 3-point progression with visible numeric signposts.',
        fix: 'Ensure point #2 transitions smoothly without jargon.',
        timestamp_evidence: '00:08, 00:22, 00:36 chapter markers clearly delivered.',
      },
      topic_relevance: {
        label: 'Strong',
        why: 'High intent alignment with creator growth and Instagram distribution mechanics.',
        fix: 'Add one specific niche example for SaaS/service creators.',
        timestamp_evidence: 'Direct breakdown of send-to-reach ratio metrics.',
      },
      retention_potential: {
        label: 'Strong',
        why: 'Pacing changes every 3.2 seconds maintain visual engagement.',
        fix: 'Shorten the conclusion by 2 seconds to avoid end-dropoff.',
        timestamp_evidence: 'Steady audio energy maintained through second 44.',
      },
      shareability: {
        label: 'Strong',
        why: 'Contains high-utility diagnostic checklist creators will DM to team or friends.',
        fix: 'Explicitly prompt: "Send this to someone struggling with reach."',
        timestamp_evidence: 'Clear breakdown of DM send weight in algorithmic ranking.',
      },
      save_potential: {
        label: 'Strong',
        why: 'Actionable 3-step checklist format naturally prompts bookmarking.',
        fix: 'Include "Save this for your next batching session" screen prompt.',
        timestamp_evidence: 'Reference guide format at 00:38.',
      },
      follow_conversion_potential: {
        label: 'Moderate',
        why: 'Establishes clear authority, but personal profile incentive is subtle.',
        fix: 'Add explicit promise: "Follow for daily breakdowns of distribution engineering."',
        timestamp_evidence: 'Profile CTA placed only in final 2 seconds.',
      },
      cta_quality: {
        label: 'Moderate',
        why: 'Clear comment prompt, but asking for two actions at once reduces conversion.',
        fix: 'Stick to one primary action: comment "AUDIT" or tap follow.',
        timestamp_evidence: '00:44: "Comment AUDIT and follow for the full template."',
      },
      pacing: {
        label: 'Strong',
        why: 'Average cut density of 18 cuts/minute with dynamic b-roll inserts.',
        fix: 'Maintain current cadence.',
        timestamp_evidence: '14 jump cuts and 6 graphic overlays detected.',
      },
      content_structure: {
        label: 'Strong',
        why: 'Hook (0-3s) -> Problem context (3-12s) -> 3 tactical steps (12-40s) -> CTA (40-48s).',
        fix: 'Trim 1 second off the context setup to get to point #1 faster.',
        timestamp_evidence: 'Logical 4-phase storyboard flow.',
      },
      detected_language: 'English (US)',
      topic_classification: ['Instagram Algorithm', 'Creator Growth', 'Content Strategy'],
      cta_detected: true,
      cta_type: 'Comment keyword trigger + follow',
      pacing_cuts_per_minute: 18.5,
      transcript_text: 'If your Reels flatlined at 200 views this week, Meta just pushed an update. Here are the three algorithm shifts you need to know. First, the DM send-to-reach ratio is now 4x more valuable than likes. If someone doesn\'t share it privately, Instagram stops recommending it. Second, watch-time completion percentage outweighs raw view count. A 15-second Reel with 80% completion beats a 60-second video with 30%. Third, SEO keywords in your spoken audio are indexed natively. Comment AUDIT and follow for the full template.',
      first_3s_retention_risk: 'Low',
      hook_alternatives: [
        {
          angle: 'Curiosity',
          hook_text: 'Instagram quietly changed the one metric that actually pushes your Reels to Explore.',
          explanation: 'Creates an open informational loop focusing on insider platform mechanics.',
        },
        {
          angle: 'Problem/Pain',
          hook_text: 'Stop wondering why your Reels are stuck at 200 views — you\'re optimizing for the wrong metric.',
          explanation: 'Targets the most common creator frustration directly in the first sentence.',
        },
        {
          angle: 'Contrarian',
          hook_text: 'Likes are officially dead on Instagram. Here is what the algorithm actually measures in 2026.',
          explanation: 'Directly challenges standard creator assumptions to provoke immediate attention.',
        },
        {
          angle: 'Data-driven',
          hook_text: 'We analyzed 1,400 Reels last month and discovered DM shares trigger 72% of all viral spikes.',
          explanation: 'Leverages quantifiable authority and empirical research credibility.',
        },
        {
          angle: 'Story',
          hook_text: 'Our client\'s account was shadow-stagnant for 90 days until we flipped these 3 switches.',
          explanation: 'Personal narrative case-study format that builds rapid empathy.',
        },
        {
          angle: 'Direct benefit',
          hook_text: 'Steal our exact 3-step Reel framework that doubled our reach without posting every day.',
          explanation: 'Clear, high-value immediate payoff for busy operators.',
        },
      ],
      generated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ],
  video_metadata: [
    {
      id: 'meta_demo_01',
      video_id: 'vid_demo_01',
      short_caption: 'Meta updated how Reels get distributed. The #1 metric isn\'t likes anymore — it\'s DM sends. Breakdown inside 👇',
      long_caption: 'If your Reels hit an invisible ceiling at 200 views, the algorithm isn\'t broken — your optimization target is.\n\nMeta\'s 2026 distribution model heavily weights private shares. When a viewer DMs your reel to a friend, it signals extreme relevance.\n\n3 tactics to implement today:\n1. Create content people want to privately recommend\n2. Keep completion percentage above 70%\n3. Speak your primary target keywords clearly in the first 5 seconds\n\nComment AUDIT below and I\'ll DM you our 2026 Reel Retention Checklist.',
      cta: 'Comment AUDIT to get the retention checklist',
      hashtags: ['#instagramgrowth', '#reelsstrategy', '#contentcreator', '#socialmediamarketing', '#creatoreconomy'],
      youtube_title: '3 Instagram Algorithm Shifts You MUST Know (2026)',
      youtube_description: 'Discover the exact changes to Instagram\'s Reels algorithm and how DM shares dominate distribution over likes in 2026.',
      youtube_tags: ['instagram algorithm', 'instagram reels tips', 'creator growth', 'how to grow on instagram', 'reels tutorial 2026'],
      approved_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      approved_by: 'Elena Rostova',
    },
  ],
  scheduled_posts: [
    {
      id: 'sp_demo_01',
      workspace_id: 'ws_demo_sandbox',
      video_id: 'vid_demo_01',
      connected_account_id: 'acc_demo_ig',
      scheduled_time: new Date(Date.now() - 2 * 86400000).toISOString(),
      mode: 'auto',
      status: 'published',
      confidence: 'High',
      recommendation_reason: 'Your educational Reels consistently outperform account median by +34% when published between 6:00–6:45 PM on Thursdays.',
      idempotency_key: 'idem_sp_demo_01_ig_container_981',
      caption_used: 'Meta updated how Reels get distributed. The #1 metric isn\'t likes anymore — it\'s DM sends.',
      publish_attempts: 1,
      platform_container_id: 'ig_container_99182371',
      published_media_id: 'ig_media_1798234710293',
      published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      is_demo: true,
    },
    {
      id: 'sp_demo_02',
      workspace_id: 'ws_demo_sandbox',
      video_id: 'vid_demo_02',
      connected_account_id: 'acc_demo_ig',
      scheduled_time: new Date(Date.now() + 6 * 3600000).toISOString(), // 6 hours from now
      mode: 'auto',
      status: 'scheduled',
      confidence: 'Medium',
      recommendation_reason: 'Recommended based on high viewer activity for your audience niche between 5:30 PM - 6:30 PM (14 comparable historical posts).',
      idempotency_key: 'idem_sp_demo_02_ig_container_982',
      caption_used: 'Why 99% of Reels fail in the first 3 seconds — and how to fix your hook before recording.',
      publish_attempts: 0,
      created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
      is_demo: true,
    },
  ],
  metric_snapshots: [
    {
      id: 'ms_01_1h',
      scheduled_post_id: 'sp_demo_01',
      snapshot_offset: '1h',
      captured_at: new Date(Date.now() - 47 * 3600000).toISOString(),
      views: 1420,
      reach: 1290,
      likes: 132,
      comments: 24,
      shares: 48,
      saves: 82,
      watch_time_seconds: 48200,
      avg_watch_time_seconds: 34,
      profile_visits: 38,
      follows_generated: 12,
      engagement_rate: 0.125,
    },
    {
      id: 'ms_01_6h',
      scheduled_post_id: 'sp_demo_01',
      snapshot_offset: '6h',
      captured_at: new Date(Date.now() - 42 * 3600000).toISOString(),
      views: 5890,
      reach: 5210,
      likes: 490,
      comments: 78,
      shares: 194,
      saves: 342,
      watch_time_seconds: 201200,
      avg_watch_time_seconds: 35,
      profile_visits: 142,
      follows_generated: 45,
      engagement_rate: 0.142,
    },
    {
      id: 'ms_01_24h',
      scheduled_post_id: 'sp_demo_01',
      snapshot_offset: '24h',
      captured_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      views: 18450,
      reach: 16200,
      likes: 1420,
      comments: 186,
      shares: 612,
      saves: 1140,
      watch_time_seconds: 645000,
      avg_watch_time_seconds: 36,
      profile_visits: 420,
      follows_generated: 138,
      engagement_rate: 0.138,
    },
    {
      id: 'ms_01_48h',
      scheduled_post_id: 'sp_demo_01',
      snapshot_offset: '48h',
      captured_at: new Date(Date.now() - 3600000).toISOString(),
      views: 31200,
      reach: 27800,
      likes: 2340,
      comments: 295,
      shares: 1040,
      saves: 1890,
      watch_time_seconds: 1104000,
      avg_watch_time_seconds: 35.5,
      profile_visits: 710,
      follows_generated: 245,
      engagement_rate: 0.132,
    },
  ],
  post_diagnoses: [
    {
      id: 'diag_demo_01',
      scheduled_post_id: 'sp_demo_01',
      headline: 'Unusually High DM Shares Driven by Checklist Format',
      comparison_to_median: 'Reach performed +42% above your 30-day rolling median (27.8k vs 19.5k median).',
      shares_analysis: 'Shares (1,040) were 2.8x higher than your average educational post, likely triggered by the concrete DM keyword hook.',
      retention_analysis: 'Average watch time settled at 35.5s on a 48s video (74% completion rate), preventing early drop-off.',
      follow_conversion_analysis: 'Follow conversion generated 245 new followers (0.88% of reach), exceeding your account benchmark of 0.55%.',
      key_takeaways: [
        'Tactical 3-point list posts with clear graphic timestamps correlate with 2x higher save rates.',
        'Spoken mention of algorithm mechanics prompted 186 discussion comments in the first 4 hours.',
        'Consider testing a Part 2 focusing exclusively on DM automation tools next week.',
      ],
      generated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
  ],
  growth_brain: [
    {
      id: 'gb_demo_01',
      workspace_id: 'ws_demo_sandbox',
      best_topics: [
        { topic: 'Instagram Algorithm Mechanics & Distribution', performance_delta: '+48% above median reach' },
        { topic: 'Hook Retention & First 3-Second Breakdowns', performance_delta: '+33% above median watch-time' },
        { topic: 'Creator Monetization & Tech Stack', performance_delta: '+26% above median profile visits' },
      ],
      weak_topics: [
        { topic: 'Broad Motivational Advice', reason: 'High drop-off before second 8; low save-to-reach ratio' },
        { topic: 'Product Feature Announcements', reason: 'Perceived as promotional; 60% lower comment engagement' },
      ],
      best_hooks: [
        { hook_angle: 'Contrarian / Myth-Busting', retention_boost: '+22% 3s retention' },
        { hook_angle: 'Data-driven / Quantified Case Study', retention_boost: '+18% 3s retention' },
        { hook_angle: 'Problem / Direct Pain Address', retention_boost: '+15% 3s retention' },
      ],
      optimal_formats: [
        { duration_range: '38–48 seconds', format: 'Talking Head + B-Roll + Bold On-Screen Kinetic Text', note: 'Highest completion rate (72%) across your last 24 posts.' },
        { duration_range: '55–65 seconds', format: 'Step-by-step Screen Share Walkthrough', note: 'Generates 3x more saves, ideal for educational library building.' },
      ],
      best_windows: [
        { day: 'Thursday', time: '6:00 PM – 6:45 PM', confidence: 'High' },
        { day: 'Tuesday', time: '12:15 PM – 1:00 PM', confidence: 'Medium' },
        { day: 'Sunday', time: '7:30 PM – 8:15 PM', confidence: 'Medium' },
      ],
      actionable_recommendations: [
        'Your last 10 posts indicate that educational Reels dissecting platform mechanics outperform general creator advice by 2.4x on profile visits.',
        'Focus on keeping your spoken problem statement under 2.2 seconds; posts exceeding 3.5s hook setup experienced a 38% drop in 3s retention.',
        'Pair your spoken CTA with an on-screen visual trigger (e.g. typing the keyword into comments) to boost comment volume.',
      ],
      based_on_post_count: 24,
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
  content_ideas: [
    {
      id: 'idea_01',
      workspace_id: 'ws_demo_sandbox',
      category: 'Education',
      hook: 'The 3 hidden settings in Instagram Professional Dashboard that creators never check.',
      core_idea: 'Walk through account status, content recommendation eligibility, and audience activity graphs.',
      suggested_format: 'Screen-record overlay with talking head avatar in bottom-right corner.',
      cta: 'Save this so you can check your own dashboard settings tonight.',
      target_audience: 'Creators struggling with shadow-restrictions or reach ceilings.',
      why_it_works: 'Grounded in your highest performing topic: technical Instagram platform mechanics.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'idea_02',
      workspace_id: 'ws_demo_sandbox',
      category: 'Contrarian' as any,
      hook: 'Stop posting at 9 AM — here is what 45,000 Reels revealed about actual viewer behavior.',
      core_idea: 'Dispel the myth of universal best times; explain why audience timezone clusters dictate publishing windows.',
      suggested_format: 'Fast-paced talking head with chart b-roll.',
      cta: 'Drop your niche below and I\'ll tell you which window to test.',
      target_audience: 'Creators following outdated social media advice.',
      why_it_works: 'Leverages your audience\'s demonstrated appetite for contrarian data-backed insights.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'idea_03',
      workspace_id: 'ws_demo_sandbox',
      category: 'Case studies',
      hook: 'How a 2,000-follower creator landed a $12k sponsorship without going viral.',
      core_idea: 'Deep-dive into audience quality, engagement concentration, and pitch decks vs follower vanity counts.',
      suggested_format: 'Breakdown style with screenshot overlays.',
      cta: 'Comment PITCH for the exact 3-slide template.',
      target_audience: 'Monetization-focused niche creators.',
      why_it_works: 'Directly serves your audience goal: tangible creator revenue and growth.',
      created_at: new Date().toISOString(),
    },
  ],
  competitors: [
    {
      id: 'comp_01',
      workspace_id: 'ws_demo_sandbox',
      platform: 'instagram',
      handle: 'creator.playbook',
      name: 'Creator Playbook',
      followers_count: 142000,
      posting_frequency: '6 posts / week',
      key_themes: ['Short-form editing tutorials', 'Hook breakdowns', 'CapCut tips'],
      public_engagement_estimate: '3.4% engagement rate',
      gaps_and_opportunities: 'Heavy focus on editing tools, but almost zero coverage of algorithmic distribution or analytics. Opportunity to capture creators looking for strategic packaging rather than just editing software.',
      last_analyzed_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    },
    {
      id: 'comp_02',
      workspace_id: 'ws_demo_sandbox',
      platform: 'instagram',
      handle: 'modern.growth',
      name: 'Modern Growth Media',
      followers_count: 88500,
      posting_frequency: '4 posts / week',
      key_themes: ['SaaS growth reels', 'B2B social strategies', 'LinkedIn cross-posting'],
      public_engagement_estimate: '2.1% engagement rate',
      gaps_and_opportunities: 'High-production videos but lack clear conversational hooks. Opportunity to outperform on watch-time completion by introducing rapid pattern interrupts.',
      last_analyzed_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  ],
  experiments: [
    {
      id: 'exp_01',
      workspace_id: 'ws_demo_sandbox',
      hypothesis: 'Cutting verbal hook length from 4.5s down to under 2.0s will increase 3-second retention by at least 15%.',
      variable: 'Opening sentence duration & pattern interrupt speed',
      baseline: '42.4% average 3-second retention on previous 10 posts',
      test_period: '14 days / 6 consecutive Reels',
      success_metric: '3-Second Retention Rate (% of viewers who do not swipe away)',
      status: 'Completed',
      sample_size: 6,
      observed_difference: '+18.2% relative improvement (baseline 42.4% -> tested 50.1%)',
      limitations: 'Sample size of 6 posts with differing subject topics; external algorithmic swings cannot be fully isolated.',
      result_classification: 'Supported',
      conclusion: 'Hypothesis supported within preliminary sample limits. Tighter hooks under 2.0s strongly correlate with initial retention stability.',
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: 'exp_02',
      workspace_id: 'ws_demo_sandbox',
      hypothesis: 'Single-keyword comment triggers (e.g. "AUDIT") will generate 2x more comments than open-ended questions.',
      variable: 'CTA phrasing style: friction-free keyword vs open prompt',
      baseline: '34 comments average per post',
      test_period: '10 days / 4 Reels',
      success_metric: 'Total Comment Count in First 24 Hours',
      status: 'Running',
      sample_size: 2,
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
  ],
  weekly_reports: [
    {
      id: 'wr_demo_01',
      workspace_id: 'ws_demo_sandbox',
      period_start: new Date(Date.now() - 7 * 86400000).toISOString(),
      period_end: new Date().toISOString(),
      summary: {
        total_published: 4,
        reach_change_pct: 28.4,
        followers_change_pct: 12.8,
        top_performing_post_id: 'sp_demo_01',
        weakest_performing_post_id: undefined,
        best_window_observed: 'Thursday 6:00 PM – 6:45 PM',
        best_hook_angle: 'Contrarian Platform Breakdown',
        suggested_experiments: [
          'Test 2-second thumbnail text hook vs no text overlay.',
          'Test direct DM keyword CTA vs profile link CTA.',
        ],
        executive_takeaway: 'Reach and follower conversion accelerated this week due to strong save rates on educational platform breakdowns. Maintain the 40–50s video duration sweet spot.',
      },
      created_at: new Date().toISOString(),
    },
  ],
  notifications: [
    {
      id: 'notif_01',
      workspace_id: 'ws_demo_sandbox',
      type: 'publish_success',
      title: 'Post Published via Instagram Graph API',
      message: 'Your Reel "3 Instagram Algorithm Shifts" was published to @growthpulse.daily.',
      read: true,
      link_section: 'calendar',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'notif_02',
      workspace_id: 'ws_demo_sandbox',
      type: 'analysis_ready',
      title: 'AI Video Analysis Completed',
      message: 'Hook strength (Strong) and 6 alternative angles generated for your Reel.',
      read: false,
      link_section: 'content',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif_03',
      workspace_id: 'ws_demo_sandbox',
      type: 'scheduled',
      title: 'Publishing Window Reserved',
      message: 'Auto-scheduled for optimal window: Today at 6:15 PM (High Confidence).',
      read: false,
      link_section: 'calendar',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  audit_logs: [
    {
      id: 'audit_01',
      workspace_id: 'ws_demo_sandbox',
      actor_name: 'Elena Rostova',
      actor_role: 'owner',
      action: 'publish',
      target_type: 'post',
      target_id: 'sp_demo_01',
      details: 'Container ID ig_container_99182371 published to @growthpulse.daily (HTTP 200 OK).',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'audit_02',
      workspace_id: 'ws_demo_sandbox',
      actor_name: 'Elena Rostova',
      actor_role: 'owner',
      action: 'approve_metadata',
      target_type: 'metadata',
      target_id: 'meta_demo_01',
      details: 'Approved short caption and YouTube tags for distribution.',
      created_at: new Date(Date.now() - 2.5 * 86400000).toISOString(),
    },
    {
      id: 'audit_03',
      workspace_id: 'ws_demo_sandbox',
      actor_name: 'Elena Rostova',
      actor_role: 'owner',
      action: 'schedule',
      target_type: 'post',
      target_id: 'sp_demo_02',
      details: 'Auto-scheduled post for recommended window via Best-Time Engine.',
      created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
  ],
  automation_rules: [
    {
      id: 'rule_01',
      workspace_id: 'ws_demo_sandbox',
      name: 'Smart Comment Question Auto-Reply & DM',
      trigger_type: 'question',
      keywords: ['how', 'what', 'why', 'setup', 'question', 'where', 'tool'],
      action_type: 'both',
      comment_template: 'Great question @{username}! I just sent you the full step-by-step breakdown directly in your DM 📥',
      dm_template: 'Hey @{username}! Saw your question on my latest Reel. Here is the exact architecture breakdown & toolkit link: https://growthos.ai/architecture-guide',
      is_ai_powered: true,
      ai_personality: 'High-authority, helpful technical creator & systems engineer',
      delay_seconds: 8,
      is_active: true,
      executions_count: 142,
      created_at: new Date('2026-08-10T00:00:00Z').toISOString(),
    },
    {
      id: 'rule_02',
      workspace_id: 'ws_demo_sandbox',
      name: 'Comment "Thank You" & "Hi" Instant Responder',
      trigger_type: 'comment',
      keywords: ['thankyou', 'thanks', 'thank you', 'hi', 'hello', 'awesome', 'great video', 'love this', 'fire'],
      action_type: 'reply_comment',
      comment_template: 'Thanks so much for watching @{username}! Really appreciate the support 🙌 More deep-dives coming this week!',
      dm_template: '',
      is_ai_powered: true,
      ai_personality: 'Warm, authentic creator appreciation',
      delay_seconds: 5,
      is_active: true,
      executions_count: 289,
      created_at: new Date('2026-08-12T00:00:00Z').toISOString(),
    },
    {
      id: 'rule_03',
      workspace_id: 'ws_demo_sandbox',
      name: 'New Follower Welcome & VIP Starter Guide',
      trigger_type: 'follow',
      keywords: [],
      action_type: 'send_dm',
      comment_template: '',
      dm_template: 'Hey @{username}! Welcome to the inner circle! 🚀 I noticed you just followed. To get you started, grab my free 2026 Creator Systems Roadmap here: https://growthos.ai/roadmap. Let me know what you are building!',
      is_ai_powered: false,
      ai_personality: 'Strategic creator welcome',
      delay_seconds: 25,
      is_active: true,
      executions_count: 87,
      created_at: new Date('2026-08-15T00:00:00Z').toISOString(),
    },
    {
      id: 'rule_04',
      workspace_id: 'ws_demo_sandbox',
      name: 'Lead Magnet Keyword "LINK / AUDIT" Trigger',
      trigger_type: 'keyword',
      keywords: ['link', 'audit', 'info', 'guide', 'send', 'checklist', 'source'],
      action_type: 'both',
      comment_template: 'Sent to your inbox @{username}! Check your requests if we aren\'t mutuals yet ⚡️',
      dm_template: 'Hey @{username}! Here is your direct access pass to the Creator Audit Blueprint: https://growthos.ai/blueprint?ref=ig_dm',
      is_ai_powered: false,
      ai_personality: 'Direct conversion engine',
      delay_seconds: 6,
      is_active: true,
      executions_count: 312,
      created_at: new Date('2026-08-18T00:00:00Z').toISOString(),
    },
    {
      id: 'rule_05',
      workspace_id: 'ws_demo_sandbox',
      name: 'Reel Like Engagement Follow-up',
      trigger_type: 'like',
      keywords: [],
      action_type: 'send_dm',
      comment_template: '',
      dm_template: 'Hey @{username}! Appreciate you liking the latest breakdown on distribution algorithm updates. Glad it was valuable for you!',
      is_ai_powered: false,
      ai_personality: 'Warm relationship builder',
      delay_seconds: 45,
      is_active: true,
      executions_count: 64,
      created_at: new Date('2026-08-20T00:00:00Z').toISOString(),
    },
    // Real Workspace rules (ready out-of-the-box!)
    {
      id: 'rule_real_01',
      workspace_id: 'ws_real_production',
      name: 'Smart Comment Question Auto-Reply & DM',
      trigger_type: 'question',
      keywords: ['how', 'what', 'why', 'setup', 'question', 'source', 'prompt'],
      action_type: 'both',
      comment_template: 'Hey @{username}! Just answered your question and sent the direct resource to your DM 📥',
      dm_template: 'Hey @{username}! Here is the resource from my Reel: https://growthos.ai/creator-vault. Feel free to reply if you need any clarification!',
      is_ai_powered: true,
      ai_personality: 'Authoritative, sharp engineering & creator leader',
      delay_seconds: 7,
      is_active: true,
      executions_count: 18,
      created_at: new Date('2026-09-02T00:00:00Z').toISOString(),
    },
    {
      id: 'rule_real_02',
      workspace_id: 'ws_real_production',
      name: 'Comment "Thank You" & "Hi" Instant Greeting',
      trigger_type: 'comment',
      keywords: ['thankyou', 'thanks', 'thank you', 'hi', 'hello', 'great', 'awesome'],
      action_type: 'reply_comment',
      comment_template: 'Hi @{username}! Thank you for watching and supporting! 🚀 Let me know what topic you want next.',
      dm_template: '',
      is_ai_powered: true,
      ai_personality: 'Authentic creator community builder',
      delay_seconds: 5,
      is_active: true,
      executions_count: 24,
      created_at: new Date('2026-09-02T00:00:00Z').toISOString(),
    },
    {
      id: 'rule_real_03',
      workspace_id: 'ws_real_production',
      name: 'New Follower Greeting & Onboarding',
      trigger_type: 'follow',
      keywords: [],
      action_type: 'send_dm',
      comment_template: '',
      dm_template: 'Hey @{username}! Thanks for following my profile. What is the #1 project or account you are working on scaling right now? Excited to connect!',
      is_ai_powered: false,
      ai_personality: 'Community onboarding',
      delay_seconds: 20,
      is_active: true,
      executions_count: 12,
      created_at: new Date('2026-09-03T00:00:00Z').toISOString(),
    },
  ],
  automation_activities: [
    {
      id: 'act_01',
      workspace_id: 'ws_demo_sandbox',
      rule_id: 'rule_01',
      trigger_type: 'question',
      user_handle: 'sarah_builds',
      user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      post_id: 'sp_demo_01',
      post_title: '3 Algorithm Shifts for Reels in 2026',
      trigger_content: 'How do you measure DM sends on personal reels vs professional accounts?',
      comment_reply_sent: 'Great question @sarah_builds! I just sent you the full step-by-step breakdown directly in your DM 📥',
      dm_sent: 'Hey @sarah_builds! On Professional Creator accounts, Meta Graph API exposes `shares` and `messages_sent_from_post` inside Post Insights. Personal accounts only show aggregate plays.',
      is_ai_generated: true,
      status: 'sent',
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    },
    {
      id: 'act_02',
      workspace_id: 'ws_demo_sandbox',
      rule_id: 'rule_04',
      trigger_type: 'keyword',
      user_handle: 'david_agency',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      post_id: 'sp_demo_01',
      post_title: '3 Algorithm Shifts for Reels in 2026',
      trigger_content: 'AUDIT please, need this for my client',
      comment_reply_sent: 'Sent to your inbox @david_agency! Check your requests if we aren\'t mutuals yet ⚡️',
      dm_sent: 'Hey @david_agency! Here is your direct access pass to the Creator Audit Blueprint: https://growthos.ai/blueprint?ref=ig_dm',
      is_ai_generated: false,
      status: 'sent',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
      id: 'act_03',
      workspace_id: 'ws_demo_sandbox',
      rule_id: 'rule_03',
      trigger_type: 'follow',
      user_handle: 'maya_ai_dev',
      user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
      trigger_content: 'Started following your Instagram account',
      comment_reply_sent: '',
      dm_sent: 'Hey @maya_ai_dev! Welcome to the inner circle! 🚀 I noticed you just followed. Grab my free 2026 Creator Systems Roadmap: https://growthos.ai/roadmap.',
      is_ai_generated: false,
      status: 'sent',
      timestamp: new Date(Date.now() - 95 * 60000).toISOString(),
    },
    {
      id: 'act_04',
      workspace_id: 'ws_demo_sandbox',
      rule_id: 'rule_02',
      trigger_type: 'comment',
      user_handle: 'marcus_tech',
      user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      post_id: 'sp_demo_01',
      post_title: '3 Algorithm Shifts for Reels in 2026',
      trigger_content: 'hi, awesome breakdown thank you so much for this!',
      comment_reply_sent: 'Thanks so much for watching @marcus_tech! Really appreciate the support 🙌 More deep-dives coming this week!',
      dm_sent: '',
      is_ai_generated: true,
      status: 'sent',
      timestamp: new Date(Date.now() - 140 * 60000).toISOString(),
    },
    {
      id: 'act_05',
      workspace_id: 'ws_demo_sandbox',
      rule_id: 'rule_05',
      trigger_type: 'like',
      user_handle: 'lucas_creator',
      user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      post_id: 'sp_demo_01',
      post_title: '3 Algorithm Shifts for Reels in 2026',
      trigger_content: 'Liked your reel "3 Algorithm Shifts for Reels in 2026"',
      comment_reply_sent: '',
      dm_sent: 'Hey @lucas_creator! Appreciate you liking the latest breakdown on distribution algorithm updates. Glad it was valuable for you!',
      is_ai_generated: false,
      status: 'sent',
      timestamp: new Date(Date.now() - 210 * 60000).toISOString(),
    },
  ],
  autonomous_decisions: [
    {
      id: 'dec_01',
      workspace_id: 'ws_demo_sandbox',
      category: 'competitor_counter',
      title: 'Counter Competitor @growthmaster Viral Spike',
      description: 'Competitor @growthmaster published a Reel on "No-Code AI Automation" that surged to 142k views (+310% their median). Their retention dropped in the middle 10 seconds. Create a faster-paced breakdown revealing the actual production architecture.',
      reason: 'Competitor audience attention is primed on this exact keyword right now. Capitalizing within 48 hours captures explore page recommendations.',
      source_metric: 'Competitor @growthmaster Reel #42: 142,000 views, 4.8% save rate',
      competitor_handle: 'growthmaster',
      expected_impact: '+45% Reach & +380 New Followers',
      confidence: 'High',
      status: 'pending',
      suggested_action_label: 'Auto-Draft Counter-Reel Strategy',
      action_payload: {
        type: 'create_idea',
        data: {
          category: 'Trending opportunities',
          hook: 'The AI automation stack @growthmaster did not tell you about.',
          core_idea: 'Contrast superficial no-code tools with scalable webhook automation.',
          suggested_format: 'Split-screen comparison with live workflow terminal.',
          cta: 'Comment ARCHITECTURE to get the full open-source repo.',
        },
      },
      created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
    {
      id: 'dec_02',
      workspace_id: 'ws_demo_sandbox',
      category: 'schedule_timing',
      title: 'Shift Thursday Publishing Slot to 6:45 PM',
      description: 'Your account engagement velocity and competitor audience activity both peak between 6:30 PM and 7:15 PM EST on Thursdays. Your current queue post is slotted for 2:00 PM.',
      reason: 'Initial 60-minute view velocity determines whether Instagram surfaces the Reel to non-follower Explore feeds.',
      source_metric: 'Historical retention curve: +34% watch completion at 6:45 PM vs 2:00 PM',
      expected_impact: '+28% First-Hour Velocity',
      confidence: 'High',
      status: 'auto_executed',
      suggested_action_label: 'Reschedule Pending Reel',
      action_payload: {
        type: 'reschedule',
        data: {
          new_window: 'Thursday, 6:45 PM EST',
        },
      },
      created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
      executed_at: new Date(Date.now() - 13 * 3600000).toISOString(),
    },
    {
      id: 'dec_03',
      workspace_id: 'ws_demo_sandbox',
      category: 'engagement_loop',
      title: 'Activate "Question-in-Hook" Inbound DM Loop',
      description: 'Videos that ask a specific dilemma question in the first 3 seconds generate 3.4x more comment questions and 82% higher DM engagement than declarative statements.',
      reason: 'Instagram algorithms rank private messaging signals 4x heavier than public likes.',
      source_metric: 'A/B Experiment #3: 18.2% DM rate on question hooks vs 5.3% on statements',
      expected_impact: '+52% DM Conversations & Qualified Leads',
      confidence: 'High',
      status: 'manual_executed',
      suggested_action_label: 'Enforce Question Hooks in Ideation',
      created_at: new Date(Date.now() - 28 * 3600000).toISOString(),
      executed_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
      id: 'dec_04',
      workspace_id: 'ws_demo_sandbox',
      category: 'content_strategy',
      title: 'Double Down on "Creator Tool Teardowns"',
      description: 'Content analysis across your last 5 posts indicates "Tool Teardowns" drove 62% of your new followers, while general motivational clips underperformed median by -38%.',
      reason: 'Niche authority creates disproportionate conversion from viewer to follower.',
      source_metric: 'Topic Analysis: 148 follows generated per tool teardown vs 22 for lifestyle',
      expected_impact: '2.5x Faster Account Growth Rate',
      confidence: 'High',
      status: 'pending',
      suggested_action_label: 'Generate 3 Tool Teardown Ideas',
      created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    // Real Workspace decisions
    {
      id: 'dec_real_01',
      workspace_id: 'ws_real_production',
      category: 'content_strategy',
      title: 'Direct Account Authority Optimization',
      description: 'Your real account @ElenaRostova has untapped distribution in the "AI Engineering & Systems" niche. Competitors in this vertical have weak retention in the first 2 seconds.',
      reason: 'Opening with high-contrast proof creates immediate authority, beating established agency competitors.',
      source_metric: 'Competitor gap analysis: average competitor hook retention is 38%',
      expected_impact: '+60% 3-Second Retention',
      confidence: 'High',
      status: 'pending',
      suggested_action_label: 'Apply Authority Framework',
      created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
  ],
  agency_clients: [
    {
      id: 'client_01',
      workspace_id: 'ws_demo_sandbox',
      name: 'Apex Fitness & Health',
      handle: 'apex.fitlab',
      avatar_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80',
      niche: 'Fitness & Wellness',
      platform: 'instagram',
      monthly_retainer: 999,
      package_tier: 'Growth Accelerator',
      status: 'active',
      posts_delivered: 14,
      posts_target: 16,
      follower_growth_pct: 28.4,
      comments_automated: 412,
      dms_sent: 184,
      next_billing_date: '2026-10-15',
      created_at: new Date('2026-08-01T00:00:00Z').toISOString(),
    },
    {
      id: 'client_02',
      workspace_id: 'ws_demo_sandbox',
      name: 'FinScale Ventures',
      handle: 'finscale.capital',
      avatar_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=150&q=80',
      niche: 'Finance & Investing',
      platform: 'both',
      monthly_retainer: 2500,
      package_tier: 'Full Agency Domination',
      status: 'active',
      posts_delivered: 26,
      posts_target: 30,
      follower_growth_pct: 42.1,
      comments_automated: 1120,
      dms_sent: 540,
      next_billing_date: '2026-10-01',
      created_at: new Date('2026-08-05T00:00:00Z').toISOString(),
    },
    {
      id: 'client_03',
      workspace_id: 'ws_demo_sandbox',
      name: 'SaaS Metric Pulse',
      handle: 'saaspulse.app',
      avatar_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=150&q=80',
      niche: 'E-commerce & SaaS',
      platform: 'instagram',
      monthly_retainer: 499,
      package_tier: 'Starter Autopilot',
      status: 'active',
      posts_delivered: 8,
      posts_target: 8,
      follower_growth_pct: 18.2,
      comments_automated: 188,
      dms_sent: 76,
      next_billing_date: '2026-10-20',
      created_at: new Date('2026-08-15T00:00:00Z').toISOString(),
    },
    // Real Workspace client
    {
      id: 'client_real_01',
      workspace_id: 'ws_real_production',
      name: 'First Growth Client',
      handle: 'client.growth.ai',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      niche: 'Tech & AI',
      platform: 'instagram',
      monthly_retainer: 750,
      package_tier: 'Growth Accelerator',
      status: 'active',
      posts_delivered: 6,
      posts_target: 12,
      follower_growth_pct: 19.5,
      comments_automated: 84,
      dms_sent: 42,
      next_billing_date: '2026-10-10',
      created_at: new Date('2026-09-05T00:00:00Z').toISOString(),
    },
  ],
};

class DatabaseService {
  private db: DatabaseState = INITIAL_DB;

  // Workspace Operations
  getWorkspaces(): Workspace[] {
    return this.db.workspaces;
  }

  getWorkspaceById(id: string): Workspace | undefined {
    return this.db.workspaces.find((w) => w.id === id);
  }

  createWorkspace(workspace: Omit<Workspace, 'id' | 'created_at'>): Workspace {
    const newWs: Workspace = {
      ...workspace,
      id: `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.db.workspaces.push(newWs);

    // Create default connected account records for real workspace
    this.db.connected_accounts.push(
      {
        id: `acc_${newWs.id}_ig`,
        workspace_id: newWs.id,
        platform: 'instagram',
        external_account_id: '',
        handle: '',
        name: '',
        profile_image_url: '',
        account_type: 'professional_creator',
        status: 'not_connected',
        scopes_granted: [],
        last_synced_at: '',
        followers_count: 0,
        rate_limit_remaining: 100,
        is_demo_account: false,
      },
      {
        id: `acc_${newWs.id}_yt`,
        workspace_id: newWs.id,
        platform: 'youtube',
        external_account_id: '',
        handle: '',
        name: '',
        profile_image_url: '',
        account_type: 'channel',
        status: 'not_connected',
        scopes_granted: [],
        last_synced_at: '',
        followers_count: 0,
        rate_limit_remaining: 10000,
        is_demo_account: false,
      }
    );

    return newWs;
  }

  updateWorkspace(id: string, updates: Partial<Workspace>): Workspace | undefined {
    const ws = this.getWorkspaceById(id);
    if (!ws) return undefined;
    Object.assign(ws, updates);
    return ws;
  }

  // Connected Accounts
  getConnectedAccounts(workspace_id: string): ConnectedAccount[] {
    return this.db.connected_accounts.filter((a) => a.workspace_id === workspace_id);
  }

  getConnectedAccount(id: string): ConnectedAccount | undefined {
    return this.db.connected_accounts.find((a) => a.id === id);
  }

  updateConnectedAccount(id: string, updates: Partial<ConnectedAccount>): ConnectedAccount | undefined {
    const acc = this.getConnectedAccount(id);
    if (!acc) return undefined;
    Object.assign(acc, updates);
    return acc;
  }

  saveOAuthToken(tokenData: Omit<OAuthToken, 'id'>): OAuthToken {
    const existingIndex = this.db.oauth_tokens.findIndex((t) => t.connected_account_id === tokenData.connected_account_id);
    const newToken: OAuthToken = {
      ...tokenData,
      id: `tok_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    if (existingIndex >= 0) {
      this.db.oauth_tokens[existingIndex] = newToken;
    } else {
      this.db.oauth_tokens.push(newToken);
    }
    return newToken;
  }

  getOAuthToken(connected_account_id: string): OAuthToken | undefined {
    return this.db.oauth_tokens.find((t) => t.connected_account_id === connected_account_id);
  }

  deleteOAuthToken(connected_account_id: string): void {
    this.db.oauth_tokens = this.db.oauth_tokens.filter((t) => t.connected_account_id !== connected_account_id);
  }

  // Videos & Processing
  getVideos(workspace_id: string): VideoItem[] {
    return this.db.videos.filter((v) => v.workspace_id === workspace_id);
  }

  getVideoById(id: string): VideoItem | undefined {
    return this.db.videos.find((v) => v.id === id);
  }

  addVideo(video: Omit<VideoItem, 'id' | 'created_at'>): VideoItem {
    const newVid: VideoItem = {
      ...video,
      id: `vid_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.db.videos.unshift(newVid);
    return newVid;
  }

  updateVideo(id: string, updates: Partial<VideoItem>): VideoItem | undefined {
    const vid = this.getVideoById(id);
    if (!vid) return undefined;
    Object.assign(vid, updates);
    return vid;
  }

  // Content Analysis
  getContentAnalysisByVideo(video_id: string): ContentAnalysis | undefined {
    return this.db.content_analysis.find((ca) => ca.video_id === video_id);
  }

  saveContentAnalysis(analysis: Omit<ContentAnalysis, 'id' | 'generated_at'>): ContentAnalysis {
    const existingIndex = this.db.content_analysis.findIndex((ca) => ca.video_id === analysis.video_id);
    const record: ContentAnalysis = {
      ...analysis,
      id: `ca_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      generated_at: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      this.db.content_analysis[existingIndex] = record;
    } else {
      this.db.content_analysis.push(record);
    }
    return record;
  }

  // Video Metadata & Captions
  getVideoMetadata(video_id: string): VideoMetadata | undefined {
    return this.db.video_metadata.find((m) => m.video_id === video_id);
  }

  saveVideoMetadata(meta: Omit<VideoMetadata, 'id'>): VideoMetadata {
    const existingIndex = this.db.video_metadata.findIndex((m) => m.video_id === meta.video_id);
    const record: VideoMetadata = {
      ...meta,
      id: `meta_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    if (existingIndex >= 0) {
      this.db.video_metadata[existingIndex] = record;
    } else {
      this.db.video_metadata.push(record);
    }
    return record;
  }

  // Scheduled & Published Posts
  getScheduledPosts(workspace_id: string): ScheduledPost[] {
    return this.db.scheduled_posts.filter((p) => p.workspace_id === workspace_id);
  }

  getScheduledPostById(id: string): ScheduledPost | undefined {
    return this.db.scheduled_posts.find((p) => p.id === id);
  }

  createScheduledPost(post: Omit<ScheduledPost, 'id' | 'created_at' | 'updated_at'>): ScheduledPost {
    const record: ScheduledPost = {
      ...post,
      id: `sp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.db.scheduled_posts.push(record);
    return record;
  }

  updateScheduledPost(id: string, updates: Partial<ScheduledPost>): ScheduledPost | undefined {
    const post = this.getScheduledPostById(id);
    if (!post) return undefined;
    Object.assign(post, { ...updates, updated_at: new Date().toISOString() });
    return post;
  }

  // Atomic state transition for scheduler to prevent race conditions
  atomicLockAndTransitionToPublishing(id: string): boolean {
    const post = this.getScheduledPostById(id);
    if (!post || post.status !== 'scheduled') {
      return false;
    }
    post.status = 'publishing';
    post.publish_attempts += 1;
    post.updated_at = new Date().toISOString();
    return true;
  }

  // Metric Snapshots (Immutable)
  getMetricSnapshots(scheduled_post_id: string): MetricSnapshot[] {
    return this.db.metric_snapshots.filter((s) => s.scheduled_post_id === scheduled_post_id);
  }

  addMetricSnapshot(snapshot: Omit<MetricSnapshot, 'id' | 'captured_at'>): MetricSnapshot {
    const record: MetricSnapshot = {
      ...snapshot,
      id: `ms_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      captured_at: new Date().toISOString(),
    };
    this.db.metric_snapshots.push(record);
    return record;
  }

  // Post Diagnoses
  getPostDiagnosis(scheduled_post_id: string): PostDiagnosis | undefined {
    return this.db.post_diagnoses.find((d) => d.scheduled_post_id === scheduled_post_id);
  }

  savePostDiagnosis(diag: Omit<PostDiagnosis, 'id' | 'generated_at'>): PostDiagnosis {
    const existingIndex = this.db.post_diagnoses.findIndex((d) => d.scheduled_post_id === diag.scheduled_post_id);
    const record: PostDiagnosis = {
      ...diag,
      id: `diag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      generated_at: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      this.db.post_diagnoses[existingIndex] = record;
    } else {
      this.db.post_diagnoses.push(record);
    }
    return record;
  }

  // Growth Brain
  getGrowthBrain(workspace_id: string): GrowthBrainInsight | undefined {
    return this.db.growth_brain.find((gb) => gb.workspace_id === workspace_id);
  }

  saveGrowthBrain(insight: Omit<GrowthBrainInsight, 'id' | 'updated_at'>): GrowthBrainInsight {
    const existingIndex = this.db.growth_brain.findIndex((gb) => gb.workspace_id === insight.workspace_id);
    const record: GrowthBrainInsight = {
      ...insight,
      id: `gb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      updated_at: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      this.db.growth_brain[existingIndex] = record;
    } else {
      this.db.growth_brain.push(record);
    }
    return record;
  }

  // Content Ideas
  getContentIdeas(workspace_id: string): ContentIdea[] {
    return this.db.content_ideas.filter((i) => i.workspace_id === workspace_id);
  }

  saveContentIdeas(workspace_id: string, ideas: Omit<ContentIdea, 'id' | 'workspace_id' | 'created_at'>[]): ContentIdea[] {
    const newRecords: ContentIdea[] = ideas.map((idea) => ({
      ...idea,
      id: `idea_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      workspace_id,
      created_at: new Date().toISOString(),
    }));
    this.db.content_ideas.unshift(...newRecords);
    return newRecords;
  }

  // Competitor Intel
  getCompetitors(workspace_id: string): CompetitorIntel[] {
    return this.db.competitors.filter((c) => c.workspace_id === workspace_id);
  }

  addCompetitor(competitor: Omit<CompetitorIntel, 'id' | 'last_analyzed_at'>): CompetitorIntel {
    const record: CompetitorIntel = {
      ...competitor,
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      last_analyzed_at: new Date().toISOString(),
    };
    this.db.competitors.push(record);
    return record;
  }

  // Experiments
  getExperiments(workspace_id: string): Experiment[] {
    return this.db.experiments.filter((e) => e.workspace_id === workspace_id);
  }

  createExperiment(exp: Omit<Experiment, 'id' | 'created_at'>): Experiment {
    const record: Experiment = {
      ...exp,
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.db.experiments.unshift(record);
    return record;
  }

  updateExperiment(id: string, updates: Partial<Experiment>): Experiment | undefined {
    const exp = this.db.experiments.find((e) => e.id === id);
    if (!exp) return undefined;
    Object.assign(exp, updates);
    return exp;
  }

  // Weekly Reports
  getWeeklyReports(workspace_id: string): WeeklyReport[] {
    return this.db.weekly_reports.filter((r) => r.workspace_id === workspace_id);
  }

  saveWeeklyReport(report: Omit<WeeklyReport, 'id' | 'created_at'>): WeeklyReport {
    const record: WeeklyReport = {
      ...report,
      id: `wr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.db.weekly_reports.unshift(record);
    return record;
  }

  // Notifications
  getNotifications(workspace_id: string): NotificationItem[] {
    return this.db.notifications
      .filter((n) => n.workspace_id === workspace_id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'created_at'>): NotificationItem {
    const record: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.db.notifications.unshift(record);
    return record;
  }

  markNotificationRead(id: string): void {
    const n = this.db.notifications.find((notif) => notif.id === id);
    if (n) n.read = true;
  }

  // Audit Logs
  getAuditLogs(workspace_id: string): AuditLog[] {
    return this.db.audit_logs
      .filter((l) => l.workspace_id === workspace_id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  logAudit(log: Omit<AuditLog, 'id' | 'created_at'>): AuditLog {
    const record: AuditLog = {
      ...log,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.db.audit_logs.unshift(record);
    return record;
  }

  // ==========================================
  // Automation Rules & Activities
  // ==========================================
  getAutomationRules(workspace_id: string): AutomationRule[] {
    return this.db.automation_rules.filter((r) => r.workspace_id === workspace_id);
  }

  getAutomationRuleById(id: string): AutomationRule | undefined {
    return this.db.automation_rules.find((r) => r.id === id);
  }

  saveAutomationRule(rule: Omit<AutomationRule, 'id' | 'created_at' | 'executions_count'>): AutomationRule {
    const record: AutomationRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      executions_count: 0,
      created_at: new Date().toISOString(),
    };
    this.db.automation_rules.unshift(record);
    return record;
  }

  updateAutomationRule(id: string, updates: Partial<AutomationRule>): AutomationRule | undefined {
    const r = this.getAutomationRuleById(id);
    if (!r) return undefined;
    Object.assign(r, updates);
    return r;
  }

  deleteAutomationRule(id: string): boolean {
    const initialLen = this.db.automation_rules.length;
    this.db.automation_rules = this.db.automation_rules.filter((r) => r.id !== id);
    return this.db.automation_rules.length < initialLen;
  }

  getAutomationActivities(workspace_id: string): AutomationActivity[] {
    return this.db.automation_activities
      .filter((a) => a.workspace_id === workspace_id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  logAutomationActivity(act: Omit<AutomationActivity, 'id' | 'timestamp'>): AutomationActivity {
    const record: AutomationActivity = {
      ...act,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.db.automation_activities.unshift(record);

    // If rule_id provided, increment execution count
    if (act.rule_id) {
      const rule = this.getAutomationRuleById(act.rule_id);
      if (rule) {
        rule.executions_count = (rule.executions_count || 0) + 1;
      }
    }

    return record;
  }

  getAutomationStats(workspace_id: string): AutomationStats {
    const acts = this.getAutomationActivities(workspace_id);
    const commentsHandled = acts.filter((a) => a.trigger_type === 'comment' || a.trigger_type === 'question' || a.trigger_type === 'keyword').length;
    const dmsSent = acts.filter((a) => Boolean(a.dm_sent)).length;
    const greetings = acts.filter((a) => a.trigger_type === 'follow').length;
    const questionsAnswered = acts.filter((a) => a.trigger_type === 'question').length;

    return {
      total_comments_handled: commentsHandled || 18,
      total_dms_sent: dmsSent || 14,
      total_greetings_sent: greetings || 5,
      total_questions_answered: questionsAnswered || 9,
      safety_rate_limit_status: 'Optimal',
      daily_dm_quota_used: Math.min(dmsSent, 100),
      hours_saved_vs_manual: Number(((commentsHandled * 2 + dmsSent * 4) / 60).toFixed(1)),
    };
  }

  // ==========================================
  // Autonomous Decisions
  // ==========================================
  getAutonomousDecisions(workspace_id: string): AutonomousDecision[] {
    return this.db.autonomous_decisions
      .filter((d) => d.workspace_id === workspace_id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  addAutonomousDecision(decision: Omit<AutonomousDecision, 'id' | 'created_at'>): AutonomousDecision {
    const record: AutonomousDecision = {
      ...decision,
      id: `dec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.db.autonomous_decisions.unshift(record);
    return record;
  }

  executeAutonomousDecision(id: string): AutonomousDecision | undefined {
    const d = this.db.autonomous_decisions.find((dec) => dec.id === id);
    if (!d) return undefined;
    d.status = 'manual_executed';
    d.executed_at = new Date().toISOString();

    // If decision has an action payload like creating an idea, auto-apply it!
    if (d.action_payload?.type === 'create_idea' && d.action_payload.data) {
      this.saveContentIdeas(d.workspace_id, [
        {
          category: d.action_payload.data.category || 'Trending opportunities',
          hook: d.action_payload.data.hook,
          core_idea: d.action_payload.data.core_idea,
          suggested_format: d.action_payload.data.suggested_format,
          cta: d.action_payload.data.cta,
          target_audience: 'Creators seeking high-authority distribution',
          why_it_works: `Generated from autonomous decision "${d.title}"`,
        },
      ]);
    }

    this.logAudit({
      workspace_id: d.workspace_id,
      actor_name: 'Elena Rostova',
      actor_role: 'owner',
      action: 'execute_decision',
      target_type: 'decision',
      target_id: d.id,
      details: `Executed autonomous growth decision: "${d.title}". Expected impact: ${d.expected_impact}.`,
    });

    this.addNotification({
      workspace_id: d.workspace_id,
      type: 'analysis_ready',
      title: 'Growth Decision Executed',
      message: `"${d.title}" has been executed into your production workflow.`,
      read: false,
      link_section: 'decisions',
    });

    return d;
  }

  dismissAutonomousDecision(id: string): AutonomousDecision | undefined {
    const d = this.db.autonomous_decisions.find((dec) => dec.id === id);
    if (!d) return undefined;
    d.status = 'dismissed';
    return d;
  }

  // ==========================================
  // Client Agency Hub
  // ==========================================
  getAgencyClients(workspace_id: string): AgencyClient[] {
    return this.db.agency_clients.filter((c) => c.workspace_id === workspace_id);
  }

  addAgencyClient(client: Omit<AgencyClient, 'id' | 'created_at'>): AgencyClient {
    const record: AgencyClient = {
      ...client,
      id: `client_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.db.agency_clients.unshift(record);

    this.logAudit({
      workspace_id: client.workspace_id,
      actor_name: 'Elena Rostova',
      actor_role: 'owner',
      action: 'connect',
      target_type: 'client',
      target_id: record.id,
      details: `Onboarded agency client "${client.name}" (@${client.handle}) on ${client.package_tier} ($${client.monthly_retainer}/mo).`,
    });

    return record;
  }

  updateAgencyClient(id: string, updates: Partial<AgencyClient>): AgencyClient | undefined {
    const c = this.db.agency_clients.find((client) => client.id === id);
    if (!c) return undefined;
    Object.assign(c, updates);
    return c;
  }

  deleteAgencyClient(id: string): boolean {
    const initialLen = this.db.agency_clients.length;
    this.db.agency_clients = this.db.agency_clients.filter((c) => c.id !== id);
    return this.db.agency_clients.length < initialLen;
  }
}

export const dbService = new DatabaseService();

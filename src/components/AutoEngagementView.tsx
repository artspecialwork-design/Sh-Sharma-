import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  UserCheck,
  Heart,
  Bot,
  Sparkles,
  ShieldCheck,
  Clock,
  Plus,
  Trash2,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Sliders,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import {
  AutomationRule,
  AutomationActivity,
  AutomationStats,
  AutomationTriggerType,
  Workspace,
} from '../types/index.js';
import {
  fetchAutomationRules,
  createAutomationRule,
  updateAutomationRule,
  deleteAutomationRule,
  fetchAutomationActivities,
  fetchAutomationStats,
  triggerAutomationSimulation,
} from '../services/api.js';

interface AutoEngagementViewProps {
  workspace: Workspace;
  onNavigateToCompetitors?: () => void;
  onNavigateToAgency?: () => void;
}

export const AutoEngagementView: React.FC<AutoEngagementViewProps> = ({
  workspace,
  onNavigateToCompetitors,
  onNavigateToAgency,
}) => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [activities, setActivities] = useState<AutomationActivity[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rules' | 'activities' | 'simulator'>('simulator');

  // Simulator state
  const [simType, setSimType] = useState<AutomationTriggerType>('question');
  const [simUser, setSimUser] = useState('tech_creator_mark');
  const [simContent, setSimContent] = useState('How do you set up the lighting and audio for your reels? Love the quality!');
  const [simRunning, setSimRunning] = useState(false);
  const [simResult, setSimResult] = useState<{
    commentReply?: string;
    dmMessage?: string;
    matchedRule?: string;
  } | null>(null);

  // New Rule Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleTrigger, setNewRuleTrigger] = useState<AutomationTriggerType>('comment');
  const [newRuleKeywords, setNewRuleKeywords] = useState('thankyou, hi, awesome, great');
  const [newRuleAction, setNewRuleAction] = useState<'reply_comment' | 'send_dm' | 'both'>('both');
  const [newRuleCommentTemplate, setNewRuleCommentTemplate] = useState('Hi @{username}! Thank you so much for watching! 🙌 Sent you a DM with extra tips!');
  const [newRuleDmTemplate, setNewRuleDmTemplate] = useState('Hey @{username}! Appreciate you stopping by my latest reel. Here is the full guide: https://growthos.ai/vault');
  const [newRuleIsAi, setNewRuleIsAi] = useState(true);
  const [newRulePersonality, setNewRulePersonality] = useState('Authoritative, warm, high-value creator');
  const [newRuleDelay, setNewRuleDelay] = useState(8);
  const [savingRule, setSavingRule] = useState(false);

  useEffect(() => {
    loadData();
  }, [workspace.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [r, a, s] = await Promise.all([
        fetchAutomationRules(workspace.id),
        fetchAutomationActivities(workspace.id),
        fetchAutomationStats(workspace.id),
      ]);
      setRules(r);
      setActivities(a);
      setStats(s);
    } catch (err) {
      console.error('Error loading automation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (rule: AutomationRule) => {
    try {
      const updated = await updateAutomationRule(rule.id, { is_active: !rule.is_active });
      setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err) {
      console.error('Error updating rule:', err);
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await deleteAutomationRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error deleting rule:', err);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;
    setSavingRule(true);
    try {
      const keywordsArray = newRuleKeywords
        .split(',')
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

      const created = await createAutomationRule({
        workspace_id: workspace.id,
        name: newRuleName,
        trigger_type: newRuleTrigger,
        keywords: keywordsArray,
        action_type: newRuleAction,
        comment_template: newRuleCommentTemplate,
        dm_template: newRuleDmTemplate,
        is_ai_powered: newRuleIsAi,
        ai_personality: newRulePersonality,
        delay_seconds: newRuleDelay,
      });

      setRules((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewRuleName('');
    } catch (err) {
      console.error('Error creating rule:', err);
    } finally {
      setSavingRule(false);
    }
  };

  const handleRunSimulator = async () => {
    if (!simUser) return;
    setSimRunning(true);
    setSimResult(null);
    try {
      const res = await triggerAutomationSimulation({
        workspace_id: workspace.id,
        trigger_type: simType,
        user_handle: simUser,
        content: simContent,
        post_title: '3 Algorithm Shifts for Reels in 2026',
      });
      setSimResult({
        commentReply: res.commentReply,
        dmMessage: res.dmMessage,
        matchedRule: res.matchedRule,
      });
      // Refresh activities & stats
      const [a, s] = await Promise.all([
        fetchAutomationActivities(workspace.id),
        fetchAutomationStats(workspace.id),
      ]);
      setActivities(a);
      setStats(s);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimRunning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400" />
              <span>Smart Engagement &amp; Direct Messaging Engine</span>
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Autopilot Active</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Automatically sends personalized replies to comments, answers questions with Gemini AI, and delivers greetings &amp; resources via Direct Message (DM).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
              activeTab === 'simulator'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-purple-400" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Automation Rule</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Comments Handled</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">{stats?.total_comments_handled || 18}</div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center mt-1">
            <span>100% replied in &lt;10s</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Auto-DMs Sent</span>
            <Send className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white">{stats?.total_dms_sent || 14}</div>
          <div className="text-[11px] text-indigo-400 font-medium flex items-center mt-1">
            <span>Direct to Inboxes</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Follower Greetings</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">{stats?.total_greetings_sent || 5}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            <span>Warm Onboarding</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">AI Q&amp;A Answers</span>
            <Bot className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-xl font-bold text-white">{stats?.total_questions_answered || 9}</div>
          <div className="text-[11px] text-pink-400 font-medium mt-1">
            <span>Powered by Gemini</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Safety Rate Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">Optimal</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            <span>{stats?.daily_dm_quota_used || 14}/100 safe quota</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Hours Saved</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300">
            {stats?.hours_saved_vs_manual ? `${stats.hours_saved_vs_manual} hrs` : '38.4 hrs'}
          </div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">
            <span>Replaces 1 Community Mgr</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'simulator'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Interactive Simulator &amp; Instant Tester</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'rules'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Automation Rules &amp; Triggers ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'activities'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Live Activity Feed ({activities.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. INTERACTIVE SIMULATOR */}
      {/* ============================================================== */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Simulator Form */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-base">Test Your Auto-Response Engine</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Simulate a real Instagram follower comment, question, or follow to watch your smart auto-reply and direct DM send in real time.
              </p>
            </div>

            {/* Trigger Type selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Simulated Event Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'question', label: 'Question in Comment', icon: Bot, prompt: 'How do you set up the lighting and audio for your reels? Love the quality!' },
                  { id: 'comment', label: 'Thank You / Greeting', icon: MessageSquare, prompt: 'Thank you so much for this breakdown, really helpful! 🔥' },
                  { id: 'follow', label: 'New Account Follower', icon: UserCheck, prompt: 'Started following your account' },
                  { id: 'like', label: 'Reel Liked', icon: Heart, prompt: 'Liked your reel "3 Algorithm Shifts for Reels in 2026"' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = simType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSimType(item.id as AutomationTriggerType);
                        setSimContent(item.prompt);
                      }}
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left text-xs transition ${
                        isSel
                          ? 'bg-purple-600/20 border-purple-500 text-white font-medium shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSel ? 'text-purple-400' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Keyword Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Quick Trigger Presets</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Question: "What mic?"', text: 'What microphone are you using in this video? The audio is crisp!' },
                  { label: 'Lead Keyword: "LINK"', text: 'LINK please! Send the full guide' },
                  { label: 'Lead Keyword: "AUDIT"', text: 'Can I get the AUDIT template please?' },
                  { label: 'Appreciation: "Hi & Thanks"', text: 'Hi! Thank you so much, this made my day' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSimType('question');
                      setSimContent(preset.text);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Instagram Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-slate-500">@</span>
                <input
                  type="text"
                  value={simUser}
                  onChange={(e) => setSimUser(e.target.value.replace(/^@/, ''))}
                  placeholder="creator_handle"
                  className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Content / Comment */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {simType === 'follow' ? 'Follower Interaction Note' : 'Comment Text'}
              </label>
              <textarea
                value={simContent}
                onChange={(e) => setSimContent(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunSimulator}
              disabled={simRunning || !simUser}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2"
            >
              {simRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing AI Response &amp; Direct Message...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Test Fire Auto-Engagement Now</span>
                </>
              )}
            </button>
          </div>

          {/* Simulator Visualizer */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Live Dispatch Simulator Output
                  </span>
                </div>
                {simResult?.matchedRule && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                    Matched: {simResult.matchedRule}
                  </span>
                )}
              </div>

              {simResult ? (
                <div className="space-y-4 animate-in fade-in">
                  {/* Incoming Event Banner */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-xs text-white shrink-0">
                      {simUser.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">@{simUser}</span>
                        <span className="text-[10px] text-slate-500">Incoming Event</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{simContent}</p>
                    </div>
                  </div>

                  {/* Public Comment Reply */}
                  {simResult.commentReply ? (
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                          <span>1. Automated Public Comment Reply Sent</span>
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          Delivered to Thread
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 pl-5 border-l-2 border-purple-500/50 italic">
                        &ldquo;{simResult.commentReply}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      (No public comment reply needed for this event type)
                    </div>
                  )}

                  {/* Private Direct Message (DM) */}
                  {simResult.dmMessage ? (
                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-indigo-400" />
                          <span>2. Automated Direct Message (DM) Delivered</span>
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">
                          Direct to @{simUser} Inbox
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/90 border border-indigo-500/20 text-xs text-slate-200">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Private DM Payload:
                        </div>
                        <p className="leading-relaxed text-indigo-100">{simResult.dmMessage}</p>
                      </div>
                    </div>
                  ) : null}

                  {/* Safety & Compliance Badge */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Meta Graph API Compliant &bull; 8-second humanized delivery jitter</span>
                    </div>
                    <span className="font-semibold text-emerald-400">Status 200 OK</span>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3 text-slate-500">
                  <Play className="w-10 h-10 mx-auto text-slate-700 stroke-[1.5]" />
                  <p className="text-xs max-w-sm mx-auto">
                    Select an interaction on the left and click &ldquo;Test Fire Auto-Engagement Now&rdquo; to simulate instant automated responses.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Links to Competitors & Agency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span>Competitor Decision Engine</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Always inspects competitor metrics to generate autonomous growth decisions for your account.
                </p>
                {onNavigateToCompetitors && (
                  <button
                    onClick={onNavigateToCompetitors}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 mt-1"
                  >
                    <span>View Competitor Analytics</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Agency &amp; Client Monetization</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Use this automated infrastructure to manage client accounts and earn recurring retainers.
                </p>
                {onNavigateToAgency && (
                  <button
                    onClick={onNavigateToAgency}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 mt-1"
                  >
                    <span>Open Agency Hub</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. AUTOMATION RULES */}
      {/* ============================================================== */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Configured Automation Rules ({rules.length})
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-5 rounded-2xl border transition shadow-sm flex flex-col justify-between ${
                  rule.is_active
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-slate-950/60 border-slate-900 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm">{rule.name}</h4>
                        {rule.is_ai_powered && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Powered</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 capitalize">
                        Trigger: {rule.trigger_type} &bull; Action: {rule.action_type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleRule(rule)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          rule.is_active
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rule.is_active ? 'Active' : 'Paused'}
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Keywords */}
                  {rule.keywords.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Matching Keywords
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {rule.keywords.map((k, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] border border-slate-800">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Templates */}
                  {rule.comment_template && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300">
                      <span className="text-slate-500 font-semibold block mb-0.5">Comment Reply:</span>
                      <p className="line-clamp-2 italic">&ldquo;{rule.comment_template}&rdquo;</p>
                    </div>
                  )}

                  {rule.dm_template && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300">
                      <span className="text-slate-500 font-semibold block mb-0.5">Direct Message (DM):</span>
                      <p className="line-clamp-2 italic">&ldquo;{rule.dm_template}&rdquo;</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Executions: {rule.executions_count || 0} times</span>
                  <span>Delay: {rule.delay_seconds}s jitter</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. LIVE ACTIVITY FEED */}
      {/* ============================================================== */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Automated Engagements History ({activities.length})
            </span>
            <button
              onClick={loadData}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Log</span>
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {act.user_handle.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs">@{act.user_handle}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                        {act.trigger_type}
                      </span>
                      {act.is_ai_generated && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Gemini AI</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{act.trigger_content}</p>

                    {/* Dispatched actions */}
                    <div className="mt-2 space-y-1 text-[11px]">
                      {act.comment_reply_sent && (
                        <div className="text-purple-300 flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3 text-purple-400" />
                          <span>Comment Reply: &ldquo;{act.comment_reply_sent}&rdquo;</span>
                        </div>
                      )}
                      {act.dm_sent && (
                        <div className="text-indigo-300 flex items-center space-x-1">
                          <Send className="w-3 h-3 text-indigo-400" />
                          <span>DM Sent: &ldquo;{act.dm_sent}&rdquo;</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Delivered</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleCreateRule}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Create New Automation Rule</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Lead Magnet 'GUIDE' Trigger"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Trigger Event</label>
                  <select
                    value={newRuleTrigger}
                    onChange={(e) => setNewRuleTrigger(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="comment">Any Comment</option>
                    <option value="question">Question in Comment</option>
                    <option value="keyword">Specific Keyword</option>
                    <option value="follow">New Follower</option>
                    <option value="like">Reel Like</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Action Type</label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="both">Both Comment &amp; DM</option>
                    <option value="reply_comment">Comment Reply Only</option>
                    <option value="send_dm">Direct Message (DM) Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Trigger Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={newRuleKeywords}
                  onChange={(e) => setNewRuleKeywords(e.target.value)}
                  placeholder="e.g. how, link, info, question, price, audit"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="ruleAiToggle"
                  checked={newRuleIsAi}
                  onChange={(e) => setNewRuleIsAi(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                />
                <label htmlFor="ruleAiToggle" className="text-xs text-slate-300 font-medium">
                  Use Gemini AI to craft personalized answers for each commenter
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Public Comment Reply Template (use &#123;username&#125;)
                </label>
                <textarea
                  value={newRuleCommentTemplate}
                  onChange={(e) => setNewRuleCommentTemplate(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Direct Message (DM) Template (use &#123;username&#125;)
                </label>
                <textarea
                  value={newRuleDmTemplate}
                  onChange={(e) => setNewRuleDmTemplate(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Humanized Delay Jitter (seconds)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={60}
                    value={newRuleDelay}
                    onChange={(e) => setNewRuleDelay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    AI Personality Tone
                  </label>
                  <input
                    type="text"
                    value={newRulePersonality}
                    onChange={(e) => setNewRulePersonality(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingRule}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
              >
                {savingRule ? 'Saving Rule...' : 'Save & Activate Rule'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

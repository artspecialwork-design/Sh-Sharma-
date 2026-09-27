import React, { useState, useEffect } from 'react';
import {
  Radar,
  Instagram,
  Youtube,
  Plus,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Layers,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  BarChart3,
  BrainCircuit,
  Sliders,
  Award,
} from 'lucide-react';
import {
  CompetitorIntel,
  AutonomousDecision,
  CompetitorComparison,
  Workspace,
} from '../types/index.js';
import {
  fetchCompetitors,
  addCompetitor,
  fetchAutonomousDecisions,
  executeAutonomousDecision,
  dismissAutonomousDecision,
  generateAiDecisions,
  fetchCompetitorComparisons,
} from '../services/api.js';

interface CompetitorIntelViewProps {
  workspace: Workspace;
  onNavigateToIdeas?: () => void;
  onNavigateToAutomation?: () => void;
}

export const CompetitorIntelView: React.FC<CompetitorIntelViewProps> = ({
  workspace,
  onNavigateToIdeas,
  onNavigateToAutomation,
}) => {
  const [competitors, setCompetitors] = useState<CompetitorIntel[]>([]);
  const [decisions, setDecisions] = useState<AutonomousDecision[]>([]);
  const [comparisons, setComparisons] = useState<CompetitorComparison[]>([]);
  const [myHandle, setMyHandle] = useState('elena_rostova');
  const [activeTab, setActiveTab] = useState<'decisions' | 'comparison' | 'profiles'>('decisions');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newHandle, setNewHandle] = useState('');
  const [newPlatform, setNewPlatform] = useState<'instagram' | 'youtube'>('instagram');
  const [loading, setLoading] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [executingId, setExecutingId] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, [workspace.id]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [compList, decList, compData] = await Promise.all([
        fetchCompetitors(workspace.id),
        fetchAutonomousDecisions(workspace.id),
        fetchCompetitorComparisons(workspace.id),
      ]);
      setCompetitors(compList);
      setDecisions(decList);
      setComparisons(compData.comparisons || []);
      if (compData.my_account_handle) {
        setMyHandle(compData.my_account_handle);
      }
    } catch (err) {
      console.error('Error loading competitor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle) return;
    setLoading(true);
    try {
      await addCompetitor(workspace.id, newHandle, newPlatform);
      setShowAddModal(false);
      setNewHandle('');
      loadAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteDecision = async (id: string) => {
    setExecutingId(id);
    try {
      const res = await executeAutonomousDecision(id);
      setDecisions((prev) => prev.map((d) => (d.id === id ? res.decision : d)));
    } catch (err) {
      console.error('Error executing decision:', err);
    } finally {
      setExecutingId(null);
    }
  };

  const handleDismissDecision = async (id: string) => {
    try {
      const res = await dismissAutonomousDecision(id);
      setDecisions((prev) => prev.map((d) => (d.id === id ? res.decision : d)));
    } catch (err) {
      console.error('Error dismissing decision:', err);
    }
  };

  const handleRunAiAudit = async () => {
    setAuditing(true);
    try {
      const newDecisions = await generateAiDecisions(workspace.id);
      setDecisions((prev) => [...newDecisions, ...prev]);
      setActiveTab('decisions');
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setAuditing(false);
    }
  };

  const pendingDecisions = decisions.filter((d) => d.status === 'pending');
  const executedDecisions = decisions.filter((d) => d.status === 'auto_executed' || d.status === 'manual_executed');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Radar className="w-6 h-6 text-purple-400" />
              <span>Competitor Intelligence &amp; Autonomous Growth Decisions</span>
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Autonomous Growth Brain
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Continuously evaluates your account against competitors to formulate and execute strategic growth decisions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunAiAudit}
            disabled={auditing}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-semibold text-xs transition"
          >
            {auditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning Competitor Accounts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Run AI Competitor Audit</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Creator Handle</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('decisions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'decisions'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Autonomous Strategic Decisions ({pendingDecisions.length} pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'comparison'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Account vs Competitor Side-by-Side</span>
        </button>

        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'profiles'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radar className="w-3.5 h-3.5" />
          <span>Tracked Competitor Profiles ({competitors.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. AUTONOMOUS STRATEGIC DECISIONS */}
      {/* ============================================================== */}
      {activeTab === 'decisions' && (
        <div className="space-y-6">
          {/* Autopilot Status Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white text-base">Autonomous Decision Loop Active</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    24/7 Intelligence
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  GrowthOS analyzes hook retention, explore spikes, and posting cadences across your niche. When a competitor creates an exploitable gap, the system formulates high-confidence decisions for 1-click execution.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Decisions Executed</span>
                <span className="text-lg font-bold text-emerald-400">{executedDecisions.length} Applied</span>
              </div>
            </div>
          </div>

          {/* Pending Decisions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pending Autonomous Growth Decisions ({pendingDecisions.length})
              </span>
              <span className="text-xs text-slate-400">
                Ranked by expected audience impact
              </span>
            </div>

            {pendingDecisions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                <h4 className="font-bold text-white text-sm">All Current Decisions Executed</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your account is aligned with the latest competitor intelligence. Click &ldquo;Run AI Competitor Audit&rdquo; to scan for fresh opportunity gaps.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingDecisions.map((dec) => (
                  <div
                    key={dec.id}
                    className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-4 shadow-xl hover:border-purple-500/50 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                            {dec.category.replace('_', ' ')}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Expected: {dec.expected_impact}
                          </span>
                          {dec.competitor_handle && (
                            <span className="text-xs text-slate-400 font-medium">
                              Target: @{dec.competitor_handle}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white">{dec.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                          {dec.description}
                        </p>
                      </div>

                      {/* Execution Action Button */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleDismissDecision(dec.id)}
                          className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition"
                        >
                          Dismiss
                        </button>

                        <button
                          onClick={() => handleExecuteDecision(dec.id)}
                          disabled={executingId === dec.id}
                          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/30"
                        >
                          {executingId === dec.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Executing Decision...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              <span>{dec.suggested_action_label || 'Execute Decision'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Rationale & Source Benchmark */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                        <span className="text-slate-500 font-semibold block mb-0.5">Underlying Algorithm Rationale:</span>
                        <p className="text-slate-300">{dec.reason}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                        <span className="text-slate-500 font-semibold block mb-0.5">Source Metric Evidence:</span>
                        <p className="text-slate-300">{dec.source_metric}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Executed Decision History */}
          {executedDecisions.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Executed Decision History ({executedDecisions.length})
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {executedDecisions.map((dec) => (
                  <div
                    key={dec.id}
                    className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{dec.title}</span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Applied</span>
                      </span>
                    </div>
                    <p className="text-slate-400 line-clamp-2">{dec.description}</p>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Impact: {dec.expected_impact}</span>
                      <span>{dec.executed_at ? new Date(dec.executed_at).toLocaleDateString() : 'Active'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SIDE-BY-SIDE ACCOUNT VS COMPETITOR COMPARISON */}
      {/* ============================================================== */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Benchmark Matrix: Your Account vs Competitors</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time side-by-side comparison of engagement velocity, audience size, and posting cadence.
                </p>
              </div>

              <span className="text-xs text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                Active Benchmark
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Account / Creator</th>
                    <th className="py-3 px-4">Followers</th>
                    <th className="py-3 px-4">Engagement Rate</th>
                    <th className="py-3 px-4">Posting Cadence</th>
                    <th className="py-3 px-4">Dominant Hook Style</th>
                    <th className="py-3 px-4">Strategic Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {/* Your Account Row */}
                  <tr className="bg-purple-950/20 font-medium">
                    <td className="py-3 px-4 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-white">Your Account (@{myHandle})</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {comparisons[0] ? comparisons[0].my_followers.toLocaleString() : '5,400'}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">12.8% (Top 2%)</td>
                    <td className="py-3 px-4">Daily (Best-Time)</td>
                    <td className="py-3 px-4 text-purple-300 font-semibold">Problem / Dilemma Hook</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        +10.0% Engagement Advantage
                      </span>
                    </td>
                  </tr>

                  {/* Competitor Rows */}
                  {comparisons.map((c) => (
                    <tr key={c.competitor_id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        @{c.competitor_handle} ({c.competitor_name})
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {c.competitor_followers.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400">2.8%</td>
                      <td className="py-3 px-4 text-slate-400">{c.posting_cadence_comparison.split('Competitor: ')[1] || '5x/week'}</td>
                      <td className="py-3 px-4 text-slate-400">{c.top_viral_hook}</td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                        {c.gap_to_exploit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. TRACKED COMPETITOR PROFILES */}
      {/* ============================================================== */}
      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitors.map((comp) => (
            <div
              key={comp.id}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white">
                      {comp.platform === 'instagram' ? <Instagram className="w-5 h-5" /> : <Youtube className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">@{comp.handle}</h3>
                      <span className="text-xs text-slate-400">{comp.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-200 block">{comp.followers_count.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">followers</span>
                  </div>
                </div>

                {/* Stats & Themes */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Cadence:</span>
                    <span className="font-semibold text-slate-200">{comp.posting_frequency}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Public Engagement:</span>
                    <span className="font-semibold text-purple-300">{comp.public_engagement_estimate}</span>
                  </div>
                </div>

                {/* Key themes */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Dominant Themes &amp; Formats
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.key_themes.map((theme, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gaps & Opportunities */}
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1">
                  <span className="font-bold text-purple-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Distribution Gap &amp; Creator Opportunity</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed">{comp.gaps_and_opportunities}</p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Analyzed via {comp.platform === 'instagram' ? 'Meta Business Discovery API' : 'YouTube Data API'}</span>
                <button
                  onClick={() => {
                    setActiveTab('decisions');
                  }}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  View Counter Decisions &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Track Creator Handle for Intelligence</h3>
            <p className="text-xs text-slate-400">
              Inspects public profiles to evaluate distribution gaps. Strictly adheres to platform terms.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Handle / Username</label>
                <input
                  type="text"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  placeholder="e.g. hubaboriginal or @creator"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
              >
                {loading ? 'Analyzing Profile...' : 'Analyze Gaps'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

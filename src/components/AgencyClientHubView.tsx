import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  ShieldCheck,
  CheckCircle2,
  Plus,
  FileText,
  ExternalLink,
  Award,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  Lock,
  Layers,
  ChevronRight,
  Printer,
  Download,
} from 'lucide-react';
import {
  AgencyClient,
  ClientGrowthReport,
  ClientTier,
  Workspace,
} from '../types/index.js';
import {
  fetchAgencyClients,
  createAgencyClient,
  deleteAgencyClient,
  fetchClientGrowthReport,
} from '../services/api.js';

interface AgencyClientHubViewProps {
  workspace: Workspace;
  onNavigateToEngagement?: () => void;
  onNavigateToCompetitors?: () => void;
}

export const AgencyClientHubView: React.FC<AgencyClientHubViewProps> = ({
  workspace,
  onNavigateToEngagement,
  onNavigateToCompetitors,
}) => {
  const [clients, setClients] = useState<AgencyClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeReport, setActiveReport] = useState<ClientGrowthReport | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // New Client Form
  const [newClientName, setNewClientName] = useState('');
  const [newClientHandle, setNewClientHandle] = useState('');
  const [newClientNiche, setNewClientNiche] = useState('Fitness & Wellness');
  const [newClientTier, setNewClientTier] = useState<ClientTier>('Growth Accelerator');
  const [newClientRetainer, setNewClientRetainer] = useState(999);
  const [newClientTarget, setNewClientTarget] = useState(16);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClients();
  }, [workspace.id]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await fetchAgencyClients(workspace.id);
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientHandle) return;
    setSubmitting(true);
    try {
      const created = await createAgencyClient({
        workspace_id: workspace.id,
        name: newClientName,
        handle: newClientHandle,
        niche: newClientNiche,
        package_tier: newClientTier,
        monthly_retainer: newClientRetainer,
        posts_target: newClientTarget,
      });
      setClients((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewClientName('');
      setNewClientHandle('');
    } catch (err) {
      console.error('Error adding client:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReport = async (client: AgencyClient) => {
    setGeneratingReport(true);
    try {
      const rep = await fetchClientGrowthReport(client.id, workspace.id);
      setActiveReport(rep);
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const totalMRR = clients.reduce((acc, c) => acc + (c.monthly_retainer || 0), 0);
  const totalCommentsAutomated = clients.reduce((acc, c) => acc + (c.comments_automated || 0), 0);
  const totalDmsSent = clients.reduce((acc, c) => acc + (c.dms_sent || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-400" />
              <span>Agency &amp; Client Monetization Hub</span>
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Agency-in-a-Box
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Replaces a 4-person agency for your own brand, and lets you manage &amp; grow client accounts to earn recurring monthly retainers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Client Account</span>
        </button>
      </div>

      {/* Solo Agency Value & MRR Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-purple-950/30 border border-emerald-500/30 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              <span>Active Monthly Retainer (MRR)</span>
            </span>
            <div className="text-3xl font-extrabold text-white">
              ${totalMRR.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ month</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Generated from {clients.length} active recurring client accounts
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Agency Overhead Saved</span>
            </span>
            <div className="text-3xl font-extrabold text-purple-300">
              $3,500 <span className="text-sm font-normal text-slate-400">/ mo</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Replaces Content Strategist, Copywriter &amp; DM Community Mgr
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>Automated Touchpoints</span>
            </span>
            <div className="text-3xl font-extrabold text-indigo-200">
              {(totalCommentsAutomated + totalDmsSent).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400">
              {totalCommentsAutomated} comments handled &bull; {totalDmsSent} DMs delivered
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span>Solo Creator Authority</span>
              <span className="text-emerald-400">96 / 100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full w-[96%]" />
            </div>
            <span className="text-[10px] text-slate-400 block">
              Autonomous system operating without agency dependency.
            </span>
          </div>
        </div>
      </div>

      {/* Client Accounts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Client Accounts ({clients.length})
          </span>
          <span className="text-xs text-slate-400">
            Average Retainer: ${(totalMRR / (clients.length || 1)).toFixed(0)}/mo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clients.map((client) => {
            const progressPct = Math.min(
              100,
              Math.round((client.posts_delivered / (client.posts_target || 1)) * 100)
            );

            return (
              <div
                key={client.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div className="space-y-4">
                  {/* Client Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={client.avatar_url}
                        alt={client.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-white text-base">{client.name}</h3>
                        <span className="text-xs text-slate-400">@{client.handle}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ${client.monthly_retainer}/mo
                    </span>
                  </div>

                  {/* Niche & Package Tier */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {client.niche}
                    </span>
                    <span className="font-semibold text-purple-300">
                      {client.package_tier}
                    </span>
                  </div>

                  {/* Monthly Deliverables Progress */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-400">Content Scheduled:</span>
                      <span className="text-white font-bold">
                        {client.posts_delivered} / {client.posts_target} Reels
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Automations metrics for this client */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Auto-Comments
                      </span>
                      <span className="font-bold text-slate-200">
                        {client.comments_automated} handled
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Growth Delivered
                      </span>
                      <span className="font-bold text-emerald-400">
                        +{client.follower_growth_pct}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Renews: {client.next_billing_date}
                  </span>

                  <button
                    onClick={() => handleOpenReport(client)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Client Report</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agency Services Packaging Guide (How to Earn Money) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Turnkey Creator Growth Packages to Sell Clients</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-packaged pricing tiers you can immediately pitch to business owners, consultants, and creators to run on GrowthOS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tier 1</span>
              <span className="text-xl font-extrabold text-white">$499 <span className="text-xs text-slate-400 font-normal">/ mo</span></span>
            </div>
            <h3 className="font-bold text-white text-base">Starter Autopilot</h3>
            <p className="text-xs text-slate-400">
              Ideal for local business owners or solo consultants who need a consistent posting rhythm without managing social media.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>8 Strategic Reels scheduled via Best-Time Engine</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automatic Comment &quot;Thank you &amp; Hi&quot; Replies</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Monthly Executive Performance Summary</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/30 to-slate-900/80 border border-purple-500/40 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
              Most Popular
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Tier 2</span>
              <span className="text-xl font-extrabold text-purple-300">$999 <span className="text-xs text-slate-400 font-normal">/ mo</span></span>
            </div>
            <h3 className="font-bold text-white text-base">Growth Accelerator</h3>
            <p className="text-xs text-slate-400">
              For ambitious founders and creators wanting real lead generation, follower growth, and inbound DM conversations.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>16 Reels with AI Qualitative Hook Optimizations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Smart Comment Q&amp;A AI Answering + DM Resource Delivery</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>New Follower Greeting &amp; Inbound Lead Automation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Bi-weekly Competitor Gap Strategy Re-alignment</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tier 3</span>
              <span className="text-xl font-extrabold text-white">$2,500 <span className="text-xs text-slate-400 font-normal">/ mo</span></span>
            </div>
            <h3 className="font-bold text-white text-base">Full Agency Domination</h3>
            <p className="text-xs text-slate-400">
              For established brands, tech founders, and scaling e-commerce brands demanding complete vertical dominance.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>30 Daily Reels + Multi-Platform YouTube Shorts</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Autonomous Decision Maker with Real-Time Competitor Counters</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Inbound Sales Pipeline &amp; Lead Qualification via DM</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>White-Label Executive Reports with Proven Client ROI</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Onboard Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleAddClient}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Onboard New Client Account</h3>
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
                <label className="text-xs font-semibold text-slate-300 block mb-1">Client Business / Creator Name</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Acme Tech Studio"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Instagram Handle</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-xs text-slate-500">@</span>
                  <input
                    type="text"
                    value={newClientHandle}
                    onChange={(e) => setNewClientHandle(e.target.value)}
                    placeholder="client_handle"
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Niche / Industry</label>
                  <select
                    value={newClientNiche}
                    onChange={(e) => setNewClientNiche(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="Tech & AI">Tech &amp; AI</option>
                    <option value="Fitness & Wellness">Fitness &amp; Wellness</option>
                    <option value="Finance & Investing">Finance &amp; Investing</option>
                    <option value="E-commerce & SaaS">E-commerce &amp; SaaS</option>
                    <option value="Creator Economy">Creator Economy</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Package Tier</label>
                  <select
                    value={newClientTier}
                    onChange={(e) => {
                      const tier = e.target.value as ClientTier;
                      setNewClientTier(tier);
                      if (tier === 'Starter Autopilot') {
                        setNewClientRetainer(499);
                        setNewClientTarget(8);
                      } else if (tier === 'Growth Accelerator') {
                        setNewClientRetainer(999);
                        setNewClientTarget(16);
                      } else {
                        setNewClientRetainer(2500);
                        setNewClientTarget(30);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="Starter Autopilot">Starter ($499/mo)</option>
                    <option value="Growth Accelerator">Growth ($999/mo)</option>
                    <option value="Full Agency Domination">Domination ($2500/mo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Retainer ($USD)</label>
                  <input
                    type="number"
                    value={newClientRetainer}
                    onChange={(e) => setNewClientRetainer(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Monthly Reels</label>
                  <input
                    type="number"
                    value={newClientTarget}
                    onChange={(e) => setNewClientTarget(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
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
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
              >
                {submitting ? 'Onboarding...' : 'Onboard Client & Start Autopilot'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* White-Label Growth Report Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Report Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Client ROI &amp; Growth Report
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeReport.client_name}</h3>
                <span className="text-xs text-slate-400">@{activeReport.client_handle} &bull; {activeReport.period_label}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
                  className="text-slate-400 hover:text-white text-base p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Reach</span>
                <span className="text-lg font-bold text-white">{activeReport.total_reach.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Followers Gained</span>
                <span className="text-lg font-bold text-emerald-400">+{activeReport.followers_gained}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Engagement</span>
                <span className="text-lg font-bold text-purple-400">{activeReport.engagement_rate}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Client ROI Value</span>
                <span className="text-lg font-bold text-amber-300">{activeReport.roi_multiple}</span>
              </div>
            </div>

            {/* Automation Value Section */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                Automated Community &amp; Inbound Lead Dispatch
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block mb-0.5">Comment Auto-Replies:</span>
                  <span className="font-bold text-white">{activeReport.auto_comments_handled} handled with zero missed leads</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Direct Messages (DMs) Delivered:</span>
                  <span className="font-bold text-white">{activeReport.auto_dms_delivered} links &amp; guides delivered</span>
                </div>
              </div>
            </div>

            {/* Executive Highlights */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Executive Takeaways
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeReport.highlights?.map((h, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Prepared automatically by GrowthOS Autonomous Creator Engine</span>
              <span>Generated {new Date(activeReport.generated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

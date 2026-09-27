import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { GrowthBrainInsight, Workspace } from '../types/index.js';
import { fetchGrowthBrain } from '../services/api.js';

interface GrowthBrainViewProps {
  workspace: Workspace;
  onNavigateToIdeas: () => void;
}

export const GrowthBrainView: React.FC<GrowthBrainViewProps> = ({
  workspace,
  onNavigateToIdeas,
}) => {
  const [insight, setInsight] = useState<GrowthBrainInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthBrain(workspace.id)
      .then(setInsight)
      .finally(() => setLoading(false));
  }, [workspace.id]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Account Growth Brain</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Persistent Insight Layer
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Continuously learns what drives follows vs shares vs saves from your historical post trajectories.
          </p>
        </div>

        <button
          onClick={onNavigateToIdeas}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/20"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Generate Ideas Grounded in Growth Brain</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Synthesizing Growth Patterns...</div>
      ) : insight ? (
        <div className="space-y-6">
          {/* Actionable Recommendations Banner */}
          <div className="p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Key Account Growth Directives</h3>
              <span className="text-xs text-slate-400 font-mono ml-auto">
                Based on {insight.based_on_post_count} historical posts
              </span>
            </div>

            <div className="space-y-2">
              {insight.actionable_recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Quadrants: Best/Weak Topics, Best Hooks, Optimal Formats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Performing Topics */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Top Distribution Themes</span>
              </span>
              <div className="space-y-2.5">
                {insight.best_topics.map((t, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{t.topic}</span>
                    <span className="text-emerald-400 font-bold font-mono text-[11px]">{t.performance_delta}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Topics */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Topics to Deprecate / Reframe</span>
              </span>
              <div className="space-y-2.5">
                {insight.weak_topics.map((w, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-slate-300 block">{w.topic}</span>
                    <span className="text-slate-400 text-[11px] block">{w.reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Hooks */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Zap className="w-4 h-4" />
                <span>Highest Retention Hook Angles</span>
              </span>
              <div className="space-y-2.5">
                {insight.best_hooks.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{h.hook_angle}</span>
                    <span className="text-purple-300 font-bold font-mono text-[11px]">{h.retention_boost}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimal Formats */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-4 h-4" />
                <span>Format Duration Sweet Spots</span>
              </span>
              <div className="space-y-2.5">
                {insight.optimal_formats.map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-200">
                      <span>{f.duration_range}</span>
                      <span className="text-slate-400 font-normal">{f.format}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] block">{f.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 rounded-2xl border border-slate-800 bg-slate-900/40">
          No Growth Brain model computed for this workspace yet. Publish 3+ posts to begin pattern modeling.
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Experiment, Workspace } from '../types/index.js';
import { fetchExperiments, createExperiment } from '../services/api.js';

interface ExperimentsViewProps {
  workspace: Workspace;
}

export const ExperimentsView: React.FC<ExperimentsViewProps> = ({ workspace }) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [hypothesis, setHypothesis] = useState('');
  const [variable, setVariable] = useState('');
  const [baseline, setBaseline] = useState('');
  const [testPeriod, setTestPeriod] = useState('14 days / 6 posts');
  const [successMetric, setSuccessMetric] = useState('3-Second Retention Rate');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadExperiments();
  }, [workspace.id]);

  const loadExperiments = async () => {
    try {
      const data = await fetchExperiments(workspace.id);
      setExperiments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypothesis || !variable) return;
    setSubmitting(true);
    try {
      await createExperiment({
        workspace_id: workspace.id,
        hypothesis,
        variable,
        baseline,
        test_period: testPeriod,
        success_metric: successMetric,
      });
      setShowModal(false);
      setHypothesis('');
      setVariable('');
      setBaseline('');
      loadExperiments();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getResultBadge = (result?: 'Supported' | 'Inconclusive' | 'Not supported') => {
    switch (result) {
      case 'Supported':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Supported</span>
          </span>
        );
      case 'Inconclusive':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
            <HelpCircle className="w-3 h-3" />
            <span>Inconclusive</span>
          </span>
        );
      case 'Not supported':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Not Supported</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Active Test</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Scientific Growth Experiments</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Hypothesis Driven
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Formulate empirical packaging experiments. Evaluates statistical significance and limitations — never overstating small-sample results.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Experiment</span>
        </button>
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition space-y-4 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                  {exp.status}
                </span>
                <span className="text-xs text-slate-400">Sample size: {exp.sample_size} posts</span>
              </div>
              {getResultBadge(exp.result_classification)}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Hypothesis
              </span>
              <h3 className="text-base font-bold text-white leading-snug">
                "{exp.hypothesis}"
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Isolated Variable:</span>
                <span className="font-semibold text-slate-200">{exp.variable}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Success Metric:</span>
                <span className="font-semibold text-purple-300">{exp.success_metric}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Historical Baseline:</span>
                <span className="font-semibold text-slate-300">{exp.baseline}</span>
              </div>
            </div>

            {exp.observed_difference && (
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1.5">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Observed Difference: {exp.observed_difference}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{exp.conclusion}</p>
                {exp.limitations && (
                  <p className="text-[11px] text-amber-200/80 pt-1 border-t border-purple-900/40">
                    <strong>Statistical Limitations:</strong> {exp.limitations}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Experiment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Design Growth Experiment</h3>
            <p className="text-xs text-slate-400">
              State a testable hypothesis with an isolated packaging variable.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Hypothesis Statement</label>
                <textarea
                  rows={3}
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  placeholder="e.g. Using a contrarian question in the first 2 seconds will boost 3-second retention by 15%."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Variable</label>
                  <input
                    type="text"
                    value={variable}
                    onChange={(e) => setVariable(e.target.value)}
                    placeholder="e.g. Hook angle (contrarian vs curiosity)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Historical Baseline</label>
                  <input
                    type="text"
                    value={baseline}
                    onChange={(e) => setBaseline(e.target.value)}
                    placeholder="e.g. 42% average 3s retention"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
              >
                {submitting ? 'Creating...' : 'Start Experiment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

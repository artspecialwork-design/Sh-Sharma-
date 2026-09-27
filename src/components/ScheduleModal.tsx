import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  VideoItem,
  ConnectedAccount,
  BestTimeRecommendation,
  ScheduleMode,
  Workspace,
} from '../types/index.js';
import {
  fetchBestTimeRecommendation,
  schedulePost,
  fetchVideoMetadata,
} from '../services/api.js';

interface ScheduleModalProps {
  video: VideoItem;
  workspace: Workspace;
  connectedAccounts: ConnectedAccount[];
  onClose: () => void;
  onScheduledSuccess: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  video,
  workspace,
  connectedAccounts,
  onClose,
  onScheduledSuccess,
}) => {
  const [recommendation, setRecommendation] = useState<BestTimeRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<ScheduleMode>('auto');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [customDateTime, setCustomDateTime] = useState<string>('');
  const [caption, setCaption] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [workspace.id, video.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const rec = await fetchBestTimeRecommendation(workspace.id);
      setRecommendation(rec);

      // Default to 15 mins into recommended window
      const defaultTime = new Date(rec.recommended_window_start);
      defaultTime.setMinutes(defaultTime.getMinutes() + 15);
      const isoStringForInput = new Date(defaultTime.getTime() - defaultTime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setCustomDateTime(isoStringForInput);

      // Load saved caption or title
      const meta = await fetchVideoMetadata(video.id);
      setCaption(meta?.short_caption || video.title);

      // Default connected account
      const availableAccount = connectedAccounts.find((a) => a.status === 'connected') || connectedAccounts[0];
      if (availableAccount) {
        setSelectedAccountId(availableAccount.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = connectedAccounts.find((a) => a.id === selectedAccountId);

  const handleConfirmSchedule = async () => {
    if (!selectedAccountId) {
      alert('Please select a connected platform account.');
      return;
    }

    const scheduledTime = mode === 'auto' && recommendation
      ? recommendation.recommended_window_start
      : new Date(customDateTime).toISOString();

    setSubmitting(true);
    try {
      await schedulePost({
        workspace_id: workspace.id,
        video_id: video.id,
        connected_account_id: selectedAccountId,
        scheduled_time: scheduledTime,
        mode,
        caption,
      });

      onScheduledSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`Scheduling error: ${err.message || 'Failed to schedule post'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Schedule Reel / Video</h2>
              <span className="text-xs text-slate-400 truncate block max-w-xs">{video.title}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Personalized Best-Time Recommendation Card (Section 8 requirement) */}
        {recommendation && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Personalized Best-Time Recommendation
                </span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  recommendation.confidence === 'High'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : recommendation.confidence === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {recommendation.confidence} Confidence
              </span>
            </div>

            <div className="text-lg font-bold text-white tracking-tight">
              {recommendation.display_window}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {recommendation.reason}
            </p>

            <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px] text-slate-400">
              <span>Grounded in {recommendation.comparable_post_count} comparable historical posts</span>
              <span className="italic text-slate-400">Probabilistic guidance (no guarantees)</span>
            </div>
          </div>
        )}

        {/* Scheduling Mode Selection */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('auto')}
              className={`p-3 rounded-xl border text-left transition ${
                mode === 'auto'
                  ? 'border-purple-500 bg-purple-950/20 text-white'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Auto-Schedule</span>
                {mode === 'auto' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Claims optimal slot inside the recommended window.
              </p>
            </button>

            <button
              onClick={() => setMode('manual')}
              className={`p-3 rounded-xl border text-left transition ${
                mode === 'manual'
                  ? 'border-purple-500 bg-purple-950/20 text-white'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Manual Schedule</span>
                {mode === 'manual' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Pick specific calendar date &amp; exact publishing minute.
              </p>
            </button>
          </div>

          {/* Manual Date Picker if chosen */}
          {mode === 'manual' && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 animate-in fade-in">
              <label className="text-xs font-semibold text-slate-300 block">Select Date &amp; Time (Local)</label>
              <input
                type="datetime-local"
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Destination Platform Account */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Publishing Account Target</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              {connectedAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.platform === 'instagram' ? 'Instagram Reel' : 'YouTube Short'} &mdash; @{acc.handle || acc.name || 'Unconnected'} ({acc.status})
                </option>
              ))}
            </select>
          </div>

          {/* Rate limit status warning */}
          {selectedAccount && (
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>Platform rate limit remaining:</span>
              <span className="font-semibold text-slate-300">
                {selectedAccount.rate_limit_remaining} / 100 API posts left in 24h
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSchedule}
            disabled={submitting}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition active:scale-98"
          >
            <span>{submitting ? 'Dispatching to Queue...' : 'Confirm Schedule'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

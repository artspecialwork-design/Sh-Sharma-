import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Instagram,
  Youtube,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Zap,
} from 'lucide-react';
import { ScheduledPost, VideoItem, PostStatus } from '../types/index.js';
import { reschedulePost, cancelPost, triggerImmediatePublish } from '../services/api.js';

interface CalendarViewProps {
  scheduledPosts: ScheduledPost[];
  videos: VideoItem[];
  onRefresh: () => void;
  onOpenAnalysis: (video: VideoItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  scheduledPosts,
  videos,
  onRefresh,
  onOpenAnalysis,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'week' | 'month'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reschedulingPost, setReschedulingPost] = useState<ScheduledPost | null>(null);
  const [newTime, setNewTime] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  const filteredPosts = scheduledPosts
    .filter((p) => (statusFilter === 'all' ? true : p.status === statusFilter))
    .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime());

  const getVideo = (videoId: string) => videos.find((v) => v.id === videoId);

  const handleRescheduleSubmit = async () => {
    if (!reschedulingPost || !newTime) return;
    setActionLoading(true);
    try {
      await reschedulePost(reschedulingPost.id, newTime);
      setReschedulingPost(null);
      onRefresh();
    } catch (err: any) {
      alert(`Reschedule error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (postId: string) => {
    if (!confirm('Cancel this scheduled post?')) return;
    try {
      await cancelPost(postId);
      onRefresh();
    } catch (err: any) {
      alert(`Cancellation failed: ${err.message}`);
    }
  };

  const handleForcePublish = async (postId: string) => {
    try {
      await triggerImmediatePublish(postId);
      alert('Post queued for immediate publishing cycle!');
      onRefresh();
    } catch (err: any) {
      alert(`Failed to trigger immediate publish: ${err.message}`);
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Published</span>
          </span>
        );
      case 'publishing':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1 animate-pulse">
            <RotateCw className="w-3 h-3 animate-spin" />
            <span>Publishing API Container</span>
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Scheduled</span>
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Content Calendar &amp; Queue</h1>
          <p className="mt-1 text-sm text-slate-400">
            Official container-based scheduling. Drag &amp; drop reschedule guarded by state locks.
          </p>
        </div>

        {/* View toggles & Filters */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            {(['list', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                  viewMode === mode
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Statuses ({scheduledPosts.length})</option>
            <option value="scheduled">Scheduled Queue</option>
            <option value="published">Published</option>
            <option value="publishing">Publishing in Progress</option>
            <option value="failed">Failed Posts</option>
          </select>
        </div>
      </div>

      {/* Main List View */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-400">
              No posts found for this filter.
            </div>
          ) : (
            filteredPosts.map((post) => {
              const video = getVideo(post.video_id);
              const isPast = new Date(post.scheduled_time).getTime() < Date.now();
              return (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    {/* Thumbnail placeholder */}
                    <div className="w-14 h-20 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 relative overflow-hidden">
                      <Play className="w-5 h-5 text-purple-400" />
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono text-slate-400 bg-black/70 px-1 rounded">
                        {video?.duration_seconds || 45}s
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(post.status)}
                        <span className="text-xs text-slate-400">
                          {new Date(post.scheduled_time).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          at{' '}
                          {new Date(post.scheduled_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {post.mode === 'auto' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            Auto Best-Time
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-white text-sm truncate max-w-lg">
                        {video?.title || 'Video Post'}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                        "{post.caption_used}"
                      </p>

                      {post.recommendation_reason && (
                        <div className="text-[11px] text-purple-300/80 flex items-center space-x-1 pt-1">
                          <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{post.recommendation_reason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    {video && (
                      <button
                        onClick={() => onOpenAnalysis(video)}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                      >
                        Inspect Packaging
                      </button>
                    )}

                    {post.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => {
                            setReschedulingPost(post);
                            setNewTime(
                              new Date(new Date(post.scheduled_time).getTime() - new Date().getTimezoneOffset() * 60000)
                                .toISOString()
                                .slice(0, 16)
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleForcePublish(post.id)}
                          className="px-3 py-1.5 rounded-lg border border-purple-600/40 bg-purple-600/20 text-purple-200 text-xs font-semibold hover:bg-purple-600/40 transition"
                          title="Trigger immediate publish tick"
                        >
                          Publish Now
                        </button>
                        <button
                          onClick={() => handleCancel(post.id)}
                          className="p-1.5 rounded-lg border border-rose-900/50 text-rose-400 hover:bg-rose-950/40 transition"
                          title="Cancel scheduled post"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Week / Month Grid Preview */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white">Upcoming Publishing Windows</span>
            <span className="text-xs text-slate-400 font-mono">Current Week Schedule</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={idx} className="min-h-36 p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 block">{day}</span>
                {filteredPosts
                  .filter((p) => {
                    const postDay = new Date(p.scheduled_time).getDay();
                    const targetDay = (idx + 1) % 7;
                    return postDay === targetDay;
                  })
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[10px] space-y-0.5 cursor-pointer hover:border-purple-400"
                    >
                      <div className="font-semibold text-purple-200 truncate">
                        {getVideo(p.video_id)?.title || 'Post'}
                      </div>
                      <div className="text-slate-400">
                        {new Date(p.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Reschedule Post</h3>
            <p className="text-xs text-slate-400">
              Select a new date &amp; time. Guarded by atomic locks against background worker race conditions.
            </p>
            <input
              type="datetime-local"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            />
            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={() => setReschedulingPost(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
              >
                {actionLoading ? 'Updating...' : 'Save New Time'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

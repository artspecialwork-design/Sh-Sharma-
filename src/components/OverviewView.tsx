import React from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Share2,
  Bookmark,
  Calendar,
  Sparkles,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Clock,
  Instagram,
  Youtube,
  Play,
  Zap,
} from 'lucide-react';
import {
  Workspace,
  ConnectedAccount,
  ScheduledPost,
  VideoItem,
} from '../types/index.js';

interface OverviewViewProps {
  workspace: Workspace;
  connectedAccounts: ConnectedAccount[];
  scheduledPosts: ScheduledPost[];
  videos: VideoItem[];
  onUploadClick: () => void;
  onOpenAnalysis: (video: VideoItem) => void;
  onOpenSchedule: (video: VideoItem) => void;
  onNavigateToTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  workspace,
  connectedAccounts,
  scheduledPosts,
  videos,
  onUploadClick,
  onOpenAnalysis,
  onOpenSchedule,
  onNavigateToTab,
}) => {
  const igAccount = connectedAccounts.find((a) => a.platform === 'instagram');
  const isIgConnected = igAccount?.status === 'connected';

  const published = scheduledPosts.filter((p) => p.status === 'published');
  const queued = scheduledPosts.filter((p) => p.status === 'scheduled');

  const getVideo = (videoId: string) => videos.find((v) => v.id === videoId);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Growth Dashboard</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {workspace.niche}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            AI-driven packaging, best-time publishing windows, and algorithmic distribution metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateToTab('calendar')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition"
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Queue ({queued.length})</span>
          </button>
          <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Reel</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Section 3 requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Followers */}
        <StatCard
          title="Followers / Subscribers"
          value={isIgConnected ? igAccount!.followers_count.toLocaleString() : null}
          trend="+12.4% vs prior 7d"
          emptyMessage="Connect Instagram to view followers"
          onConnectClick={() => onNavigateToTab('connections')}
          icon={Users}
        />

        {/* Reach */}
        <StatCard
          title="Account Reach (30d)"
          value={isIgConnected ? '48,920' : null}
          trend="+28.4% above rolling median"
          emptyMessage="Connect Instagram to view reach"
          onConnectClick={() => onNavigateToTab('connections')}
          icon={TrendingUp}
        />

        {/* DM Shares */}
        <StatCard
          title="Private DM Shares"
          value={isIgConnected ? '1,840' : null}
          trend="Top ranking algorithm signal"
          emptyMessage="Connect Instagram to view shares"
          onConnectClick={() => onNavigateToTab('connections')}
          icon={Share2}
        />

        {/* Reference Saves */}
        <StatCard
          title="Reference Saves"
          value={isIgConnected ? '3,450' : null}
          trend="+34% above median"
          emptyMessage="Connect Instagram to view saves"
          onConnectClick={() => onNavigateToTab('connections')}
          icon={Bookmark}
        />
      </div>

      {/* Recommended Best-Time Spotlight */}
      <div className="p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Personalized Publishing Window
            </span>
            <span className="text-xs text-slate-400 font-mono">Today, 6:00 PM – 6:45 PM</span>
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">
            Your educational Reels have outperformed your account median by +34% when published in this window.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Confidence is high based on 24 comparable historical posts. Auto-schedule reserves this slot and verifies container readiness before release.
          </p>
        </div>

        <button
          onClick={() => {
            if (videos.length > 0) onOpenSchedule(videos[0]);
            else onUploadClick();
          }}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 shrink-0"
        >
          <span>Claim Recommended Slot</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2 Columns: Scheduled Queue vs Recent Top-Performing Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Scheduled Queue (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Upcoming Scheduled Queue ({queued.length})
            </h3>
            <button
              onClick={() => onNavigateToTab('calendar')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Full Calendar &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {queued.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-500 text-xs">
                No posts scheduled. Upload a Reel or auto-schedule a slot.
              </div>
            ) : (
              queued.map((post) => {
                const video = getVideo(post.video_id);
                return (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-900/70 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-10 h-14 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="truncate">
                        <span className="text-[11px] text-purple-400 font-semibold block">
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
                        <h4 className="text-xs font-bold text-white truncate max-w-xs">{video?.title || 'Video Post'}</h4>
                        <span className="text-[10px] text-slate-400">Status: Scheduled in Queue</span>
                      </div>
                    </div>

                    {video && (
                      <button
                        onClick={() => onOpenAnalysis(video)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 font-semibold hover:bg-slate-700 transition shrink-0"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Recent Top-Performing Posts (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Top-Performing Reels (Ranked by DM Sends)
            </h3>
            <button
              onClick={() => onNavigateToTab('analytics')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Post Diagnoses &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {published.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-500 text-xs">
                No published posts recorded yet.
              </div>
            ) : (
              published.map((post, idx) => {
                const video = getVideo(post.video_id);
                return (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-900/70 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="w-6 h-6 rounded-full bg-purple-600/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-white truncate max-w-xs">{video?.title || 'Published Reel'}</h4>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-3 mt-0.5">
                          <span className="text-emerald-300 font-semibold">+34% vs median</span>
                          <span>&bull;</span>
                          <span>1,040 DM shares</span>
                          <span>&bull;</span>
                          <span>1,890 saves</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateToTab('analytics')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 font-semibold hover:bg-slate-700 transition shrink-0"
                    >
                      Diagnosis
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | null;
  trend: string;
  emptyMessage: string;
  onConnectClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
}> = ({ title, value, trend, emptyMessage, onConnectClick, icon: Icon }) => (
  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-2 flex flex-col justify-between">
    <div className="flex items-center justify-between text-slate-400">
      <span className="text-xs font-medium">{title}</span>
      <Icon className="w-4 h-4 text-purple-400" />
    </div>

    {value !== null ? (
      <>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-[11px] text-slate-400 font-medium">{trend}</div>
      </>
    ) : (
      <div className="py-2 space-y-1.5">
        <span className="text-[11px] text-slate-500 block leading-tight">{emptyMessage}</span>
        <button
          onClick={onConnectClick}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 underline"
        >
          Connect &rarr;
        </button>
      </div>
    )}
  </div>
);

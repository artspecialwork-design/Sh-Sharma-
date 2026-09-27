import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Film,
  Calendar,
  BarChart3,
  BrainCircuit,
  Lightbulb,
  Radar,
  FlaskConical,
  Link2,
  ScrollText,
  Settings,
  Zap,
  Briefcase,
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'upload'
  | 'library'
  | 'calendar'
  | 'analytics'
  | 'growth_brain'
  | 'ideas'
  | 'competitors'
  | 'automation'
  | 'agency'
  | 'experiments'
  | 'connections'
  | 'audit';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  videoCount: number;
  scheduledCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  videoCount,
  scheduledCount,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload & Pipeline', icon: UploadCloud },
    { id: 'library', label: 'Content Library', icon: Film, badge: videoCount },
    { id: 'calendar', label: 'Calendar & Queue', icon: Calendar, badge: scheduledCount },
    { id: 'analytics', label: 'Analytics & Diagnosis', icon: BarChart3 },
    { id: 'growth_brain', label: 'Account Growth Brain', icon: BrainCircuit },
    { id: 'ideas', label: 'Content Ideas', icon: Lightbulb },
    { id: 'competitors', label: 'Competitor Intel', icon: Radar },
    { id: 'automation', label: 'Smart Auto-Engagement', icon: Zap, badge: 'Live' },
    { id: 'agency', label: 'Agency & Client Hub', icon: Briefcase, badge: 'MRR' },
    { id: 'experiments', label: 'Growth Experiments', icon: FlaskConical },
    { id: 'connections', label: 'Connected Accounts', icon: Link2 },
    { id: 'audit', label: 'Audit Trail', icon: ScrollText },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1">
          Creator Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition group ${
                isActive
                  ? 'bg-purple-600/20 text-white border border-purple-500/40 shadow-sm shadow-purple-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800/70 space-y-3">
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/70 p-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Direct Instagram API</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Meta Business Login for Instagram. No Facebook page required.
          </p>
        </div>
      </div>
    </aside>
  );
};

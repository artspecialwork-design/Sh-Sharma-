import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  Layers,
  Plus,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { Workspace, NotificationItem, ConnectedAccount } from '../types/index.js';

interface NavbarProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  onSelectWorkspace: (workspace: Workspace) => void;
  onCreateWorkspaceClick: () => void;
  onUploadClick: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  connectedAccounts: ConnectedAccount[];
}

export const Navbar: React.FC<NavbarProps> = ({
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  onCreateWorkspaceClick,
  onUploadClick,
  notifications,
  onMarkNotificationRead,
  connectedAccounts,
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const connectedCount = connectedAccounts.filter((a) => a.status === 'connected').length;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Brand & Workspace Switcher */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Growth<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">OS</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block -mt-1">
              Creator Packaging &amp; Publishing
            </span>
          </div>
        </div>

        {/* Workspace Switcher dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/90 hover:bg-slate-800/80 text-sm transition"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="font-medium text-slate-200 max-w-[200px] truncate">{activeWorkspace.name}</span>
            {activeWorkspace.is_demo ? (
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Sandbox
              </span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live
              </span>
            )}
          </button>

          {showWorkspaceMenu && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1.5">
                Workspaces ({workspaces.length})
              </div>
              <div className="space-y-1">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      onSelectWorkspace(ws);
                      setShowWorkspaceMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition ${
                      ws.id === activeWorkspace.id
                        ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30 font-medium'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate">{ws.name}</div>
                      <div className="text-[11px] text-slate-400">{ws.niche}</div>
                    </div>
                    {ws.is_demo ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        Demo
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        Real
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowWorkspaceMenu(false);
                    onCreateWorkspaceClick();
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Real Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Status, Notifications, Actions */}
      <div className="flex items-center space-x-4">
        {/* Connected accounts badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
          <div className={`w-2 h-2 rounded-full ${connectedCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-slate-300">
            {connectedCount > 0 ? `${connectedCount} Account${connectedCount > 1 ? 's' : ''} Connected` : 'No accounts connected'}
          </span>
        </div>

        {/* Primary CTA: Upload Video */}
        <button
          onClick={onUploadClick}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-purple-600/20 transition active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Video</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Notifications ({unreadCount} unread)
                </span>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">No notifications yet</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                        n.read
                          ? 'border-slate-800/60 bg-slate-950/40 text-slate-400'
                          : 'border-purple-500/30 bg-purple-950/20 text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-slate-200 flex items-center justify-between">
                        <span>{n.title}</span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-purple-400" />}
                      </div>
                      <p className="mt-1 text-slate-400 leading-relaxed text-[11px]">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Elena Rostova"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
          />
        </div>
      </div>
    </header>
  );
};

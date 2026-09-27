import React from 'react';
import { AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Workspace } from '../types/index.js';

interface BannerProps {
  workspace: Workspace;
  onSwitchToReal: () => void;
  onGoToConnectedAccounts: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  workspace,
  onSwitchToReal,
  onGoToConnectedAccounts,
}) => {
  if (workspace.is_demo) {
    return (
      <div className="bg-gradient-to-r from-amber-950/80 via-purple-950/70 to-slate-900 border-b border-amber-500/30 px-6 py-2.5 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center space-x-2.5">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider text-[10px] border border-amber-500/40 shrink-0">
            Sandbox Demo Workspace
          </span>
          <p className="text-amber-100/90 leading-tight">
            You are browsing <strong>isolated benchmark test data</strong>. Real publishing and API syncs require your verified Instagram/YouTube connection.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onSwitchToReal}
            className="flex items-center space-x-1 font-semibold text-amber-300 hover:text-amber-100 transition underline underline-offset-2"
          >
            <span>Switch to Real Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Live Creator Workspace:</strong> Isolated data with row-level workspace scoping. Platform actions dispatch via official APIs.
        </span>
      </div>
      <button
        onClick={onGoToConnectedAccounts}
        className="text-purple-400 hover:text-purple-300 font-semibold transition"
      >
        Configure Official Instagram &amp; YouTube Connections &rarr;
      </button>
    </div>
  );
};

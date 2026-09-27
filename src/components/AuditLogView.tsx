import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  Shield,
  Clock,
  User,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { AuditLog, Workspace } from '../types/index.js';
import { fetchAuditLogs } from '../services/api.js';

interface AuditLogViewProps {
  workspace: Workspace;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ workspace }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetchAuditLogs(workspace.id).then(setLogs).catch(console.error);
  }, [workspace.id]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Security &amp; Publishing Audit Trail</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Agency Compliance Ready
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Immutable event ledger recording who scheduled, approved, published, or canceled content across this workspace.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Target</th>
                <th className="p-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/40 transition">
                    <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-200 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        <span>{log.actor_name}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                          ({log.actor_role})
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {log.target_type} ({log.target_id.slice(0, 10)}...)
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-md truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

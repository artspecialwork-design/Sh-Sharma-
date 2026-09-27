import React from 'react';
import {
  Film,
  Play,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { VideoItem } from '../types/index.js';

interface ContentLibraryViewProps {
  videos: VideoItem[];
  onUploadClick: () => void;
  onOpenAnalysis: (video: VideoItem) => void;
  onOpenSchedule: (video: VideoItem) => void;
}

export const ContentLibraryView: React.FC<ContentLibraryViewProps> = ({
  videos,
  onUploadClick,
  onOpenAnalysis,
  onOpenSchedule,
}) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Content Library</h1>
          <p className="mt-1 text-sm text-slate-400">
            All processed video assets, transcripts, and structured packaging records.
          </p>
        </div>

        <button
          onClick={onUploadClick}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/20"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition shadow-xl"
          >
            {/* Thumbnail Header */}
            <div className="h-44 bg-slate-950 border-b border-slate-800 relative flex items-center justify-center group overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center group-hover:scale-110 transition">
                <Play className="w-6 h-6 ml-0.5" />
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[11px] text-white">
                {vid.duration_seconds}s
              </span>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold uppercase text-[9px]">
                {vid.resolution} (9:16)
              </span>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base leading-snug">{vid.title}</h3>
                <span className="text-xs text-slate-400 block mt-1">
                  Uploaded {new Date(vid.created_at).toLocaleDateString()} &bull; {(vid.file_size_bytes / 1000000).toFixed(1)} MB
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pipeline Status
                </span>
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Transcription &amp; Hook Diagnostic Ready</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center space-x-2">
                <button
                  onClick={() => onOpenAnalysis(vid)}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Packaging</span>
                </button>
                <button
                  onClick={() => onOpenSchedule(vid)}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

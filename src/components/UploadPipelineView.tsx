import React, { useState } from 'react';
import {
  UploadCloud,
  FileVideo,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Layers,
  AlertCircle,
  Film,
} from 'lucide-react';
import { VideoItem, Workspace } from '../types/index.js';
import { uploadVideo } from '../services/api.js';

interface UploadPipelineViewProps {
  workspace: Workspace;
  onUploadSuccess: (video: VideoItem) => void;
  onOpenAnalysis: (video: VideoItem) => void;
  onOpenSchedule: (video: VideoItem) => void;
  recentVideos: VideoItem[];
}

export const UploadPipelineView: React.FC<UploadPipelineViewProps> = ({
  workspace,
  onUploadSuccess,
  onOpenAnalysis,
  onOpenSchedule,
  recentVideos,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(
    recentVideos.length > 0 ? recentVideos[0] : null
  );

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [targetPlatform, setTargetPlatform] = useState<'instagram' | 'youtube' | 'both'>('instagram');
  const [videoGoal, setVideoGoal] = useState<'Reach' | 'Followers' | 'Engagement' | 'Saves'>('Reach');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const extractVideoMeta = (file: File): Promise<{ duration: number; resolution: string; aspectRatio: '9:16' | '16:9' | '1:1' }> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        const duration = Math.round(video.duration) || 45;
        const width = video.videoWidth || 1080;
        const height = video.videoHeight || 1920;
        const resolution = `${width}x${height}`;
        const aspectRatio = height > width ? '9:16' : height === width ? '1:1' : '16:9';
        resolve({ duration, resolution, aspectRatio });
      };
      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ duration: 45, resolution: '1080x1920', aspectRatio: '9:16' });
      };
    });
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(15);

    try {
      const meta = await extractVideoMeta(file);
      setUploadProgress(35);

      const formData = new FormData();
      formData.append('video', file);
      formData.append('workspace_id', workspace.id);
      formData.append('title', title || file.name.replace(/\.[^/.]+$/, ''));
      formData.append('topic', topic);
      formData.append('target_platform', targetPlatform);
      formData.append('goal', videoGoal);
      formData.append('duration', String(meta.duration));
      formData.append('resolution', meta.resolution);
      formData.append('aspect_ratio', meta.aspectRatio);

      setUploadProgress(65);
      const video = await uploadVideo(formData);
      setUploadProgress(100);

      setActiveVideo(video);
      onUploadSuccess(video);
    } catch (err: any) {
      console.error(err);
      alert(`Upload error: ${err.message || 'Failed to upload video'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Video Upload &amp; Processing Pipeline</h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload short-form video (Reels / Shorts). The multi-stage pipeline extracts transcript, speech cadence, opening hook, and retention risk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Zone & Context Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
              dragActive
                ? 'border-purple-500 bg-purple-950/20'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            <input
              type="file"
              id="video-input"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="video-input" className="cursor-pointer block space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Drag &amp; drop your short-form video</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Supports MP4, MOV, WebM (up to 250MB). Optimal format: 9:16 vertical 1080x1920 (Reels &amp; Shorts).
                </p>
              </div>
              <span className="inline-block px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition">
                Browse Files
              </span>
            </label>
          </div>

          {/* Upload Progress Bar if active */}
          {uploading && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 animate-in fade-in">
              <div className="flex justify-between text-xs font-medium text-slate-300">
                <span>Executing Pipeline Stages...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Video Metadata / Context Inputs */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Video Context &amp; Targeting</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Video Title / Working Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 3 Instagram Algorithm Shifts You MUST Know"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Platform</label>
                  <select
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="instagram">Instagram Reel (Primary)</option>
                    <option value="youtube">YouTube Short</option>
                    <option value="both">Both Platforms</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Growth Goal</label>
                  <select
                    value={videoGoal}
                    onChange={(e) => setVideoGoal(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Reach">Explore Page Reach</option>
                    <option value="Followers">Follow Conversion</option>
                    <option value="Saves">High-Utility Saves</option>
                    <option value="Engagement">DM Shares &amp; Discussion</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Observability & Active Video Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {activeVideo ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Ready for Packaging
                  </span>
                  <h3 className="font-bold text-white text-base mt-1.5 leading-snug">{activeVideo.title}</h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
                    <span>{activeVideo.duration_seconds}s</span>
                    <span>&bull;</span>
                    <span>{activeVideo.resolution} (9:16)</span>
                    <span>&bull;</span>
                    <span>{(activeVideo.file_size_bytes / 1000000).toFixed(1)} MB</span>
                  </div>
                </div>

                <div className="w-16 h-24 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 relative overflow-hidden group">
                  <Play className="w-6 h-6 text-purple-400 group-hover:scale-110 transition" />
                </div>
              </div>

              {/* Multi-stage Pipeline Steps Log (Section 4 requirement) */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Processing Pipeline Stages
                </span>
                <div className="space-y-2">
                  {activeVideo.processing_steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200">{step.name}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{step.duration_ms}ms</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-2.5">
                <button
                  onClick={() => onOpenAnalysis(activeVideo)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Inspect AI Hook &amp; Video Analysis</span>
                </button>
                <button
                  onClick={() => onOpenSchedule(activeVideo)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                >
                  <span>Schedule in Recommended Window</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-3">
              <Film className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-400">No Video Selected</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Upload a video to the left or select an existing piece from your library to view pipeline logs and run AI packaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

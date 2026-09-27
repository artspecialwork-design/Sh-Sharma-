import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Wand2,
  Check,
  Copy,
  ChevronRight,
  Clock,
  MessageSquare,
  FileText,
  Bookmark,
  Share2,
  TrendingUp,
} from 'lucide-react';
import {
  VideoItem,
  ContentAnalysis,
  VideoMetadata,
  ScoreDetail,
  HookAlternative,
  QualitativeScoreLabel,
} from '../types/index.js';
import {
  fetchContentAnalysis,
  triggerVideoAnalysis,
  fetchVideoMetadata,
  generateMetadata,
  approveMetadata,
} from '../services/api.js';

interface AIAnalysisModalProps {
  video: VideoItem;
  onClose: () => void;
  onScheduleVideo: (video: VideoItem) => void;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  video,
  onClose,
  onScheduleVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'hooks' | 'metadata'>('analysis');
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingMeta, setGeneratingMeta] = useState(false);
  const [selectedHookText, setSelectedHookText] = useState<string>('');
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Metadata form state
  const [shortCaption, setShortCaption] = useState('');
  const [longCaption, setLongCaption] = useState('');
  const [cta, setCta] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [youtubeDescription, setYoutubeDescription] = useState('');
  const [youtubeTags, setYoutubeTags] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    loadData();
  }, [video.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      let a = await fetchContentAnalysis(video.id);
      if (!a) {
        // Trigger initial analysis automatically if none exists
        a = await triggerVideoAnalysis(video.id);
      }
      setAnalysis(a);

      let m = await fetchVideoMetadata(video.id);
      if (!m && a) {
        m = await generateMetadata(video.id, a.hook_alternatives[0]?.hook_text);
      }
      if (m) {
        setMetadata(m);
        setShortCaption(m.short_caption);
        setLongCaption(m.long_caption);
        setCta(m.cta);
        setHashtags(m.hashtags);
        setYoutubeTitle(m.youtube_title);
        setYoutubeDescription(m.youtube_description);
        setYoutubeTags(m.youtube_tags);
        setIsApproved(Boolean(m.approved_at));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHook = async (hook: HookAlternative) => {
    setSelectedHookText(hook.hook_text);
    setGeneratingMeta(true);
    try {
      const updatedMeta = await generateMetadata(video.id, hook.hook_text);
      setMetadata(updatedMeta);
      setShortCaption(updatedMeta.short_caption);
      setLongCaption(updatedMeta.long_caption);
      setYoutubeTitle(updatedMeta.youtube_title);
      setActiveTab('metadata');
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingMeta(false);
    }
  };

  const handleApproveMetadata = async () => {
    try {
      const approved = await approveMetadata({
        video_id: video.id,
        short_caption: shortCaption,
        long_caption: longCaption,
        cta,
        hashtags,
        youtube_title: youtubeTitle,
        youtube_description: youtubeDescription,
        youtube_tags: youtubeTags,
      });
      setIsApproved(true);
      setMetadata(approved);
      onScheduleVideo(video);
    } catch (err) {
      console.error(err);
    }
  };

  const getScoreBadge = (label: QualitativeScoreLabel) => {
    switch (label) {
      case 'Strong':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Strong</span>
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Moderate</span>
          </span>
        );
      case 'Needs improvement':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Needs Improvement</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white truncate max-w-md">{video.title}</h2>
              <div className="text-xs text-slate-400 flex items-center space-x-2">
                <span>AI Video Analysis &amp; Packaging Optimization</span>
                <span>&bull;</span>
                <span className="text-purple-400">Gemini 3.8 Flash</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-slate-800 bg-slate-950/30 flex space-x-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-3 transition relative ${
              activeTab === 'analysis' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Qualitative Video Diagnostic
            {activeTab === 'analysis' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('hooks')}
            className={`pb-3 transition relative ${
              activeTab === 'hooks' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Hook Optimizer (6 Angles)
            {activeTab === 'hooks' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`pb-3 transition relative ${
              activeTab === 'metadata' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Captions &amp; Packaging (Anti-Slop)
            {activeTab === 'metadata' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-semibold text-slate-300">Extracting Video Evidence &amp; Running Diagnosis...</div>
              <p className="text-xs text-slate-400">Analyzing spoken hook, cut density, and retention risk</p>
            </div>
          ) : activeTab === 'analysis' && analysis ? (
            <div className="space-y-6">
              {/* First 3 Seconds Retention Risk Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                    First 3 Seconds Retention Risk
                  </span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {analysis.first_3s_retention_risk === 'Low' ? 'Low Swipe-Away Risk' : 'Medium Swipe-Away Risk'}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {analysis.hook_strength.why}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Pacing Cadence</span>
                  <span className="text-sm font-bold text-slate-200">{analysis.pacing_cuts_per_minute} cuts / min</span>
                </div>
              </div>

              {/* Qualitative Diagnostic Cards (Section 5 requirement) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Qualitative Metric Audit (Timestamped Evidence)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hook Strength */}
                  <DiagnosticScoreCard title="Hook Strength" detail={analysis.hook_strength} getScoreBadge={getScoreBadge} />
                  {/* Retention Potential */}
                  <DiagnosticScoreCard title="Retention Potential" detail={analysis.retention_potential} getScoreBadge={getScoreBadge} />
                  {/* Shareability */}
                  <DiagnosticScoreCard title="Shareability (DM Senders)" detail={analysis.shareability} getScoreBadge={getScoreBadge} />
                  {/* Save Potential */}
                  <DiagnosticScoreCard title="Save Potential" detail={analysis.save_potential} getScoreBadge={getScoreBadge} />
                  {/* Follow-Conversion Potential */}
                  <DiagnosticScoreCard title="Follow-Conversion Potential" detail={analysis.follow_conversion_potential} getScoreBadge={getScoreBadge} />
                  {/* CTA Quality */}
                  <DiagnosticScoreCard title="Call-To-Action (CTA)" detail={analysis.cta_quality} getScoreBadge={getScoreBadge} />
                  {/* Clarity */}
                  <DiagnosticScoreCard title="Clarity & Pacing" detail={analysis.clarity} getScoreBadge={getScoreBadge} />
                  {/* Content Structure */}
                  <DiagnosticScoreCard title="Structure & Progression" detail={analysis.content_structure} getScoreBadge={getScoreBadge} />
                </div>
              </div>

              {/* Spoken Transcript Preview */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Extracted Audio Transcript
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono italic">
                  "{analysis.transcript_text}"
                </p>
              </div>
            </div>
          ) : activeTab === 'hooks' && analysis ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">AI Hook Optimizer (6 Psychological Angles)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Re-packaging the first sentence without altering the video itself. Select an angle to auto-inject into your caption packaging.
                </p>
              </div>

              <div className="space-y-3">
                {analysis.hook_alternatives.map((hook, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      selectedHookText === hook.hook_text
                        ? 'border-purple-500 bg-purple-950/20'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-purple-300 border border-slate-700">
                        {hook.angle} Angle
                      </span>
                      <button
                        onClick={() => handleSelectHook(hook)}
                        disabled={generatingMeta}
                        className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold transition"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Use This Hook</span>
                      </button>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-white leading-relaxed">
                      "{hook.hook_text}"
                    </p>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {hook.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'metadata' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Captions &amp; Packaging Optimization</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Engineered against generic "AI-slop": no cliché openers, no emoji spam, relevance-ranked hashtags. Fully editable.
                </p>
              </div>

              <div className="space-y-4">
                {/* Short Caption */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">Short Caption Variant (Feed Scan)</label>
                    <span className="text-[11px] text-slate-400">{shortCaption.length} characters</span>
                  </div>
                  <input
                    type="text"
                    value={shortCaption}
                    onChange={(e) => setShortCaption(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Long Caption */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">Long Caption Variant (Story + Value Breakdown)</label>
                    <span className="text-[11px] text-slate-400">{longCaption.length} characters</span>
                  </div>
                  <textarea
                    rows={6}
                    value={longCaption}
                    onChange={(e) => setLongCaption(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                  />
                </div>

                {/* Relevance-ranked hashtags */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Relevance-Ranked Hashtags</label>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 font-mono text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* YouTube Metadata */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    YouTube Shorts Packaging
                  </span>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">YouTube Title</label>
                    <input
                      type="text"
                      value={youtubeTitle}
                      onChange={(e) => setYoutubeTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            {isApproved ? (
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Metadata approved for publication</span>
              </span>
            ) : (
              <span>Review final copy before scheduling</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={handleApproveMetadata}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition"
            >
              <span>Approve &amp; Proceed to Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiagnosticScoreCard: React.FC<{
  title: string;
  detail: ScoreDetail;
  getScoreBadge: (label: QualitativeScoreLabel) => React.ReactNode;
}> = ({ title, detail, getScoreBadge }) => (
  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
    <div className="flex items-center justify-between">
      <span className="font-semibold text-slate-200 text-xs">{title}</span>
      {getScoreBadge(detail.label)}
    </div>
    <p className="text-xs text-slate-300 leading-snug">{detail.why}</p>
    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900">
      <strong className="text-purple-300">Concrete Fix:</strong> {detail.fix}
    </div>
    {detail.timestamp_evidence && (
      <div className="text-[10px] text-slate-400 font-mono bg-slate-900/60 px-2 py-1 rounded">
        Evidence: {detail.timestamp_evidence}
      </div>
    )}
  </div>
);

import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  Bookmark,
  Share2,
  Filter,
  Check,
  Wand2,
} from 'lucide-react';
import { ContentIdea, Workspace } from '../types/index.js';
import { fetchContentIdeas, generateContentIdeas } from '../services/api.js';

interface ContentIdeasViewProps {
  workspace: Workspace;
  onSendToUpload: (idea: ContentIdea) => void;
}

export const ContentIdeasView: React.FC<ContentIdeasViewProps> = ({
  workspace,
  onSendToUpload,
}) => {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [generating, setGenerating] = useState(false);

  const categories = [
    'all',
    'Education',
    'Storytelling',
    'Entertainment',
    'Authority',
    'Case studies',
    'Experiments',
    'Trending opportunities',
  ];

  useEffect(() => {
    loadIdeas();
  }, [workspace.id]);

  const loadIdeas = async () => {
    try {
      const data = await fetchContentIdeas(workspace.id);
      setIdeas(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateMore = async () => {
    setGenerating(true);
    try {
      const newIdeas = await generateContentIdeas(
        workspace.id,
        activeCategory === 'all' ? 'Education' : activeCategory
      );
      setIdeas((prev) => [...newIdeas, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const filteredIdeas = activeCategory === 'all'
    ? ideas
    : ideas.filter((i) => i.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Content Idea Generator</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Pattern-Grounded
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Tailored to your niche ({workspace.niche}) and primary growth goal ({workspace.growth_goal}).
          </p>
        </div>

        <button
          onClick={handleGenerateMore}
          disabled={generating}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition active:scale-98"
        >
          <Sparkles className="w-4 h-4" />
          <span>{generating ? 'Synthesizing Angles...' : 'Generate New Ideas'}</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              activeCategory === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {idea.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {idea.suggested_format}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Opening Hook
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">
                  "{idea.hook}"
                </h3>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Core Thesis
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {idea.core_idea}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-purple-300/90 leading-snug">
                <strong className="text-purple-200">Why this works:</strong> {idea.why_it_works}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                CTA: {idea.cta}
              </span>

              <button
                onClick={() => onSendToUpload(idea)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white text-xs font-semibold transition"
              >
                <span>Produce</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

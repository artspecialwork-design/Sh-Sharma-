import React, { useState } from 'react';
import { X, Layers, Plus, Sparkles } from 'lucide-react';
import { Workspace } from '../types/index.js';
import { createWorkspace } from '../services/api.js';

interface CreateWorkspaceModalProps {
  onClose: () => void;
  onWorkspaceCreated: (workspace: Workspace) => void;
}

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  onClose,
  onWorkspaceCreated,
}) => {
  const [name, setName] = useState('');
  const [niche, setNiche] = useState<any>('Tech & AI');
  const [primaryPlatform, setPrimaryPlatform] = useState<any>('instagram');
  const [targetAudience, setTargetAudience] = useState('');
  const [country, setCountry] = useState('United States');
  const [timezone, setTimezone] = useState('America/New_York');
  const [language, setLanguage] = useState('English');
  const [growthGoal, setGrowthGoal] = useState<any>('Reach');
  const [postingFrequency, setPostingFrequency] = useState<any>('Daily');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    try {
      const ws = await createWorkspace({
        name,
        niche,
        primary_platform: primaryPlatform,
        target_audience: targetAudience || 'Target audience seeking high quality short-form video',
        country,
        timezone,
        language,
        growth_goal: growthGoal,
        posting_frequency: postingFrequency,
        is_demo: false,
      });
      onWorkspaceCreated(ws);
      onClose();
    } catch (err: any) {
      alert(`Error creating workspace: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Create Creator Workspace</h3>
              <span className="text-xs text-slate-400">Scoped row-level data isolation</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Creator / Brand / Client Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Rostova or Apex Media"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Content Niche</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Tech & AI">Tech &amp; AI</option>
                <option value="Finance & Investing">Finance &amp; Investing</option>
                <option value="Creator Economy">Creator Economy</option>
                <option value="E-commerce & SaaS">E-commerce &amp; SaaS</option>
                <option value="Fitness & Wellness">Fitness &amp; Wellness</option>
                <option value="Education & Career">Education &amp; Career</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Primary Platform</label>
              <select
                value={primaryPlatform}
                onChange={(e) => setPrimaryPlatform(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="instagram">Instagram Reels (Direct Login)</option>
                <option value="youtube">YouTube Shorts</option>
                <option value="both">Both Platforms</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Growth Goal</label>
              <select
                value={growthGoal}
                onChange={(e) => setGrowthGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Reach">Reach &amp; Explore</option>
                <option value="Followers">Follower Conversion</option>
                <option value="Engagement">Engagement &amp; DM Shares</option>
                <option value="Sales">Sales &amp; Conversions</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Target Timezone (IANA)</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="America/New_York"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Target Audience Summary</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Developers and founders building AI tools"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
          >
            {loading ? 'Creating...' : 'Provision Workspace'}
          </button>
        </div>
      </form>
    </div>
  );
};

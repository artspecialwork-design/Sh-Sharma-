import React, { useState, useEffect } from 'react';
import {
  Workspace,
  ConnectedAccount,
  VideoItem,
  ScheduledPost,
  NotificationItem,
} from './types/index.js';
import {
  fetchWorkspaces,
  fetchConnectedAccounts,
  fetchVideos,
  fetchScheduledPosts,
  fetchNotifications,
  markNotificationRead,
} from './services/api.js';

import { Navbar } from './components/Navbar.js';
import { Sidebar, ActiveTab } from './components/Sidebar.js';
import { Banner } from './components/Banner.js';
import { OverviewView } from './components/OverviewView.js';
import { UploadPipelineView } from './components/UploadPipelineView.js';
import { ContentLibraryView } from './components/ContentLibraryView.js';
import { CalendarView } from './components/CalendarView.js';
import { AnalyticsView } from './components/AnalyticsView.js';
import { GrowthBrainView } from './components/GrowthBrainView.js';
import { ContentIdeasView } from './components/ContentIdeasView.js';
import { CompetitorIntelView } from './components/CompetitorIntelView.js';
import { ExperimentsView } from './components/ExperimentsView.js';
import { ConnectedAccountsView } from './components/ConnectedAccountsView.js';
import { AuditLogView } from './components/AuditLogView.js';
import { AutoEngagementView } from './components/AutoEngagementView.js';
import { AgencyClientHubView } from './components/AgencyClientHubView.js';
import { AIAnalysisModal } from './components/AIAnalysisModal.js';
import { ScheduleModal } from './components/ScheduleModal.js';
import { CreateWorkspaceModal } from './components/CreateWorkspaceModal.js';

export default function App() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('connections');

  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals state
  const [modalVideoAnalysis, setModalVideoAnalysis] = useState<VideoItem | null>(null);
  const [modalSchedule, setModalSchedule] = useState<VideoItem | null>(null);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);

  // Initial data load
  useEffect(() => {
    loadWorkspaces();
  }, []);

  // When active workspace changes, reload workspace-specific entities
  useEffect(() => {
    if (activeWorkspace) {
      loadWorkspaceData(activeWorkspace.id);
    }
  }, [activeWorkspace?.id]);

  const loadWorkspaces = async () => {
    try {
      const wsList = await fetchWorkspaces();
      setWorkspaces(wsList);
      if (wsList.length > 0 && !activeWorkspace) {
        // Default to the Real Creator Workspace so user can immediately connect their authentic account
        const realWs = wsList.find((w) => !w.is_demo) || wsList[0];
        setActiveWorkspace(realWs);
      }
    } catch (err) {
      console.error('Error fetching workspaces:', err);
    }
  };

  const loadWorkspaceData = async (wsId: string) => {
    try {
      const [accs, vids, posts, notifs] = await Promise.all([
        fetchConnectedAccounts(wsId),
        fetchVideos(wsId),
        fetchScheduledPosts(wsId),
        fetchNotifications(wsId),
      ]);
      setConnectedAccounts(accs);
      setVideos(vids);
      setScheduledPosts(posts);
      setNotifications(notifs);
    } catch (err) {
      console.error('Error loading workspace data:', err);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    await markNotificationRead(id);
    if (activeWorkspace) {
      const notifs = await fetchNotifications(activeWorkspace.id);
      setNotifications(notifs);
    }
  };

  const handleUploadSuccess = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  if (!activeWorkspace) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading GrowthOS Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        onCreateWorkspaceClick={() => setShowCreateWorkspace(true)}
        onUploadClick={() => setActiveTab('upload')}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        connectedAccounts={connectedAccounts}
      />

      {/* Mode Banner: Explicitly flags Sandbox vs Live Workspace */}
      <Banner
        workspace={activeWorkspace}
        onSwitchToReal={() => {
          const realWs = workspaces.find((w) => !w.is_demo);
          if (realWs) setActiveWorkspace(realWs);
        }}
        onGoToConnectedAccounts={() => setActiveTab('connections')}
      />

      {/* Main Layout: Sidebar + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          videoCount={videos.length}
          scheduledCount={scheduledPosts.filter((p) => p.status === 'scheduled').length}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeTab === 'overview' && (
            <OverviewView
              workspace={activeWorkspace}
              connectedAccounts={connectedAccounts}
              scheduledPosts={scheduledPosts}
              videos={videos}
              onUploadClick={() => setActiveTab('upload')}
              onOpenAnalysis={(vid) => setModalVideoAnalysis(vid)}
              onOpenSchedule={(vid) => setModalSchedule(vid)}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'upload' && (
            <UploadPipelineView
              workspace={activeWorkspace}
              onUploadSuccess={handleUploadSuccess}
              onOpenAnalysis={(vid) => setModalVideoAnalysis(vid)}
              onOpenSchedule={(vid) => setModalSchedule(vid)}
              recentVideos={videos}
            />
          )}

          {activeTab === 'library' && (
            <ContentLibraryView
              videos={videos}
              onUploadClick={() => setActiveTab('upload')}
              onOpenAnalysis={(vid) => setModalVideoAnalysis(vid)}
              onOpenSchedule={(vid) => setModalSchedule(vid)}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              scheduledPosts={scheduledPosts}
              videos={videos}
              onRefresh={() => loadWorkspaceData(activeWorkspace.id)}
              onOpenAnalysis={(vid) => setModalVideoAnalysis(vid)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              workspace={activeWorkspace}
              videos={videos}
              publishedPosts={scheduledPosts.filter((p) => p.status === 'published')}
            />
          )}

          {activeTab === 'growth_brain' && (
            <GrowthBrainView
              workspace={activeWorkspace}
              onNavigateToIdeas={() => setActiveTab('ideas')}
            />
          )}

          {activeTab === 'ideas' && (
            <ContentIdeasView
              workspace={activeWorkspace}
              onSendToUpload={(idea) => {
                setActiveTab('upload');
              }}
            />
          )}

          {activeTab === 'competitors' && (
            <CompetitorIntelView
              workspace={activeWorkspace}
              onNavigateToIdeas={() => setActiveTab('ideas')}
              onNavigateToAutomation={() => setActiveTab('automation')}
            />
          )}

          {activeTab === 'automation' && (
            <AutoEngagementView
              workspace={activeWorkspace}
              onNavigateToCompetitors={() => setActiveTab('competitors')}
              onNavigateToAgency={() => setActiveTab('agency')}
            />
          )}

          {activeTab === 'agency' && (
            <AgencyClientHubView
              workspace={activeWorkspace}
              onNavigateToEngagement={() => setActiveTab('automation')}
              onNavigateToCompetitors={() => setActiveTab('competitors')}
            />
          )}

          {activeTab === 'experiments' && (
            <ExperimentsView workspace={activeWorkspace} />
          )}

          {activeTab === 'connections' && (
            <ConnectedAccountsView
              workspace={activeWorkspace}
              accounts={connectedAccounts}
              onRefreshAccounts={() => loadWorkspaceData(activeWorkspace.id)}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogView workspace={activeWorkspace} />
          )}
        </main>
      </div>

      {/* AI Qualitative Analysis & Hook Optimizer Modal */}
      {modalVideoAnalysis && (
        <AIAnalysisModal
          video={modalVideoAnalysis}
          onClose={() => setModalVideoAnalysis(null)}
          onScheduleVideo={(vid) => {
            setModalVideoAnalysis(null);
            setModalSchedule(vid);
          }}
        />
      )}

      {/* Personalized Best-Time Scheduling Modal */}
      {modalSchedule && (
        <ScheduleModal
          video={modalSchedule}
          workspace={activeWorkspace}
          connectedAccounts={connectedAccounts}
          onClose={() => setModalSchedule(null)}
          onScheduledSuccess={() => {
            loadWorkspaceData(activeWorkspace.id);
            setActiveTab('calendar');
          }}
        />
      )}

      {/* Create Workspace Modal */}
      {showCreateWorkspace && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateWorkspace(false)}
          onWorkspaceCreated={(newWs) => {
            setWorkspaces((prev) => [...prev, newWs]);
            setActiveWorkspace(newWs);
          }}
        />
      )}
    </div>
  );
}

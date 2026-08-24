import { useEffect, useMemo, useState } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { AppHeader } from './components/AppHeader';
import { LoginPage } from './components/LoginPage';
import { ServerDetailsPanel } from './components/ServerDetailsPanel';
import { WorkspaceTabs } from './components/WorkspaceTabs';
import { RemediationPanel } from './components/RemediationPanel';
import { AiChatPanel } from './components/AiChatPanel';
import { CmdbCorrectionPanel } from './components/CmdbCorrectionPanel';
import { NotificationDrawer } from './components/NotificationDrawer';
import { useMockAuth } from './auth/authConfig';
import {
  askAssistant,
  createCmdbCorrection,
  generatePlan,
  getNotifications,
  getServer,
  markAllNotificationsRead,
  markNotificationRead,
  saveDecision,
} from './services/serverApi';
import type {
  ChatMessage,
  RemediationPlan,
  ServerRecord,
  UserNotification,
  WorkspaceTab,
} from './types';

export default function App() {
  // Authentication state: the local boolean is used only when mock auth is enabled.
  const msalAuthenticated = useIsAuthenticated();
  const [mockAuthenticated, setMockAuthenticated] = useState(false);
  const authenticated = useMockAuth ? mockAuthenticated : msalAuthenticated;

  // Workspace state shared between independent components.
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('remediation');
  const [server, setServer] = useState<ServerRecord | null>(null);
  const [plan, setPlan] = useState<RemediationPlan | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.readAt).length,
    [notifications],
  );

  // Load notification data after sign-in. Errors should be routed to production telemetry/toasts.
  useEffect(() => {
    if (authenticated) getNotifications().then(setNotifications).catch(console.error);
  }, [authenticated]);

  const searchServer = async (serverName: string) => {
    setBusy('server');
    try {
      setServer(await getServer(serverName));
      setPlan(null);
      setMessages([]);
    } finally {
      setBusy(null);
    }
  };
  const createPlan = async () => {
    if (!server) return;
    setBusy('plan');
    try {
      setPlan(await generatePlan(server.id));
    } finally {
      setBusy(null);
    }
  };
  const sendQuestion = async (question: string) => {
    if (!server) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: question };
    setMessages((current) => [...current, userMessage]);
    setBusy('chat');
    try {
      const answer = await askAssistant(question, server.id, plan?.id);
      setMessages((current) => [...current, answer]);
    } finally {
      setBusy(null);
    }
  };
  const selectNotification = async (notification: UserNotification) => {
    await markNotificationRead(notification.id);
    setNotifications((items) =>
      items.map((item) =>
        item.id === notification.id ? { ...item, readAt: new Date().toISOString() } : item,
      ),
    );
    setNotificationsOpen(false);
    if (notification.serverId) {
      await searchServer(notification.detail.split(' • ')[0]);
      setActiveTab('remediation');
    }
  };
  const markAllRead = async () => {
    await markAllNotificationsRead();
    const readAt = new Date().toISOString();
    setNotifications((items) => items.map((item) => ({ ...item, readAt })));
  };

  if (!authenticated) return <LoginPage onMockLogin={() => setMockAuthenticated(true)} />;

  return (
    <div className="app-shell">
      <AppHeader
        title="Build an evidence-based remediation decision"
        subtitle={server ? `Server ${server.serverName}` : 'Search for a server to begin'}
        unreadCount={unreadCount}
        notificationsOpen={notificationsOpen}
        onToggleNotifications={() => setNotificationsOpen((open) => !open)}
      />
      <main className="workspace-layout">
        <ServerDetailsPanel server={server} loading={busy === 'server'} onSearch={searchServer} />
        <section className="workspace-main">
          <WorkspaceTabs activeTab={activeTab} onChange={setActiveTab} />
          {!server ? (
            <div className="workspace-empty">
              <h2>Search for a server</h2>
              <p>
                Enter a server name in the CMDB panel to load lifecycle details and remediation
                tools.
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'remediation' && (
                <RemediationPanel
                  server={server}
                  plan={plan}
                  generating={busy === 'plan'}
                  onGenerate={createPlan}
                  onSave={saveDecision}
                />
              )}
              {activeTab === 'assistant' && (
                <AiChatPanel messages={messages} sending={busy === 'chat'} onSend={sendQuestion} />
              )}
              {activeTab === 'correction' && (
                <CmdbCorrectionPanel
                  server={server}
                  submitting={busy === 'ticket'}
                  onSubmit={async (request) => {
                    setBusy('ticket');
                    try {
                      return await createCmdbCorrection(request);
                    } finally {
                      setBusy(null);
                    }
                  }}
                />
              )}
            </>
          )}
        </section>
      </main>
      {notificationsOpen && (
        <NotificationDrawer
          notifications={notifications}
          onClose={() => setNotificationsOpen(false)}
          onSelect={selectNotification}
          onMarkAllRead={markAllRead}
        />
      )}
    </div>
  );
}

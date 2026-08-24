import { apiClient } from './apiClient';
import { mockNotifications, mockPlan, mockServer } from '../data/mockData';
import type {
  ChatMessage,
  CmdbCorrectionRequest,
  RemediationDecision,
  RemediationPlan,
  ServerRecord,
  UserNotification,
} from '../types';

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';
const wait = (milliseconds = 450) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// GET /servers/{serverName}
export async function getServer(serverName: string): Promise<ServerRecord> {
  if (useMockApi) {
    await wait();
    return { ...mockServer, serverName: serverName || mockServer.serverName };
  }
  return (await apiClient.get<ServerRecord>(`/servers/${encodeURIComponent(serverName)}`)).data;
}

// POST /servers/{serverId}/remediation-plans
export async function generatePlan(serverId: string): Promise<RemediationPlan> {
  if (useMockApi) {
    await wait(850);
    return mockPlan;
  }
  const accepted = await apiClient.post<{ jobId: string; statusUrl: string }>(
    `/servers/${serverId}/remediation-plans`,
    {
      trigger: 'user',
      strategyOptions: ['refresh', 'decommission', 'defer'],
      includeEvidence: true,
    },
    { headers: { 'Idempotency-Key': crypto.randomUUID() } },
  );
  // PLACEHOLDER: production should poll accepted.data.statusUrl until the job returns the final plan.
  return (await apiClient.get<RemediationPlan>(accepted.data.statusUrl)).data;
}

// PATCH /remediation-decisions/{decisionId}
export async function saveDecision(decision: RemediationDecision): Promise<RemediationDecision> {
  if (useMockApi) {
    await wait();
    return { ...decision, version: decision.version + 1 };
  }
  return (
    await apiClient.patch<RemediationDecision>(`/remediation-decisions/${decision.id}`, decision)
  ).data;
}

// POST /chat/query
export async function askAssistant(
  question: string,
  serverId: string,
  planId?: string,
): Promise<ChatMessage> {
  if (useMockApi) {
    await wait(600);
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        'Refresh is preferred because this production server supports a business-critical application and both OS and hardware support windows are closing. Deferral reduces near-term effort but leaves elevated security, compliance and outage exposure.',
      citations: ['CMDB record', 'Remediation Plan v1', 'KA-1048', 'Vendor lifecycle evidence'],
    };
  }
  return (await apiClient.post<ChatMessage>('/chat/query', { question, serverId, planId })).data;
}

// POST /cmdb-corrections; backend/Power Automate creates the ServiceNow ticket.
export async function createCmdbCorrection(
  payload: CmdbCorrectionRequest,
): Promise<{ ticketNumber: string; status: string }> {
  if (useMockApi) {
    await wait(650);
    return { ticketNumber: 'INC0019999', status: 'New (mock)' };
  }
  return (
    await apiClient.post<{ ticketNumber: string; status: string }>('/cmdb-corrections', payload, {
      headers: { 'Idempotency-Key': crypto.randomUUID() },
    })
  ).data;
}

// GET /notifications?status=unread&limit=20
export async function getNotifications(): Promise<UserNotification[]> {
  if (useMockApi) return mockNotifications.map((item) => ({ ...item }));
  return (
    await apiClient.get<{ items: UserNotification[] }>('/notifications', {
      params: { status: 'unread', limit: 20 },
    })
  ).data.items;
}

// PATCH notification acknowledgement endpoints.
export async function markNotificationRead(notificationId: string): Promise<void> {
  if (useMockApi) return;
  await apiClient.patch(`/notifications/${notificationId}`, { readAt: new Date().toISOString() });
}

export async function markAllNotificationsRead(): Promise<void> {
  if (useMockApi) return;
  await apiClient.patch('/notifications/read-all', { readAt: new Date().toISOString() });
}

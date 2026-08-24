export type WorkspaceTab = 'remediation' | 'assistant' | 'correction';
export type RemediationStrategy = 'refresh' | 'decommission' | 'defer' | 'replatform';

export interface ServerRecord {
  id: string;
  serverName: string;
  lifecycleStatus: string;
  daysToEol: number;
  applicationName: string;
  applicationId: string;
  criticality: string;
  serverOwner: string;
  contactEmail: string;
  countrySite: string;
  environment: string;
  osName: string;
  osVersionId: string;
  hardwareModel: string;
  serialNumber: string;
  hardwareProvider: string;
  installDate: string;
  supportTier: string;
  dataRefreshedAt: string;
}

export interface RemediationPlan {
  id: string;
  version: number;
  status: 'draft' | 'ready' | 'approved';
  recommendedStrategy: RemediationStrategy;
  summary: string;
  advantages: string[];
  tradeOffs: string[];
  evidence: string[];
  generatedAt: string;
}

export interface RemediationDecision {
  id: string;
  strategy: RemediationStrategy;
  targetDate: string;
  rationale: string;
  version: number;
}

export interface UserNotification {
  id: string;
  type: 'EOL_WARNING' | 'APPROVAL' | 'OVERDUE' | 'PLAN_READY' | 'TICKET_UPDATE';
  title: string;
  detail: string;
  statusText: string;
  tone: 'danger' | 'success' | 'primary' | 'secondary';
  createdAt: string;
  readAt: string | null;
  serverId?: string;
  deepLink?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

export interface CmdbCorrectionRequest {
  serverId: string;
  fieldName: string;
  currentValue: string;
  correctedValue: string;
  reason: string;
}

import type { RemediationPlan, ServerRecord, UserNotification } from '../types';

// PLACEHOLDER DATA: replace with ServiceNow CMDB/PostgreSQL data through the API layer.
export const mockServer: ServerRecord = {
  id: 'srv_1042',
  serverName: 'HOU-APP-PRD-042',
  lifecycleStatus: 'EOL in 184 days',
  daysToEol: 184,
  applicationName: 'Pipeline Scheduling',
  applicationId: 'APP-008742',
  criticality: 'Business Critical',
  serverOwner: 'Maya Patel',
  contactEmail: 'maya.patel@company.com',
  countrySite: 'USA / Houston',
  environment: 'Production',
  osName: 'Windows Server 2016',
  osVersionId: '10.0.14393 / WIN-16-DC',
  hardwareModel: 'Dell PowerEdge R740',
  serialNumber: '9XZ4KQ2',
  hardwareProvider: 'Dell Technologies',
  installDate: '18 Sep 2018',
  supportTier: 'Premium • expires 20 Feb 2027',
  dataRefreshedAt: '20 Aug 2026 • 02:15 UTC',
};

// PLACEHOLDER PLAN: simulates the grounded plan returned by the AI workflow.
export const mockPlan: RemediationPlan = {
  id: 'plan_7842',
  version: 1,
  status: 'ready',
  recommendedStrategy: 'refresh',
  summary:
    'Replace the Dell R740 and migrate the Pipeline Scheduling application to a supported Windows platform before 20 Feb 2027.',
  advantages: [
    'Lowest residual security and outage risk',
    'Maintains vendor support for a business-critical production service',
    'Enables validation and rollback before the deadline',
  ],
  tradeOffs: [
    'Higher one-time cost',
    'Requires application regression testing',
    'Planned maintenance window',
  ],
  evidence: ['Microsoft lifecycle', 'Dell support', 'Internal risk registry', 'KA-1048'],
  generatedAt: '2026-08-20T02:22:00Z',
};

// PLACEHOLDER NOTIFICATIONS: examples shown in the PowerPoint mockup.
export const mockNotifications: UserNotification[] = [
  {
    id: 'ntf_9021',
    type: 'EOL_WARNING',
    title: 'EOL approaching in 180 days',
    detail: 'HOU-APP-PRD-042 • Windows Server 2016',
    statusText: 'Action required',
    tone: 'danger',
    createdAt: 'Today',
    readAt: null,
    serverId: 'srv_1042',
    deepLink: '/servers/srv_1042/remediation',
  },
  {
    id: 'ntf_9022',
    type: 'APPROVAL',
    title: 'Remediation request approved',
    detail: 'DAL-DB-PRD-118 • Server refresh',
    statusText: 'Approved',
    tone: 'success',
    createdAt: 'Today',
    readAt: null,
  },
  {
    id: 'ntf_9023',
    type: 'OVERDUE',
    title: 'Decision target date is overdue',
    detail: 'LON-WEB-DEV-009 • Decommission',
    statusText: 'Follow up',
    tone: 'danger',
    createdAt: 'Yesterday',
    readAt: null,
  },
  {
    id: 'ntf_9024',
    type: 'PLAN_READY',
    title: 'New plan is ready for review',
    detail: 'HOU-FILE-PRD-031 • Plan v2',
    statusText: 'Review',
    tone: 'primary',
    createdAt: '18 Aug',
    readAt: null,
  },
  {
    id: 'ntf_9025',
    type: 'TICKET_UPDATE',
    title: 'ServiceNow ticket updated',
    detail: 'INC0018742 • CMDB owner correction',
    statusText: 'In progress',
    tone: 'secondary',
    createdAt: '17 Aug',
    readAt: null,
  },
];

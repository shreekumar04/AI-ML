# Server Lifecycle AI — React UI

An editable React + TypeScript implementation of the Server EOL Remediation UI mockup. The application helps an Oil & Gas infrastructure team identify servers approaching operating-system or hardware end of life, generate evidence-grounded remediation plans, record human decisions, ask grounded questions, and request ServiceNow CMDB corrections.

## What is implemented

- Separate Microsoft SSO page using MSAL, with mock authentication enabled by default.
- Persistent 40% CMDB server-details panel and 60% action workspace.
- Remediation-plan generation, strategy/date/rationale capture, and PDF-export placeholder.
- Grounded AI assistant interface.
- ServiceNow correction-ticket payload and submission flow.
- Notification bell, unread badge, notification drawer, mark-read and mark-all-read behavior.
- Axios API layer matching the GET, POST, and PATCH contracts in the PowerPoint.
- Responsive Bootstrap-compatible styling using `#FFB81C`, `#353535`, and white.

## Prerequisites

- Node.js 20.19+ or 22.12+ is recommended for Vite 7.
- npm 10+.
- Visual Studio Code is optional. “Material Icon Theme” only changes VS Code file icons; it is not required by this application.

## Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL shown by Vite, normally `http://localhost:5173`.

The default environment uses mock authentication and mock API data, so no Azure resources are required for the first run. Search for any server name; the other fields use clearly labeled placeholder data from `src/data/mockData.ts`.

## Folder structure

```text
server-eol-remediation-ui/
├── src/
│   ├── auth/
│   │   └── authConfig.ts          # MSAL and Entra ID configuration
│   ├── components/
│   │   ├── AiChatPanel.tsx        # Grounded assistant UI
│   │   ├── AppHeader.tsx          # Header, bell, badge and avatar
│   │   ├── BellIcon.tsx           # Dependency-free SVG bell icon
│   │   ├── CmdbCorrectionPanel.tsx# ServiceNow correction form
│   │   ├── LoginPage.tsx          # SSO/login screen
│   │   ├── NotificationDrawer.tsx # EOL and workflow notifications
│   │   ├── RemediationPanel.tsx   # Plan generation and decision capture
│   │   ├── ServerDetailsPanel.tsx # Read-only CMDB data and search
│   │   └── WorkspaceTabs.tsx      # Three-section tab navigation
│   ├── data/
│   │   └── mockData.ts            # Explicit placeholder server/plan/alerts
│   ├── services/
│   │   ├── apiClient.ts           # Axios client and interceptors
│   │   └── serverApi.ts           # Typed GET/POST/PATCH functions
│   ├── styles/
│   │   └── app.css                # Responsive visual system
│   ├── types/
│   │   └── index.ts               # Shared domain contracts
│   ├── App.tsx                    # Application state and orchestration
│   └── main.tsx                   # React, Bootstrap and MSAL bootstrap
├── .env.example                   # Configuration template
├── package.json
└── vite.config.ts
```

## Switching from placeholders to Azure

1. Register the SPA in Microsoft Entra ID and add the local/production redirect URIs.
2. Copy `.env.example` to `.env.local` and set the tenant, client, API scope, and API base URL.
3. Set `VITE_USE_MOCK_AUTH=false` and `VITE_USE_MOCK_API=false`.
4. In `src/services/apiClient.ts`, replace the marked authorization placeholder with an MSAL `acquireTokenSilent()` token provider. Keep secrets out of Vite variables because all `VITE_*` values are visible in the browser.
5. Implement the Azure Function/API Management endpoints documented below.
6. Poll the plan-generation `statusUrl` until the asynchronous job completes. The current real-API branch contains a clearly marked placeholder implementation.
7. Replace the PDF-export alert with `POST /remediation-plans/{planId}/exports`, then download the returned short-lived reference through the backend.

Managed identity is used by the backend Azure Functions to access AI Search, PostgreSQL, Blob Storage, and other Azure resources. Browser code cannot use managed identity directly.

## Expected API contracts

| Method | Endpoint                                       | UI use                                                    |
| ------ | ---------------------------------------------- | --------------------------------------------------------- |
| GET    | `/servers/{serverName}`                        | CMDB server search and EOL status                         |
| GET    | `/servers/{serverId}/remediation-plans/latest` | Latest plan                                               |
| GET    | `/notifications?status=unread&limit=20`        | Bell drawer                                               |
| POST   | `/servers/{serverId}/remediation-plans`        | Start plan generation; return `202`, `jobId`, `statusUrl` |
| POST   | `/chat/query`                                  | Grounded answer and citations                             |
| POST   | `/cmdb-corrections`                            | Power Automate/ServiceNow ticket                          |
| POST   | `/remediation-plans/{planId}/exports`          | PDF generation                                            |
| PATCH  | `/remediation-decisions/{decisionId}`          | Strategy, target date, rationale and version              |
| PATCH  | `/notifications/{notificationId}`              | Mark one notification read/dismissed                      |
| PATCH  | `/notifications/read-all`                      | Mark all notifications read                               |

Recommended contract conventions:

- Validate MSAL bearer tokens and role/scope claims at the API boundary.
- Pass `X-Correlation-ID` for tracing.
- Use `Idempotency-Key` for plan generation, exports and ticket creation.
- Store UTC ISO-8601 timestamps.
- Use optimistic concurrency and return `409 Conflict` for stale decision versions.
- Do not expose Blob URLs, database credentials, vendor credentials or managed-identity tokens to the browser.

## Build and format

```bash
npm run build
npm run format
npm run format:check
```

## Placeholder inventory

- All initial server, remediation plan and notification values are dummy data in `src/data/mockData.ts`.
- The chatbot mock answer is in `src/services/serverApi.ts`.
- The ServiceNow mock ticket is `INC0019999`.
- PDF export currently displays an explicit placeholder alert.
- Notification deep links update the local state; add React Router if URL-based routing is required.
- Endpoint schemas are representative and should be aligned with the final Azure Functions/OpenAPI specification.

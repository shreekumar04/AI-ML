import { useState, type FormEvent } from 'react';
import type { ServerRecord } from '../types';

interface ServerDetailsPanelProps {
  server: ServerRecord | null;
  loading: boolean;
  onSearch: (serverName: string) => void;
}

// Static 40% CMDB panel. Values refresh when the user searches for a server.
export function ServerDetailsPanel({ server, loading, onSearch }: ServerDetailsPanelProps) {
  const [serverName, setServerName] = useState(server?.serverName ?? 'HOU-APP-PRD-042');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(serverName.trim());
  };
  const rows = server
    ? [
        ['Lifecycle status', server.lifecycleStatus],
        ['Application', server.applicationName],
        ['Application ID', server.applicationId],
        ['Criticality', server.criticality],
        ['Server owner', server.serverOwner],
        ['Contact', server.contactEmail],
        ['Country / Site', server.countrySite],
        ['Environment', server.environment],
        ['OS', server.osName],
        ['OS version / ID', server.osVersionId],
        ['Hardware', server.hardwareModel],
        ['Serial / Service Tag', server.serialNumber],
        ['Provider', server.hardwareProvider],
        ['Install date', server.installDate],
        ['Support tier', server.supportTier],
        ['Data refreshed', server.dataRefreshedAt],
      ]
    : [];

  return (
    <aside className="server-panel">
      <h2>Server Details</h2>
      <p className="section-subtitle">Authoritative CMDB snapshot</p>
      <form onSubmit={submit} className="server-search">
        <label htmlFor="server-name">Server name</label>
        <div className="input-group">
          <input
            id="server-name"
            className="form-control"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
          />
          <button className="btn brand-button" disabled={loading || !serverName.trim()}>
            {loading ? 'Loading…' : 'Go'}
          </button>
        </div>
      </form>
      {!server && <div className="empty-state">Search for a server to load CMDB details.</div>}
      <dl className="server-details-list">
        {rows.map(([label, value], index) => (
          <div className="detail-row" key={label}>
            <dt>{label}</dt>
            <dd className={index === 0 ? 'danger-text' : ''}>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

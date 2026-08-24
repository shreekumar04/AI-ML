import { useState, type FormEvent } from 'react';
import type { CmdbCorrectionRequest, ServerRecord } from '../types';

interface CmdbCorrectionPanelProps {
  server: ServerRecord;
  submitting: boolean;
  onSubmit: (request: CmdbCorrectionRequest) => Promise<{ ticketNumber: string; status: string }>;
}

// Builds the payload consumed by Power Automate/ServiceNow without directly changing CMDB data.
export function CmdbCorrectionPanel({ server, submitting, onSubmit }: CmdbCorrectionPanelProps) {
  const [fieldName, setFieldName] = useState('serverOwner');
  const [correctedValue, setCorrectedValue] = useState('Jordan Lee');
  const [reason, setReason] = useState(
    'Ownership moved to Infrastructure Operations after the support transition.',
  );
  const [result, setResult] = useState<string>();
  const currentValue =
    fieldName === 'serverOwner'
      ? server.serverOwner
      : fieldName === 'contactEmail'
        ? server.contactEmail
        : server.hardwareModel;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await onSubmit({
      serverId: server.id,
      fieldName,
      currentValue,
      correctedValue,
      reason,
    });
    setResult(`${response.ticketNumber} • ${response.status}`);
  };
  return (
    <section className="workspace-section">
      <h2>Report Incorrect Server Data</h2>
      <p>
        Select the incorrect field and provide the corrected value. Power Automate creates the
        ServiceNow ticket.
      </p>
      <form onSubmit={submit}>
        <div className="correction-grid">
          <label>
            Incorrect CMDB field
            <select
              className="form-select"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            >
              <option value="serverOwner">Server owner</option>
              <option value="contactEmail">Contact email</option>
              <option value="hardwareModel">Hardware model</option>
            </select>
          </label>
          <label>
            Current value
            <input className="form-control" value={currentValue} readOnly />
          </label>
          <label>
            Correct value
            <input
              className="form-control"
              value={correctedValue}
              onChange={(e) => setCorrectedValue(e.target.value)}
            />
          </label>
        </div>
        <label className="d-block mt-4">
          Reason / supporting detail
          <textarea
            className="form-control"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <div className="payload-preview">
          <h3>ServiceNow payload preview</h3>
          <code>
            CI: {server.serverName} • Field: {fieldName} • Old: {currentValue} • New:{' '}
            {correctedValue}
          </code>
        </div>
        <div className="save-row">
          <span>{result ?? 'The ticket number and status appear here after submission.'}</span>
          <button
            className="btn brand-button"
            disabled={submitting || !correctedValue.trim() || !reason.trim()}
          >
            {submitting ? 'Creating…' : 'Create ServiceNow ticket'}
          </button>
        </div>
      </form>
    </section>
  );
}

import { useEffect, useState } from 'react';
import type {
  RemediationDecision,
  RemediationPlan,
  RemediationStrategy,
  ServerRecord,
} from '../types';

interface RemediationPanelProps {
  server: ServerRecord;
  plan: RemediationPlan | null;
  generating: boolean;
  onGenerate: () => void;
  onSave: (decision: RemediationDecision) => Promise<RemediationDecision>;
}

// Captures the AI recommendation and the accountable human decision separately.
export function RemediationPanel({
  server,
  plan,
  generating,
  onGenerate,
  onSave,
}: RemediationPanelProps) {
  const [strategy, setStrategy] = useState<RemediationStrategy>('refresh');
  const [targetDate, setTargetDate] = useState('2027-01-15');
  const [rationale, setRationale] = useState(
    'Production-critical workload; refresh before vendor support ends.',
  );
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (plan) setStrategy(plan.recommendedStrategy);
  }, [plan]);
  const save = async () => {
    await onSave({ id: `decision_${server.id}`, strategy, targetDate, rationale, version: 1 });
    setSaved(true);
  };

  return (
    <section className="workspace-section" aria-labelledby="remediation-heading">
      <div className="section-heading-row">
        <div>
          <h2 id="remediation-heading">Remediation Decision</h2>
          <p>Generate evidence, compare options and record the approved path.</p>
        </div>
        <button className="btn brand-button" onClick={onGenerate} disabled={generating}>
          {generating ? 'Generating…' : 'Generate AI remediation plan'}
        </button>
      </div>
      <div className="decision-grid">
        <label>
          Selected strategy
          <select
            className="form-select"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as RemediationStrategy)}
          >
            <option value="refresh">Server refresh</option>
            <option value="decommission">Decommission</option>
            <option value="defer">Defer</option>
            <option value="replatform">Replatform</option>
          </select>
        </label>
        <label>
          Target implementation date
          <input
            className="form-control"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </label>
        <label>
          Decision rationale
          <textarea
            className="form-control"
            rows={2}
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
          />
        </label>
      </div>
      <article className="plan-card">
        {!plan ? (
          <div className="empty-state">
            Select “Generate AI remediation plan” to create a grounded plan. Mock mode returns
            placeholder evidence.
          </div>
        ) : (
          <>
            <div className="plan-title-row">
              <div>
                <h3>AI-generated remediation plan</h3>
                <strong className="success-text">Recommended • {plan.recommendedStrategy}</strong>
              </div>
              <button
                className="btn btn-outline-dark"
                onClick={() =>
                  alert(
                    'Placeholder: connect POST /remediation-plans/{planId}/exports to download the PDF.',
                  )
                }
              >
                Download PDF
              </button>
            </div>
            <p className="plan-summary">{plan.summary}</p>
            <div className="plan-columns">
              <div>
                <h4>Why this option</h4>
                <ul>
                  {plan.advantages.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Trade-offs</h4>
                <ul>
                  {plan.tradeOffs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <small>Evidence: {plan.evidence.join(' • ')}</small>
          </>
        )}
      </article>
      <div className="save-row">
        <span>{saved ? 'Decision saved (mock or API response).' : ''}</span>
        <button className="btn brand-button" disabled={!plan} onClick={save}>
          Save decision
        </button>
      </div>
    </section>
  );
}

import { useState, type FormEvent } from 'react';
import type { ChatMessage } from '../types';

interface AiChatPanelProps {
  messages: ChatMessage[];
  sending: boolean;
  onSend: (question: string) => void;
}

// Chat UI is grounded by the backend; the browser submits only the question and resource identifiers.
export function AiChatPanel({ messages, sending, onSend }: AiChatPanelProps) {
  const [question, setQuestion] = useState('Why is refresh preferred over deferral?');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (question.trim()) {
      onSend(question.trim());
      setQuestion('');
    }
  };
  return (
    <section className="workspace-section chat-section">
      <div>
        <h2>AI Assistant</h2>
        <p>Grounded in CMDB, generated plan, approved knowledge articles and vendor evidence.</p>
      </div>
      <div className="chat-history" aria-live="polite">
        {messages.length === 0 && (
          <div className="empty-state">
            Ask a server-specific question. Mock mode returns a placeholder grounded answer.
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
            <p>{message.content}</p>
            {message.citations && <small>Sources: {message.citations.join(' • ')}</small>}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="chat-composer">
        <label htmlFor="chat-question">Ask a follow-up</label>
        <div className="input-group">
          <input
            id="chat-question"
            className="form-control"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Compare cost, effort and residual risk…"
          />
          <button className="btn brand-button" disabled={sending || !question.trim()}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </section>
  );
}

import type { WorkspaceTab } from '../types';

interface WorkspaceTabsProps {
  activeTab: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
}
const tabs: Array<{ id: WorkspaceTab; label: string }> = [
  { id: 'remediation', label: 'Remediation Plan' },
  { id: 'assistant', label: 'AI Assistant' },
  { id: 'correction', label: 'Correct CMDB Data' },
];

// Accessible tab selector for the three right-side workspaces.
export function WorkspaceTabs({ activeTab, onChange }: WorkspaceTabsProps) {
  return (
    <nav className="workspace-tabs" aria-label="Workspace sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? 'active' : ''}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

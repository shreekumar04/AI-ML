import { BellIcon } from './BellIcon';

interface AppHeaderProps {
  title: string;
  subtitle: string;
  unreadCount: number;
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
}

// Persistent application chrome: product identity, current context, notifications and user.
export function AppHeader({
  title,
  subtitle,
  unreadCount,
  notificationsOpen,
  onToggleNotifications,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-block">SERVER LIFECYCLE AI</div>
      <div className="header-copy">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <button
        className="notification-button"
        type="button"
        aria-label="Open notifications"
        aria-expanded={notificationsOpen}
        onClick={onToggleNotifications}
      >
        <BellIcon className="bell-icon" />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>
      <div className="user-avatar" aria-label="Signed in user">
        SK
      </div>
    </header>
  );
}

import type { UserNotification } from '../types';

interface NotificationDrawerProps {
  notifications: UserNotification[];
  onClose: () => void;
  onSelect: (notification: UserNotification) => void;
  onMarkAllRead: () => void;
}

// Overlay drawer mirrors the mockup. Deep links can later be routed with React Router.
export function NotificationDrawer({
  notifications,
  onClose,
  onSelect,
  onMarkAllRead,
}: NotificationDrawerProps) {
  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className="notification-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
      >
        <div className="drawer-header">
          <h2 id="notifications-title">Notifications</h2>
          <button className="btn btn-outline-dark btn-sm" onClick={onMarkAllRead}>
            Mark all read
          </button>
          <button className="drawer-close" aria-label="Close notifications" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="notification-list">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className={`notification-item ${notification.readAt ? 'read' : ''}`}
              onClick={() => onSelect(notification)}
            >
              <span className="unread-dot" />
              <span>
                <strong>{notification.title}</strong>
                <span>{notification.detail}</span>
                <small className={`text-${notification.tone}`}>
                  {notification.createdAt} • {notification.statusText}
                </small>
              </span>
            </button>
          ))}
        </div>
        <p className="drawer-footer">
          Selecting a notification opens the related server and preserves the originating action
          context.
        </p>
      </aside>
    </div>
  );
}

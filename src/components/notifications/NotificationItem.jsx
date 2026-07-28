import React from 'react';
import checkIcon from '@/assets/icons/check.svg';
import packageIcon from '@/assets/icons/package.svg';

const formatTimestamp = (ts) => {
  if (!ts) return '';
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const NotificationItem = ({ notification, onMarkRead }) => {
  const { id, message, created_at, is_read, type } = notification;

  const handleMarkRead = () => {
    if (!is_read && onMarkRead) {
      onMarkRead(id);
    }
  };

  return (
    <li
      className={`notification-item${is_read ? ' notification-item--read' : ' notification-item--unread'}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border, #e2e8f0)',
        backgroundColor: is_read
          ? 'var(--color-surface, #fff)'
          : 'var(--color-surface-highlight, #ebf8ff)',
        transition: 'background-color 0.2s',
      }}
    >
      <div
        className="notification-item__icon"
        aria-hidden="true"
        style={{
          flexShrink: '0',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: is_read
            ? 'var(--color-neutral-100, #f7fafc)'
            : 'var(--color-primary-light, #bee3f8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={packageIcon}
          alt=""
          style={{ width: '18px', height: '18px', opacity: is_read ? 0.5 : 1 }}
        />
      </div>

      <div className="notification-item__body" style={{ flex: '1', minWidth: '0' }}>
        <p
          className="notification-item__message"
          style={{
            margin: '0 0 4px 0',
            fontSize: '14px',
            lineHeight: '1.5',
            color: is_read
              ? 'var(--color-text-secondary, #4a5568)'
              : 'var(--color-text-primary, #1a202c)',
            fontWeight: is_read ? '400' : '500',
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
        <time
          className="notification-item__timestamp"
          dateTime={created_at}
          style={{
            fontSize: '12px',
            color: 'var(--color-text-muted, #718096)',
          }}
        >
          {formatTimestamp(created_at)}
        </time>
      </div>

      {!is_read && (
        <button
          className="notification-item__mark-read"
          onClick={handleMarkRead}
          aria-label="Mark notification as read"
          title="Mark as read"
          style={{
            flexShrink: '0',
            background: 'none',
            border: '1px solid var(--color-primary, #3182ce)',
            borderRadius: '4px',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary, #3182ce)',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-light, #bee3f8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <img
            src={checkIcon}
            alt=""
            aria-hidden="true"
            style={{ width: '14px', height: '14px' }}
          />
        </button>
      )}
    </li>
  );
};

export default NotificationItem;

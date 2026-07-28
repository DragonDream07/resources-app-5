import React from 'react';
import { Link } from 'react-router-dom';
import chevronRightSrc from '@/assets/icons/chevron-right.svg';

/**
 * Breadcrumb component.
 *
 * Props:
 *   items: Array<{ label: string, to?: string }>
 *   The last item is treated as the current (active) crumb and is not linked even if `to` is provided.
 */
function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.25rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: '0.8125rem',
          color: '#6b7280',
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.to || item.label}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {index > 0 && (
                <img
                  src={chevronRightSrc}
                  alt=""
                  aria-hidden="true"
                  style={{ width: '14px', height: '14px', opacity: 0.4 }}
                />
              )}
              {isLast || !item.to ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{
                    color: isLast ? '#111827' : '#6b7280',
                    fontWeight: isLast ? 500 : 400,
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  style={{
                    color: '#2563eb',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;

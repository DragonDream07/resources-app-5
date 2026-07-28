import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';
import menuIconSrc from '@/assets/icons/menu.svg';
import closeIconSrc from '@/assets/icons/close.svg';
import packageIconSrc from '@/assets/icons/package.svg';
import userIconSrc from '@/assets/icons/user.svg';
import chevronDownSrc from '@/assets/icons/chevron-down.svg';

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    end: true,
  },
  {
    label: 'Reports',
    to: '/admin/reports',
  },
  {
    label: 'Orders',
    to: '/admin/orders',
  },
  {
    label: 'Returns',
    to: '/admin/returns',
  },
  {
    label: 'Catalogue',
    children: [
      { label: 'Products', to: '/admin/catalogue/products' },
      { label: 'Categories', to: '/admin/catalogue/categories' },
      { label: 'Brands', to: '/admin/catalogue/brands' },
    ],
  },
  {
    label: 'Promotions',
    to: '/admin/promotions',
  },
  {
    label: 'Users',
    to: '/admin/users',
  },
];

function SidebarGroup({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <li style={{ listStyle: 'none' }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0.625rem 1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#d1d5db',
          fontSize: '0.875rem',
          fontWeight: 500,
          borderRadius: '6px',
          textAlign: 'left',
        }}
        aria-expanded={open}
      >
        <span>{item.label}</span>
        <img
          src={chevronDownSrc}
          alt=""
          style={{
            width: '16px',
            height: '16px',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            opacity: 0.6,
          }}
        />
      </button>
      {open && (
        <ul style={{ listStyle: 'none', margin: 0, padding: '0 0 0 1rem' }}>
          {item.children.map((child) => (
            <li key={child.to} style={{ listStyle: 'none' }}>
              <NavLink
                to={child.to}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'background-color 0.15s, color 0.15s',
                })}
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      style={{
        width: collapsed ? '64px' : '240px',
        backgroundColor: '#1f2937',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
        flexShrink: 0,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '1rem',
          borderBottom: '1px solid #374151',
          height: '64px',
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <NavLink to="/admin" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoSrc} alt="Admin" style={{ height: '28px' }} />
          </NavLink>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={collapsed ? menuIconSrc : closeIconSrc}
            alt=""
            style={{ width: '20px', height: '20px', filter: 'invert(1)', opacity: 0.7 }}
          />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.5rem' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) =>
            item.children ? (
              !collapsed && <SidebarGroup key={item.label} item={item} />
            ) : (
              <li key={item.to} style={{ listStyle: 'none' }}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  title={collapsed ? item.label : undefined}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: collapsed ? '0.625rem' : '0.625rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    color: isActive ? '#ffffff' : '#9ca3af',
                    backgroundColor: isActive ? '#2563eb' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: isActive ? 600 : 400,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    transition: 'background-color 0.15s, color 0.15s',
                  })}
                >
                  {!collapsed && <span>{item.label}</span>}
                  {collapsed && <span style={{ fontSize: '0.625rem', color: '#9ca3af' }}>{item.label.slice(0, 2)}</span>}
                </NavLink>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '0.75rem',
          borderTop: '1px solid #374151',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/logout')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9ca3af',
            fontSize: '0.8125rem',
            padding: '0.5rem',
            borderRadius: '6px',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <img src={userIconSrc} alt="" style={{ width: '18px', height: '18px', filter: 'invert(1)', opacity: 0.5 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;

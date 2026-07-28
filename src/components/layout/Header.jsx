import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logoSrc from '@/assets/images/logo.svg';
import searchIconSrc from '@/assets/icons/search.svg';
import cartIconSrc from '@/assets/icons/cart.svg';
import userIconSrc from '@/assets/icons/user.svg';
import bellIconSrc from '@/assets/icons/bell.svg';
import chevronDownSrc from '@/assets/icons/chevron-down.svg';
import menuIconSrc from '@/assets/icons/menu.svg';
import closeIconSrc from '@/assets/icons/close.svg';

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const cartItemCount = useSelector((state) => state.cart?.items?.length ?? 0);
  const notificationCount = useSelector((state) =>
    state.notifications?.items?.filter((n) => !n.read).length ?? 0
  );
  const isAuthenticated = useSelector((state) => !!state.auth?.user);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery('');
    }
  }

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          height: '64px',
          gap: '1rem',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <img src={logoSrc} alt="Logo" style={{ height: '36px' }} />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '0 0.75rem',
            maxWidth: '600px',
          }}
        >
          <img src={searchIconSrc} alt="Search" style={{ width: '18px', height: '18px', marginRight: '0.5rem', opacity: 0.5 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.875rem',
              padding: '0.5rem 0',
              color: '#111827',
            }}
          />
        </form>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          {/* Notification Bell */}
          {isAuthenticated && (
            <Link
              to="/account/notifications"
              aria-label="Notifications"
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <img src={bellIconSrc} alt="Notifications" style={{ width: '24px', height: '24px' }} />
              {notificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 2px',
                  }}
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            aria-label="Cart"
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            <img src={cartIconSrc} alt="Cart" style={{ width: '24px', height: '24px' }} />
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 2px',
                }}
              >
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Link>

          {/* Account Menu */}
          {isAuthenticated ? (
            <div ref={accountMenuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                aria-expanded={accountMenuOpen}
                aria-label="Account menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '4px',
                }}
              >
                <img src={userIconSrc} alt="Account" style={{ width: '24px', height: '24px' }} />
                <span style={{ fontSize: '0.875rem', color: '#374151', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.firstName || 'Account'}
                </span>
                <img src={chevronDownSrc} alt="" style={{ width: '16px', height: '16px', opacity: 0.5 }} />
              </button>
              {accountMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                    minWidth: '180px',
                    zIndex: 200,
                    overflow: 'hidden',
                  }}
                >
                  <Link to="/account" style={dropdownItemStyle} onClick={() => setAccountMenuOpen(false)}>My Account</Link>
                  <Link to="/account/orders" style={dropdownItemStyle} onClick={() => setAccountMenuOpen(false)}>Orders</Link>
                  <Link to="/account/addresses" style={dropdownItemStyle} onClick={() => setAccountMenuOpen(false)}>Addresses</Link>
                  <Link to="/account/notifications" style={dropdownItemStyle} onClick={() => setAccountMenuOpen(false)}>Notifications</Link>
                  <hr style={{ margin: '4px 0', borderColor: '#e5e7eb' }} />
                  <button
                    type="button"
                    onClick={() => { setAccountMenuOpen(false); navigate('/logout'); }}
                    style={{ ...dropdownItemStyle, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.875rem',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <img src={userIconSrc} alt="" style={{ width: '20px', height: '20px' }} />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

const dropdownItemStyle = {
  display: 'block',
  padding: '0.625rem 1rem',
  fontSize: '0.875rem',
  color: '#374151',
  textDecoration: 'none',
  transition: 'background-color 0.15s',
};

export default Header;

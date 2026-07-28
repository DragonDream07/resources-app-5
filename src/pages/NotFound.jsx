import { Link } from 'react-router-dom';
import emptyState from '@/assets/images/empty-state.svg';
import logo from '@/assets/images/logo.svg';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Minimal header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e9ecef',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <img src={logo} alt="ShopMini" style={{ height: 32 }} />
          <span
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#4c6ef5',
              letterSpacing: '-0.02em',
            }}
          >
            ShopMini
          </span>
        </Link>
      </header>

      {/* 404 content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <img
          src={emptyState}
          alt="Page not found"
          style={{
            width: '100%',
            maxWidth: '280px',
            marginBottom: '32px',
            opacity: 0.85,
          }}
        />

        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#868e96',
            marginBottom: '12px',
            display: 'block',
          }}
        >
          Error 404
        </span>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '40px',
            letterSpacing: '-0.02em',
            color: '#212529',
            margin: '0 0 16px',
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            fontSize: '16px',
            lineHeight: '24px',
            color: '#495057',
            margin: '0 0 32px',
            maxWidth: '420px',
          }}
        >
          Sorry, the page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Let&apos;s get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44px',
              padding: '0 24px',
              backgroundColor: '#4c6ef5',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '10px',
              textDecoration: 'none',
              minWidth: '160px',
            }}
          >
            Go to Home
          </Link>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44px',
              padding: '0 24px',
              backgroundColor: 'transparent',
              color: '#4c6ef5',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '10px',
              border: '1px solid #4c6ef5',
              textDecoration: 'none',
              minWidth: '160px',
            }}
          >
            Browse Products
          </Link>
        </div>

        <nav
          aria-label="Helpful links"
          style={{
            marginTop: '40px',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { label: 'Home', to: '/' },
            { label: 'All Products', to: '/products' },
            { label: 'My Orders', to: '/orders' },
            { label: 'Account', to: '/account' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontSize: '14px',
                color: '#4c6ef5',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e9ecef',
          padding: '20px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '12px', color: '#868e96', margin: 0 }}>
          &copy; ShopMini. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

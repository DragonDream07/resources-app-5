import React from 'react';
import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/products' },
      { label: 'Categories', to: '/categories' },
      { label: 'New Arrivals', to: '/products?sort=newest' },
      { label: 'Best Sellers', to: '/products?sort=popular' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Account', to: '/account' },
      { label: 'Orders', to: '/account/orders' },
      { label: 'Addresses', to: '/account/addresses' },
      { label: 'Notifications', to: '/account/notifications' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Returns Policy', to: '/returns-policy' },
      { label: 'Shipping Info', to: '/shipping' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Sitemap', to: '/sitemap' },
    ],
  },
];

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#111827',
        color: '#d1d5db',
        paddingTop: '3rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '1rem',
                  marginTop: 0,
                }}
              >
                {section.title}
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      style={{
                        color: '#9ca3af',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr style={{ borderColor: '#374151', borderWidth: '1px 0 0 0', marginBottom: '1.5rem' }} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280' }}>
            &copy; {new Date().getFullYear()} ShopApp. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/privacy" style={{ color: '#6b7280', fontSize: '0.8125rem', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/terms" style={{ color: '#6b7280', fontSize: '0.8125rem', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import heartIcon from '@/assets/icons/heart.svg';
import starIcon from '@/assets/icons/star.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

const categories = [
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'home-living', label: 'Home & Living', emoji: '🏠' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'books', label: 'Books', emoji: '📚' },
];

const featuredProducts = [
  { id: '1', name: 'Wireless Headphones', price: 1299, originalPrice: 2499, rating: 4.5, reviews: 128 },
  { id: '2', name: 'Running Shoes', price: 1899, originalPrice: 3499, rating: 4.3, reviews: 95 },
  { id: '3', name: 'Smart Watch', price: 4999, originalPrice: 8999, rating: 4.7, reviews: 210 },
  { id: '4', name: 'Linen Kurta Set', price: 799, originalPrice: 1499, rating: 4.1, reviews: 63 },
];

function StarRating({ rating }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        fontSize: '12px',
        color: '#fd7e14',
        fontWeight: 600,
      }}
    >
      <img src={starIcon} alt="star" style={{ width: 12, height: 12 }} />
      {rating}
    </span>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      {/* Navbar */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #868e96',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            height: '60px',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0,
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

          {/* Search bar */}
          <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
            <img
              src={searchIcon}
              alt="search"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 18,
                height: 18,
                opacity: 0.5,
              }}
            />
            <input
              type="search"
              placeholder="Search products, brands…"
              aria-label="Search products"
              onClick={() => navigate('/search')}
              readOnly
              style={{
                width: '100%',
                height: '44px',
                paddingLeft: '40px',
                paddingRight: '12px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#f8f9fa',
                cursor: 'text',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/account"
              aria-label="Account"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: '6px',
                color: '#495057',
                textDecoration: 'none',
              }}
            >
              <img src={cartIcon} alt="Cart" style={{ width: 22, height: 22 }} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #4c6ef5 0%, #3b5bdb 100%)',
          color: '#ffffff',
          padding: '64px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '20px',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '4px 10px',
              borderRadius: '9999px',
            }}
          >
            Limited Time Offer
          </span>
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              margin: 0,
              maxWidth: '600px',
            }}
          >
            Up to 60% off on electronics, fashion &amp; home essentials
          </h1>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.5,
              margin: 0,
              opacity: 0.85,
              maxWidth: '480px',
            }}
          >
            Discover thousands of products at unbeatable prices. Free delivery on orders above ₹499.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '44px',
                padding: '0 24px',
                backgroundColor: '#ffffff',
                color: '#4c6ef5',
                fontWeight: 600,
                fontSize: '16px',
                borderRadius: '10px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Shop Now
              <img src={chevronRightIcon} alt="" style={{ width: 16, height: 16 }} />
            </Link>
            <Link
              to="/categories/home-living"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '44px',
                padding: '0 20px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                borderRadius: '9999px',
                border: '2px solid rgba(255,255,255,0.6)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              🏠 Home &amp; Living
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: '32px',
              marginBottom: '24px',
              color: '#212529',
            }}
          >
            Shop by Category
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '16px',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '24px 16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef',
                  textDecoration: 'none',
                  color: '#212529',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'box-shadow 0.15s',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                <span style={{ fontSize: '28px' }}>{cat.emoji}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '16px 24px 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                lineHeight: '32px',
                margin: 0,
                color: '#212529',
              }}
            >
              Featured Products
            </h2>
            <Link
              to="/products"
              style={{
                fontSize: '14px',
                color: '#4c6ef5',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View all
              <img src={chevronRightIcon} alt="" style={{ width: 14, height: 14 }} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {featuredProducts.map((product) => {
              const discountPct = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );
              return (
                <article
                  key={product.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      backgroundColor: '#f8f9fa',
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={placeholderProduct}
                      alt={product.name}
                      style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                    />
                    {discountPct > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: '#f03e3e',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '3px',
                        }}
                      >
                        -{discountPct}%
                      </span>
                    )}
                    <button
                      aria-label={`Wishlist ${product.name}`}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '9999px',
                        border: '1px solid #e9ecef',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <img src={heartIcon} alt="" style={{ width: 16, height: 16 }} />
                    </button>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <Link
                      to={`/products/${product.id}`}
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#212529',
                        textDecoration: 'none',
                        lineHeight: '24px',
                      }}
                    >
                      {product.name}
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <StarRating rating={product.rating} />
                      <span style={{ fontSize: '12px', color: '#495057' }}>({product.reviews})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                      <span style={{ fontSize: '20px', fontWeight: 700, color: '#212529' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#868e96',
                          textDecoration: 'line-through',
                        }}
                      >
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      style={{
                        marginTop: '8px',
                        height: '44px',
                        width: '100%',
                        backgroundColor: '#4c6ef5',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '14px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <img
                        src={cartIcon}
                        alt=""
                        style={{ width: 16, height: 16, filter: 'brightness(10)' }}
                      />
                      Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section
        style={{
          backgroundColor: '#fff3e6',
          borderTop: '1px solid #ffe8cc',
          borderBottom: '1px solid #ffe8cc',
          padding: '40px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 600,
                margin: '0 0 8px',
                color: '#212529',
              }}
            >
              Get extra 10% off with code
            </h3>
            <code
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                fontSize: '20px',
                fontWeight: 700,
                color: '#fd7e14',
                backgroundColor: '#ffffff',
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px dashed #fd7e14',
                letterSpacing: '0.06em',
              }}
            >
              SAVE10
            </code>
          </div>
          <Link
            to="/products"
            style={{
              height: '44px',
              padding: '0 24px',
              backgroundColor: '#fd7e14',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            Shop &amp; Save
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e9ecef',
          padding: '32px 24px',
          marginTop: '0',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
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
          <nav style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
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
          <p style={{ fontSize: '12px', color: '#868e96', margin: 0 }}>
            &copy; ShopMini. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

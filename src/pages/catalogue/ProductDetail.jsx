import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import cartIcon from '@/assets/icons/cart.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import starIcon from '@/assets/icons/star.svg';

const API_BASE = '/api';

const tokens = {
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorSecondary: '#fd7e14',
  colorSecondarySubtle: '#fff3e6',
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorError: '#f03e3e',
  colorErrorSubtle: '#ffe3e3',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
  fontSans: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  radiusMd: '10px',
  radiusSm: '6px',
  radiusXs: '3px',
  radiusFull: '9999px',
};

const styles = {
  page: {
    background: tokens.colorCanvas,
    minHeight: '100vh',
    fontFamily: tokens.fontSans,
    color: tokens.colorBody,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  breadcrumb: {
    fontSize: '14px',
    color: tokens.colorMuted,
    marginBottom: '24px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    color: tokens.colorPrimary,
    textDecoration: 'none',
    fontWeight: '500',
  },
  productLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'flex-start',
  },
  galleryWrap: {
    position: 'sticky',
    top: '24px',
  },
  mainImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: tokens.radiusMd,
    border: `1px solid ${tokens.colorBorder}`,
    background: tokens.colorDisabledBg,
    display: 'block',
    cursor: 'zoom-in',
  },
  thumbRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  thumb: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: tokens.radiusSm,
    border: `2px solid transparent`,
    cursor: 'pointer',
    background: tokens.colorDisabledBg,
  },
  thumbActive: {
    borderColor: tokens.colorPrimary,
  },
  infoPannel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  brandLink: {
    fontSize: '14px',
    color: tokens.colorPrimary,
    textDecoration: 'none',
    fontWeight: '500',
  },
  productName: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
    margin: 0,
  },
  skuCode: {
    fontSize: '14px',
    fontFamily: tokens.fontMono,
    color: tokens.colorMuted,
    letterSpacing: '0em',
  },
  priceBlock: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  price: {
    fontSize: '28px',
    fontWeight: '700',
    color: tokens.colorInk,
    letterSpacing: '-0.01em',
  },
  priceNote: {
    fontSize: '13px',
    color: tokens.colorMuted,
  },
  priceMrp: {
    fontSize: '16px',
    color: tokens.colorMuted,
    textDecoration: 'line-through',
  },
  discountBadge: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorSuccess,
    background: tokens.colorSuccessSubtle,
    borderRadius: tokens.radiusXs,
    padding: '2px 8px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    marginBottom: '8px',
    display: 'block',
  },
  variantGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  variantBtn: {
    padding: '8px 16px',
    border: `1.5px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusSm,
    background: tokens.colorSurface,
    fontSize: '14px',
    fontFamily: tokens.fontSans,
    color: tokens.colorBody,
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'border-color 0.1s, background 0.1s',
  },
  variantBtnActive: {
    borderColor: tokens.colorPrimary,
    background: tokens.colorPrimarySubtle,
    color: tokens.colorPrimary,
    fontWeight: '600',
  },
  variantBtnOos: {
    opacity: 0.5,
    cursor: 'not-allowed',
    textDecoration: 'line-through',
  },
  colorSwatch: {
    width: '32px',
    height: '32px',
    borderRadius: tokens.radiusFull,
    border: `2px solid transparent`,
    cursor: 'pointer',
    outline: 'none',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchActive: {
    borderColor: tokens.colorPrimary,
    boxShadow: `0 0 0 2px ${tokens.colorPrimary}`,
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusSm,
    overflow: 'hidden',
    width: 'fit-content',
  },
  qtyBtn: {
    width: '44px',
    height: '44px',
    border: 'none',
    background: tokens.colorSurface,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: tokens.colorBody,
  },
  qtyVal: {
    width: '48px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: tokens.colorInk,
    border: 'none',
    borderLeft: `1px solid ${tokens.colorBorder}`,
    borderRight: `1px solid ${tokens.colorBorder}`,
    padding: '0',
    height: '44px',
    lineHeight: '44px',
    fontFamily: tokens.fontSans,
  },
  addToCartBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 32px',
    background: tokens.colorPrimary,
    color: '#fff',
    border: 'none',
    borderRadius: tokens.radiusMd,
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: tokens.fontSans,
    cursor: 'pointer',
    minHeight: '44px',
    width: '100%',
    transition: 'background 0.15s',
  },
  addToCartBtnDisabled: {
    background: tokens.colorDisabledBg,
    color: tokens.colorDisabledText,
    cursor: 'not-allowed',
  },
  stockBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: tokens.radiusXs,
  },
  inStockBadge: {
    background: tokens.colorSuccessSubtle,
    color: tokens.colorSuccess,
  },
  oosStockBadge: {
    background: tokens.colorDisabledBg,
    color: tokens.colorDisabledText,
  },
  cartFeedback: {
    padding: '12px 16px',
    borderRadius: tokens.radiusSm,
    fontSize: '14px',
    fontWeight: '500',
  },
  cartFeedbackSuccess: {
    background: tokens.colorSuccessSubtle,
    color: tokens.colorSuccess,
  },
  cartFeedbackError: {
    background: tokens.colorErrorSubtle,
    color: tokens.colorError,
  },
  divider: {
    border: 'none',
    borderTop: `1px solid ${tokens.colorBorder}`,
    margin: '0',
  },
  descSection: {
    marginTop: '40px',
  },
  tabRow: {
    display: 'flex',
    gap: '0',
    borderBottom: `2px solid ${tokens.colorBorder}`,
    marginBottom: '24px',
  },
  tab: {
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: '500',
    color: tokens.colorMuted,
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    cursor: 'pointer',
    fontFamily: tokens.fontSans,
    transition: 'color 0.1s',
  },
  tabActive: {
    color: tokens.colorPrimary,
    borderBottomColor: tokens.colorPrimary,
    fontWeight: '600',
  },
  tabContent: {
    fontSize: '16px',
    lineHeight: '1.625',
    color: tokens.colorBody,
    maxWidth: '72ch',
  },
  specTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  specTh: {
    textAlign: 'left',
    padding: '10px 12px',
    fontWeight: '600',
    background: tokens.colorDisabledBg,
    color: tokens.colorMuted,
    borderBottom: `1px solid ${tokens.colorBorder}`,
    width: '35%',
  },
  specTd: {
    padding: '10px 12px',
    borderBottom: `1px solid ${tokens.colorBorder}`,
    color: tokens.colorBody,
  },
  loadingText: {
    color: tokens.colorMuted,
    fontSize: '16px',
    padding: '80px 0',
    textAlign: 'center',
  },
  errorText: {
    color: tokens.colorError,
    fontSize: '14px',
    padding: '16px',
    background: '#ffe3e3',
    borderRadius: tokens.radiusSm,
    margin: '40px 0',
  },
};

function formatPrice(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
}

function getCartId() {
  return localStorage.getItem('cartId');
}

function setCartId(id) {
  localStorage.setItem('cartId', id);
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState(null);
  const [cartMsgType, setCartMsgType] = useState('success');
  const [activeTab, setActiveTab] = useState('description');

  // Group skus by attribute type (e.g. size, color)
  const variantAttributes = (() => {
    const attrMap = {};
    skus.forEach(sku => {
      if (!sku.attributes) return;
      Object.entries(sku.attributes).forEach(([key, val]) => {
        if (!attrMap[key]) attrMap[key] = new Set();
        attrMap[key].add(val);
      });
    });
    return Object.fromEntries(Object.entries(attrMap).map(([k, v]) => [k, Array.from(v)]));
  })();

  const [selectedAttrs, setSelectedAttrs] = useState({});

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Resolve slug to productId via listing
        const listRes = await fetch(`${API_BASE}/products?slug=${encodeURIComponent(slug)}&limit=1`);
        let productId = null;
        let foundProduct = null;
        if (listRes.ok) {
          const listData = await listRes.json();
          const prods = listData.data || listData.products || [];
          const match = prods.find(p => p.slug === slug);
          if (match) {
            productId = match.id;
            foundProduct = match;
          }
        }
        if (!productId) {
          // Try direct fetch by slug as id fallback
          const directRes = await fetch(`${API_BASE}/products/${slug}`);
          if (directRes.ok) {
            const data = await directRes.json();
            foundProduct = data.data || data.product || data;
            productId = foundProduct?.id;
          }
        }
        if (productId) {
          const prodRes = await fetch(`${API_BASE}/products/${productId}`);
          if (!prodRes.ok) throw new Error(`Product not found (${prodRes.status})`);
          const prodData = await prodRes.json();
          const prod = prodData.data || prodData.product || prodData;
          setProduct(prod);

          // Load SKUs
          const skuRes = await fetch(`${API_BASE}/products/${productId}/skus`);
          if (skuRes.ok) {
            const skuData = await skuRes.json();
            const loadedSkus = skuData.data || skuData.skus || [];
            setSkus(loadedSkus);
            if (loadedSkus.length > 0) {
              setSelectedSku(loadedSkus[0]);
              const initialAttrs = {};
              if (loadedSkus[0].attributes) {
                Object.entries(loadedSkus[0].attributes).forEach(([k, v]) => { initialAttrs[k] = v; });
              }
              setSelectedAttrs(initialAttrs);
            }
          }
        } else {
          throw new Error('Product not found.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  // When selected attributes change, find matching SKU
  useEffect(() => {
    if (skus.length === 0) return;
    const match = skus.find(sku => {
      if (!sku.attributes) return Object.keys(selectedAttrs).length === 0;
      return Object.entries(selectedAttrs).every(([k, v]) => sku.attributes[k] === v);
    });
    if (match) setSelectedSku(match);
  }, [selectedAttrs, skus]);

  const images = product?.images || [];
  const displayImages = images.length > 0 ? images : [{ url: placeholderProduct, alt: product?.name || '' }];

  const effectiveSku = selectedSku || skus[0] || null;
  const currentPrice = effectiveSku?.price ?? product?.min_price ?? product?.price ?? 0;
  const mrpPrice = effectiveSku?.mrp ?? effectiveSku?.compare_price ?? null;
  const discount = mrpPrice && mrpPrice > currentPrice
    ? Math.round((1 - currentPrice / mrpPrice) * 100)
    : 0;
  const inStock = effectiveSku ? effectiveSku.stock > 0 : (product?.in_stock !== false);
  const maxQty = effectiveSku?.stock ?? 99;

  const handleAttrSelect = (attrKey, value) => {
    setSelectedAttrs(prev => ({ ...prev, [attrKey]: value }));
  };

  const isSkuAvailable = (attrKey, value) => {
    return skus.some(sku => sku.attributes?.[attrKey] === value && sku.stock > 0);
  };

  const handleAddToCart = async () => {
    if (!inStock || !effectiveSku) return;
    setCartLoading(true);
    setCartMsg(null);
    try {
      let cartId = getCartId();
      if (!cartId) {
        // Create a cart first via guest session
        const createRes = await fetch(`${API_BASE}/carts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
        if (createRes.ok) {
          const cartData = await createRes.json();
          cartId = cartData.data?.id || cartData.id;
          if (cartId) setCartId(cartId);
        }
      }
      if (!cartId) throw new Error('Unable to create cart session.');
      const res = await fetch(`${API_BASE}/carts/${cartId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku_id: effectiveSku.id, quantity }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to add to cart (${res.status})`);
      }
      setCartMsg('Item added to cart successfully!');
      setCartMsgType('success');
    } catch (err) {
      setCartMsg(err.message);
      setCartMsgType('error');
    } finally {
      setCartLoading(false);
      setTimeout(() => setCartMsg(null), 4000);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingText}>Loading product…</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorText}>{error || 'Product not found.'}</div>
          <Link to="/products" style={{ color: tokens.colorPrimary, fontSize: '14px' }}>
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'shipping', label: 'Shipping & Returns' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" style={styles.breadcrumbLink}>Home</Link>
          <span>/</span>
          <Link to="/products" style={styles.breadcrumbLink}>Products</Link>
          {product.category_name && (
            <>
              <span>/</span>
              <Link
                to={`/categories/${product.category_slug || product.category_id}/products`}
                style={styles.breadcrumbLink}
              >
                {product.category_name}
              </Link>
            </>
          )}
          <span>/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        {/* Product Main Layout */}
        <div style={styles.productLayout}>
          {/* Gallery */}
          <div style={styles.galleryWrap}>
            <img
              src={displayImages[activeImageIdx]?.url || placeholderProduct}
              alt={displayImages[activeImageIdx]?.alt || product.name}
              style={styles.mainImage}
              onError={e => { e.target.src = placeholderProduct; }}
            />
            {displayImages.length > 1 && (
              <div style={styles.thumbRow}>
                {displayImages.map((img, i) => (
                  <img
                    key={i}
                    src={img.url || placeholderProduct}
                    alt={img.alt || `${product.name} view ${i + 1}`}
                    style={{
                      ...styles.thumb,
                      ...(i === activeImageIdx ? styles.thumbActive : {}),
                    }}
                    onClick={() => setActiveImageIdx(i)}
                    onError={e => { e.target.src = placeholderProduct; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div style={styles.infoPannel}>
            {/* Brand */}
            {product.brand_name && (
              <div>
                <Link
                  to={`/products?brand=${product.brand_id}`}
                  style={styles.brandLink}
                >
                  {product.brand_name}
                </Link>
              </div>
            )}

            {/* Name */}
            <h1 style={styles.productName}>{product.name}</h1>

            {/* SKU code */}
            {effectiveSku?.sku_code && (
              <span style={styles.skuCode}>SKU: {effectiveSku.sku_code}</span>
            )}

            {/* Price */}
            <div style={styles.priceBlock}>
              <span style={styles.price}>{formatPrice(currentPrice)}</span>
              {mrpPrice && mrpPrice > currentPrice && (
                <span style={styles.priceMrp}>{formatPrice(mrpPrice)}</span>
              )}
              {discount > 0 && (
                <span style={styles.discountBadge}>{discount}% off</span>
              )}
            </div>
            <span style={styles.priceNote}>Price inclusive of all taxes</span>

            <hr style={styles.divider} />

            {/* Variant Pickers */}
            {Object.entries(variantAttributes).map(([attrKey, values]) => (
              <div key={attrKey}>
                <span style={styles.sectionLabel}>
                  {attrKey}: {selectedAttrs[attrKey] || ''}
                </span>
                {attrKey.toLowerCase() === 'color' ? (
                  <div style={styles.variantGroup}>
                    {values.map(val => {
                      const available = isSkuAvailable(attrKey, val);
                      const active = selectedAttrs[attrKey] === val;
                      return (
                        <button
                          key={val}
                          title={val}
                          aria-label={`Color: ${val}`}
                          aria-pressed={active}
                          style={{
                            ...styles.colorSwatch,
                            backgroundColor: val,
                            ...(active ? styles.colorSwatchActive : {}),
                            ...(available ? {} : { opacity: 0.35 }),
                          }}
                          onClick={() => available && handleAttrSelect(attrKey, val)}
                          disabled={!available}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div style={styles.variantGroup}>
                    {values.map(val => {
                      const available = isSkuAvailable(attrKey, val);
                      const active = selectedAttrs[attrKey] === val;
                      return (
                        <button
                          key={val}
                          aria-pressed={active}
                          style={{
                            ...styles.variantBtn,
                            ...(active ? styles.variantBtnActive : {}),
                            ...(!available ? styles.variantBtnOos : {}),
                          }}
                          onClick={() => available && handleAttrSelect(attrKey, val)}
                          disabled={!available}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Stock status */}
            <div>
              <span
                style={{
                  ...styles.stockBadge,
                  ...(inStock ? styles.inStockBadge : styles.oosStockBadge),
                }}
              >
                {inStock ? '● In Stock' : '● Out of Stock'}
              </span>
            </div>

            {/* Quantity picker */}
            {inStock && (
              <div>
                <span style={styles.sectionLabel}>Quantity</span>
                <div style={styles.qtyRow}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    <img src={minusIcon} alt="" width="16" height="16" />
                  </button>
                  <span style={styles.qtyVal} aria-live="polite">{quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                    aria-label="Increase quantity"
                    disabled={quantity >= maxQty}
                  >
                    <img src={plusIcon} alt="" width="16" height="16" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              style={{
                ...styles.addToCartBtn,
                ...(!inStock || cartLoading ? styles.addToCartBtnDisabled : {}),
              }}
              onClick={handleAddToCart}
              disabled={!inStock || cartLoading}
              onMouseEnter={e => {
                if (inStock && !cartLoading) e.currentTarget.style.background = tokens.colorPrimaryDark;
              }}
              onMouseLeave={e => {
                if (inStock && !cartLoading) e.currentTarget.style.background = tokens.colorPrimary;
              }}
            >
              <img src={cartIcon} alt="" width="20" height="20" style={{ filter: 'invert(1)' }} />
              {cartLoading ? 'Adding…' : inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Cart feedback */}
            {cartMsg && (
              <div
                style={{
                  ...styles.cartFeedback,
                  ...(cartMsgType === 'success' ? styles.cartFeedbackSuccess : styles.cartFeedbackError),
                }}
                role="status"
                aria-live="polite"
              >
                {cartMsg}
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Description / Specifications / Shipping */}
        <div style={styles.descSection}>
          <div style={styles.tabRow} role="tablist">
            {tabs.map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={activeTab === t.key}
                style={{
                  ...styles.tab,
                  ...(activeTab === t.key ? styles.tabActive : {}),
                }}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div role="tabpanel">
            {activeTab === 'description' && (
              <div style={styles.tabContent}>
                {product.description
                  ? <p>{product.description}</p>
                  : <p style={{ color: tokens.colorMuted }}>No description available for this product.</p>
                }
              </div>
            )}
            {activeTab === 'specifications' && (
              <div style={styles.tabContent}>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table style={styles.specTable}>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key}>
                          <th style={styles.specTh}>{key}</th>
                          <td style={styles.specTd}>{String(val)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: tokens.colorMuted }}>No specifications available.</p>
                )}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div style={styles.tabContent}>
                <p>Free shipping on orders above ₹499. Standard delivery in 3–7 business days. Easy returns within 30 days of delivery.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

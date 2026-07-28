import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cartIcon from '@/assets/icons/cart.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyStateImg from '@/assets/images/empty-state.svg';

const API_BASE = import.meta.env.VITE_API_URL || '';

function getCartId() {
  return localStorage.getItem('cartId') || null;
}

async function fetchCart(cartId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/carts/${cartId}`, { headers });
  if (!res.ok) throw new Error('Failed to load cart');
  return res.json();
}

async function updateCartItem(cartId, itemId, quantity) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/carts/${cartId}/items/${itemId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
}

async function deleteCartItem(cartId, itemId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/carts/${cartId}/items/${itemId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to remove item');
  return res.ok;
}

async function applyPromoCode(cartId, code) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/carts/${cartId}/promo`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid promo code');
  }
  return res.json();
}

function Toast({ toasts }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          style={{
            background: t.type === 'error' ? '#f03e3e' : t.type === 'success' ? '#37b24d' : '#343a40',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 500,
            boxShadow: '0 4px 16px rgba(33,37,41,0.18)',
            maxWidth: '340px',
            pointerEvents: 'auto',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        padding: '20px',
        background: '#ffffff',
        borderRadius: '10px',
        marginBottom: '12px',
        boxShadow: '0 1px 4px rgba(33,37,41,0.07)',
      }}
    >
      <div
        style={{
          width: '88px',
          height: '88px',
          borderRadius: '6px',
          background: '#e9ecef',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ height: '16px', borderRadius: '4px', background: '#e9ecef', width: '60%' }} />
        <div style={{ height: '14px', borderRadius: '4px', background: '#e9ecef', width: '40%' }} />
        <div style={{ height: '14px', borderRadius: '4px', background: '#e9ecef', width: '25%' }} />
      </div>
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        padding: '24px',
        boxShadow: '0 1px 4px rgba(33,37,41,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {[80, 60, 50, 70].map((w, i) => (
        <div
          key={i}
          style={{ height: '16px', borderRadius: '4px', background: '#e9ecef', width: `${w}%` }}
        />
      ))}
    </div>
  );
}

function QuantityControl({ value, onIncrease, onDecrease, disabled }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #868e96',
        borderRadius: '6px',
        overflow: 'hidden',
        height: '36px',
      }}
    >
      <button
        aria-label="Decrease quantity"
        onClick={onDecrease}
        disabled={disabled || value <= 1}
        style={{
          width: '36px',
          height: '36px',
          border: 'none',
          background: 'transparent',
          cursor: disabled || value <= 1 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: disabled || value <= 1 ? '#adb5bd' : '#212529',
          fontSize: '18px',
          fontWeight: 600,
          padding: 0,
        }}
      >
        <img src={minusIcon} alt="" width={14} height={14} />
      </button>
      <span
        style={{
          minWidth: '36px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          color: '#212529',
          userSelect: 'none',
          padding: '0 4px',
        }}
        aria-live="polite"
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>
      <button
        aria-label="Increase quantity"
        onClick={onIncrease}
        disabled={disabled}
        style={{
          width: '36px',
          height: '36px',
          border: 'none',
          background: 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: disabled ? '#adb5bd' : '#212529',
          fontSize: '18px',
          fontWeight: 600,
          padding: 0,
        }}
      >
        <img src={plusIcon} alt="" width={14} height={14} />
      </button>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | loaded | empty | error
  const [cart, setCart] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [itemLoadingIds, setItemLoadingIds] = useState(new Set());
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState(null); // null | 'applying' | 'success' | 'error'
  const [promoError, setPromoError] = useState('');

  const showToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const loadCart = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId) {
      setStatus('empty');
      return;
    }
    setStatus('loading');
    try {
      const data = await fetchCart(cartId);
      const items = data.items || data.cart?.items || [];
      if (items.length === 0) {
        setStatus('empty');
      } else {
        setCart(data.cart || data);
        setStatus('loaded');
      }
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = useCallback(
    async (itemId, newQty) => {
      const cartId = getCartId();
      if (!cartId) return;
      setItemLoadingIds((prev) => new Set(prev).add(itemId));
      try {
        const data = await updateCartItem(cartId, itemId, newQty);
        setCart(data.cart || data);
      } catch {
        showToast('Could not update item quantity. Please try again.', 'error');
      } finally {
        setItemLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }
    },
    [showToast]
  );

  const handleRemove = useCallback(
    async (itemId) => {
      const cartId = getCartId();
      if (!cartId) return;
      setItemLoadingIds((prev) => new Set(prev).add(itemId));
      try {
        await deleteCartItem(cartId, itemId);
        setCart((prev) => {
          if (!prev) return prev;
          const items = (prev.items || []).filter((i) => i.id !== itemId);
          if (items.length === 0) {
            setStatus('empty');
            return null;
          }
          return { ...prev, items };
        });
        showToast('Item removed from cart', 'success');
      } catch {
        showToast('Could not remove item. Please try again.', 'error');
      } finally {
        setItemLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }
    },
    [showToast]
  );

  const handleApplyPromo = useCallback(
    async (e) => {
      e.preventDefault();
      const cartId = getCartId();
      if (!cartId || !promoCode.trim()) return;
      setPromoStatus('applying');
      setPromoError('');
      try {
        const data = await applyPromoCode(cartId, promoCode.trim());
        setCart(data.cart || data);
        setPromoStatus('success');
        showToast('Promo code applied!', 'success');
      } catch (err) {
        setPromoStatus('error');
        setPromoError(err.message || 'Invalid promo code');
      }
    },
    [promoCode, showToast]
  );

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const subtotal = items.reduce(
    (sum, i) => sum + (i.unit_price || i.price || 0) * (i.quantity || 1),
    0
  );
  const discount = cart?.discount_amount || 0;
  const deliveryFee = cart?.delivery_fee ?? 0;
  const total = cart?.total_amount || Math.max(0, subtotal - discount + deliveryFee);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(
      val
    );

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      padding: '40px 16px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      color: '#212529',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    badge: {
      display: 'inline-block',
      background: '#e8ecfd',
      color: '#3b5bdb',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      padding: '2px 10px',
      verticalAlign: 'middle',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px',
      alignItems: 'flex-start',
    },
    layoutDesktop: {
      gridTemplateColumns: '1fr 360px',
    },
    itemCard: {
      background: '#ffffff',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '12px',
      boxShadow: '0 1px 4px rgba(33,37,41,0.07)',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
    },
    itemImg: {
      width: '88px',
      height: '88px',
      objectFit: 'cover',
      borderRadius: '6px',
      flexShrink: 0,
      border: '1px solid #e9ecef',
      background: '#f8f9fa',
    },
    itemDetails: {
      flex: 1,
      minWidth: 0,
    },
    itemName: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#212529',
      marginBottom: '4px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    itemMeta: {
      fontSize: '14px',
      color: '#495057',
      marginBottom: '12px',
    },
    itemPrice: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#212529',
    },
    itemActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      marginTop: '12px',
    },
    removeBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#f03e3e',
      fontSize: '14px',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '6px',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    summaryCard: {
      background: '#ffffff',
      borderRadius: '10px',
      padding: '24px',
      boxShadow: '0 1px 4px rgba(33,37,41,0.07)',
      position: 'sticky',
      top: '24px',
    },
    summaryTitle: {
      fontSize: '20px',
      fontWeight: 600,
      color: '#212529',
      marginBottom: '20px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      color: '#495057',
      marginBottom: '12px',
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '16px',
      fontWeight: 700,
      color: '#212529',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e9ecef',
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #e9ecef',
      margin: '16px 0',
    },
    promoForm: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
    },
    promoInput: {
      flex: 1,
      height: '44px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      padding: '0 12px',
      fontSize: '14px',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      color: '#212529',
      background: '#ffffff',
      outline: 'none',
    },
    applyBtn: {
      height: '44px',
      padding: '0 16px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      whiteSpace: 'nowrap',
    },
    checkoutBtn: {
      display: 'block',
      width: '100%',
      height: '48px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: '20px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      letterSpacing: '0em',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 16px',
      textAlign: 'center',
    },
    emptyImg: {
      width: '120px',
      height: '120px',
      marginBottom: '24px',
      opacity: 0.7,
    },
    emptyHeading: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#212529',
      marginBottom: '8px',
    },
    emptyBody: {
      fontSize: '16px',
      color: '#495057',
      marginBottom: '28px',
    },
    startShoppingBtn: {
      display: 'inline-block',
      padding: '12px 28px',
      background: '#4c6ef5',
      color: '#ffffff',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 600,
      textDecoration: 'none',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    errorState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 16px',
      textAlign: 'center',
    },
    errorIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    errorHeading: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#212529',
      marginBottom: '8px',
    },
    errorBody: {
      fontSize: '16px',
      color: '#495057',
      marginBottom: '24px',
    },
    refreshBtn: {
      padding: '12px 28px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    discountText: {
      color: '#37b24d',
      fontWeight: 500,
    },
    promoErrorText: {
      fontSize: '12px',
      color: '#f03e3e',
      marginTop: '4px',
    },
    promoSuccessText: {
      fontSize: '12px',
      color: '#37b24d',
      marginTop: '4px',
    },
  };

  // Responsive layout: use CSS grid, switch cols on wider screens
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    function check() {
      setIsWide(window.innerWidth >= 768);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (status === 'loading') {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.pageTitle}>Your cart</h1>
          <div style={{ ...(isWide ? { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'flex-start' } : {}) }}>
            <div>
              {[1, 2, 3].map((n) => (
                <SkeletonRow key={n} />
              ))}
            </div>
            <SkeletonSummary />
          </div>
        </div>
        <Toast toasts={toasts} />
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorState} role="alert">
            <div style={styles.errorIcon} aria-hidden="true">⚠️</div>
            <h1 style={styles.errorHeading}>Couldn't load your cart</h1>
            <p style={styles.errorBody}>Please refresh the page.</p>
            <button style={styles.refreshBtn} onClick={loadCart}>
              Refresh
            </button>
          </div>
        </div>
        <Toast toasts={toasts} />
      </main>
    );
  }

  if (status === 'empty') {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.emptyState}>
            <img src={emptyStateImg} alt="Empty cart" style={styles.emptyImg} />
            <h1 style={styles.emptyHeading}>Your cart is empty</h1>
            <p style={styles.emptyBody}>Looks like you haven't added anything yet.</p>
            <Link to="/products" style={styles.startShoppingBtn}>
              Start shopping
            </Link>
          </div>
        </div>
        <Toast toasts={toasts} />
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>
          Your cart{' '}
          <span style={styles.badge} aria-label={`${itemCount} items`}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </h1>

        <div
          style={{
            ...(isWide
              ? { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'flex-start' }
              : {}),
          }}
        >
          {/* Cart Items Column */}
          <section aria-label="Cart items">
            {items.map((item) => {
              const isLoading = itemLoadingIds.has(item.id);
              const imageUrl = item.image_url || (item.images && item.images[0]?.url) || null;
              return (
                <article
                  key={item.id}
                  style={{
                    ...styles.itemCard,
                    opacity: isLoading ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                  }}
                  aria-label={item.product_name || item.name || 'Cart item'}
                >
                  <img
                    src={imageUrl || placeholderProduct}
                    alt={item.product_name || item.name || 'Product image'}
                    style={styles.itemImg}
                    onError={(e) => {
                      e.currentTarget.src = placeholderProduct;
                    }}
                  />
                  <div style={styles.itemDetails}>
                    <div style={styles.itemName}>
                      {item.product_name || item.name || 'Product'}
                    </div>
                    <div style={styles.itemMeta}>
                      {item.sku_name || item.variant_label || item.sku_code
                        ? `Variant: ${item.sku_name || item.variant_label || item.sku_code}`
                        : null}
                    </div>
                    <div style={styles.itemPrice}>
                      {formatCurrency((item.unit_price || item.price || 0) * (item.quantity || 1))}
                      {(item.unit_price || item.price) ? (
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 400,
                            color: '#495057',
                            marginLeft: '6px',
                          }}
                        >
                          ({formatCurrency(item.unit_price || item.price)} each)
                        </span>
                      ) : null}
                    </div>
                    <div style={styles.itemActions}>
                      <QuantityControl
                        value={item.quantity || 1}
                        disabled={isLoading}
                        onDecrease={() => {
                          if ((item.quantity || 1) > 1) {
                            handleQuantityChange(item.id, (item.quantity || 1) - 1);
                          }
                        }}
                        onIncrease={() => {
                          handleQuantityChange(item.id, (item.quantity || 1) + 1);
                        }}
                      />
                      <button
                        style={styles.removeBtn}
                        onClick={() => handleRemove(item.id)}
                        disabled={isLoading}
                        aria-label={`Remove ${item.product_name || item.name || 'item'} from cart`}
                      >
                        <img src={trashIcon} alt="" width={14} height={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Order Summary Column */}
          <aside aria-label="Order summary">
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>

              <div style={styles.summaryRow}>
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div style={styles.summaryRow}>
                  <span>Discount</span>
                  <span style={styles.discountText}>− {formatCurrency(discount)}</span>
                </div>
              )}

              <div style={styles.summaryRow}>
                <span>Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span style={{ color: '#37b24d', fontWeight: 500 }}>Free</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              <div style={styles.summaryTotal}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <hr style={styles.divider} />

              {/* Promo Code */}
              <div>
                <label
                  htmlFor="promoCodeInput"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#212529',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Promo Code
                </label>
                <form onSubmit={handleApplyPromo} style={styles.promoForm}>
                  <input
                    id="promoCodeInput"
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoStatus(null);
                      setPromoError('');
                    }}
                    placeholder="Enter code"
                    style={{
                      ...styles.promoInput,
                      borderColor: promoStatus === 'error' ? '#f03e3e' : promoStatus === 'success' ? '#37b24d' : '#868e96',
                    }}
                    aria-describedby={promoStatus === 'error' ? 'promoError' : promoStatus === 'success' ? 'promoSuccess' : undefined}
                    disabled={promoStatus === 'applying'}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    type="submit"
                    style={{
                      ...styles.applyBtn,
                      opacity: promoStatus === 'applying' ? 0.7 : 1,
                      cursor: promoStatus === 'applying' ? 'not-allowed' : 'pointer',
                    }}
                    disabled={promoStatus === 'applying' || !promoCode.trim()}
                  >
                    {promoStatus === 'applying' ? 'Applying…' : 'Apply'}
                  </button>
                </form>
                {promoStatus === 'error' && (
                  <p id="promoError" style={styles.promoErrorText} role="alert">
                    {promoError}
                  </p>
                )}
                {promoStatus === 'success' && (
                  <p id="promoSuccess" style={styles.promoSuccessText} role="status">
                    Promo code applied!
                  </p>
                )}
              </div>

              <button
                style={styles.checkoutBtn}
                onClick={() => navigate('/checkout/review')}
                aria-label="Proceed to checkout"
              >
                Proceed to Checkout
              </button>

              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <Link
                  to="/products"
                  style={{
                    fontSize: '14px',
                    color: '#4c6ef5',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  ← Continue shopping
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Toast toasts={toasts} />
    </main>
  );
}

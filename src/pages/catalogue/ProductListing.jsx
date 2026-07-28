import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';

const API_BASE = '/api';

const tokens = {
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorSecondary: '#fd7e14',
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorError: '#f03e3e',
  colorSuccess: '#37b24d',
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
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
    marginBottom: '8px',
  },
  resultCount: {
    fontSize: '14px',
    color: tokens.colorMuted,
    marginBottom: '24px',
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    background: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid ${tokens.colorBorder}`,
    padding: '24px',
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: tokens.colorInk,
    marginBottom: '16px',
  },
  filterSection: {
    marginBottom: '24px',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    marginBottom: '8px',
    display: 'block',
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
    fontSize: '14px',
    color: tokens.colorBody,
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: tokens.colorPrimary,
    cursor: 'pointer',
  },
  priceRange: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  priceInput: {
    width: '80px',
    padding: '6px 8px',
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusSm,
    fontSize: '14px',
    fontFamily: tokens.fontSans,
    color: tokens.colorBody,
    outline: 'none',
  },
  main: {
    flex: 1,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sortSelect: {
    padding: '8px 12px',
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusSm,
    fontSize: '14px',
    fontFamily: tokens.fontSans,
    color: tokens.colorBody,
    background: tokens.colorSurface,
    cursor: 'pointer',
    outline: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '24px',
  },
  card: {
    background: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid ${tokens.colorBorder}`,
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.15s ease',
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    background: tokens.colorDisabledBg,
    display: 'block',
  },
  cardBody: {
    padding: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardBrand: {
    fontSize: '12px',
    color: tokens.colorMuted,
    fontWeight: '400',
  },
  cardName: {
    fontSize: '16px',
    fontWeight: '600',
    color: tokens.colorInk,
    lineHeight: '24px',
  },
  cardPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: tokens.colorPrimary,
    marginTop: '8px',
  },
  cardPriceMuted: {
    fontSize: '12px',
    color: tokens.colorMuted,
    fontWeight: '400',
  },
  badgeOos: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    background: tokens.colorDisabledBg,
    color: tokens.colorDisabledText,
    borderRadius: tokens.radiusXs,
    padding: '2px 6px',
    marginTop: '6px',
    alignSelf: 'flex-start',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    color: tokens.colorMuted,
  },
  emptyImg: {
    width: '120px',
    marginBottom: '16px',
    opacity: 0.6,
  },
  emptyText: {
    fontSize: '16px',
    color: tokens.colorMuted,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '40px',
  },
  pageBtn: {
    minWidth: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusSm,
    background: tokens.colorSurface,
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: tokens.fontSans,
    color: tokens.colorBody,
    padding: '0 12px',
    transition: 'background 0.1s',
  },
  pageBtnActive: {
    background: tokens.colorPrimary,
    color: '#fff',
    borderColor: tokens.colorPrimary,
    fontWeight: '600',
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  loadingText: {
    color: tokens.colorMuted,
    fontSize: '16px',
    padding: '48px 0',
    textAlign: 'center',
  },
  errorText: {
    color: tokens.colorError,
    fontSize: '14px',
    padding: '16px',
    background: '#ffe3e3',
    borderRadius: tokens.radiusSm,
    marginBottom: '16px',
  },
  clearBtn: {
    fontSize: '12px',
    color: tokens.colorPrimary,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    fontFamily: tokens.fontSans,
    textDecoration: 'underline',
  },
  applyBtn: {
    padding: '8px 16px',
    background: tokens.colorPrimary,
    color: '#fff',
    border: 'none',
    borderRadius: tokens.radiusSm,
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: tokens.fontSans,
    fontWeight: '600',
    marginTop: '8px',
    minHeight: '44px',
  },
};

function formatPrice(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
}

function ProductCard({ product }) {
  const image = product.images?.[0]?.url || placeholderProduct;
  const minPrice = product.min_price ?? product.price ?? 0;
  const isOos = product.in_stock === false;
  return (
    <Link
      to={`/products/${product.slug}`}
      style={styles.card}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(76,110,245,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <img
        src={image}
        alt={product.name}
        style={styles.cardImage}
        onError={e => { e.target.src = placeholderProduct; }}
      />
      <div style={styles.cardBody}>
        {product.brand_name && <span style={styles.cardBrand}>{product.brand_name}</span>}
        <span style={styles.cardName}>{product.name}</span>
        <span style={styles.cardPrice}>
          {formatPrice(minPrice)}
          <span style={styles.cardPriceMuted}> incl. tax</span>
        </span>
        {isOos && <span style={styles.badgeOos}>Out of Stock</span>}
      </div>
    </Link>
  );
}

const PAGE_SIZE = 20;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'newest';
  const selectedCategories = searchParams.getAll('category');
  const selectedBrands = searchParams.getAll('brand');
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';

  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', PAGE_SIZE);
      if (sort) params.set('sort', sort);
      selectedCategories.forEach(c => params.append('category', c));
      selectedBrands.forEach(b => params.append('brand', b));
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);
      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
      const data = await res.json();
      setProducts(data.data || data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, sort, selectedCategories.join(','), selectedBrands.join(','), minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(r => r.json())
      .then(d => setCategories(d.data || d.categories || []))
      .catch(() => {});
    fetch(`${API_BASE}/brands`)
      .then(r => r.json())
      .then(d => setBrands(d.data || d.brands || []))
      .catch(() => {});
  }, []);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const toggleMulti = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const existing = next.getAll(key);
    next.delete(key);
    if (existing.includes(value)) {
      existing.filter(v => v !== value).forEach(v => next.append(key, v));
    } else {
      [...existing, value].forEach(v => next.append(key, v));
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({ page: '1', sort });
    setPriceMin('');
    setPriceMax('');
  };

  const applyPrice = () => {
    const next = new URLSearchParams(searchParams);
    if (priceMin) next.set('min_price', priceMin); else next.delete('min_price');
    if (priceMax) next.set('max_price', priceMax); else next.delete('max_price');
    next.set('page', '1');
    setSearchParams(next);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>All Products</h1>
        <p style={styles.resultCount}>
          {loading ? 'Loading…' : `${total.toLocaleString()} product${total !== 1 ? 's' : ''} found`}
        </p>
        {error && <div style={styles.errorText}>{error}</div>}
        <div style={styles.layout}>
          {/* Sidebar Filters */}
          <aside style={styles.sidebar}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={styles.sidebarTitle}>Filters</span>
              <button style={styles.clearBtn} onClick={clearFilters} type="button">Clear all</button>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div style={styles.filterSection}>
                <span style={styles.filterLabel}>Category</span>
                {categories.map(cat => (
                  <label key={cat.id} style={styles.filterOption}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={selectedCategories.includes(String(cat.id))}
                      onChange={() => toggleMulti('category', String(cat.id))}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            )}

            {/* Brands */}
            {brands.length > 0 && (
              <div style={styles.filterSection}>
                <span style={styles.filterLabel}>Brand</span>
                {brands.map(brand => (
                  <label key={brand.id} style={styles.filterOption}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={selectedBrands.includes(String(brand.id))}
                      onChange={() => toggleMulti('brand', String(brand.id))}
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
            )}

            {/* Price Range */}
            <div style={styles.filterSection}>
              <span style={styles.filterLabel}>Price (incl. tax)</span>
              <div style={styles.priceRange}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  style={styles.priceInput}
                  min="0"
                />
                <span style={{ color: tokens.colorMuted }}>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  style={styles.priceInput}
                  min="0"
                />
              </div>
              <button style={styles.applyBtn} onClick={applyPrice} type="button">Apply</button>
            </div>
          </aside>

          {/* Main content */}
          <main style={styles.main}>
            <div style={styles.toolbar}>
              <span style={{ fontSize: '14px', color: tokens.colorMuted }}>
                {!loading && `Showing page ${page} of ${totalPages || 1}`}
              </span>
              <select
                style={styles.sortSelect}
                value={sort}
                onChange={e => setParam('sort', e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name A–Z</option>
                <option value="name_desc">Name Z–A</option>
              </select>
            </div>

            {loading ? (
              <div style={styles.loadingText}>Loading products…</div>
            ) : products.length === 0 ? (
              <div style={styles.emptyState}>
                <img src={emptyState} alt="No products found" style={styles.emptyImg} />
                <p style={styles.emptyText}>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav style={styles.pagination} aria-label="Pagination">
                <button
                  style={{
                    ...styles.pageBtn,
                    ...(page <= 1 ? styles.pageBtnDisabled : {}),
                  }}
                  onClick={() => setParam('page', page - 1)}
                  disabled={page <= 1}
                  aria-label="Previous page"
                >
                  <img src={chevronLeft} alt="" width="16" height="16" />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p;
                  if (totalPages <= 7) {
                    p = i + 1;
                  } else if (page <= 4) {
                    p = i + 1;
                    if (i === 6) p = totalPages;
                  } else if (page >= totalPages - 3) {
                    p = i === 0 ? 1 : totalPages - 6 + i;
                  } else {
                    const map = [1, page - 2, page - 1, page, page + 1, page + 2, totalPages];
                    p = map[i];
                  }
                  return (
                    <button
                      key={p}
                      style={{
                        ...styles.pageBtn,
                        ...(p === page ? styles.pageBtnActive : {}),
                      }}
                      onClick={() => setParam('page', p)}
                      aria-current={p === page ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  style={{
                    ...styles.pageBtn,
                    ...(page >= totalPages ? styles.pageBtnDisabled : {}),
                  }}
                  onClick={() => setParam('page', page + 1)}
                  disabled={page >= totalPages}
                  aria-label="Next page"
                >
                  <img src={chevronRight} alt="" width="16" height="16" />
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

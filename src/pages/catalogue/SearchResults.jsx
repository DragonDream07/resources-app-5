import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';

const API_BASE = '/api';

const tokens = {
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorError: '#f03e3e',
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
  fontSans: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
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
  searchBarWrap: {
    marginBottom: '24px',
  },
  searchBar: {
    display: 'flex',
    gap: '0',
    border: `1.5px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusMd,
    overflow: 'hidden',
    background: tokens.colorSurface,
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    fontFamily: tokens.fontSans,
    color: tokens.colorBody,
    background: 'transparent',
  },
  searchBtn: {
    padding: '12px 20px',
    background: tokens.colorPrimary,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    minHeight: '44px',
  },
  suggest: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: tokens.colorSurface,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusSm,
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    zIndex: 100,
    listStyle: 'none',
    margin: 0,
    padding: '4px 0',
  },
  suggestItem: {
    padding: '10px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    color: tokens.colorBody,
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
    marginBottom: '4px',
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
  facetCount: {
    fontSize: '12px',
    color: tokens.colorMuted,
    marginLeft: 'auto',
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
  noQuery: {
    textAlign: 'center',
    padding: '64px 24px',
    color: tokens.colorMuted,
    fontSize: '16px',
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
  highlightQ: {
    color: tokens.colorPrimary,
    fontWeight: '700',
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

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const suggestTimer = useRef(null);

  const q = searchParams.get('q') || '';
  const [inputQ, setInputQ] = useState(q);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'relevance';
  const selectedCategories = searchParams.getAll('category');
  const selectedBrands = searchParams.getAll('brand');
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  const fetchResults = useCallback(async () => {
    if (!q.trim()) {
      setProducts([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('q', q);
      params.set('page', page);
      params.set('limit', PAGE_SIZE);
      if (sort && sort !== 'relevance') params.set('sort', sort);
      selectedCategories.forEach(c => params.append('category', c));
      selectedBrands.forEach(b => params.append('brand', b));
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);
      const res = await fetch(`${API_BASE}/search?${params.toString()}`);
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();
      setProducts(data.data || data.hits || data.products || []);
      setTotal(data.total || 0);
      setFacets(data.facets || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [q, page, sort, selectedCategories.join(','), selectedBrands.join(','), minPrice, maxPrice]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  useEffect(() => { setInputQ(q); }, [q]);

  const handleSuggest = (value) => {
    setInputQ(value);
    clearTimeout(suggestTimer.current);
    if (value.trim().length < 2) { setSuggestions([]); setShowSuggest(false); return; }
    suggestTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search/suggest?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || data.data || []);
          setShowSuggest(true);
        }
      } catch { /* ignore */ }
    }, 250);
  };

  const submitSearch = (qVal) => {
    const val = (qVal !== undefined ? qVal : inputQ).trim();
    setShowSuggest(false);
    if (!val) return;
    const next = new URLSearchParams();
    next.set('q', val);
    next.set('page', '1');
    if (sort !== 'relevance') next.set('sort', sort);
    setSearchParams(next);
  };

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
    if (existing.includes(String(value))) {
      existing.filter(v => v !== String(value)).forEach(v => next.append(key, v));
    } else {
      [...existing, String(value)].forEach(v => next.append(key, v));
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({ q, page: '1', sort });
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

  const categoryFacets = facets.categories || [];
  const brandFacets = facets.brands || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ ...styles.searchBarWrap, position: 'relative' }}>
          <form
            onSubmit={e => { e.preventDefault(); submitSearch(); }}
            style={styles.searchBar}
            role="search"
          >
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products…"
              value={inputQ}
              onChange={e => handleSuggest(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
              onFocus={() => suggestions.length > 0 && setShowSuggest(true)}
              style={styles.searchInput}
              autoComplete="off"
            />
            <button type="submit" style={styles.searchBtn} aria-label="Submit search">
              <img src={searchIcon} alt="" width="20" height="20" style={{ filter: 'invert(1)' }} />
            </button>
          </form>
          {showSuggest && suggestions.length > 0 && (
            <ul style={styles.suggest} role="listbox">
              {suggestions.slice(0, 8).map((s, i) => (
                <li
                  key={i}
                  style={styles.suggestItem}
                  role="option"
                  onMouseDown={() => { submitSearch(typeof s === 'string' ? s : s.text); }}
                  onMouseEnter={e => { e.currentTarget.style.background = tokens.colorPrimarySubtle; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; }}
                >
                  {typeof s === 'string' ? s : s.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        <h1 style={styles.pageTitle}>
          {q ? (
            <>Search results for <span style={styles.highlightQ}>&ldquo;{q}&rdquo;</span></>
          ) : 'Search'}
        </h1>
        <p style={styles.resultCount}>
          {q
            ? (loading ? 'Searching…' : `${total.toLocaleString()} result${total !== 1 ? 's' : ''} found`)
            : 'Enter a search term above.'}
        </p>

        {error && <div style={styles.errorText}>{error}</div>}

        {!q.trim() ? (
          <div style={styles.noQuery}>
            <img src={emptyState} alt="" style={{ ...styles.emptyImg, width: '100px' }} />
            <p>Start typing to search for products.</p>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Facet Sidebar */}
            <aside style={styles.sidebar}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={styles.sidebarTitle}>Refine</span>
                <button style={styles.clearBtn} onClick={clearFilters} type="button">Clear all</button>
              </div>

              {categoryFacets.length > 0 && (
                <div style={styles.filterSection}>
                  <span style={styles.filterLabel}>Category</span>
                  {categoryFacets.map(facet => (
                    <label key={facet.id || facet.value} style={styles.filterOption}>
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={selectedCategories.includes(String(facet.id || facet.value))}
                        onChange={() => toggleMulti('category', facet.id || facet.value)}
                      />
                      <span>{facet.name || facet.label || facet.value}</span>
                      {facet.count !== undefined && <span style={styles.facetCount}>({facet.count})</span>}
                    </label>
                  ))}
                </div>
              )}

              {brandFacets.length > 0 && (
                <div style={styles.filterSection}>
                  <span style={styles.filterLabel}>Brand</span>
                  {brandFacets.map(facet => (
                    <label key={facet.id || facet.value} style={styles.filterOption}>
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={selectedBrands.includes(String(facet.id || facet.value))}
                        onChange={() => toggleMulti('brand', facet.id || facet.value)}
                      />
                      <span>{facet.name || facet.label || facet.value}</span>
                      {facet.count !== undefined && <span style={styles.facetCount}>({facet.count})</span>}
                    </label>
                  ))}
                </div>
              )}

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

            <main style={styles.main}>
              <div style={styles.toolbar}>
                <span style={{ fontSize: '14px', color: tokens.colorMuted }}>
                  {!loading && q && `Showing page ${page} of ${totalPages || 1}`}
                </span>
                <select
                  style={styles.sortSelect}
                  value={sort}
                  onChange={e => setParam('sort', e.target.value)}
                  aria-label="Sort results"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name A–Z</option>
                </select>
              </div>

              {loading ? (
                <div style={styles.loadingText}>Searching…</div>
              ) : products.length === 0 ? (
                <div style={styles.emptyState}>
                  <img src={emptyState} alt="No results" style={styles.emptyImg} />
                  <p style={styles.emptyText}>No results found for &ldquo;{q}&rdquo;. Try different keywords or remove filters.</p>
                </div>
              ) : (
                <div style={styles.grid}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <nav style={styles.pagination} aria-label="Pagination">
                  <button
                    style={{ ...styles.pageBtn, ...(page <= 1 ? styles.pageBtnDisabled : {}) }}
                    onClick={() => setParam('page', page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    <img src={chevronLeft} alt="" width="16" height="16" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let p;
                    if (totalPages <= 7) p = i + 1;
                    else if (page <= 4) { p = i + 1; if (i === 6) p = totalPages; }
                    else if (page >= totalPages - 3) p = i === 0 ? 1 : totalPages - 6 + i;
                    else { const map = [1, page - 2, page - 1, page, page + 1, page + 2, totalPages]; p = map[i]; }
                    return (
                      <button
                        key={p}
                        style={{ ...styles.pageBtn, ...(p === page ? styles.pageBtnActive : {}) }}
                        onClick={() => setParam('page', p)}
                        aria-current={p === page ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    style={{ ...styles.pageBtn, ...(page >= totalPages ? styles.pageBtnDisabled : {}) }}
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
        )}
      </div>
    </div>
  );
}

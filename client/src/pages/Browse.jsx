import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, PackageSearch, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { API_BASE, CATEGORIES, PRODUCTS_PER_PAGE } from '../config';

export default function Browse() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const [brands, setBrands] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/products/brands`);
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch { setBrands([]); }
  }, []);

  const fetchProducts = useCallback(async (category, brand, page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: PRODUCTS_PER_PAGE,
        page,
        ...(category !== 'all' && { category }),
        ...(brand !== 'all' && { brand }),
      });
      const res = await fetch(`${API_BASE}/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
    fetchProducts('all', 'all', 1);
  }, [fetchBrands, fetchProducts]);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setActiveBrand('all');
    fetchProducts(cat, 'all', 1);
  };

  const handleBrand = (brand) => {
    setActiveBrand(brand);
    fetchProducts(activeCategory, brand, 1);
  };

  const handlePage = (p) => {
    fetchProducts(activeCategory, activeBrand, p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side search filter
  const displayed = search.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearSearch = () => { setSearch(''); setSearchInput(''); };

  return (
    <main style={{ background: 'var(--color-primary-dark)', minHeight: '100vh', paddingTop: '80px' }}>

      {/* ── PAGE HEADER ─────────────────────────────────────── */}
      <div
        style={{
          borderBottom: '1px solid rgba(170,124,17,0.15)',
          background: 'var(--color-secondary-dark)',
          padding: '3rem 1.5rem 2rem',
        }}
      >
        <div className="container-max">
          <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.22em', color: 'var(--color-muted-gold)', textTransform: 'uppercase' }}>
            Full Range
          </span>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--color-neutral-light)', marginTop: '0.3rem', marginBottom: '1.75rem' }}
          >
            The Collection
          </h1>

          {/* Gender / Category tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(142,142,147,0.12)' }}>
            {CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleCategory(id)}
                style={{
                  padding: '0.6rem 1.4rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  borderBottom: activeCategory === id ? '2px solid var(--color-accent-gold)' : '2px solid transparent',
                  color: activeCategory === id ? 'var(--color-accent-gold)' : 'var(--color-muted-gray)',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.04em',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-max" style={{ padding: '2rem 1.5rem 4rem' }}>

        {/* ── TOOLBAR ──────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {/* Brand filter pills */}
          {brands.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <SlidersHorizontal size={13} style={{ color: 'var(--color-muted-gold)', flexShrink: 0 }} />
              <button
                className={`filter-pill ${activeBrand === 'all' ? 'active' : ''}`}
                onClick={() => handleBrand('all')}
              >
                All Brands
              </button>
              {brands.map(b => (
                <button key={b} className={`filter-pill ${activeBrand === b ? 'active' : ''}`} onClick={() => handleBrand(b)}>
                  {b}
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-gray)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="input-dark"
                placeholder="Search products..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                style={{ paddingLeft: '2.25rem', paddingRight: search ? '2.25rem' : '1rem', width: '220px', fontSize: '0.85rem', padding: '0.55rem 1rem 0.55rem 2.25rem' }}
              />
              {search && (
                <button type="button" onClick={clearSearch} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-gray)', display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>
            <button type="submit" className="btn-outline-gold" style={{ fontSize: '0.78rem', padding: '0.5rem 1rem', flexShrink: 0 }}>
              Go
            </button>
          </form>
        </div>

        {/* Count */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(142,142,147,0.1)' }} />
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-muted-gray)', letterSpacing: '0.1em', flexShrink: 0 }}>
            {loading ? '...' : search ? `${displayed.length} result${displayed.length !== 1 ? 's' : ''}` : `${pagination.total} item${pagination.total !== 1 ? 's' : ''}`}
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(142,142,147,0.1)' }} />
        </div>

        {/* ── GRID ─────────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {loading
            ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
            : displayed.length === 0
            ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-muted-gray)' }}>
                <PackageSearch size={44} style={{ margin: '0 auto 1.25rem', opacity: 0.3 }} />
                <p style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>No products found</p>
                <p style={{ fontSize: '0.83rem', opacity: 0.7 }}>
                  {search ? `No matches for "${search}". Try a different term.` : 'Try a different filter.'}
                </p>
                {search && (
                  <button onClick={clearSearch} className="btn-outline-gold" style={{ marginTop: '1.25rem', fontSize: '0.78rem' }}>
                    Clear Search
                  </button>
                )}
              </div>
            )
            : displayed.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>

        {/* ── PAGINATION ───────────────────────────────────── */}
        {!search && !loading && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handlePage(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="btn-outline-gold"
              style={{ fontSize: '0.78rem', padding: '0.5rem 0.9rem', opacity: pagination.page <= 1 ? 0.35 : 1 }}
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => handlePage(p)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '4px',
                  border: `1px solid ${pagination.page === p ? 'var(--color-accent-gold)' : 'rgba(142,142,147,0.2)'}`,
                  background: pagination.page === p ? 'rgba(212,175,55,0.12)' : 'transparent',
                  color: pagination.page === p ? 'var(--color-accent-gold)' : 'var(--color-muted-gray)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="btn-outline-gold"
              style={{ fontSize: '0.78rem', padding: '0.5rem 0.9rem', opacity: pagination.page >= pagination.totalPages ? 0.35 : 1 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

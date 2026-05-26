import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, PlusCircle, Package, Trash2,
  Upload, Image as ImageIcon, Shirt, AlertCircle,
  LogOut, ChevronRight, Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import SkeletonCard from '../components/SkeletonCard';
import { API_BASE } from '../config';

const KNOWN_BRANDS = ['Carter Wear'];
const CATEGORIES_OPTIONS = [
  { value: 'men',   label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids',  label: 'Kids' },
];

const INITIAL_FORM = { name: '', brand: '', category: 'men', price: '', description: '', image: null };

export default function Admin() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add');
  const [form, setForm] = useState(INITIAL_FORM);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchProducts = async (cat = 'all') => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (cat !== 'all') params.set('category', cat);
      const res = await fetch(`${API_BASE}/products?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setForm(f => ({ ...f, image: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.price) {
      showToast('Name, brand, and price are required.', 'error'); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('brand', form.brand.trim());
      fd.append('category', form.category);
      fd.append('price', form.price);
      fd.append('description', form.description.trim());
      if (form.image) fd.append('image', form.image);

      const res = await fetch(`${API_BASE}/products`, { method: 'POST', headers: authHeaders, body: fd });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed'); }

      showToast('Product added to inventory.');
      setForm(INITIAL_FORM);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchProducts(categoryFilter);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Product removed.');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      showToast('Could not delete product.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const catFilteredProducts = categoryFilter === 'all' ? products : products.filter(p => p.category === categoryFilter);

  const labelStyle = { display: 'block', fontSize: '0.68rem', letterSpacing: '0.14em', color: 'var(--color-muted-gold)', textTransform: 'uppercase', marginBottom: '0.45rem', fontFamily: 'var(--font-mono)' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-primary-dark)' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Admin header ─────────────────────────────────────── */}
      <header style={{ paddingTop: '80px', borderBottom: '1px solid rgba(170,124,17,0.15)', background: 'var(--color-secondary-dark)' }}>
        <div className="container-max" style={{ padding: '2rem 1.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <LayoutDashboard size={18} style={{ color: 'var(--color-accent-gold)' }} />
              <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--color-muted-gold)', textTransform: 'uppercase' }}>
                Admin Panel
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-gray)' }}>
                <span style={{ color: 'var(--color-accent-gold)' }}>{user?.name}</span>
              </span>
              <button onClick={handleLogout} className="btn-outline-gold" style={{ fontSize: '0.76rem', padding: '0.45rem 0.9rem' }}>
                <LogOut size={13} /> <span>Logout</span>
              </button>
            </div>
          </div>

          <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--color-neutral-light)', marginBottom: '1.75rem' }}>
            Inventory Dashboard
          </h1>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { id: 'add', label: 'Add Product', icon: PlusCircle },
              { id: 'inventory', label: `Inventory (${products.length})`, icon: Package },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.7rem 1.4rem',
                  fontSize: '0.875rem', fontWeight: 500, fontFamily: 'var(--font-body)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: activeTab === id ? '2px solid var(--color-accent-gold)' : '2px solid transparent',
                  color: activeTab === id ? 'var(--color-accent-gold)' : 'var(--color-muted-gray)',
                  marginBottom: '-1px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="section-pad">
        <div className="container-max">

          {/* ── ADD PRODUCT ─────────────────────────────────── */}
          {activeTab === 'add' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,400px),1fr))', gap: '3rem', alignItems: 'start' }}>
              {/* Form */}
              <div>
                <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-neutral-light)', marginBottom: '2rem' }}>
                  New Product
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label htmlFor="name" style={labelStyle}>Product Name *</label>
                    <input id="name" name="name" type="text" className="input-dark" placeholder="e.g. Classic Slim Tee" value={form.name} onChange={handleChange} required />
                  </div>

                  <div>
                    <label htmlFor="brand" style={labelStyle}>Brand *</label>
                    <input id="brand" name="brand" type="text" className="input-dark" placeholder="e.g. Carter Wear" value={form.brand} onChange={handleChange} list="brand-datalist" required />
                    <datalist id="brand-datalist">{KNOWN_BRANDS.map(b => <option key={b} value={b} />)}</datalist>
                  </div>

                  {/* Category selector */}
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {CATEGORIES_OPTIONS.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, category: value }))}
                          style={{
                            flex: 1,
                            padding: '0.6rem',
                            border: `1px solid ${form.category === value ? 'var(--color-accent-gold)' : 'rgba(142,142,147,0.25)'}`,
                            borderRadius: '6px',
                            background: form.category === value ? 'rgba(212,175,55,0.1)' : 'var(--color-secondary-dark)',
                            color: form.category === value ? 'var(--color-accent-gold)' : 'var(--color-muted-gray)',
                            fontSize: '0.85rem',
                            fontFamily: 'var(--font-body)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontWeight: form.category === value ? 600 : 400,
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="price" style={labelStyle}>Price (USD) *</label>
                    <input id="price" name="price" type="number" step="0.01" min="0" className="input-dark" placeholder="0.00" value={form.price} onChange={handleChange} required />
                  </div>

                  <div>
                    <label htmlFor="description" style={labelStyle}>Description</label>
                    <textarea id="description" name="description" className="input-dark" placeholder="Short product description..." rows={4} value={form.description} onChange={handleChange} style={{ resize: 'vertical', minHeight: '96px' }} />
                  </div>

                  <button type="submit" className="btn-gold" disabled={submitting} style={{ marginTop: '0.25rem', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}>
                    <PlusCircle size={15} />
                    <span>{submitting ? 'Adding...' : 'Add to Inventory'}</span>
                  </button>
                </form>
              </div>

              {/* Image upload */}
              <div>
                <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-neutral-light)', marginBottom: '2rem' }}>
                  Product Image
                </h2>

                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => !preview && fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${preview ? 'rgba(212,175,55,0.4)' : 'rgba(142,142,147,0.25)'}`,
                    borderRadius: '10px',
                    minHeight: '280px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: preview ? 'default' : 'pointer',
                    background: 'var(--color-secondary-dark)',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={clearFile}
                        style={{
                          position: 'absolute', top: '0.75rem', right: '0.75rem',
                          background: 'rgba(13,13,13,0.85)', border: '1px solid rgba(239,68,68,0.4)',
                          color: '#ef4444', borderRadius: '6px', padding: '0.35rem 0.65rem',
                          cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'var(--font-body)',
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                        }}
                      >
                        <Trash2 size={11} /> Remove
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <ImageIcon size={34} style={{ color: 'var(--color-muted-gold)', opacity: 0.45, margin: '0 auto 1rem' }} />
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral-light)', marginBottom: '0.35rem', fontWeight: 500 }}>
                        Drop image here or click to browse
                      </p>
                      <p className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--color-muted-gray)', letterSpacing: '0.08em' }}>
                        JPEG, PNG, WEBP — max 8MB
                      </p>
                      <button
                        type="button"
                        className="btn-outline-gold"
                        style={{ marginTop: '1.1rem', fontSize: '0.76rem' }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={13} /> <span>Upload Image</span>
                      </button>
                    </div>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={handleFile} />

                <div style={{ marginTop: '0.85rem', padding: '0.75rem 1rem', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '6px', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <AlertCircle size={13} style={{ color: 'var(--color-muted-gold)', marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.76rem', color: 'var(--color-muted-gray)', lineHeight: 1.5 }}>
                    Images save to <code style={{ color: 'var(--color-accent-gold)', fontSize: '0.7rem' }}>/server/uploads</code>. Only the path is stored in MySQL.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── INVENTORY ────────────────────────────────────── */}
          {activeTab === 'inventory' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-neutral-light)' }}>All Products</h2>
                <button className="btn-outline-gold" style={{ fontSize: '0.76rem' }} onClick={() => fetchProducts(categoryFilter)}>
                  <ChevronRight size={13} /> <span>Refresh</span>
                </button>
              </div>

              {/* Category filter */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                {['all', 'men', 'women', 'kids'].map(cat => (
                  <button
                    key={cat}
                    className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
                    onClick={() => { setCategoryFilter(cat); fetchProducts(cat); }}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>

              {productsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '8px' }} />
                  ))}
                </div>
              ) : catFilteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-muted-gray)' }}>
                  <Package size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>No products in this category yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {catFilteredProducts.map(p => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '0.9rem 1.2rem',
                        background: 'var(--color-secondary-dark)',
                        border: '1px solid rgba(170,124,17,0.1)',
                        borderRadius: '8px',
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{ width: '54px', height: '54px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <Shirt size={20} style={{ color: 'var(--color-muted-gold)', opacity: 0.4 }} />
                        }
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="brand-label">{p.brand}</span>
                          <span style={{
                            padding: '0.15rem 0.55rem', borderRadius: '999px',
                            fontSize: '0.58rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase',
                            background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)',
                            color: 'var(--color-accent-gold)',
                          }}>
                            {p.category}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-neutral-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.15rem' }}>
                          {p.name}
                        </p>
                      </div>

                      <span className="price-display" style={{ flexShrink: 0, fontSize: '0.95rem' }}>
                        ${parseFloat(p.price).toFixed(2)}
                      </span>

                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        style={{
                          flexShrink: 0, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                          color: '#ef4444', borderRadius: '6px', padding: '0.45rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease', opacity: deletingId === p.id ? 0.5 : 1,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

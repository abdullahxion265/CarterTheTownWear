import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    color: isActive(path) ? 'var(--color-accent-gold)' : 'var(--color-muted-gray)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  });

  return (
    <nav className={`navbar ${scrolled || menuOpen ? 'navbar-scrolled' : ''}`}>
      <div className="container-max px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span className="text-gold-gradient font-display" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Carter
            </span>
            <span className="font-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--color-muted-gray)', textTransform: 'uppercase', marginTop: '1px' }}>
              The Town Wear
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" style={navLinkStyle('/')}>Home</Link>
          <Link to="/browse" style={navLinkStyle('/browse')}>Browse</Link>
          {isAdmin && <Link to="/admin" style={navLinkStyle('/admin')} className="flex items-center gap-1"><LayoutDashboard size={13} /> Admin</Link>}

          {isAdmin ? (
            <button onClick={handleLogout} className="btn-outline-gold" style={{ fontSize: '0.78rem', padding: '0.5rem 1rem' }}>
              <LogOut size={13} /> <span>Logout</span>
            </button>
          ) : (
            <Link to="/browse" className="btn-gold" style={{ fontSize: '0.8rem', padding: '0.65rem 1.5rem' }}>
              <ShoppingBag size={13} />
              <span>Shop Now</span>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(v => !v)} style={{ background: 'none', border: 'none', color: 'var(--color-neutral-light)', cursor: 'pointer' }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-6 pb-5 pt-2" style={{ borderTop: '1px solid rgba(170,124,17,0.2)', background: 'rgba(13,13,13,0.98)' }}>
          <Link to="/" className="admin-nav-item" style={isActive('/') ? { color: 'var(--color-accent-gold)' } : {}}>Home</Link>
          <Link to="/browse" className="admin-nav-item" style={isActive('/browse') ? { color: 'var(--color-accent-gold)' } : {}}>Browse Collection</Link>
          {isAdmin && <Link to="/admin" className="admin-nav-item" style={isActive('/admin') ? { color: 'var(--color-accent-gold)' } : {}}><LayoutDashboard size={14} /> Admin Dashboard</Link>}
          {isAdmin && (
            <button onClick={handleLogout} className="admin-nav-item" style={{ color: '#ef4444' }}>
              <LogOut size={14} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

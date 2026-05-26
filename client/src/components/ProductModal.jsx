import { useEffect } from 'react';
import { X, Shirt, MessageCircle, Tag, Layers } from 'lucide-react';
import { WHATSAPP_NUMBER, APP_NAME } from '../config';

function buildWhatsAppUrl(product) {
  const message = encodeURIComponent(
    `Hi ${APP_NAME}! I'm interested in purchasing:\n\n` +
    `*${product.name}* by ${product.brand}\n` +
    `Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}\n` +
    `Price: MK${parseFloat(product.price).toFixed(2)}\n\n` +
    `Please let me know availability and how to proceed.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export default function ProductModal({ product, onClose }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const categoryLabel = product.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
    : '';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-secondary-dark)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,340px),1fr))',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          animation: 'fadeUp 0.3s ease',
        }}
      >
        {/* Image panel */}
        <div
          style={{
            position: 'relative',
            background: '#111',
            minHeight: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px 0 0 14px',
            overflow: 'hidden',
          }}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            />
          ) : (
            <div className="img-placeholder" style={{ height: '100%', minHeight: '320px', width: '100%' }}>
              <Shirt size={48} style={{ color: 'var(--color-muted-gold)', opacity: 0.4 }} />
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted-gray)' }}>No Image</span>
            </div>
          )}

          {/* Category badge */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              padding: '0.3rem 0.8rem',
              background: 'rgba(13,13,13,0.85)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '999px',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
            }}
          >
            {categoryLabel}
          </div>
        </div>

        {/* Info panel */}
        <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(13,13,13,0.8)',
              border: '1px solid rgba(142,142,147,0.2)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-muted-gray)',
              zIndex: 10,
            }}
          >
            <X size={16} />
          </button>

          <span className="brand-label" style={{ marginBottom: '0.5rem' }}>{product.brand}</span>
          <div className="gold-divider" style={{ width: '40px', marginBottom: '0.75rem' }} />

          <h2
            className="font-display"
            style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-neutral-light)', lineHeight: 1.2, marginBottom: '0.75rem' }}
          >
            {product.name}
          </h2>

          {/* Meta tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.18)',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
            }}>
              <Layers size={11} /> {categoryLabel}
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              background: 'rgba(142,142,147,0.08)',
              border: '1px solid rgba(142,142,147,0.15)',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-muted-gray)',
            }}>
              <Tag size={11} /> In Stock
            </span>
          </div>

          {product.description && (
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-gray)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {product.description}
            </p>
          )}

          {/* Price */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'rgba(212,175,55,0.05)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-gray)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Price
            </span>
            <span className="price-display" style={{ fontSize: '1.5rem' }}>
              MK{parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={buildWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ justifyContent: 'center', padding: '0.95rem', fontSize: '0.875rem', borderRadius: '6px', textDecoration: 'none' }}
          >
            <MessageCircle size={16} />
            <span>Order via WhatsApp</span>
          </a>

          <p
            style={{
              marginTop: '0.85rem',
              fontSize: '0.72rem',
              color: 'var(--color-muted-gray)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
            }}
          >
            Tap to chat directly with our team
          </p>
        </div>
      </div>
    </div>
  );
}

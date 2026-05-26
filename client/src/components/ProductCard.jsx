import { useState } from 'react';
import { Eye, Shirt } from 'lucide-react';
import ProductModal from './ProductModal';

export default function ProductCard({ product, featured = false }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const imageHeight = featured ? '320px' : '260px';
  const categoryLabel = product.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
    : '';

  return (
    <>
      <div
        className="card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="card-image-wrap" style={{ height: imageHeight }}>
          {product.image_url && !imgError ? (
            <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} />
          ) : (
            <div className="img-placeholder" style={{ height: imageHeight }}>
              <Shirt size={34} style={{ color: 'var(--color-muted-gold)', opacity: 0.45 }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No Image</span>
            </div>
          )}

          {/* Category badge */}
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              padding: '0.22rem 0.6rem',
              background: 'rgba(13,13,13,0.8)',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '999px',
              fontSize: '0.6rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
            }}
          >
            {categoryLabel}
          </div>

          {/* Hover overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(13,13,13,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <button
              onClick={() => setShowModal(true)}
              className="btn-gold"
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem' }}
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: featured ? '1.2rem 1.2rem 1.5rem' : '1rem 1rem 1.25rem' }}>
          <span className="brand-label">{product.brand}</span>
          <div className="gold-divider" style={{ width: '28px', margin: '0.35rem 0 0.45rem' }} />
          <h3
            className="font-display"
            style={{
              fontSize: featured ? '1.05rem' : '0.95rem',
              fontWeight: 600,
              color: 'var(--color-neutral-light)',
              marginBottom: '0.5rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            <span className="price-display">MK{parseFloat(product.price).toFixed(2)}</span>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-muted-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.25rem 0',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted-gold)'}
            >
              <Eye size={11} /> View
            </button>
          </div>
        </div>
      </div>

      {showModal && <ProductModal product={product} onClose={() => setShowModal(false)} />}
    </>
  );
}

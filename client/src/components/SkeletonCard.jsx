export default function SkeletonCard({ featured = false }) {
  const imageHeight = featured ? '320px' : '260px';

  return (
    <div className="card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ height: imageHeight, borderRadius: 0 }} />
      <div style={{ padding: '1rem 1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div className="skeleton" style={{ height: '10px', width: '60px' }} />
        <div className="skeleton" style={{ height: '2px', width: '32px' }} />
        <div className="skeleton" style={{ height: '16px', width: '75%' }} />
        <div className="skeleton" style={{ height: '12px', width: '90%' }} />
        <div className="skeleton" style={{ height: '12px', width: '65%' }} />
        <div className="skeleton" style={{ height: '20px', width: '80px', marginTop: '0.25rem' }} />
      </div>
    </div>
  );
}

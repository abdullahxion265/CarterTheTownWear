import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: '0.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

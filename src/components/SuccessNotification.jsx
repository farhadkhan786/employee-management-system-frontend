import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';
import './SuccessNotification.css';

export const SuccessNotification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-notification">
      <div className="success-content">
        <CheckCircle size={20} className="success-icon" />
        <span className="success-message">{message}</span>
        <button className="success-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

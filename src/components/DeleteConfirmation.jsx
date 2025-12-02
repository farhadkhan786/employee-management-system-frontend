import { AlertTriangle } from 'lucide-react';
import './DeleteConfirmation.css';

export const DeleteConfirmation = ({ employee, onConfirm, onCancel, loading }) => {
  return (
    <>
      <div className="confirm-overlay" onClick={onCancel} />
      <div className="confirm-dialog">
        <div className="confirm-icon">
          <AlertTriangle size={48} color="var(--danger)" />
        </div>
        <h3>Delete Employee?</h3>
        <p>
          Are you sure you want to delete <strong>{employee.name}</strong>? This
          action cannot be undone.
        </p>
        <div className="confirm-actions">
          <button
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </>
  );
};

import { useState } from 'react';
import { User, Trash2 } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { UPDATE_EMPLOYEE_STATUS, DELETE_EMPLOYEE, GET_EMPLOYEES } from '../apollo/queries';
import { DeleteConfirmation } from './DeleteConfirmation';
import { useAuth } from '../context/AuthContext';
import './GridView.css';

export const GridView = ({ employees, onEmployeeClick, onDeleteSuccess }) => {
  const { isAdmin } = useAuth();
  const [updateEmployeeStatus] = useMutation(UPDATE_EMPLOYEE_STATUS, {
    refetchQueries: ['GetEmployees'],
  });
  const [deleteEmployee, { loading: deleteLoading }] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: ['GetEmployees'],
    awaitRefetchQueries: true,
  });
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const getStatusBadgeClass = (status) => {
    return status === 'active' ? 'badge-success' : 'badge-warning';
  };

  const handleStatusChange = async (e, employeeId) => {
    e.stopPropagation();
    const newStatus = e.target.value;

    try {
      await updateEmployeeStatus({
        variables: {
          id: employeeId,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteClick = (e, employee) => {
    e.stopPropagation();
    setEmployeeToDelete(employee);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee({
        variables: { id: employeeToDelete.id },
      });
      setEmployeeToDelete(null);
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <User size={64} color="var(--gray)" />
        <h3>No employees found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid-view">
      <div className="grid-container">
        <div className="grid-header">
          <div className="grid-cell">ID</div>
          <div className="grid-cell">Name</div>
          <div className="grid-cell">Email</div>
          <div className="grid-cell">Phone</div>
          <div className="grid-cell">Age</div>
          <div className="grid-cell">Class</div>
          <div className="grid-cell">Subjects</div>
          <div className="grid-cell">Attendance</div>
          <div className="grid-cell">Status</div>
          {isAdmin && <div className="grid-cell">Actions</div>}
        </div>

        <div className="grid-body">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="grid-row"
              onClick={() => onEmployeeClick(employee)}
            >
              <div className="grid-cell">{employee.id}</div>
              <div className="grid-cell">
                <div className="employee-name">
                  <div className="avatar">
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="name-text">{employee.name}</span>
                </div>
              </div>
              <div className="grid-cell">
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="grid-cell">
                <span className="truncate">{employee.phone}</span>
              </div>
              <div className="grid-cell">{employee.age}</div>
              <div className="grid-cell">{employee.class}</div>
              <div className="grid-cell">
                <div className="subjects-cell">
                  {employee.subjects && employee.subjects.length > 0 ? (
                    <>
                      {employee.subjects.slice(0, 2).join(', ')}
                      {employee.subjects.length > 2 && (
                        <span className="subjects-more">
                          {' '}+{employee.subjects.length - 2}
                        </span>
                      )}
                    </>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div className="grid-cell">
                <div className="attendance-cell">
                  <div className="attendance-bar">
                    <div
                      className="attendance-fill"
                      style={{
                        width: `${employee.attendance}%`,
                        background:
                          employee.attendance >= 90
                            ? 'var(--success)'
                            : employee.attendance >= 70
                            ? 'var(--warning)'
                            : 'var(--danger)',
                      }}
                    ></div>
                  </div>
                  <span className="attendance-text">{employee.attendance}%</span>
                </div>
              </div>
              <div className="grid-cell">
                {isAdmin ? (
                  <select
                    className="status-select"
                    value={employee.status}
                    onChange={(e) => handleStatusChange(e, employee.id)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="active">Active</option>
                    <option value="flagged">Flagged</option>
                  </select>
                ) : (
                  <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
                    {employee.status}
                  </span>
                )}
              </div>
              {isAdmin && (
                <div className="grid-cell">
                  <button
                    className="btn btn-ghost btn-icon btn-sm delete-btn"
                    onClick={(e) => handleDeleteClick(e, employee)}
                    title="Delete employee"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {employeeToDelete && (
        <DeleteConfirmation
          employee={employeeToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setEmployeeToDelete(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

import { useState } from 'react';
import {
  MoreVertical,
  Edit,
  Flag,
  Trash2,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TileView.css';

export const TileView = ({ employees, onEmployeeClick }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { isAdmin } = useAuth();

  const getStatusBadgeClass = (status) => {
    return status === 'active' ? 'badge-success' : 'badge-warning';
  };

  const handleMenuToggle = (e, employeeId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === employeeId ? null : employeeId);
  };

  const handleMenuAction = (e, action, employee) => {
    e.stopPropagation();
    setActiveMenu(null);
    console.log(action, employee);
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
    <>
      <div className="tile-view">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="employee-tile"
            onClick={() => onEmployeeClick(employee)}
          >
            <div className="tile-header">
              <div className="tile-avatar">
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <button
                className="tile-menu-btn"
                onClick={(e) => handleMenuToggle(e, employee.id)}
              >
                <MoreVertical size={18} />
              </button>

              {activeMenu === employee.id && (
                <div className="tile-menu" onClick={(e) => e.stopPropagation()}>
                  {isAdmin && (
                    <>
                      <button
                        className="tile-menu-item"
                        onClick={(e) => handleMenuAction(e, 'edit', employee)}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        className="tile-menu-item"
                        onClick={(e) => handleMenuAction(e, 'flag', employee)}
                      >
                        <Flag size={16} />
                        Flag
                      </button>
                      <button
                        className="tile-menu-item danger"
                        onClick={(e) => handleMenuAction(e, 'delete', employee)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                  {!isAdmin && (
                    <button
                      className="tile-menu-item"
                      onClick={(e) => handleMenuAction(e, 'view', employee)}
                    >
                      <User size={16} />
                      View Details
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="tile-body">
              <h3 className="tile-name">{employee.name}</h3>
              <p className="tile-position">{employee.class}</p>

              <div className="tile-status">
                <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
                  {employee.status}
                </span>
              </div>

              <div className="tile-info">
                <div className="info-item">
                  <Mail size={16} />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="info-item">
                  <Phone size={16} />
                  <span>{employee.phone}</span>
                </div>
              </div>

              <div className="tile-stats">
                <div className="stat-item">
                  <div className="stat-label">ID</div>
                  <div className="stat-value">{employee.id}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Age</div>
                  <div className="stat-value">{employee.age}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Attendance</div>
                  <div className="stat-value">
                    <span
                      className={`attendance-badge ${
                        employee.attendance >= 90
                          ? 'high'
                          : employee.attendance >= 70
                          ? 'medium'
                          : 'low'
                      }`}
                    >
                      {employee.attendance}%
                    </span>
                  </div>
                </div>
              </div>

              {employee.subjects && employee.subjects.length > 0 && (
                <div className="tile-subjects">
                  {employee.subjects.slice(0, 3).map((subject, index) => (
                    <span key={index} className="subject-tag">
                      {subject}
                    </span>
                  ))}
                  {employee.subjects.length > 3 && (
                    <span className="subject-tag more">
                      +{employee.subjects.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeMenu && (
        <div className="overlay" onClick={() => setActiveMenu(null)} />
      )}
    </>
  );
};

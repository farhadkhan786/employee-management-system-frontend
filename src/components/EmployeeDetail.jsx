import { useState } from 'react';
import {
  X,
  User,
  Edit,
  Save,
  XCircle,
  TrendingUp,
  BookOpen,
  Flag,
  Mail,
  Phone,
  Plus,
  Trash2,
} from 'lucide-react';
import { useMutation } from '@apollo/client';
import { UPDATE_EMPLOYEE, UPDATE_EMPLOYEE_STATUS } from '../apollo/queries';
import { useAuth } from '../context/AuthContext';
import './EmployeeDetail.css';

export const EmployeeDetail = ({ employee, onClose, onUpdate, onSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    age: employee.age,
    class: employee.class,
    attendance: employee.attendance,
  });
  const [subjects, setSubjects] = useState(
    employee.subjects && employee.subjects.length > 0 ? employee.subjects : ['']
  );

  const { isAdmin } = useAuth();
  const [updateEmployee, { loading }] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: ['GetEmployees'],
    awaitRefetchQueries: true,
  });
  const [updateEmployeeStatus] = useMutation(UPDATE_EMPLOYEE_STATUS, {
    refetchQueries: ['GetEmployees'],
  });

  const getStatusBadgeClass = (status) => {
    return status === 'active' ? 'badge-success' : 'badge-warning';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const addSubjectField = () => {
    setSubjects([...subjects, '']);
  };

  const removeSubjectField = (index) => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      await updateEmployeeStatus({
        variables: {
          id: employee.id,
          status: newStatus,
        },
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleSave = async () => {
    try {
      const filteredSubjects = subjects.filter((s) => s.trim() !== '');

      await updateEmployee({
        variables: {
          id: employee.id,
          input: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            age: parseInt(formData.age),
            class: formData.class,
            subjects: filteredSubjects,
            attendance: parseFloat(formData.attendance),
          },
        },
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      age: employee.age,
      class: employee.class,
      attendance: employee.attendance,
    });
    setSubjects(
      employee.subjects && employee.subjects.length > 0 ? employee.subjects : ['']
    );
    setIsEditing(false);
  };

  return (
    <>
      <div className="detail-overlay" onClick={onClose} />
      <div className="employee-detail">
        <div className="detail-header">
          <div className="detail-header-content">
            <div className="detail-avatar-large">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <div className="detail-header-info">
              {isEditing ? (
                <div className="edit-fields-container">
                  <div className="edit-field">
                    <label className="edit-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input detail-input-large"
                    />
                  </div>
                  <div className="edit-field">
                    <label className="edit-label">Status</label>
                    <select
                      className="status-select"
                      value={employee.status}
                      onChange={handleStatusChange}
                    >
                      <option value="active">Active</option>
                      <option value="flagged">Flagged</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="detail-title">{employee.name}</h2>
                  {isAdmin ? (
                    <select
                      className="status-select status-select-compact"
                      value={employee.status}
                      onChange={handleStatusChange}
                    >
                      <option value="active">Active</option>
                      <option value="flagged">Flagged</option>
                    </select>
                  ) : (
                    <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
                      {employee.status}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="detail-actions">
            {isAdmin && !isEditing && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} />
                Edit
              </button>
            )}
            {isEditing && (
              <>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              </>
            )}
            <button className="btn btn-ghost btn-icon" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">
                  <User size={18} />
                  ID
                </div>
                <div className="detail-value">{employee.id}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <Mail size={18} />
                  Email
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input detail-input"
                  />
                ) : (
                  <div className="detail-value">{employee.email}</div>
                )}
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <Phone size={18} />
                  Phone
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input detail-input"
                  />
                ) : (
                  <div className="detail-value">{employee.phone}</div>
                )}
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <User size={18} />
                  Age
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input detail-input"
                  />
                ) : (
                  <div className="detail-value">{employee.age} years</div>
                )}
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <BookOpen size={18} />
                  Class
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="input detail-input"
                  />
                ) : (
                  <div className="detail-value">{employee.class}</div>
                )}
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <TrendingUp size={18} />
                  Attendance
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleInputChange}
                    className="input detail-input"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                ) : (
                  <div className="detail-value">
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
                )}
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <Flag size={18} />
                  Status
                </div>
                <div className="detail-value">
                  <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">Subjects</h3>
            {isEditing ? (
              <div className="subjects-inputs">
                {subjects.map((subject, index) => (
                  <div key={index} className="subject-input-row">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => handleSubjectChange(index, e.target.value)}
                      placeholder={`Subject ${index + 1}`}
                      className="input"
                    />
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubjectField(index)}
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Remove subject"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSubjectField}
                  className="btn btn-secondary btn-sm add-subject-btn"
                >
                  <Plus size={16} />
                  Add Subject
                </button>
              </div>
            ) : (
              <div className="subjects-list">
                {employee.subjects && employee.subjects.length > 0 ? (
                  employee.subjects.map((subject, index) => (
                    <span key={index} className="subject-badge">
                      {subject}
                    </span>
                  ))
                ) : (
                  <p>No subjects assigned</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

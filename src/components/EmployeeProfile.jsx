import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EMPLOYEES, UPDATE_EMPLOYEE } from '../apollo/queries';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  TrendingUp,
  Edit,
  Save,
  XCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import './EmployeeProfile.css';

export const EmployeeProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { first: 1 },
    fetchPolicy: 'cache-and-network',
  });

  const [updateEmployee, { loading: updateLoading }] = useMutation(UPDATE_EMPLOYEE);

  const employee = data?.employees?.edges?.[0]?.node;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    class: '',
    attendance: '',
  });

  const [subjects, setSubjects] = useState(['']);

  // Update form data when employee data loads
  useEffect(() => {
    if (employee) {
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
    }
  }, [employee]);

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

  const handleEdit = () => {
    if (employee) {
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
    }
    setIsEditing(true);
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

      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (employee) {
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
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>Error loading profile</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="profile-error">
        <h2>No profile found</h2>
        <p>Unable to load your employee profile</p>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    return status === 'active' ? 'badge-success' : 'badge-warning';
  };

  return (
    <div className="employee-profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{employee.name}</h1>
            <p className="profile-email">{user?.email}</p>
            <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
              {employee.status}
            </span>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={handleEdit}>
                <Edit size={18} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={updateLoading}
                >
                  <Save size={18} />
                  {updateLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={handleCancel}
                  disabled={updateLoading}
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>
                  <User size={18} />
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p>{employee.name}</p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  <User size={18} />
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p>{employee.age} years</p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  <Mail size={18} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p>{employee.email}</p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  <Phone size={18} />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p>{employee.phone}</p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  <BookOpen size={18} />
                  Class
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p>{employee.class}</p>
                )}
              </div>

              <div className="profile-field">
                <label>
                  <TrendingUp size={18} />
                  Attendance
                </label>
                <div className="attendance-display">
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
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Subjects</h2>
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
                  <p className="no-data">No subjects assigned</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

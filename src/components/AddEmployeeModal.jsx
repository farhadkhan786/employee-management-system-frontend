import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_EMPLOYEE, GET_EMPLOYEES } from '../apollo/queries';
import { X, Plus, Trash2 } from 'lucide-react';
import './AddEmployeeModal.css';

export const AddEmployeeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    class: '',
    attendance: '0',
  });
  const [subjects, setSubjects] = useState(['']);
  const [errors, setErrors] = useState({});

  const [createEmployee, { loading }] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: ['GetEmployees'],
    awaitRefetchQueries: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (formData.age < 18 || formData.age > 100)
      newErrors.age = 'Age must be between 18 and 100';
    if (!formData.class.trim()) newErrors.class = 'Class is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const filteredSubjects = subjects.filter((s) => s.trim() !== '');

      await createEmployee({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
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
      console.error('Error creating employee:', error);
      setErrors({ submit: error.message });
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New Employee</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`input ${errors.age ? 'input-error' : ''}`}
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`input ${errors.phone ? 'input-error' : ''}`}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input ${errors.password ? 'input-error' : ''}`}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="class">Class *</label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className={`input ${errors.class ? 'input-error' : ''}`}
              />
              {errors.class && <span className="error-text">{errors.class}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="attendance">Attendance (%)</label>
            <input
              type="number"
              id="attendance"
              name="attendance"
              value={formData.attendance}
              onChange={handleInputChange}
              className="input"
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Subjects</label>
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
          </div>

          {errors.submit && (
            <div className="error-message">
              <p>{errors.submit}</p>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

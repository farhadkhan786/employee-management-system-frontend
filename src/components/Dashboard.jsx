import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEES } from '../apollo/queries';
import { GridView } from './GridView';
import { TileView } from './TileView';
import { EmployeeDetail } from './EmployeeDetail';
import { AddEmployeeModal } from './AddEmployeeModal';
import { SuccessNotification } from './SuccessNotification';
import { Grid, LayoutGrid, Search, Filter, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Dashboard = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [successMessage, setSuccessMessage] = useState(null);
  const { isAdmin } = useAuth();

  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      first: 50,
      filter: {
        ...(searchTerm && { search: searchTerm }),
        ...(filterClass && { class: filterClass }),
        ...(filterStatus && { status: filterStatus }),
      },
      sort: {
        field: sortField,
        order: sortOrder,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDetail = () => {
    setSelectedEmployee(null);
  };

  const employees = data?.employees?.edges?.map((edge) => edge.node) || [];
  const classes = [...new Set(employees.map((emp) => emp.class))];
  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'flagged', label: 'Flagged' }
  ];

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error loading employees</h2>
          <p>{error.message}</p>
          <button className="btn btn-primary" onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1 className="dashboard-title">Employee Management</h1>
          <p className="dashboard-subtitle">
            {data?.employees?.totalCount || 0} employees
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Employee
          </button>
        )}
      </div>

      <div className="dashboard-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email, phone, age, or class..."
            value={searchTerm}
            onChange={handleSearch}
            className="input search-input"
          />
        </div>

        <div className="controls-right">
          <div className="filter-group">
            <Filter size={18} />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="input filter-select"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Filter size={18} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input filter-select"
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="input filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
              <option value="class">Sort by Class</option>
              <option value="attendance">Sort by Attendance</option>
            </select>
          </div>

          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <button
            className="btn btn-ghost btn-icon"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </button>

          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              className={`toggle-btn ${viewMode === 'tile' ? 'active' : ''}`}
              onClick={() => setViewMode('tile')}
              title="Tile View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {loading && employees.length === 0 ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading employees...</p>
          </div>
        ) : viewMode === 'grid' ? (
          <GridView
            employees={employees}
            onEmployeeClick={handleEmployeeClick}
            onDeleteSuccess={() => setSuccessMessage('Employee deleted successfully')}
          />
        ) : (
          <TileView
            employees={employees}
            onEmployeeClick={handleEmployeeClick}
          />
        )}
      </div>

      {selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          onClose={handleCloseDetail}
          onUpdate={handleRefresh}
          onSuccess={() => setSuccessMessage('Employee updated successfully')}
        />
      )}

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setSuccessMessage('Employee created successfully')}
        />
      )}

      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
};

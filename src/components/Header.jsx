import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Users,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to={isAdmin ? '/dashboard' : '/profile'} className="logo">
              <Users size={28} />
              <span>EmployeeHub</span>
            </Link>
          </div>

          <div className="header-right">
            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => toggleDropdown('user')}
              >
                <User size={18} />
                <span>{user?.email}</span>
                <ChevronDown size={16} />
              </button>
              {activeDropdown === 'user' && (
                <div className="dropdown-menu dropdown-menu-right">
                  <div className="user-info">
                    <div className="user-email">{user?.email}</div>
                    <div className="user-role">{user?.role}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu slide-in">
            <nav className="mobile-nav">
              {isAdmin && (
                <Link
                  to="/dashboard"
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users size={20} />
                  <span>Employees</span>
                </Link>
              )}

              <button onClick={handleLogout} className="mobile-nav-link logout">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {(isMobileMenuOpen || activeDropdown) && (
        <div
          className="overlay"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setActiveDropdown(null);
          }}
        />
      )}
    </header>
  );
};

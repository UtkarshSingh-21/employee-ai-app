// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiPlusCircle, FiCpu, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
    { to: '/employees', label: 'Employees', icon: <FiUsers /> },
    { to: '/add-employee', label: 'Add Employee', icon: <FiPlusCircle /> },
    { to: '/ai-recommend', label: 'AI Insights', icon: <FiCpu /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-text">TalentAI</span>
      </div>
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>
      <div className="navbar-user">
        <span className="user-name">{user?.name}</span>
        <span className="user-role">{user?.role}</span>
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
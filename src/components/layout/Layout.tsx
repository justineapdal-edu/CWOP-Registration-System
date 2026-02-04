import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/LIGHTHOUSE_CAINTA_LOGO_BLACK.png';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/registration', label: 'Registration', icon: 'patients' },
    { path: '/records', label: 'Patient Records', icon: 'records' },
    { path: '/vitals', label: 'Vitals Recording', icon: 'vitals' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img src={logo} alt="Lighthouse Cainta" className="logo-image" />
            <p>Medical Mission System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">
            <span className="nav-label">Settings</span>
          </button>
          <button className="nav-item">
            <span className="nav-label">Support</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/repairs', label: 'Réparations', icon: '🔧' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/shops', label: 'Boutiques', icon: '🏪' },
  { to: '/settings', label: 'Paramètres', icon: '⚙️' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">R</span>
          <span className="sidebar-logo-text">RepairSaaS</span>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.firstName} {user?.lastName}</p>
            <p className="sidebar-user-role">{user?.role}</p>
          </div>
        </div>
        <button className="sidebar-logout" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import PixelDiamondLogo from '../pixel/PixelDiamondLogo.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import {
  TEAM_NAV_LINKS,
  JUDGE_NAV_LINKS,
  ADMIN_NAV_LINKS,
} from '../../config/navLinks.js';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, role, logout } = useAuth();

  const getLinks = () => {
    switch (role) {
      case 'team':
        return TEAM_NAV_LINKS;
      case 'judge':
        return JUDGE_NAV_LINKS;
      case 'admin':
        return ADMIN_NAV_LINKS;
      default:
        return [];
    }
  };

  const navLinks = getLinks();
  const displayName = user?.teamName || user?.name || user?.leaderEmail || 'Account';

  const roleToneMap = {
    admin: 'pink',
    judge: 'purple',
    team: 'yellow',
  };

  return (
    <div className="dashboard-shell">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="dashboard-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? 'dashboard-sidebar--open' : ''}`}
        aria-label="Dashboard Sidebar"
      >
        <Link to="/" className="dashboard-sidebar__brand">
          <PixelDiamondLogo size={26} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
            PIXEL <span style={{ color: 'var(--color-arcade-yellow)' }}>PATAKHA</span>
          </span>
        </Link>

        <nav className="dashboard-sidebar__nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/team' || link.to === '/judge'}
              className={({ isActive }) =>
                `dashboard-sidebar__link ${isActive ? 'dashboard-sidebar__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-sidebar__footer">
          <Button variant="ghost" size="sm" onClick={logout} fullWidth>
            ⏻ Log Out
          </Button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__left">
            <button
              type="button"
              className="dashboard-topbar__menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="dashboard-topbar__menu-bar" />
              <span className="dashboard-topbar__menu-bar" />
              <span className="dashboard-topbar__menu-bar" />
            </button>

            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-cloud-white)' }}>
              Portal: <strong style={{ color: 'var(--color-electric-cyan)' }}>{role?.toUpperCase()}</strong>
            </span>
          </div>

          <div className="dashboard-topbar__right">
            <Badge tone={roleToneMap[role] || 'cyan'}>
              {role?.toUpperCase()}
            </Badge>
            <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-primary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </span>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

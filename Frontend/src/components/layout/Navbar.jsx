import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PixelDiamondLogo from '../pixel/PixelDiamondLogo.jsx';
import Button from '../ui/Button.jsx';
import { LANDING_NAV_LINKS } from '../../config/navLinks.js';
import { ROUTES } from '../../config/routes.js';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import { getRoleHome } from '../../features/auth/utils/roleHome.js';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Close drawer on route change
  const [prevLocationKey, setPrevLocationKey] = useState(location.key);
  if (location.key !== prevLocationKey) {
    setPrevLocationKey(location.key);
    setIsOpen(false);
  }

  const getAnchorHref = (href) => {
    return location.pathname === '/' ? href : `/${href}`;
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="PIXEL PATAKHA Home">
          <PixelDiamondLogo size={32} />
          <span className="navbar__title">
            PIXEL <span className="navbar__title-sub">PATAKHA</span>
          </span>
        </Link>

        {/* Desktop menu */}
        <nav aria-label="Primary Navigation">
          <ul className="navbar__menu">
            {LANDING_NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={getAnchorHref(link.href)} className="navbar__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <Button to={getRoleHome(role)} variant="primary" size="sm">
              Dashboard
            </Button>
          ) : (
            <Button to={ROUTES.REGISTER} variant="primary" size="sm">
              Register Team
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div id="mobile-nav" className="navbar__drawer" role="dialog" aria-modal="true">
          {LANDING_NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={getAnchorHref(link.href)}
              className="navbar__drawer-link"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <div style={{ marginTop: 'var(--space-s)' }}>
            {isAuthenticated ? (
              <Button to={getRoleHome(role)} variant="primary" fullWidth size="md">
                Dashboard
              </Button>
            ) : (
              <Button to={ROUTES.REGISTER} variant="primary" fullWidth size="md">
                Register Team
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

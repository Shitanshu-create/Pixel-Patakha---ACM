import { Outlet, Link } from 'react-router-dom';
import PixelStars from '../pixel/PixelStars.jsx';
import PixelDiamondLogo from '../pixel/PixelDiamondLogo.jsx';
import Button from '../ui/Button.jsx';
import { ROUTES } from '../../config/routes.js';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <PixelStars count={35} />

      <header className="auth-layout__nav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)', textDecoration: 'none' }}>
            <PixelDiamondLogo size={28} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-cloud-white)' }}>
              PIXEL <span style={{ color: 'var(--color-arcade-yellow)' }}>PATAKHA</span>
            </span>
          </Link>

          <Button to={ROUTES.LANDING} variant="ghost" size="sm">
            ← Back to Home
          </Button>
        </div>
      </header>

      <main className="auth-layout__content">
        <Outlet />
      </main>
    </div>
  );
}

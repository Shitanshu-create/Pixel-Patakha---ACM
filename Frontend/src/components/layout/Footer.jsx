import { Link } from 'react-router-dom';
import PixelDiamondLogo from '../pixel/PixelDiamondLogo.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import { ROUTES } from '../../config/routes.js';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Brand & Logos */}
          <div className="footer__brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
              <PixelDiamondLogo size={24} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)' }}>
                PIXEL <span style={{ color: 'var(--color-arcade-yellow)' }}>PATAKHA</span>
              </span>
            </div>

            <p className="footer__tagline">
              A 3-Hour UI/UX Designathon organized by DAS × ACM as part of BVEST '26.
            </p>

            <div className="footer__logos">
              <img src="/bvcoe-logo.png" alt="BVCOE Logo" className="footer__logo-img" />
              <img src="/DAS-logo.png" alt="DAS Logo" className="footer__logo-img" />
              <img src="/ACM-logo.png" alt="ACM BVP Logo" className="footer__logo-img" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            <ul className="footer__list">
              <li><a href="/#about" className="footer__link">About the Event</a></li>
              <li><a href="/#timeline" className="footer__link">Timeline</a></li>
              <li><a href="/#rules" className="footer__link">Rules & Policy</a></li>
              <li><a href="/#showcase" className="footer__link">Showcase</a></li>
              <li><a href="/#faq" className="footer__link">FAQ</a></li>
            </ul>
          </div>

          {/* Portals & Access */}
          <div className="footer__col">
            <h4 className="footer__col-title">Access</h4>
            <ul className="footer__list">
              <li><Link to={ROUTES.REGISTER} className="footer__link">Team Registration</Link></li>
              <li><Link to={ROUTES.LOGIN} className="footer__link">Team Login</Link></li>
              <li><Link to={ROUTES.STAFF_LOGIN} className="footer__link">Staff / Judge Login</Link></li>
              {EVENT_INFO.contact.email && (
                <li>
                  <a href={`mailto:${EVENT_INFO.contact.email}`} className="footer__link">
                    Contact Organizers
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 PIXEL PATAKHA • ALL RIGHTS RESERVED</span>
          <span>BVEST '26 • DESIGN. BUILD. PLAY.</span>
        </div>
      </div>
    </footer>
  );
}

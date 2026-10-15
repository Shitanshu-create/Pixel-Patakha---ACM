import PixelStars from '../pixel/PixelStars.jsx';
import PixelSprite from '../pixel/PixelSprite.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import { ROUTES } from '../../config/routes.js';
import useCompetition from '../../features/common/hooks/useCompetition.js';
import { getRegistrationStatus } from '../../features/common/utils/windowStatus.js';
import { formatDate } from '../../features/common/utils/formatDate.js';
import './HeroSection.css';

export default function HeroSection() {
  const { competition } = useCompetition();
  const regStatus = getRegistrationStatus(competition);

  return (
    <section className="hero-section" aria-label="Introduction">
      <PixelStars count={40} />
      <div className="hero-band" aria-hidden="true" />

      <div className="container hero-grid">
        {/* Left: Content */}
        <div className="hero-content">
          <div className="hero-badge-row">
            <Badge tone="yellow" icon="★">
              {EVENT_INFO.edition}
            </Badge>
            <Badge tone="cyan" icon="◆">
              3-Hour Quest
            </Badge>
            <Badge tone="purple" icon="●">
              {EVENT_INFO.organizers}
            </Badge>
          </div>

          <h1 className="hero-title">
            PIXEL<br />PATAKHA
          </h1>

          <div className="hero-subtitle">{EVENT_INFO.tagline}</div>
          <p className="hero-description">{EVENT_INFO.subtitle}</p>

          <div className="hero-cta-group">
            {regStatus.isOpen ? (
              <Button to={ROUTES.REGISTER} variant="primary" size="lg">
                Register Your Team
              </Button>
            ) : (
              <Button variant="primary" size="lg" disabled title={regStatus.reason}>
                Registration Closed
              </Button>
            )}

            <Button href="#about" variant="secondary" size="lg">
              Explore The Event
            </Button>
          </div>

          {/* Quick HUD Chips */}
          <div className="hero-hud-chips">
            <span className="hud-chip hud-chip--highlight">
              <PixelSprite name="coin" size={14} />
              <span>Prize Pool: {EVENT_INFO.prizePool}</span>
            </span>

            <span className="hud-chip">
              <PixelSprite name="flag" size={14} />
              <span>{EVENT_INFO.date}</span>
            </span>

            <span className="hud-chip">
              <span>📍 {EVENT_INFO.venue}</span>
            </span>
          </div>
        </div>

        {/* Right: Quest Card & Pixel Art */}
        <div className="hero-art-wrapper">
          <div className="floating-sprites-container" aria-hidden="true">
            <div className="sprite-robot"><PixelSprite name="robot" size={48} /></div>
            <div className="sprite-hero"><PixelSprite name="hero" size={48} /></div>
            <div className="sprite-invader"><PixelSprite name="invader" size={40} /></div>
            <div className="sprite-coin"><PixelSprite name="coin" size={32} /></div>
          </div>

          <div className="quest-card">
            <div className="quest-card__header">
              <span className="quest-card__title">Live Quest Intel</span>
              <Badge tone={regStatus.isOpen ? 'green' : 'pink'}>
                {regStatus.isOpen ? 'Active' : 'Locked'}
              </Badge>
            </div>

            <div className="quest-card__rows">
              <div className="quest-card__row">
                <span className="quest-card__row-label">Event Date:</span>
                <span className="quest-card__row-val">{EVENT_INFO.date}</span>
              </div>
              <div className="quest-card__row">
                <span className="quest-card__row-label">Timing:</span>
                <span className="quest-card__row-val">{EVENT_INFO.time}</span>
              </div>
              <div className="quest-card__row">
                <span className="quest-card__row-label">Location:</span>
                <span className="quest-card__row-val">{EVENT_INFO.venue}</span>
              </div>
              <div className="quest-card__row">
                <span className="quest-card__row-label">Prize Pool:</span>
                <span className="quest-card__row-val" style={{ color: 'var(--color-arcade-yellow)' }}>
                  {EVENT_INFO.prizePool}
                </span>
              </div>
              <div className="quest-card__row">
                <span className="quest-card__row-label">Reg Deadline:</span>
                <span className="quest-card__row-val">
                  {competition?.registrationDeadline ? formatDate(competition.registrationDeadline) : 'Announced Soon'}
                </span>
              </div>
            </div>

            <div
              className={`quest-card__status-banner ${regStatus.isOpen ? 'quest-card__status-banner--open' : 'quest-card__status-banner--closed'}`}
            >
              {regStatus.isOpen
                ? '★ REGISTRATIONS ARE CURRENTLY OPEN ★'
                : `⚠ ${regStatus.reason.toUpperCase()}`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

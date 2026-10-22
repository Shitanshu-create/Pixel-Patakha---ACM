import PixelSprite from '../pixel/PixelSprite.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import { ROUTES } from '../../config/routes.js';
import useCompetition from '../../features/common/hooks/useCompetition.js';
import { getRegistrationStatus } from '../../features/common/utils/windowStatus.js';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './HeroSection.css';

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
  const { competition } = useCompetition();
  const regStatus = getRegistrationStatus(competition);
  const heroRef = useRef(null);

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.hero-badge-row', { y: 20, autoAlpha: 0, duration: 0.45 })
        .from('.hero-title-word', { y: 42, scale: 0.92, autoAlpha: 0, duration: 0.6, stagger: 0.12 }, '-=0.15')
        .from('.hero-subtitle, .hero-description', { y: 18, autoAlpha: 0, duration: 0.4, stagger: 0.1 }, '-=0.2')
        .from('.hero-cta-group, .hero-hud-chips', { y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.1 }, '-=0.15');
      gsap.to('.hero-sprite--float', { y: -10, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.2 });
      return () => timeline.kill();
    });
    return () => motion.revert();
  }, { scope: heroRef });

  return (
    <section className="hero-section" aria-label="Introduction" ref={heroRef}>
      <div className="hero-sky-overlay" aria-hidden="true" />

      <div className="container hero-grid">
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

          <h1 className="hero-title" aria-label="Pixel Patakha">
            <span className="hero-title-word">PIXEL</span>
            <span className="hero-title-word hero-title-word--gold">PATAKHA</span>
          </h1>

          <div className="hero-subtitle">A 3-HOUR UI/UX DESIGNATHON</div>
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
              <span>{EVENT_INFO.venue}</span>
            </span>

            <span className="hud-chip">
              <span>🎨 Figma · Canva · Adobe XD</span>
            </span>
          </div>
        </div>

        <div className="hero-art-wrapper">
          <div className="floating-sprites-container" aria-hidden="true">
            <div className="sprite-robot hero-sprite--float"><PixelSprite name="robot" size={48} /></div>
            <div className="sprite-hero hero-sprite--float"><PixelSprite name="hero" size={48} /></div>
            <div className="sprite-invader hero-sprite--float"><PixelSprite name="invader" size={40} /></div>
            <div className="sprite-coin hero-sprite--float"><PixelSprite name="coin" size={32} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

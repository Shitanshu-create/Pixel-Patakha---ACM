import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import PixelSprite from '../pixel/PixelSprite.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import { ROUTES } from '../../config/routes.js';
import './ShowcaseSection.css';

export default function ShowcaseSection() {
  return (
    <section id="showcase" className="showcase-section landing-reveal-section" aria-label="Participant Showcase">
      <div className="container">
        <div className="section-header">
          <div className="section-header__tag">★ HALL OF CREATION ★</div>
          <h2 className="section-header__title">Your Creation, on the Board</h2>
          <p className="section-header__subtitle">
            After the 3-hour run, the highest-rated UI/UX prototypes from our teams will be exhibited here.
          </p>
        </div>

        <div className="showcase-grid">
          {EVENT_INFO.showcase.map((item) => (
            <Card key={item.id} accent="purple" className="showcase-card" data-reveal-item>
              <div className="showcase-card__thumb">
                <PixelSprite name="diamond" size={32} />
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '9px', color: 'var(--color-arcade-yellow)' }}>
                  {item.badge}
                </span>
              </div>

              <div>
                <span className="showcase-card__category">{item.category}</span>
                <h3 className="showcase-card__title">{item.title}</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-s)' }}>
                <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)' }}>
                  By: {item.author}
                </span>
                <Badge tone="yellow">PREVIEW</Badge>
              </div>
            </Card>
          ))}
        </div>

        <div className="showcase-cta-banner" data-reveal-item>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: 'var(--color-cloud-white)' }}>
            Ready to claim your place in the Hall of Fame?
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-body)', color: 'var(--text-secondary)', maxWidth: '540px' }}>
            Register your team today, bring your own workstation, and prove your design chops against the best minds in BVEST '26.
          </p>
          <Button to={ROUTES.REGISTER} variant="primary" size="lg">
            Team Registration
          </Button>
        </div>
      </div>
    </section>
  );
}

import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import PixelSprite from '../pixel/PixelSprite.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import './FeatureCards.css';

export default function FeatureCards() {
  return (
    <section id="about" className="feature-section" aria-label="About the Quest">
      <div className="container">
        <div className="section-header">
          <div className="section-header__tag">★ MISSION STAGES ★</div>
          <h2 className="section-header__title">Your Next Design Quest</h2>
          <p className="section-header__subtitle">
            Three focused hours from the initial spark to high-fidelity interactive craft.
          </p>
        </div>

        <div className="feature-cards-grid">
          {EVENT_INFO.features.map((feat) => (
            <Card
              key={feat.step}
              accent={feat.tone}
              interactive
              className="feature-card"
            >
              <div className="feature-card__top">
                <Badge tone={feat.tone}>STAGE {feat.step}</Badge>
                <PixelSprite name={feat.sprite} size={28} />
              </div>

              <h3 className="feature-card__title">{feat.title}</h3>
              <p className="feature-card__desc">{feat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

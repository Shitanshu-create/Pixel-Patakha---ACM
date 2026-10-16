import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import './RulesSection.css';

export default function RulesSection() {
  return (
    <section id="rules" className="rules-section landing-reveal-section" aria-label="Rules and Policies">
      <div className="container">
        <div className="section-header">
          <div className="section-header__tag">★ CODE OF HONOR ★</div>
          <h2 className="section-header__title">Play Fair. Create Original.</h2>
          <p className="section-header__subtitle">
            Integrity, craftsmanship, and pure human ingenuity define PIXEL PATAKHA.
          </p>
        </div>

        <div className="rules-grid">
          {/* Rules Checklist (Cyan bordered) */}
          <Card accent="cyan" className="rules-card" data-reveal-item>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)', marginBottom: 'var(--space-l)' }}>
              <Badge tone="cyan">GENERAL GUIDELINES</Badge>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)' }}>
                Hardware & Requirements
              </h3>
            </div>

            <ul className="rules-checklist">
              {EVENT_INFO.rules.map((rule, idx) => (
                <li key={idx} className="rules-checklist__item">
                  <span className="rules-checklist__bullet" aria-hidden="true">✔</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* AI Policy & Warning (Pink bordered) */}
          <Card accent="pink" className="ai-policy-card" data-reveal-item>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)', marginBottom: 'var(--space-s)' }}>
              <Badge tone="pink" icon="⚠">STRICT ENFORCEMENT</Badge>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-pixel-pink)' }}>
              {EVENT_INFO.aiPolicy.title}
            </h3>

            <div className="ai-policy-card__warning-box">
              {EVENT_INFO.aiPolicy.warning}
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
              Judges verify originality during mentorship and final evaluation. Bring your honest craft and let your authentic design skills shine.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

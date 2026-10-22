import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import './RulesSection.css';

export default function RulesSection() {
  const specs = EVENT_INFO.technicalSpecs || [];

  return (
    <section id="rules" className="rules-section landing-reveal-section" aria-label="Official Rules and Guidelines">
      <div className="container">
        <div className="section-header">
          <div className="section-header__tag">★ OFFICIAL RULES & GUIDELINES ★</div>
          <h2 className="section-header__title">Technical Specs & Conduct</h2>
          <p className="section-header__subtitle">
            The organising team (DAS & ACM) assumes all participating teams have read the rulebook in its entirety.
          </p>
        </div>

        {/* Mandatory Rulebook Notice */}
        <div
          data-reveal-item
          style={{
            padding: 'var(--space-m) var(--space-l)',
            background: 'rgba(255, 226, 41, 0.08)',
            border: '1px solid rgba(255, 226, 41, 0.3)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-m)',
          }}
        >
          <span style={{ fontSize: '1.75rem' }}>📜</span>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-cloud-white)', lineHeight: 1.6 }}>
            <strong>Mandatory Compliance:</strong> Every participating team must strictly adhere to the official rules. Plagiarism, unauthorized AI assistance, or late submissions will result in immediate disqualification without exception.
          </p>
        </div>

        {/* Technical Specs 4-card Grid */}
        <div className="tech-specs-grid" data-reveal-item>
          {specs.map((item, idx) => (
            <div key={idx} className="tech-spec-card">
              <span className="tech-spec-card__icon">{item.icon}</span>
              <div>
                <h4 className="tech-spec-card__title">{item.title}</h4>
                <p className="tech-spec-card__desc">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rules-grid" style={{ marginTop: 'var(--space-xl)' }}>
          {/* Rules Checklist */}
          <Card accent="cyan" className="rules-card" data-reveal-item>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)', marginBottom: 'var(--space-l)' }}>
              <Badge tone="cyan">CONDUCT & SUBMISSIONS</Badge>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)', margin: 0 }}>
                Participation Code
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

          {/* AI Policy & Warning */}
          <Card accent="pink" className="ai-policy-card" data-reveal-item>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)', marginBottom: 'var(--space-s)' }}>
              <Badge tone="pink" icon="⚠">STRICT ZERO TOLERANCE</Badge>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-pixel-pink)', margin: 0 }}>
              {EVENT_INFO.aiPolicy.title}
            </h3>

            <div className="ai-policy-card__warning-box">
              {EVENT_INFO.aiPolicy.warning}
            </div>

            <div style={{ padding: 'var(--space-m)', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '0.8125rem', color: 'var(--color-arcade-yellow)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                🔍 Version History & Verification
              </h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Judges reserve the explicit right to inspect project edit and version history in Figma, Canva, or Adobe XD. External assets (icons, stock photos) must be cited in reference documentation.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

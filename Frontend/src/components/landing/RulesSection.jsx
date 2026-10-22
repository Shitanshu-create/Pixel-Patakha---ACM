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
        <div data-reveal-item className="rules-compliance-banner">
          <span className="rules-compliance-banner__icon" aria-hidden="true">📜</span>
          <p className="rules-compliance-banner__text">
            <strong>Mandatory Compliance:</strong> Every participating team must strictly adhere to the official rules. Plagiarism, unauthorized AI assistance, or late submissions will result in immediate disqualification without exception.
          </p>
        </div>

        {/* Technical Specs 4-card Grid */}
        <div className="tech-specs-grid" data-reveal-item>
          {specs.map((item, idx) => (
            <div key={idx} className="tech-spec-card">
              <span className="tech-spec-card__icon" aria-hidden="true">{item.icon}</span>
              <div className="tech-spec-card__content">
                <h4 className="tech-spec-card__title">{item.title}</h4>
                <p className="tech-spec-card__desc">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rules-grid">
          {/* Rules Checklist */}
          <Card accent="cyan" className="rules-card" data-reveal-item>
            <div className="rules-card__header">
              <Badge tone="cyan">CONDUCT & SUBMISSIONS</Badge>
              <h3 className="rules-card__title">Participation Code</h3>
            </div>

            <ul className="rules-checklist">
              {EVENT_INFO.rules.map((rule, idx) => (
                <li key={idx} className="rules-checklist__item">
                  <span className="rules-checklist__bullet" aria-hidden="true">✔</span>
                  <span className="rules-checklist__text">{rule}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* AI Policy & Warning */}
          <Card accent="pink" className="ai-policy-card" data-reveal-item>
            <div className="ai-policy-card__header">
              <Badge tone="pink" icon="⚠">STRICT ZERO TOLERANCE</Badge>
            </div>

            <h3 className="ai-policy-card__title">
              {EVENT_INFO.aiPolicy.title}
            </h3>

            <div className="ai-policy-card__warning-box">
              {EVENT_INFO.aiPolicy.warning}
            </div>

            <div className="ai-policy-card__verification-box">
              <h4 className="ai-policy-card__verification-title">
                🔍 Version History & Verification
              </h4>
              <p className="ai-policy-card__verification-desc">
                Judges reserve the explicit right to inspect project edit and version history in Figma, Canva, or Adobe XD. External assets (icons, stock photos) must be cited in reference documentation.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

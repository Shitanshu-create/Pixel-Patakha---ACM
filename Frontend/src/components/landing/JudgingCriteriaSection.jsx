import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import './JudgingCriteriaSection.css';

export default function JudgingCriteriaSection() {
  const criteria = EVENT_INFO.judgingCriteria || [];
  const rounds = EVENT_INFO.judgingRounds || [];

  return (
    <section id="judging" className="judging-section landing-reveal-section" aria-label="Judging Criteria">
      <div className="container">
        <div className="section-header">
          <div className="section-header__tag">★ 100-POINT RUBRIC ★</div>
          <h2 className="section-header__title">Official Judging Criteria</h2>
          <p className="section-header__subtitle">
            Every submission is evaluated against five key pillars of creative craftsmanship, usability, and design thinking.
          </p>
        </div>

        {/* 5-Criteria Pillars Grid */}
        <div className="judging-grid">
          {criteria.map((item, idx) => (
            <div key={idx} className="judging-card" data-reveal-item>
              <div className="judging-card__header">
                <span className="judging-card__icon">{item.icon}</span>
                <span
                  className="judging-card__points"
                  style={{
                    color: item.color,
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                  }}
                >
                  {item.points} PTS
                </span>
              </div>

              <h3 className="judging-card__title">{item.title}</h3>

              <div className="judging-card__meter">
                <div
                  className="judging-card__fill"
                  style={{
                    width: item.percent,
                    background: item.color,
                  }}
                />
              </div>

              <p className="judging-card__desc">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Two Judging Rounds Highlight */}
        <div className="rounds-container" data-reveal-item>
          {rounds.map((rnd, idx) => (
            <Card key={idx} accent={idx === 0 ? 'cyan' : 'yellow'} className="round-card">
              <div>
                <div className="round-card__badge">{rnd.round}</div>
                <h3 className="round-card__title">{rnd.name}</h3>
                <span className="round-card__time">⏰ {rnd.time}</span>
                <p className="round-card__desc">{rnd.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

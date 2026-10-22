import PixelSprite from '../pixel/PixelSprite.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import './TimelineSection.css';

export default function TimelineSection() {
  const getSpriteName = (icon) => {
    switch (icon) {
      case 'flag':
        return 'flag';
      case 'users':
        return 'hero';
      case 'star':
        return 'star';
      default:
        return 'diamond';
    }
  };

  return (
    <section id="timeline" className="timeline-section landing-reveal-section" aria-label="Competition Timeline">
      <div className="container">
        <div className="section-header">
          <div className="section-header__tag">★ EVENT DAY SCHEDULE ★</div>
          <h2 className="section-header__title">Event Day Schedule</h2>
          <p className="section-header__subtitle">
            From morning registration to the final championship judging round.
          </p>
        </div>

        <div className="timeline-track">
          {EVENT_INFO.timeline.map((item, idx) => (
            <div key={idx} className="timeline-node" data-reveal-item>
              <div className="timeline-node__marker">
                <PixelSprite name={getSpriteName(item.icon)} size={22} />
                <span className="timeline-node__time">{item.time}</span>
              </div>

              <div className="timeline-node__card">
                <h3 className="timeline-node__stage">{item.stage}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

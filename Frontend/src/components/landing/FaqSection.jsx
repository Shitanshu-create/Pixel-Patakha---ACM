import Accordion from '../ui/Accordion.jsx';
import { EVENT_INFO } from '../../config/eventInfo.js';
import './FaqSection.css';

export default function FaqSection() {
  return (
    <section id="faq" className="faq-section" aria-label="Frequently Asked Questions">
      <div className="container">
        <div className="section-header">
          <div className="section-header__tag">★ EVENT INTEL ★</div>
          <h2 className="section-header__title">Frequently Asked Questions</h2>
          <p className="section-header__subtitle">
            Everything you need to know about participating, tools, rules, and hardware.
          </p>
        </div>

        <div className="faq-container">
          <Accordion items={EVENT_INFO.faq} />
        </div>
      </div>
    </section>
  );
}

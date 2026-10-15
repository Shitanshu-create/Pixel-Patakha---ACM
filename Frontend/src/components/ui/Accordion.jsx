import { useState } from 'react';
import './Accordion.css';

export default function Accordion({ items = [], allowMultiple = false, className = '' }) {
  const [openIndexes, setOpenIndexes] = useState([0]); // first open by default

  const toggleIndex = (idx) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(idx) ? [] : [idx]));
    }
  };

  return (
    <div className={`accordion ${className}`}>
      {items.map((item, idx) => {
        const isExpanded = openIndexes.includes(idx);
        const headerId = `accordion-header-${idx}`;
        const panelId = `accordion-panel-${idx}`;

        return (
          <div
            key={idx}
            className={`accordion-item ${isExpanded ? 'accordion-item--expanded' : ''}`}
          >
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                className="accordion-trigger"
                onClick={() => toggleIndex(idx)}
              >
                <span>{item.question}</span>
                <span className="accordion-icon" aria-hidden="true">
                  ▶
                </span>
              </button>
            </h3>
            {isExpanded && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="accordion-content"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

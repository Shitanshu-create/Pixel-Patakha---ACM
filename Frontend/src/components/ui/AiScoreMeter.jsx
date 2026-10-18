import React from 'react';
import { getLevelTone, formatPercent } from '../../features/common/utils/aiDetection.js';
import './AiScoreMeter.css';

export const AiScoreMeter = ({ likelihood, level, showLabel = true, size = 'md' }) => {
  const tone = getLevelTone(level);
  const percent = likelihood !== null && likelihood !== undefined ? Math.max(0, Math.min(100, likelihood)) : null;

  return (
    <div className={`ai-score-meter ai-score-meter--${size}`}>
      {showLabel && (
        <div className="ai-score-meter__header">
          <span className="ai-score-meter__title">AI Likelihood</span>
          <span className="ai-score-meter__value" style={{ color: `var(${tone.colorVar})` }}>
            {formatPercent(percent)} ({tone.shortLabel})
          </span>
        </div>
      )}
      <div className="ai-score-meter__track">
        <div
          className="ai-score-meter__fill"
          style={{
            width: percent !== null ? `${percent}%` : '0%',
            backgroundColor: `var(${tone.colorVar})`,
          }}
        />
      </div>
    </div>
  );
};

export default AiScoreMeter;

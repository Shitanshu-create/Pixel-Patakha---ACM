import React from 'react';
import { getLevelTone, formatPercent } from '../../features/common/utils/aiDetection.js';
import './AiScoreMeter.css';

export const AiScoreMeter = ({ likelihood, level, showLabel = true, size = 'md' }) => {
  const tone = getLevelTone(level);
  const isAvailable = likelihood !== null && likelihood !== undefined;
  const percent = isAvailable ? Math.max(0, Math.min(100, likelihood)) : null;

  const getGradient = () => {
    if (level === 'high') {
      return 'linear-gradient(90deg, #ff5364, #ff2a85)';
    }
    if (level === 'medium' || level === 'review') {
      return 'linear-gradient(90deg, #ffe229, #ff9e2c)';
    }
    return 'linear-gradient(90deg, #00d9ff, #48e08a)';
  };

  const getGlow = () => {
    if (level === 'high') return '0 0 10px rgba(255, 83, 100, 0.45)';
    if (level === 'medium' || level === 'review') return '0 0 10px rgba(255, 226, 41, 0.4)';
    return '0 0 10px rgba(0, 217, 255, 0.4)';
  };

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
      <div className={`ai-score-meter__track ${!isAvailable ? 'ai-score-meter__track--skipped' : ''}`}>
        {/* Threshold Markers */}
        <span className="ai-score-meter__marker ai-score-meter__marker--review" title="Review Threshold (30%)" />
        <span className="ai-score-meter__marker ai-score-meter__marker--high" title="High Risk Threshold (70%)" />

        {isAvailable && (
          <div
            className="ai-score-meter__fill"
            style={{
              width: `${percent}%`,
              background: getGradient(),
              boxShadow: percent > 5 ? getGlow() : 'none',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AiScoreMeter;

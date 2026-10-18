import React from 'react';
import { getLevelTone, getStatusTone, formatPercent } from '../../features/common/utils/aiDetection.js';

export const AiScoreBadge = ({ status, likelihood, level, size = 'sm' }) => {
  if (status && status !== 'completed') {
    const statusConfig = getStatusTone(status);
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: size === 'sm' ? '2px 8px' : '4px 10px',
          borderRadius: 'var(--radius-sm)',
          fontSize: size === 'sm' ? 'var(--fs-label)' : 'var(--fs-small)',
          fontWeight: 600,
          fontFamily: 'var(--font-label)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: `var(${statusConfig.colorVar})`,
          backgroundColor: statusConfig.bgVar,
          border: `1px solid ${statusConfig.borderVar}`,
        }}
      >
        {status === 'scanning' && '⏳ '}
        {statusConfig.shortLabel}
      </span>
    );
  }

  const tone = getLevelTone(level);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-sm)',
        fontSize: size === 'sm' ? 'var(--fs-label)' : 'var(--fs-small)',
        fontWeight: 600,
        fontFamily: 'var(--font-label)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: `var(${tone.colorVar})`,
        backgroundColor: tone.bgVar,
        border: `1px solid ${tone.borderVar}`,
      }}
    >
      {tone.shortLabel}: {formatPercent(likelihood)}
    </span>
  );
};

export default AiScoreBadge;

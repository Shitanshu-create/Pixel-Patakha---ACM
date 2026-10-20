import React from 'react';
import { getLevelTone, getStatusTone, formatPercent } from '../../features/common/utils/aiDetection.js';

export const AiScoreBadge = ({ status, likelihood, level, size = 'sm' }) => {
  const hasNumericScore = likelihood !== null && likelihood !== undefined && !isNaN(likelihood);
  const isCompletedScan = status === 'done' || status === 'completed';

  // If score is present OR scan marked done, show the percentage and tone!
  if (hasNumericScore || isCompletedScan) {
    const rawNum = hasNumericScore ? Number(likelihood) : null;
    const pct = rawNum !== null ? (rawNum <= 1 && rawNum > 0 ? Math.round(rawNum * 100) : Math.round(rawNum)) : null;

    let resolvedLevel = level;
    if (!resolvedLevel || resolvedLevel === 'unknown') {
      if (pct !== null) {
        resolvedLevel = pct >= 70 ? 'high' : pct >= 30 ? 'medium' : 'low';
      } else {
        resolvedLevel = 'unknown';
      }
    }

    const tone = getLevelTone(resolvedLevel);

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: size === 'sm' ? '3px 10px' : '5px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: size === 'sm' ? '0.8125rem' : '0.875rem',
          fontWeight: 700,
          fontFamily: 'var(--font-label)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: `var(${tone.colorVar})`,
          backgroundColor: tone.bgVar,
          border: `1px solid ${tone.borderVar}`,
          boxShadow: `0 0 10px ${tone.bgVar}`,
          whiteSpace: 'nowrap',
        }}
      >
        <span>{tone.shortLabel}</span>
        <span style={{ opacity: 0.6 }}>·</span>
        <span style={{ fontWeight: 800 }}>{pct !== null ? `${pct}%` : formatPercent(likelihood)}</span>
      </span>
    );
  }

  // Otherwise, render status pill (Pending, Scanning, Skipped, etc.)
  const statusConfig = getStatusTone(status || 'skipped');
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '3px 10px' : '5px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: size === 'sm' ? '0.8125rem' : '0.875rem',
        fontWeight: 600,
        fontFamily: 'var(--font-label)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: `var(${statusConfig.colorVar})`,
        backgroundColor: statusConfig.bgVar,
        border: `1px solid ${statusConfig.borderVar}`,
        whiteSpace: 'nowrap',
      }}
    >
      {(status === 'scanning' || status === 'processing') && '⏳ '}
      {statusConfig.shortLabel}
    </span>
  );
};

export default AiScoreBadge;

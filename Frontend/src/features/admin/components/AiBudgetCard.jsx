import React, { useState, useEffect } from 'react';
import { getAiDetectionStatus } from '../api/adminApi.js';
import useInterval from '../../common/hooks/useInterval.js';

export const AiBudgetCard = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await getAiDetectionStatus();
      if (res?.data?.data) {
        setStatus(res.data.data);
      }
    } catch {
      // Ignore background fetch errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Poll status every 15 seconds
  useInterval(fetchStatus, 15000);

  if (loading && !status) {
    return null;
  }

  const enabled = status?.enabled;
  const budget = status?.budget || {};
  const queue = status?.queue || {};
  const circuitBreaker = status?.circuitBreaker || {};

  const dailyPercent = budget.dailyLimit ? Math.round((budget.dailyUsage / budget.dailyLimit) * 100) : 0;
  const monthlyPercent = budget.monthlyLimit ? Math.round((budget.monthlyUsage / budget.monthlyLimit) * 100) : 0;

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-m)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-s)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--fs-card-title)' }}>
          AI Detection Quota & Queue
        </h3>
        <span
          style={{
            fontSize: 'var(--fs-label)',
            fontWeight: 600,
            textTransform: 'uppercase',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            color: enabled ? 'var(--color-success-green)' : 'var(--color-muted-text)',
            backgroundColor: enabled ? 'rgba(72, 224, 138, 0.12)' : 'rgba(170, 184, 208, 0.1)',
            border: `1px solid ${enabled ? 'rgba(72, 224, 138, 0.4)' : 'var(--border-subtle)'}`,
          }}
        >
          {enabled ? 'Active' : 'Disabled'}
        </span>
      </div>

      {circuitBreaker.open && (
        <div
          style={{
            padding: '6px 10px',
            background: 'rgba(255, 83, 100, 0.15)',
            border: '1px solid var(--color-error-red)',
            color: 'var(--color-error-red)',
            fontSize: 'var(--fs-small)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          ⚠️ Circuit breaker open! Sightengine requests temporarily paused until {new Date(circuitBreaker.until).toLocaleTimeString()}.
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-s)',
        }}
      >
        <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: 'var(--fs-label)', color: 'var(--text-secondary)' }}>Today's Operations</div>
          <div style={{ fontSize: 'var(--fs-card-title)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {budget.dailyUsage || 0} / {budget.dailyLimit || 500} ({dailyPercent}%)
          </div>
        </div>

        <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: 'var(--fs-label)', color: 'var(--text-secondary)' }}>Month's Operations</div>
          <div style={{ fontSize: 'var(--fs-card-title)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {budget.monthlyUsage || 0} / {budget.monthlyLimit || 2000} ({monthlyPercent}%)
          </div>
        </div>

        <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: 'var(--fs-label)', color: 'var(--text-secondary)' }}>Pending Scan Queue</div>
          <div style={{ fontSize: 'var(--fs-card-title)', fontWeight: 700, color: queue.pendingFiles > 0 ? 'var(--color-arcade-yellow)' : 'var(--color-electric-cyan)' }}>
            {queue.pendingFiles || 0} images ({queue.pendingSubmissions || 0} teams)
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiBudgetCard;

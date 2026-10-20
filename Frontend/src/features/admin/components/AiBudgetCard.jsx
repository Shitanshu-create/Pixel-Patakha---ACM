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
  const dailyUsage = status?.budget?.dailyUsage ?? status?.usage?.day?.used ?? 0;
  const dailyLimit = status?.budget?.dailyLimit ?? status?.usage?.day?.limit ?? 500;
  const monthlyUsage = status?.budget?.monthlyUsage ?? status?.usage?.month?.used ?? 0;
  const monthlyLimit = status?.budget?.monthlyLimit ?? status?.usage?.month?.limit ?? 2000;
  const pendingFiles = status?.queue?.pendingFiles ?? status?.queue?.pending ?? 0;
  const pendingSubmissions = status?.queue?.pendingSubmissions ?? 0;
  const circuitBreaker = status?.circuitBreaker || {};

  const dailyPercent = dailyLimit ? Math.round((dailyUsage / dailyLimit) * 100) : 0;
  const monthlyPercent = monthlyLimit ? Math.round((monthlyUsage / monthlyLimit) * 100) : 0;

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
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--fs-card-title)', color: 'var(--color-cloud-white)' }}>
          AI Detection Quota & Queue
        </h3>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: 'var(--font-label)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-sm)',
            color: enabled ? 'var(--color-success-green)' : 'var(--color-arcade-yellow)',
            backgroundColor: enabled ? 'rgba(72, 224, 138, 0.15)' : 'rgba(255, 226, 41, 0.12)',
            border: `1px solid ${enabled ? 'rgba(72, 224, 138, 0.4)' : 'rgba(255, 226, 41, 0.4)'}`,
          }}
        >
          {enabled ? 'Active' : 'Unconfigured'}
        </span>
      </div>

      {circuitBreaker.open && (
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(255, 83, 100, 0.15)',
            border: '1px solid var(--color-error-red)',
            color: 'var(--color-error-red)',
            fontSize: '0.8125rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          ⚠️ Circuit breaker open! Sightengine requests temporarily paused {circuitBreaker.until ? `until ${new Date(circuitBreaker.until).toLocaleTimeString()}` : ''}.
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-s)',
        }}
      >
        <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Today's Operations
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-cloud-white)' }}>
            {dailyUsage} / {dailyLimit} <span style={{ fontSize: '0.85rem', color: dailyPercent > 80 ? 'var(--color-error-red)' : 'var(--color-electric-cyan)' }}>({dailyPercent}%)</span>
          </div>
        </div>

        <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Month's Operations
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-cloud-white)' }}>
            {monthlyUsage} / {monthlyLimit} <span style={{ fontSize: '0.85rem', color: monthlyPercent > 80 ? 'var(--color-error-red)' : 'var(--color-electric-cyan)' }}>({monthlyPercent}%)</span>
          </div>
        </div>

        <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Pending Scan Queue
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: pendingFiles > 0 ? 'var(--color-arcade-yellow)' : 'var(--color-electric-cyan)' }}>
            {pendingFiles} images {pendingSubmissions > 0 ? `(${pendingSubmissions} teams)` : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiBudgetCard;

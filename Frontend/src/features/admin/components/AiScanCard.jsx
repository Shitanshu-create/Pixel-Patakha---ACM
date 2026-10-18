import React, { useState } from 'react';
import AiScoreMeter from '../../../components/ui/AiScoreMeter.jsx';
import AiScoreBadge from '../../../components/ui/AiScoreBadge.jsx';
import { rerunAiCheck } from '../api/adminApi.js';

export const AiScanCard = ({ submission, onScanUpdated }) => {
  const [rechecking, setRechecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const summary = submission?.aiDetectionSummary || {
    status: 'pending',
    overallLikelihood: null,
    level: 'unknown',
    scannedFiles: 0,
    totalFiles: submission?.files?.length || 0,
    highRiskCount: 0,
  };

  const handleRerun = async () => {
    try {
      setRechecking(true);
      setErrorMsg(null);
      await rerunAiCheck(submission._id);
      if (onScanUpdated) onScanUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to re-run AI check');
    } finally {
      setRechecking(false);
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-l)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-m)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-s)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--fs-card-title)' }}>
            AI Likelihood Analysis
          </h3>
          <AiScoreBadge
            status={summary.status}
            likelihood={summary.overallLikelihood}
            level={summary.level}
            size="md"
          />
        </div>

        <button
          onClick={handleRerun}
          disabled={rechecking}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-strong)',
            color: 'var(--color-electric-cyan)',
            padding: '6px 14px',
            fontSize: 'var(--fs-small)',
            fontFamily: 'var(--font-label)',
            cursor: rechecking ? 'not-allowed' : 'pointer',
            opacity: rechecking ? 0.6 : 1,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {rechecking ? 'Requesting Scan...' : '↻ Re-run AI Check'}
        </button>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(255, 83, 100, 0.1)',
            border: '1px solid var(--color-error-red)',
            color: 'var(--color-error-red)',
            fontSize: 'var(--fs-small)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {errorMsg}
        </div>
      )}

      <AiScoreMeter
        likelihood={summary.overallLikelihood}
        level={summary.level}
        size="lg"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 'var(--space-s)',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: 'var(--space-s) var(--space-m)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--fs-small)',
          color: 'var(--text-secondary)',
        }}
      >
        <div>
          Status: <strong style={{ color: 'var(--text-primary)' }}>{summary.status}</strong>
        </div>
        <div>
          Files Scanned: <strong style={{ color: 'var(--text-primary)' }}>{summary.scannedFiles} / {summary.totalFiles || submission?.files?.length || 0}</strong>
        </div>
        <div>
          High Risk Files: <strong style={{ color: summary.highRiskCount > 0 ? 'var(--color-error-red)' : 'var(--text-primary)' }}>{summary.highRiskCount || 0}</strong>
        </div>
      </div>

      {/* Per File AI Breakdown */}
      {submission?.files && submission.files.length > 0 && (
        <div style={{ marginTop: 'var(--space-xs)' }}>
          <h4 style={{ margin: '0 0 var(--space-s) 0', fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
            Per-File Analysis
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {submission.files.map((file, idx) => {
              const ai = file.aiDetection || { status: 'skipped', reason: 'not_scanned' };
              return (
                <div
                  key={file._id || idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--fs-small)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-xs)',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                    {file.originalName || file.filename}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
                    {ai.reason && (
                      <span style={{ fontSize: 'var(--fs-label)', color: 'var(--text-secondary)' }}>
                        ({ai.reason})
                      </span>
                    )}
                    <AiScoreBadge
                      status={ai.status}
                      likelihood={ai.likelihood}
                      level={ai.level}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiScanCard;

export const LEVEL_CONFIG = {
  high: {
    label: 'High AI Likelihood',
    shortLabel: 'High AI',
    tone: 'danger',
    colorVar: '--color-error-red',
    bgVar: 'rgba(255, 83, 100, 0.18)',
    borderVar: 'rgba(255, 83, 100, 0.6)',
  },
  review: {
    label: 'Needs Review',
    shortLabel: 'Review AI',
    tone: 'warning',
    colorVar: '--color-arcade-yellow',
    bgVar: 'rgba(255, 226, 41, 0.18)',
    borderVar: 'rgba(255, 226, 41, 0.6)',
  },
  medium: {
    label: 'Medium AI Likelihood',
    shortLabel: 'Medium AI',
    tone: 'warning',
    colorVar: '--color-arcade-yellow',
    bgVar: 'rgba(255, 226, 41, 0.18)',
    borderVar: 'rgba(255, 226, 41, 0.6)',
  },
  low: {
    label: 'Low AI Likelihood',
    shortLabel: 'Low AI',
    tone: 'success',
    colorVar: '--color-success-green',
    bgVar: 'rgba(72, 224, 138, 0.18)',
    borderVar: 'rgba(72, 224, 138, 0.6)',
  },
  unknown: {
    label: 'Unknown',
    shortLabel: 'Unknown',
    tone: 'neutral',
    colorVar: '--color-muted-text',
    bgVar: 'rgba(170, 184, 208, 0.12)',
    borderVar: 'var(--color-panel-border)',
  },
};

export const STATUS_CONFIG = {
  pending: {
    label: 'Scan Pending',
    shortLabel: 'Pending',
    tone: 'neutral',
    colorVar: '--color-muted-text',
    bgVar: 'rgba(170, 184, 208, 0.12)',
    borderVar: 'var(--color-panel-border)',
  },
  processing: {
    label: 'Processing...',
    shortLabel: 'Scanning',
    tone: 'cyan',
    colorVar: '--color-electric-cyan',
    bgVar: 'rgba(0, 217, 255, 0.18)',
    borderVar: 'rgba(0, 217, 255, 0.6)',
  },
  scanning: {
    label: 'Scanning...',
    shortLabel: 'Scanning',
    tone: 'cyan',
    colorVar: '--color-electric-cyan',
    bgVar: 'rgba(0, 217, 255, 0.18)',
    borderVar: 'rgba(0, 217, 255, 0.6)',
  },
  done: {
    label: 'Scan Complete',
    shortLabel: 'Complete',
    tone: 'success',
    colorVar: '--color-success-green',
    bgVar: 'rgba(72, 224, 138, 0.18)',
    borderVar: 'rgba(72, 224, 138, 0.6)',
  },
  completed: {
    label: 'Scan Complete',
    shortLabel: 'Complete',
    tone: 'success',
    colorVar: '--color-success-green',
    bgVar: 'rgba(72, 224, 138, 0.18)',
    borderVar: 'rgba(72, 224, 138, 0.6)',
  },
  failed: {
    label: 'Scan Failed',
    shortLabel: 'Failed',
    tone: 'danger',
    colorVar: '--color-error-red',
    bgVar: 'rgba(255, 83, 100, 0.18)',
    borderVar: 'rgba(255, 83, 100, 0.6)',
  },
  skipped: {
    label: 'Not Scanned',
    shortLabel: 'Skipped',
    tone: 'neutral',
    colorVar: '--color-muted-text',
    bgVar: 'rgba(170, 184, 208, 0.12)',
    borderVar: 'var(--color-panel-border)',
  },
};

export const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `${Math.round(val)}%`;
};

export const getLevelTone = (level) => {
  return LEVEL_CONFIG[level] || LEVEL_CONFIG.unknown;
};

export const getStatusTone = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.skipped;
};

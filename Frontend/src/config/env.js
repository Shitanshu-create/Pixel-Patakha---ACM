const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();

const resolveApiUrl = () => {
  if (!rawApiUrl) {
    return '/api';
  }
  // Strip trailing slashes
  const clean = rawApiUrl.replace(/\/+$/, '');
  // If user provided origin URL without /api, append /api automatically
  if (clean.startsWith('http') && !clean.endsWith('/api')) {
    return `${clean}/api`;
  }
  return clean;
};

export const API_URL = resolveApiUrl();
export const MIN_TEAM_SIZE = parseInt(import.meta.env.VITE_MIN_TEAM_SIZE || '1', 10);
export const MAX_TEAM_SIZE = parseInt(import.meta.env.VITE_MAX_TEAM_SIZE || '3', 10);
export const MAX_FILE_SIZE_MB = parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB || '10', 10);
export const MAX_FILES = parseInt(import.meta.env.VITE_MAX_FILES || '5', 10);

export default {
  API_URL,
  MIN_TEAM_SIZE,
  MAX_TEAM_SIZE,
  MAX_FILE_SIZE_MB,
  MAX_FILES,
};

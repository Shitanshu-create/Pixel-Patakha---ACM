import { ROUTES } from './routes.js';

export const LANDING_NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Rules', href: '#rules' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'FAQ', href: '#faq' },
];

export const TEAM_NAV_LINKS = [
  { label: 'Dashboard', to: ROUTES.TEAM_DASHBOARD, icon: 'grid' },
  { label: 'Submission', to: ROUTES.TEAM_SUBMISSION, icon: 'upload' },
];

export const JUDGE_NAV_LINKS = [
  { label: 'Submissions', to: ROUTES.JUDGE_SUBMISSIONS, icon: 'folder' },
  { label: 'My Reviews', to: ROUTES.JUDGE_REVIEWS, icon: 'star' },
];

export const ADMIN_NAV_LINKS = [
  { label: 'Overview', to: ROUTES.ADMIN_OVERVIEW, icon: 'chart' },
  { label: 'Teams', to: ROUTES.ADMIN_TEAMS, icon: 'users' },
  { label: 'Submissions', to: ROUTES.ADMIN_SUBMISSIONS, icon: 'folder' },
  { label: 'Judges', to: ROUTES.ADMIN_JUDGES, icon: 'award' },
  { label: 'Announcements', to: ROUTES.ADMIN_ANNOUNCEMENTS, icon: 'bell' },
  { label: 'Competition', to: ROUTES.ADMIN_COMPETITION, icon: 'settings' },
];

export default {
  LANDING_NAV_LINKS,
  TEAM_NAV_LINKS,
  JUDGE_NAV_LINKS,
  ADMIN_NAV_LINKS,
};

export const ROUTES = {
  LANDING: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  STAFF_LOGIN: '/staff/login',

  // Team
  TEAM_DASHBOARD: '/team',
  TEAM_SUBMISSION: '/team/submission',

  // Judge
  JUDGE_SUBMISSIONS: '/judge',
  JUDGE_REVIEW: '/judge/submissions/:id',
  JUDGE_REVIEWS: '/judge/reviews',

  // Admin
  ADMIN_OVERVIEW: '/admin',
  ADMIN_TEAMS: '/admin/teams',
  ADMIN_TEAM_DETAIL: '/admin/teams/:id',
  ADMIN_SUBMISSIONS: '/admin/submissions',
  ADMIN_SUBMISSION_DETAIL: '/admin/submissions/:id',
  ADMIN_JUDGES: '/admin/judges',
  ADMIN_ANNOUNCEMENTS: '/admin/announcements',
  ADMIN_COMPETITION: '/admin/competition',
};

export default ROUTES;

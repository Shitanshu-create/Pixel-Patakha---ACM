import { ROUTES } from '../../../config/routes.js';

export const getRoleHome = (role) => {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN_OVERVIEW;
    case 'judge':
      return ROUTES.JUDGE_SUBMISSIONS;
    case 'team':
      return ROUTES.TEAM_DASHBOARD;
    default:
      return ROUTES.LANDING;
  }
};

export default getRoleHome;

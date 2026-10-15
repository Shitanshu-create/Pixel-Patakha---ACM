import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getRoleHome } from '../utils/roleHome.js';
import Spinner from '../../../components/ui/Spinner.jsx';

export default function RoleRoute({ allowedRoles = [], children }) {
  const { role, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="lg" text="Verifying access..." showText />
      </div>
    );
  }

  const isStaffPath = allowedRoles.includes('admin') || allowedRoles.includes('judge');
  const loginPath = isStaffPath ? '/staff/login' : '/login';

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  const hasAccess = Array.isArray(allowedRoles)
    ? allowedRoles.includes(role)
    : role === allowedRoles;

  if (!hasAccess) {
    return <Navigate to={getRoleHome(role)} replace />;
  }

  return children || <Outlet />;
}

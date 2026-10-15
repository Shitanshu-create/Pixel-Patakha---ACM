import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getRoleHome } from '../utils/roleHome.js';
import Spinner from '../../../components/ui/Spinner.jsx';

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleHome(role)} replace />;
  }

  return children || <Outlet />;
}

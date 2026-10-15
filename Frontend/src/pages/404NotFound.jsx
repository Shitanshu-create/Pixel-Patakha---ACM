import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import PixelSprite from '../components/pixel/PixelSprite.jsx';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import { getRoleHome } from '../features/auth/utils/roleHome.js';
import useDocumentTitle from '../features/common/hooks/useDocumentTitle.js';
import '../styles/404NotFound.css';

export default function NotFoundPage() {
  useDocumentTitle('Level Not Found (404)');
  const { role, isAuthenticated } = useAuth();
  const returnUrl = isAuthenticated ? getRoleHome(role) : '/';

  return (
    <div className="not-found-page">
      <Card accent="pink" className="not-found-card">
        <PixelSprite name="invader" size={54} />
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">LEVEL NOT FOUND</h1>
        <p className="not-found-desc">
          You drifted into the cosmic void! The route you are trying to visit does not exist in this realm.
        </p>

        <Button to={returnUrl} variant="primary" size="md">
          {isAuthenticated ? 'Return to Dashboard' : 'Return to Home Base'}
        </Button>
      </Card>
    </div>
  );
}

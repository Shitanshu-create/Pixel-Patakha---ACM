import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import FormField from '../../../components/ui/FormField.jsx';
import Input from '../../../components/ui/Input.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getRoleHome } from '../utils/roleHome.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { ROUTES } from '../../../config/routes.js';
import '../styles/auth.css';

export default function StaffLoginPage() {
  useDocumentTitle('Staff Login');
  const navigate = useNavigate();
  const { loginStaff } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide your staff email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await loginStaff({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate(getRoleHome(user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Staff authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <Card accent="purple">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-s)' }}>
            <Badge tone="purple" icon="★">
              ADMIN & JUDGES
            </Badge>
          </div>
          <h1 className="auth-header__title">Official Staff Portal</h1>
          <p className="auth-header__subtitle">
            Restricted entry for designated judges and competition administrators.
          </p>
        </div>

        {error && (
          <Alert variant="error" title="Access Denied" style={{ marginBottom: 'var(--space-l)' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <FormField id="staff-email" label="Staff Email Address" required>
            <Input
              id="staff-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@pixelpatakha.com"
              autoComplete="username"
              required
            />
          </FormField>

          <FormField id="staff-password" label="Account Password" required>
            <Input
              id="staff-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </FormField>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={isSubmitting}
            fullWidth
            style={{ marginTop: 'var(--space-m)' }}
          >
            Authenticate & Proceed
          </Button>
        </form>

        <div className="auth-footer-links">
          <span>
            Participant team? <Link to={ROUTES.LOGIN}>Team Login</Link>
          </span>
          <span>
            Need to register? <Link to={ROUTES.REGISTER}>Register Team</Link>
          </span>
        </div>
      </Card>
    </div>
  );
}

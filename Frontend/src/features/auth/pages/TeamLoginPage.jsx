import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import FormField from '../../../components/ui/FormField.jsx';
import Input from '../../../components/ui/Input.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { useAuth } from '../hooks/useAuth.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { ROUTES } from '../../../config/routes.js';
import '../styles/auth.css';

export default function TeamLoginPage() {
  useDocumentTitle('Team Login');
  const navigate = useNavigate();
  const location = useLocation();
  const { loginTeam } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || ROUTES.TEAM_DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both leader email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginTeam({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <Card accent="cyan">
        <div className="auth-header">
          <h1 className="auth-header__title">Team Portal Login</h1>
          <p className="auth-header__subtitle">
            Enter your team leader credentials to access your dashboard.
          </p>
        </div>

        {error && (
          <Alert variant="error" title="Login Error" style={{ marginBottom: 'var(--space-l)' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <FormField id="login-email" label="Leader Email Address" required>
            <Input
              id="login-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="leader@college.edu"
              autoComplete="username"
              required
            />
          </FormField>

          <FormField id="login-password" label="Team Password" required>
            <Input
              id="login-password"
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
            variant="primary"
            size="lg"
            loading={isSubmitting}
            fullWidth
            style={{ marginTop: 'var(--space-m)' }}
          >
            Access Dashboard
          </Button>
        </form>

        <div className="auth-footer-links" style={{ justifyContent: 'center' }}>
          <span>
            Don&apos;t have a team yet? <Link to={ROUTES.REGISTER}>Register Team</Link>
          </span>
        </div>
      </Card>
    </div>
  );
}

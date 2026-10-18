import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import FormField from '../../../components/ui/FormField.jsx';
import Input from '../../../components/ui/Input.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import MemberFields from '../components/MemberFields.jsx';
import { useAuth } from '../hooks/useAuth.js';
import useCompetition from '../../common/hooks/useCompetition.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { getRegistrationStatus } from '../../common/utils/windowStatus.js';
import { validateTeamRegistration } from '../utils/validators.js';
import { MIN_TEAM_SIZE, MAX_TEAM_SIZE } from '../../../config/env.js';
import { ROUTES } from '../../../config/routes.js';
import '../styles/auth.css';

export default function TeamRegisterPage() {
  useDocumentTitle('Team Registration');
  const navigate = useNavigate();
  const { registerTeam, adoptSession } = useAuth();
  const { competition, loading: compLoading, error: compError, refetch: refetchComp } = useCompetition();

  const [formData, setFormData] = useState({
    teamName: '',
    college: '',
    leaderEmail: '',
    password: '',
    confirmPassword: '',
    members: [{ name: '', email: '', phone: '' }],
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  const regStatus = getRegistrationStatus(competition);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Keep leader email in sync with members[0].email
      ...(field === 'leaderEmail' && prev.members.length > 0
        ? {
            members: [
              { ...prev.members[0], email: value },
              ...prev.members.slice(1),
            ],
          }
        : {}),
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleMembersChange = (members) => {
    setFormData((prev) => ({
      ...prev,
      members,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    const { isValid, errors } = validateTeamRegistration({
      ...formData,
      minTeamSize: MIN_TEAM_SIZE,
      maxTeamSize: MAX_TEAM_SIZE,
    });

    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        teamName: formData.teamName.trim(),
        college: formData.college.trim(),
        leaderEmail: formData.leaderEmail.trim().toLowerCase(),
        password: formData.password,
        members: formData.members.map((m, idx) => ({
          name: m.name.trim(),
          email: idx === 0 ? formData.leaderEmail.trim().toLowerCase() : m.email.trim().toLowerCase(),
          phone: m.phone.trim(),
        })),
      };

      const team = await registerTeam(payload);
      setRegisteredSuccess(team);
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors(err.fieldErrors);
      }
      setGeneralError(err.message || 'Registration failed. Please review your entries.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <Spinner size="lg" text="Checking competition window..." showText />
      </div>
    );
  }

  // Server error state
  if (compError && !competition) {
    return (
      <div className="auth-container">
        <Card accent="pink">
          <div className="auth-header">
            <h1 className="auth-header__title" style={{ color: 'var(--color-pixel-pink)' }}>
              Connection Error
            </h1>
            <p className="auth-header__subtitle">
              Unable to connect to the competition server.
            </p>
          </div>
          <Alert variant="error" title="Server Offline">
            {compError?.message || 'Cannot reach API. Ensure backend is running.'}
          </Alert>
          <div style={{ marginTop: 'var(--space-l)', textAlign: 'center' }}>
            <Button onClick={() => refetchComp()} variant="primary">
              Retry Connection
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Registration closed state
  if (!regStatus.isOpen) {
    return (
      <div className="auth-container">
        <Card accent="pink">
          <div className="auth-header">
            <h1 className="auth-header__title" style={{ color: 'var(--color-pixel-pink)' }}>
              Registration Locked
            </h1>
            <p className="auth-header__subtitle">
              {regStatus.reason}
            </p>
          </div>
          <Alert variant="warning" title="Notice">
            The registration window is currently closed. If you believe this is in error, please contact the event organizers.
          </Alert>
          <div style={{ marginTop: 'var(--space-l)', textAlign: 'center' }}>
            <Button to={ROUTES.LOGIN} variant="primary">
              Already Registered? Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Registration success state
  if (registeredSuccess) {
    const successTeam = registeredSuccess.team || registeredSuccess;
    return (
      <div className="auth-container">
        <Card accent="yellow">
          <div className="auth-header">
            <h1 className="auth-header__title" style={{ color: 'var(--color-arcade-yellow)' }}>
              Quest Accepted!
            </h1>
            <p className="auth-header__subtitle">
              Team &quot;{successTeam.teamName}&quot; is officially registered for PIXEL PATAKHA.
            </p>
          </div>

          <Alert variant="success" title="Registration Confirmed">
            Your login session is active. You can now access your dashboard to view competition announcements and prepare for your design submission.
          </Alert>

          <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                adoptSession(registeredSuccess);
                navigate(ROUTES.TEAM_DASHBOARD);
              }}
            >
              Go To Dashboard →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-container auth-container--wide">
      <Card accent="cyan">
        <div className="auth-header">
          <h1 className="auth-header__title">Register Your Team</h1>
          <p className="auth-header__subtitle">
            Create your squad of 1–3 designers for PIXEL PATAKHA &apos;26.
          </p>
        </div>

        {generalError && (
          <Alert variant="error" title="Registration Error" style={{ marginBottom: 'var(--space-l)' }}>
            {generalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Team Info */}
          <div className="form-grid-2">
            <FormField
              id="teamName"
              label="Team Name"
              required
              hint="Unique name that will appear on the leaderboard"
              error={fieldErrors.teamName}
            >
              <Input
                id="teamName"
                value={formData.teamName}
                onChange={(e) => handleInputChange('teamName', e.target.value)}
                placeholder="e.g. CyberPixels"
                error={!!fieldErrors.teamName}
              />
            </FormField>

            <FormField
              id="college"
              label="College / Institution"
              required
              hint="Your college or university name"
              error={fieldErrors.college}
            >
              <Input
                id="college"
                value={formData.college}
                onChange={(e) => handleInputChange('college', e.target.value)}
                placeholder="e.g. Bharati Vidyapeeth College of Engineering"
                error={!!fieldErrors.college}
              />
            </FormField>
          </div>

          {/* Leader Credentials */}
          <div className="form-grid-3">
            <FormField
              id="leaderEmail"
              label="Leader Email (Login ID)"
              required
              hint="Used as primary team login"
              error={fieldErrors.leaderEmail}
            >
              <Input
                id="leaderEmail"
                type="email"
                value={formData.leaderEmail}
                onChange={(e) => handleInputChange('leaderEmail', e.target.value)}
                placeholder="leader@college.edu"
                error={!!fieldErrors.leaderEmail}
              />
            </FormField>

            <FormField
              id="password"
              label="Password"
              required
              hint="Minimum 6 characters"
              error={fieldErrors.password}
            >
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                error={!!fieldErrors.password}
              />
            </FormField>

            <FormField
              id="confirmPassword"
              label="Confirm Password"
              required
              error={fieldErrors.confirmPassword}
            >
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                error={!!fieldErrors.confirmPassword}
              />
            </FormField>
          </div>

          {/* Members Roster */}
          <MemberFields
            members={formData.members}
            onChange={handleMembersChange}
            leaderEmail={formData.leaderEmail}
            minTeamSize={MIN_TEAM_SIZE}
            maxTeamSize={MAX_TEAM_SIZE}
            fieldErrors={fieldErrors}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            fullWidth
            style={{ marginTop: 'var(--space-l)' }}
          >
            Complete Registration
          </Button>
        </form>

        <div className="auth-footer-links">
          <span>
            Already registered? <Link to={ROUTES.LOGIN}>Team Login</Link>
          </span>
          <span>
            Judge or Administrator? <Link to={ROUTES.STAFF_LOGIN}>Staff Portal</Link>
          </span>
        </div>
      </Card>
    </div>
  );
}

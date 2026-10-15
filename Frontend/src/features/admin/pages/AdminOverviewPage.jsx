import { useState, useEffect } from 'react';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import StatCard from '../../../components/ui/StatCard.jsx';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import { getTeams, getSubmissions, getJudges } from '../api/adminApi.js';
import useCompetition from '../../common/hooks/useCompetition.js';
import { getRegistrationStatus, getSubmissionStatus } from '../../common/utils/windowStatus.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { ROUTES } from '../../../config/routes.js';
import '../styles/admin.css';

export default function AdminOverviewPage() {
  useDocumentTitle('Admin Overview');
  const { competition } = useCompetition();

  const [stats, setStats] = useState({
    teamsCount: 0,
    submissionsCount: 0,
    judgesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [teamsRes, subsRes, judgesRes] = await Promise.all([
        getTeams({ page: 1, limit: 1 }),
        getSubmissions(),
        getJudges(),
      ]);

      setStats({
        teamsCount: teamsRes?.pagination?.total || teamsRes?.teams?.length || 0,
        submissionsCount: subsRes?.length || 0,
        judgesCount: judgesRes?.length || 0,
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const regStatus = getRegistrationStatus(competition);
  const subStatus = getSubmissionStatus(competition);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading admin analytics..." showText />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load admin stats" onRetry={fetchStats} />;
  }

  return (
    <div className="admin-overview-page">
      <PageHeader
        title="Command Center"
        subtitle="Live metrics, window toggles, and participant oversight for PIXEL PATAKHA."
      >
        <Button to={ROUTES.ADMIN_COMPETITION} variant="primary" size="sm">
          ⚙ Edit Windows
        </Button>
      </PageHeader>

      <div className="admin-stats-grid">
        <StatCard
          label="Registered Teams"
          value={stats.teamsCount}
          icon="👥"
          tone="cyan"
        />
        <StatCard
          label="Design Submissions"
          value={stats.submissionsCount}
          icon="📁"
          tone="yellow"
        />
        <StatCard
          label="Authorized Judges"
          value={stats.judgesCount}
          icon="⚖"
          tone="purple"
        />
        <StatCard
          label="Prize Pool"
          value="₹1,00,000"
          icon="★"
          tone="green"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-l)', marginBottom: 'var(--space-xl)' }}>
        <Card accent="cyan">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-m)' }}>
            Competition Windows
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-m)' }}>
            <div style={{ padding: 'var(--space-m)', background: 'var(--color-deep-navy)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)' }}>
                  TEAM REGISTRATION
                </span>
                <Badge tone={regStatus.isOpen ? 'green' : 'pink'}>
                  {regStatus.isOpen ? 'OPEN' : 'CLOSED'}
                </Badge>
              </div>
              <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-primary)' }}>
                {regStatus.isOpen ? 'Teams can register' : regStatus.reason}
              </p>
            </div>

            <div style={{ padding: 'var(--space-m)', background: 'var(--color-deep-navy)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)' }}>
                  DESIGN SUBMISSIONS
                </span>
                <Badge tone={subStatus.isOpen ? 'green' : 'pink'}>
                  {subStatus.isOpen ? 'OPEN' : 'CLOSED'}
                </Badge>
              </div>
              <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-primary)' }}>
                {subStatus.isOpen ? 'Teams can submit designs' : subStatus.reason}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

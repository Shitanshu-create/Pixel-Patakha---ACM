import PageHeader from '../../../components/ui/PageHeader.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import RegistrationSummary from '../components/RegistrationSummary.jsx';
import SubmissionStatusCard from '../components/SubmissionStatusCard.jsx';
import AnnouncementsFeed from '../components/AnnouncementsFeed.jsx';
import useTeamProfile from '../hooks/useTeamProfile.js';
import useCompetition from '../../common/hooks/useCompetition.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { getSubmissionStatus } from '../../common/utils/windowStatus.js';
import '../styles/team.css';

export default function TeamDashboardPage() {
  useDocumentTitle('Team Dashboard');
  const { team, submission, loading: teamLoading, error: teamError, refetch } = useTeamProfile();
  const { competition } = useCompetition();

  const subStatus = getSubmissionStatus(competition);

  if (teamLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading team dashboard..." showText />
      </div>
    );
  }

  if (teamError) {
    return <ErrorState title="Failed to load dashboard" onRetry={refetch} />;
  }

  return (
    <div className="team-dashboard-page">
      <PageHeader
        title={`Welcome, Team ${team?.teamName || ''}!`}
        subtitle="Manage your squad roster, monitor submission windows, and read official updates."
      />

      <div className="status-cards-row">
        <SubmissionStatusCard
          submission={submission}
          isWindowOpen={subStatus.isOpen}
          submissionDeadline={competition?.submissionDeadline}
        />
      </div>

      <div className="dashboard-grid">
        <div>
          <RegistrationSummary team={team} />
        </div>

        <div>
          <AnnouncementsFeed />
        </div>
      </div>
    </div>
  );
}

import PageHeader from '../../../components/ui/PageHeader.jsx';
import Card from '../../../components/ui/Card.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import SubmissionView from '../components/SubmissionView.jsx';
import SubmissionForm from '../components/SubmissionForm.jsx';
import useMySubmission from '../hooks/useMySubmission.js';
import useCompetition from '../../common/hooks/useCompetition.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { getSubmissionStatus } from '../../common/utils/windowStatus.js';
import { useToast } from '../../common/context/ToastContext.jsx';
import '../styles/team.css';

export default function SubmissionPage() {
  useDocumentTitle('Design Submission');
  const toast = useToast();
  const { submission, loading: subLoading, error: subError, refetch } = useMySubmission();
  const { competition, loading: compLoading } = useCompetition();

  const subStatus = getSubmissionStatus(competition);

  if (subLoading || compLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading submission portal..." showText />
      </div>
    );
  }

  if (subError) {
    return <ErrorState title="Failed to load submission info" onRetry={refetch} />;
  }

  const handleSuccess = () => {
    toast.success('Your design submission has been recorded!');
    refetch();
  };

  return (
    <div className="submission-page">
      <PageHeader
        title="Competition Submission"
        subtitle="Upload and manage your final design presentation and assets."
      />

      {/* Case 1: Already submitted */}
      {submission ? (
        <SubmissionView submission={submission} />
      ) : !subStatus.isOpen ? (
        /* Case 2: Submissions closed */
        <Card accent="pink">
          <div style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-m)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-pixel-pink)', marginBottom: 'var(--space-s)' }}>
              Submissions Are Currently Closed
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto var(--space-l)' }}>
              {subStatus.reason}
            </p>
            <Alert variant="warning" title="Notice">
              Submissions will open after the problem statement release. Monitor announcements on your dashboard for live updates.
            </Alert>
          </div>
        </Card>
      ) : (
        /* Case 3: Open for submission */
        <SubmissionForm onSuccess={handleSuccess} />
      )}
    </div>
  );
}

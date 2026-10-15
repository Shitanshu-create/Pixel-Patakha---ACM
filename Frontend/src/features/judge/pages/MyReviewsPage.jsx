import PageHeader from '../../../components/ui/PageHeader.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import useMyReviews from '../hooks/useMyReviews.js';
import { formatDate } from '../../common/utils/formatDate.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';

export default function MyReviewsPage() {
  useDocumentTitle('My Reviews');
  const { reviews, loading, error, refetch } = useMyReviews();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading your submitted reviews..." showText />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load reviews" onRetry={refetch} />;
  }

  const columns = [
    {
      key: 'teamName',
      label: 'Team Name',
      render: (r) => <strong>{r.submission?.teamName || '—'}</strong>,
    },
    {
      key: 'title',
      label: 'Submission Title',
      render: (r) => r.submission?.title || '—',
    },
    {
      key: 'score',
      label: 'Score Given',
      render: (r) => (
        <Badge tone={r.score >= 80 ? 'green' : r.score >= 50 ? 'yellow' : 'pink'}>
          {r.score} / 100
        </Badge>
      ),
    },
    {
      key: 'feedback',
      label: 'Feedback',
      render: (r) => (
        <div style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.feedback}>
          {r.feedback}
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Evaluated',
      render: (r) => formatDate(r.updatedAt || r.createdAt),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (r) => (
        <Button to={`/judge/submissions/${r.submission?._id || r.submission}`} variant="ghost" size="sm">
          Edit Score ↗
        </Button>
      ),
    },
  ];

  return (
    <div className="my-reviews-page">
      <PageHeader
        title="My Evaluated Submissions"
        subtitle="Complete record of all scores and qualitative remarks you have submitted."
      />

      {!reviews || reviews.length === 0 ? (
        <EmptyState
          title="No Reviews Submitted Yet"
          description="Go to the Submissions Queue to begin reviewing and scoring designs."
          icon="★"
          action={
            <Button to="/judge" variant="primary" size="md">
              Open Submissions Queue
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={reviews}
          keyExtractor={(r) => r._id}
        />
      )}
    </div>
  );
}

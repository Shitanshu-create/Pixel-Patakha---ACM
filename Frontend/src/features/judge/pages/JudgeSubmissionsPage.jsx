import { useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import JudgeSubmissionCard from '../components/JudgeSubmissionCard.jsx';
import useJudgeSubmissions from '../hooks/useJudgeSubmissions.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import '../styles/judge.css';

export default function JudgeSubmissionsPage() {
  useDocumentTitle('Judge Submissions');
  const { submissions, loading, error, refetch } = useJudgeSubmissions();
  const [filter, setFilter] = useState('all'); // all | pending | reviewed

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading submissions for judging..." showText />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load submissions" onRetry={refetch} />;
  }

  const filtered = (submissions || []).filter((sub) => {
    if (filter === 'pending') return !sub.hasReviewed;
    if (filter === 'reviewed') return sub.hasReviewed;
    return true;
  });

  const pendingCount = (submissions || []).filter((s) => !s.hasReviewed).length;
  const reviewedCount = (submissions || []).filter((s) => s.hasReviewed).length;

  return (
    <div className="judge-submissions-page">
      <PageHeader
        title="Submissions Queue"
        subtitle="Review participant designs, examine files, and submit official evaluations."
      />

      <div className="filter-bar">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({submissions?.length || 0})
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === 'reviewed' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('reviewed')}
        >
          Reviewed ({reviewedCount})
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Submissions Match Filter"
          description="Submissions uploaded by registered teams will appear here automatically."
          icon="📁"
        />
      ) : (
        <div className="judge-submissions-grid">
          {filtered.map((sub) => (
            <JudgeSubmissionCard key={sub._id} submission={sub} />
          ))}
        </div>
      )}
    </div>
  );
}

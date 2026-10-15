import { useParams } from 'react-router-dom';
import useAsync from '../../common/hooks/useAsync.js';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import FilePreviewGrid from '../../judge/components/FilePreviewGrid.jsx';
import { getSubmissionById } from '../api/adminApi.js';
import { formatDate } from '../../common/utils/formatDate.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { ROUTES } from '../../../config/routes.js';

export default function SubmissionDetailPage() {
  const { id } = useParams();
  useDocumentTitle('Submission Evaluation');

  const { data: submission, loading, error, refetch: fetchDetail } = useAsync(
    () => getSubmissionById(id),
    true,
    [id]
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading submission breakdown..." showText />
      </div>
    );
  }

  if (error || !submission) {
    return <ErrorState title="Submission not found" onRetry={fetchDetail} />;
  }

  return (
    <div className="admin-submission-detail-page">
      <div style={{ marginBottom: 'var(--space-m)' }}>
        <Button to={ROUTES.ADMIN_SUBMISSIONS} variant="ghost" size="sm">
          ← Back to Submissions Leaderboard
        </Button>
      </div>

      <PageHeader
        title={submission.title}
        subtitle={`Submitted by Team "${submission.teamName}" on ${formatDate(submission.submittedAt)}`}
      >
        <div style={{ display: 'flex', gap: 'var(--space-s)', alignItems: 'center' }}>
          <Badge tone="cyan">
            {submission.reviews?.length || 0} Judge Reviews
          </Badge>
          <Badge tone={submission.averageScore >= 80 ? 'green' : submission.averageScore >= 50 ? 'yellow' : 'pink'}>
            Average: {submission.averageScore !== null ? `${submission.averageScore} / 100` : 'Unrated'}
          </Badge>
        </div>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-xl)' }}>
        {/* Judge Reviews Breakdown */}
        <Card accent="yellow">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-m)' }}>
            Judge Evaluation Breakdown
          </h3>

          {!submission.reviews || submission.reviews.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-body)' }}>
              No judges have evaluated this submission yet.
            </p>
          ) : (
            <div className="reviews-summary-list">
              {submission.reviews.map((rev) => (
                <div key={rev._id} className="review-item-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                    <div>
                      <strong style={{ color: 'var(--color-cloud-white)' }}>
                        {rev.judge?.name || 'Judge'}
                      </strong>
                      <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)', marginLeft: 'var(--space-s)' }}>
                        ({rev.judge?.email || 'verified'})
                      </span>
                    </div>

                    <Badge tone={rev.score >= 80 ? 'green' : rev.score >= 50 ? 'yellow' : 'pink'}>
                      Score: {rev.score} / 100
                    </Badge>
                  </div>

                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-primary)', lineHeight: 1.5, margin: 'var(--space-s) 0' }}>
                    &ldquo;{rev.feedback}&rdquo;
                  </p>

                  <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)' }}>
                    Reviewed on {formatDate(rev.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Project Description */}
        {submission.description && (
          <Card accent="cyan">
            <h4 style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--fs-label)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
              DESCRIPTION & REFERENCES
            </h4>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 'var(--fs-body)' }}>
              {submission.description}
            </p>
          </Card>
        )}

        {/* Assets Gallery */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-m)' }}>
            Uploaded Mockups & Files ({submission.files?.length || 0})
          </h3>
          <FilePreviewGrid files={submission.files || []} />
        </div>
      </div>
    </div>
  );
}

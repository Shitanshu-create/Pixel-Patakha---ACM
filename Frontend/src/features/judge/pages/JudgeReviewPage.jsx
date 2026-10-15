import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import FilePreviewGrid from '../components/FilePreviewGrid.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import { getSubmissionById, getReviews } from '../api/judgeApi.js';
import { formatDate } from '../../common/utils/formatDate.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { ROUTES } from '../../../config/routes.js';
import '../styles/judge.css';

export default function JudgeReviewPage() {
  const { id } = useParams();
  useDocumentTitle('Score Submission');

  const [submission, setSubmission] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [subData, reviewsData] = await Promise.all([
        getSubmissionById(id),
        getReviews(),
      ]);
      setSubmission(subData);

      const foundReview = reviewsData?.find((r) => {
        const subId = r.submission?._id || r.submission;
        return subId === id;
      });
      setExistingReview(foundReview || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading submission details..." showText />
      </div>
    );
  }

  if (error || !submission) {
    return <ErrorState title="Failed to load submission" onRetry={fetchData} />;
  }

  return (
    <div className="judge-review-page">
      <div style={{ marginBottom: 'var(--space-m)' }}>
        <Button to={ROUTES.JUDGE_SUBMISSIONS} variant="ghost" size="sm">
          ← Back to Submissions Queue
        </Button>
      </div>

      <PageHeader
        title={submission.title}
        subtitle={`Submitted by Team "${submission.teamName}" on ${formatDate(submission.submittedAt)}`}
      >
        <Badge tone={existingReview ? 'green' : 'yellow'}>
          {existingReview ? `Reviewed: ${existingReview.score}/100` : 'Pending Review'}
        </Badge>
      </PageHeader>

      <div className="judge-review-split">
        {/* Left: Project Details & File Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-l)' }}>
          {submission.description && (
            <Card accent="cyan">
              <h4 style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--fs-label)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                PROJECT DESCRIPTION & REFERENCES
              </h4>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 'var(--fs-body)' }}>
                {submission.description}
              </div>
            </Card>
          )}

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-m)' }}>
              Design Assets ({submission.files?.length || 0})
            </h3>
            <FilePreviewGrid files={submission.files || []} />
          </div>
        </div>

        {/* Right: Review Form */}
        <div>
          <ReviewForm
            submissionId={id}
            initialReview={existingReview}
            onReviewSubmitted={(res) => {
              setExistingReview(res.review || res);
            }}
          />
        </div>
      </div>
    </div>
  );
}

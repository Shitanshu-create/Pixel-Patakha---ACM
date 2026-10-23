import { useParams } from 'react-router-dom';
import useAsync from '../../common/hooks/useAsync.js';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import FilePreviewGrid from '../components/FilePreviewGrid.jsx';
import AiScoreMeter from '../../../components/ui/AiScoreMeter.jsx';
import AiScoreBadge from '../../../components/ui/AiScoreBadge.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import { getSubmissionById, getReviews } from '../api/judgeApi.js';
import { formatDate } from '../../common/utils/formatDate.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { extractUrls, ClickableLinkPill, LinkifiedText } from '../../common/utils/linkUtils.jsx';
import { ROUTES } from '../../../config/routes.js';
import '../styles/judge.css';

export default function JudgeReviewPage() {
  const { id } = useParams();
  useDocumentTitle('Score Submission');

  const { data, loading, error, refetch: fetchData } = useAsync(async () => {
    const [subData, reviewsData] = await Promise.all([
      getSubmissionById(id),
      getReviews(),
    ]);

    const foundReview = reviewsData?.find((r) => {
      const subId = r.submission?._id || r.submission;
      return subId === id;
    });

    return {
      submission: subData,
      existingReview: foundReview || null,
    };
  }, true, [id]);

  const submission = data?.submission || null;
  const existingReview = data?.existingReview || null;

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

  const aiSummary = submission.aiDetectionSummary;

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
          {/* AI Likelihood Assessment Card */}
          {aiSummary && (
            <Card accent={aiSummary.level === 'high' ? 'pink' : aiSummary.level === 'medium' ? 'yellow' : 'cyan'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-s)', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--fs-card-title)' }}>
                  AI Generation Likelihood
                </h4>
                <AiScoreBadge
                  status={aiSummary.status}
                  likelihood={aiSummary.overallLikelihood}
                  level={aiSummary.level}
                  size="md"
                />
              </div>

              <AiScoreMeter
                likelihood={aiSummary.overallLikelihood}
                level={aiSummary.level}
                size="md"
              />

              <p
                style={{
                  margin: 'var(--space-s) 0 0 0',
                  fontSize: 'var(--fs-label-xs)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  fontFamily: 'var(--font-label)',
                }}
              >
                ℹ <em>Advisory Note:</em> AI Likelihood is an automated heuristic provided to assist your evaluation. High likelihood does not automatically disqualify an entry; verify originality, creative execution, and consistency across mockups.
              </p>
            </Card>
          )}

          {/* Project & Prototype Links */}
          {(() => {
            const links = extractUrls(submission.workLinks, submission.description);
            if (links.length === 0) return null;
            return (
              <Card accent="cyan">
                <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-electric-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-s)' }}>
                  🔗 PROJECT & PROTOTYPE LINKS ({links.length})
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)', flexWrap: 'wrap' }}>
                  {links.map((lnk, idx) => (
                    <ClickableLinkPill key={idx} link={lnk} size="md" />
                  ))}
                </div>
              </Card>
            );
          })()}

          {submission.description && (
            <Card accent="purple">
              <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-xs)' }}>
                PROJECT DESCRIPTION & REFERENCES
              </h4>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 'var(--fs-body)' }}>
                <LinkifiedText text={submission.description} />
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
            onReviewSubmitted={() => {
              fetchData();
            }}
          />
        </div>
      </div>
    </div>
  );
}

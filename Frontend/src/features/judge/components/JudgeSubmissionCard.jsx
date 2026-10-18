import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import AiScoreBadge from '../../../components/ui/AiScoreBadge.jsx';
import { formatDate } from '../../common/utils/formatDate.js';

export default function JudgeSubmissionCard({ submission }) {
  const isReviewed = submission.hasReviewed;
  const aiSummary = submission.aiDetectionSummary;

  return (
    <Card
      accent={isReviewed ? 'green' : 'cyan'}
      className="judge-submission-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-label)' }}>
          TEAM: {submission.teamName}
        </span>
        <Badge tone={isReviewed ? 'green' : 'yellow'}>
          {isReviewed ? `Score: ${submission.judgeScore}` : 'Pending Review'}
        </Badge>
      </div>

      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)', marginBottom: '4px' }}>
          {submission.title}
        </h3>
        <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)' }}>
          Submitted: {formatDate(submission.submittedAt)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-m)', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
          <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--color-electric-cyan)' }}>
            {submission.files?.length || 0} File(s)
          </span>
          {aiSummary && (
            <AiScoreBadge
              status={aiSummary.status}
              likelihood={aiSummary.overallLikelihood}
              level={aiSummary.level}
              size="sm"
            />
          )}
        </div>
        <Button to={`/judge/submissions/${submission._id}`} variant={isReviewed ? 'secondary' : 'primary'} size="sm">
          {isReviewed ? 'Edit Review' : 'Score Submission'}
        </Button>
      </div>
    </Card>
  );
}

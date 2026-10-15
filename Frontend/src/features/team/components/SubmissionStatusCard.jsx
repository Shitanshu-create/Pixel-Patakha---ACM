import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import { ROUTES } from '../../../config/routes.js';
import { formatDate } from '../../common/utils/formatDate.js';

export default function SubmissionStatusCard({ submission, isWindowOpen, submissionDeadline }) {
  const isSubmitted = !!submission;

  return (
    <Card accent={isSubmitted ? 'green' : isWindowOpen ? 'yellow' : 'pink'}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-s)' }}>
        <span style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)' }}>
          SUBMISSION STATUS
        </span>
        <Badge tone={isSubmitted ? 'green' : isWindowOpen ? 'yellow' : 'pink'}>
          {isSubmitted ? 'Submitted' : isWindowOpen ? 'Window Open' : 'Closed'}
        </Badge>
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-xs)' }}>
        {isSubmitted ? submission.title : isWindowOpen ? 'Ready For Upload' : 'Submission Portal Locked'}
      </h3>

      <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)', marginBottom: 'var(--space-m)' }}>
        {isSubmitted
          ? `Submitted on ${formatDate(submission.submittedAt)}`
          : isWindowOpen
          ? `Upload window is active until ${submissionDeadline ? formatDate(submissionDeadline) : 'deadline'}`
          : 'Submissions are currently locked by the organizers.'}
      </p>

      {isSubmitted ? (
        <Button to={ROUTES.TEAM_SUBMISSION} variant="secondary" size="sm" fullWidth>
          View Submitted Files
        </Button>
      ) : isWindowOpen ? (
        <Button to={ROUTES.TEAM_SUBMISSION} variant="primary" size="sm" fullWidth>
          Submit Design Now
        </Button>
      ) : (
        <Button to={ROUTES.TEAM_SUBMISSION} variant="ghost" size="sm" fullWidth disabled>
          Submissions Locked
        </Button>
      )}
    </Card>
  );
}

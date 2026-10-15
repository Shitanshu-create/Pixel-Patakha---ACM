import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { formatDate } from '../../common/utils/formatDate.js';
import { formatFileSize } from '../../common/utils/formatFileSize.js';

export default function SubmissionView({ submission }) {
  if (!submission) return null;

  return (
    <Card accent="green">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-m)', flexWrap: 'wrap', gap: 'var(--space-s)' }}>
        <div>
          <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--color-success-green)', fontFamily: 'var(--font-label)' }}>
            SUBMISSION CONFIRMED
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-cloud-white)' }}>
            {submission.title}
          </h2>
          <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
            Submitted by Team &quot;{submission.teamName}&quot; on {formatDate(submission.submittedAt)}
          </p>
        </div>

        <Badge tone="green" icon="✓">
          FINAL ENTRY RECORDED
        </Badge>
      </div>

      <Alert variant="info" title="Locked Entry" style={{ marginBottom: 'var(--space-l)' }}>
        Per competition rules, teams are permitted one final design submission. Your entry is securely logged for judging review.
      </Alert>

      {submission.description && (
        <div style={{ marginBottom: 'var(--space-l)' }}>
          <h4 style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--fs-label)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
            DESIGN DESCRIPTION & REFERENCES
          </h4>
          <div style={{ background: 'var(--color-deep-navy)', padding: 'var(--space-m)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', whiteSpace: 'pre-wrap' }}>
            {submission.description}
          </div>
        </div>
      )}

      <div>
        <h4 style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--fs-label)', color: 'var(--text-secondary)', marginBottom: 'var(--space-s)' }}>
          UPLOADED DESIGN ASSETS ({submission.files?.length || 0})
        </h4>

        <div className="submission-files-grid">
          {submission.files?.map((file, idx) => {
            const isPdf = file.mimeType === 'application/pdf' || file.filename?.endsWith('.pdf');
            return (
              <div key={idx} className="submission-file-card">
                {isPdf ? (
                  <div className="submission-file-card__pdf">
                    <span style={{ fontSize: '2rem' }}>📄</span>
                    <span>PDF DOCUMENT</span>
                  </div>
                ) : (
                  <img
                    src={file.url}
                    alt={file.originalName}
                    className="submission-file-card__thumb"
                  />
                )}

                <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-cloud-white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.originalName}>
                  {file.originalName}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)' }}>
                    {formatFileSize(file.size)}
                  </span>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--color-electric-cyan)', fontWeight: 700 }}
                  >
                    Open ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

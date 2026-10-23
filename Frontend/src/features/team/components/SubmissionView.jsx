import { useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import { formatDate } from '../../common/utils/formatDate.js';
import { formatFileSize } from '../../common/utils/formatFileSize.js';
import { extractUrls, ClickableLinkPill, LinkifiedText } from '../../common/utils/linkUtils.jsx';
import { updateWorkLinks } from '../api/submissionApi.js';

export default function SubmissionView({ submission, onUpdate }) {
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [linksInput, setLinksInput] = useState(submission?.workLinks || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!submission) return null;

  const links = extractUrls(submission.workLinks, submission.description);

  const handleSaveLinks = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      const res = await updateWorkLinks(linksInput.trim());
      setIsEditingLinks(false);
      onUpdate?.(res);
    } catch (err) {
      setSaveError(err.message || 'Failed to update links');
    } finally {
      setIsSaving(false);
    }
  };

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

      {/* Project & Prototype Links Section */}
      <div style={{ marginBottom: 'var(--space-l)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
          <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-electric-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            🔗 PROJECT & PROTOTYPE LINKS
          </h4>
          {!isEditingLinks && (
            <button
              type="button"
              onClick={() => {
                setLinksInput(submission.workLinks || '');
                setIsEditingLinks(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-arcade-yellow)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-label)',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '2px 4px',
              }}
            >
              {links.length > 0 ? '✏ Edit Links' : '+ Add Prototype Link'}
            </button>
          )}
        </div>

        {isEditingLinks ? (
          <div style={{ background: 'var(--color-deep-navy)', padding: 'var(--space-m)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-electric-cyan)' }}>
            <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)', marginBottom: 'var(--space-s)' }}>
              Paste Figma, Canva, Adobe XD, or Drive links (separated by spaces or newlines):
            </p>
            <Input
              value={linksInput}
              onChange={(e) => setLinksInput(e.target.value)}
              placeholder="e.g. https://www.figma.com/design/... or https://canva.com/..."
              style={{ marginBottom: 'var(--space-s)' }}
            />
            {saveError && <p style={{ color: '#ff4d79', fontSize: '0.8rem', marginBottom: 'var(--space-s)' }}>{saveError}</p>}
            <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
              <Button size="sm" variant="primary" loading={isSaving} onClick={handleSaveLinks}>
                Save Links
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditingLinks(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--color-deep-navy)', padding: 'var(--space-m)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 'var(--space-s)', flexWrap: 'wrap' }}>
            {links.length > 0 ? (
              links.map((lnk, idx) => (
                <ClickableLinkPill key={idx} link={lnk} size="md" />
              ))
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 'var(--space-s)' }}>
                <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
                  No clickable prototype link added yet.
                </span>
                <Button size="sm" variant="secondary" onClick={() => setIsEditingLinks(true)}>
                  + Add Figma / Canva Link
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {submission.description && (
        <div style={{ marginBottom: 'var(--space-l)' }}>
          <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-xs)' }}>
            DESIGN DESCRIPTION & REFERENCES
          </h4>
          <div style={{ background: 'var(--color-deep-navy)', padding: 'var(--space-m)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 'var(--fs-body)' }}>
            <LinkifiedText text={submission.description} />
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
                    loading="lazy"
                    decoding="async"
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

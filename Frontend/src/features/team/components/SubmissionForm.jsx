import { useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import FormField from '../../../components/ui/FormField.jsx';
import Input from '../../../components/ui/Input.jsx';
import Textarea from '../../../components/ui/Textarea.jsx';
import FileDropzone from '../../../components/ui/FileDropzone.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { ConfirmDialog } from '../../../components/ui/Modal.jsx';
import { createSubmission } from '../api/submissionApi.js';
import { MAX_FILES, MAX_FILE_SIZE_MB } from '../../../config/env.js';

export default function SubmissionForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workLinks, setWorkLinks] = useState('');
  const [files, setFiles] = useState([]);

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleValidate = () => {
    setFieldErrors({});
    setGeneralError('');
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Submission title is required.';
    }

    if (!files || files.length === 0) {
      errors.files = 'Please select at least one design file (PNG, JPG, WEBP, or PDF).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    return true;
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (handleValidate()) {
      setShowConfirm(true);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setGeneralError('');

    try {
      const submission = await createSubmission({
        title: title.trim(),
        description: description.trim(),
        workLinks: workLinks.trim(),
        files,
      });
      setShowConfirm(false);
      onSuccess?.(submission);
    } catch (err) {
      setShowConfirm(false);
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setGeneralError(err.message || 'Submission failed. Please check file sizes and formats.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card accent="cyan">
        <div style={{ marginBottom: 'var(--space-l)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-cloud-white)' }}>
            Submit Your Team&apos;s Design Work
          </h2>
          <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
            Upload high-fidelity wireframes, export mockups, or full PDF presentations.
          </p>
        </div>

        {generalError && (
          <Alert variant="error" title="Submission Error" style={{ marginBottom: 'var(--space-l)' }}>
            {generalError}
          </Alert>
        )}

        <form onSubmit={handlePreSubmit} noValidate>
          <FormField
            id="sub-title"
            label="Design Project Title"
            required
            hint="A clear title reflecting your prototype/app concept"
            error={fieldErrors.title}
          >
            <Input
              id="sub-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. EcoRide Mobility Interface"
              error={!!fieldErrors.title}
            />
          </FormField>

          <FormField
            id="sub-links"
            label="Design & Prototype Links (Figma / Canva / Adobe XD)"
            hint="Share links to your Figma canvas, Canva presentation, Adobe XD prototype, or cloud documents"
            error={fieldErrors.workLinks}
          >
            <Input
              id="sub-links"
              type="url"
              value={workLinks}
              onChange={(e) => setWorkLinks(e.target.value)}
              placeholder="e.g. https://www.figma.com/design/... or https://canva.com/..."
              error={!!fieldErrors.workLinks}
            />
          </FormField>

          <FormField
            id="sub-desc"
            label="Project Description & Reference Citations"
            hint="Describe your design choices and include required citations/links for all external assets, icons, fonts, and references"
            error={fieldErrors.description}
          >
            <Textarea
              id="sub-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of user flows and design system choices. References: Feather Icons, Unsplash photos, Google Fonts..."
            />
          </FormField>

          <FormField
            id="sub-files"
            label="Design Files & Mockups"
            required
            error={fieldErrors.files}
          >
            <FileDropzone
              files={files}
              onChange={setFiles}
              maxFiles={MAX_FILES}
              maxSizeMb={MAX_FILE_SIZE_MB}
              error={fieldErrors.files}
            />
          </FormField>

          <div
            style={{
              padding: 'var(--space-s) var(--space-m)',
              background: 'rgba(0, 217, 255, 0.05)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-label-xs)',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginTop: 'var(--space-m)',
              fontFamily: 'var(--font-label)',
            }}
          >
            🛡 <strong>Integrity & Authenticity:</strong> Submissions may undergo automated image verification to assist judges in evaluating original creative effort. Please ensure all external assets and references are properly cited.
          </div>

          <div style={{ marginTop: 'var(--space-xl)' }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
            >
              Submit Design Work →
            </Button>
          </div>
        </form>
      </Card>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleFinalSubmit}
        loading={isSubmitting}
        title="Final Submission Confirmation"
        message="Are you sure you want to finalize this submission? Only one submission per team is permitted. Once submitted, designs cannot be modified or re-uploaded."
        confirmText="Confirm & Submit"
        cancelText="Review Form"
      />
    </>
  );
}

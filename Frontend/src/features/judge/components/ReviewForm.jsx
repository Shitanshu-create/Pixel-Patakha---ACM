import { useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import FormField from '../../../components/ui/FormField.jsx';
import Input from '../../../components/ui/Input.jsx';
import Textarea from '../../../components/ui/Textarea.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { submitReview } from '../api/judgeApi.js';

export default function ReviewForm({
  submissionId,
  initialReview,
  onReviewSubmitted,
}) {
  const [score, setScore] = useState(
    initialReview?.score !== undefined ? String(initialReview.score) : ''
  );
  const [feedback, setFeedback] = useState(initialReview?.feedback || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Update form if initialReview changes from external fetch
  const [prevReview, setPrevReview] = useState(initialReview);
  if (initialReview !== prevReview) {
    setPrevReview(initialReview);
    setScore(initialReview?.score !== undefined ? String(initialReview.score) : '');
    setFeedback(initialReview?.feedback || '');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const numScore = Number(score);
    if (score === '' || isNaN(numScore) || numScore < 0 || numScore > 100) {
      setError('Score must be a valid number between 0 and 100.');
      return;
    }

    if (!feedback.trim()) {
      setError('Written feedback is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitReview(submissionId, {
        score: numScore,
        feedback: feedback.trim(),
      });
      setSuccessMsg(initialReview ? 'Review updated successfully!' : 'Review submitted successfully!');
      onReviewSubmitted?.(res);
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card accent="yellow">
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-xs)' }}>
        {initialReview ? 'Update Your Review' : 'Judge Scorecard'}
      </h3>
      <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)', marginBottom: 'var(--space-m)' }}>
        Provide an objective rating (0–100) and actionable feedback on UX flow, visual hierarchy, and original craft.
      </p>

      {error && <Alert variant="error" title="Review Error" style={{ marginBottom: 'var(--space-m)' }}>{error}</Alert>}
      {successMsg && <Alert variant="success" title="Success" style={{ marginBottom: 'var(--space-m)' }}>{successMsg}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="judge-score"
          label="Score (0–100)"
          required
          hint="Scale: 0 = Incomplete, 50 = Average, 80+ = Exceptional"
        >
          <Input
            id="judge-score"
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="e.g. 88"
            required
          />
        </FormField>

        <FormField
          id="judge-feedback"
          label="Qualitative Feedback"
          required
          hint="Explain what worked well and areas for design improvement"
        >
          <Textarea
            id="judge-feedback"
            rows={6}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Great UX flow on the booking stage; consider strengthening text contrast in secondary views..."
            required
          />
        </FormField>

        <div style={{ marginTop: 'var(--space-l)' }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            fullWidth
          >
            {initialReview ? 'Update Review Record' : 'Submit Official Review'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

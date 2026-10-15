import { useState } from 'react';
import useAsync from '../../common/hooks/useAsync.js';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import Card from '../../../components/ui/Card.jsx';
import FormField from '../../../components/ui/FormField.jsx';
import Input from '../../../components/ui/Input.jsx';
import Textarea from '../../../components/ui/Textarea.jsx';
import Toggle from '../../../components/ui/Toggle.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { useToast } from '../../common/context/ToastContext.jsx';
import { getCompetition } from '../../common/api/competitionApi.js';
import { updateCompetition } from '../api/adminApi.js';
import { toDateTimeLocalValue, toIsoStringOrNull } from '../utils/dateInput.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import '../styles/admin.css';

export default function CompetitionSettingsPage() {
  useDocumentTitle('Competition Settings');
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    venue: '',
    eventDate: '',
    registrationOpen: false,
    registrationDeadline: '',
    submissionOpen: false,
    submissionDeadline: '',
    rulesText: '',
  });
  const { loading, error: fetchError, refetch: loadData } = useAsync(async () => {
    const data = await getCompetition();
    if (data) {
      setForm({
        name: data.name || '',
        tagline: data.tagline || '',
        description: data.description || '',
        venue: data.venue || '',
        eventDate: toDateTimeLocalValue(data.eventDate),
        registrationOpen: !!data.registrationOpen,
        registrationDeadline: toDateTimeLocalValue(data.registrationDeadline),
        submissionOpen: !!data.submissionOpen,
        submissionDeadline: toDateTimeLocalValue(data.submissionDeadline),
        rulesText: Array.isArray(data.rules) ? data.rules.join('\n') : '',
      });
    }
    return data;
  }, true);

  const error = fetchError ? (fetchError?.response?.data?.message || fetchError.message || 'Failed to load competition settings') : null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        venue: form.venue.trim(),
        eventDate: toIsoStringOrNull(form.eventDate),
        registrationOpen: form.registrationOpen,
        registrationDeadline: toIsoStringOrNull(form.registrationDeadline),
        submissionOpen: form.submissionOpen,
        submissionDeadline: toIsoStringOrNull(form.submissionDeadline),
        rules: form.rulesText
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
      };

      await updateCompetition(payload);
      toast.success('Competition settings updated successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner text="Loading competition settings..." fullScreen={false} />;
  }

  return (
    <div className="admin-page-container">
      <PageHeader
        title="Competition Settings"
        subtitle="Manage global deadlines, rules, event details, and phases"
      />

      {error && (
        <Alert variant="error" title="Error" style={{ marginBottom: 'var(--space-l)' }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="admin-settings-form">
        <Card accent="cyan" className="admin-settings-card">
          <h3 className="admin-settings-section-title">General Information</h3>
          <div className="admin-grid-2">
            <FormField id="comp-name" label="Competition Name" required>
              <Input
                id="comp-name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Pixel Patakha '26"
                required
              />
            </FormField>

            <FormField id="comp-tagline" label="Tagline">
              <Input
                id="comp-tagline"
                value={form.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Unleash your creative pixel spark"
              />
            </FormField>
          </div>

          <FormField id="comp-desc" label="Description">
            <Textarea
              id="comp-desc"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detailed description of the competition..."
            />
          </FormField>

          <div className="admin-grid-2">
            <FormField id="comp-venue" label="Venue / Platform">
              <Input
                id="comp-venue"
                value={form.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                placeholder="Auditorium / Online Discord"
              />
            </FormField>

            <FormField id="comp-eventdate" label="Event Date">
              <Input
                id="comp-eventdate"
                type="datetime-local"
                value={form.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
              />
            </FormField>
          </div>
        </Card>

        <Card accent="purple" className="admin-settings-card">
          <h3 className="admin-settings-section-title">Registration Phase</h3>
          <div className="admin-toggle-field">
            <Toggle
              id="comp-reg-toggle"
              checked={form.registrationOpen}
              onChange={(checked) => handleChange('registrationOpen', checked)}
              label="Registration Window Active"
            />
            <span className="admin-field-hint">
              {form.registrationOpen
                ? 'Teams can register and sign up.'
                : 'Registration is closed to new applicants.'}
            </span>
          </div>

          <FormField id="comp-reg-deadline" label="Registration Deadline">
            <Input
              id="comp-reg-deadline"
              type="datetime-local"
              value={form.registrationDeadline}
              onChange={(e) => handleChange('registrationDeadline', e.target.value)}
            />
          </FormField>
        </Card>

        <Card accent="yellow" className="admin-settings-card">
          <h3 className="admin-settings-section-title">Submission Phase</h3>
          <div className="admin-toggle-field">
            <Toggle
              id="comp-sub-toggle"
              checked={form.submissionOpen}
              onChange={(checked) => handleChange('submissionOpen', checked)}
              label="Submission Window Active"
            />
            <span className="admin-field-hint">
              {form.submissionOpen
                ? 'Registered teams can submit project links and upload artifacts.'
                : 'Submissions are locked.'}
            </span>
          </div>

          <FormField id="comp-sub-deadline" label="Submission Deadline">
            <Input
              id="comp-sub-deadline"
              type="datetime-local"
              value={form.submissionDeadline}
              onChange={(e) => handleChange('submissionDeadline', e.target.value)}
            />
          </FormField>
        </Card>

        <Card accent="pink" className="admin-settings-card">
          <h3 className="admin-settings-section-title">Competition Rules</h3>
          <FormField
            id="comp-rules"
            label="Rules List (Enter one rule per line)"
            hint="Each line will be displayed as a distinct guideline to participants."
          >
            <Textarea
              id="comp-rules"
              rows={6}
              value={form.rulesText}
              onChange={(e) => handleChange('rulesText', e.target.value)}
              placeholder="Rule 1: All assets must be submitted before deadline&#10;Rule 2: Max team size is 3&#10;Rule 3: Plagiarism will result in immediate disqualification"
            />
          </FormField>
        </Card>

        <div className="admin-form-actions">
          <Button type="button" variant="secondary" onClick={loadData} disabled={saving}>
            Reset Changes
          </Button>
          <Button type="submit" variant="primary" loading={saving} disabled={saving}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

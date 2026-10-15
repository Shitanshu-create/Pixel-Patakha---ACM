import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Toggle from '../../../components/ui/Toggle';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Alert from '../../../components/ui/Alert';
import { useToast } from '../../common/context/ToastContext';
import { getCompetition } from '../../common/api/competitionApi';
import { updateCompetition } from '../api/adminApi';
import { toDateTimeLocalValue, toIsoStringOrNull } from '../utils/dateInput';
import useDocumentTitle from '../../common/hooks/useDocumentTitle';
import '../styles/admin.css';

export default function CompetitionSettingsPage() {
  useDocumentTitle('Competition Settings');
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
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
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load competition settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      showSuccess('Competition settings updated successfully');
    } catch (err) {
      showError(err?.response?.data?.message || err.message || 'Failed to update settings');
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
        <Alert variant="danger" title="Error">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="admin-settings-form">
        <Card variant="glass" className="admin-settings-card">
          <h3 className="admin-settings-section-title">General Information</h3>
          <div className="admin-grid-2">
            <FormField label="Competition Name" required>
              <Input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Pixel Patakha '26"
                required
              />
            </FormField>

            <FormField label="Tagline">
              <Input
                value={form.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Unleash your creative pixel spark"
              />
            </FormField>
          </div>

          <FormField label="Description">
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detailed description of the competition..."
            />
          </FormField>

          <div className="admin-grid-2">
            <FormField label="Venue / Platform">
              <Input
                value={form.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                placeholder="Auditorium / Online Discord"
              />
            </FormField>

            <FormField label="Event Date">
              <Input
                type="datetime-local"
                value={form.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
              />
            </FormField>
          </div>
        </Card>

        <Card variant="glass" className="admin-settings-card">
          <h3 className="admin-settings-section-title">Registration Phase</h3>
          <div className="admin-toggle-field">
            <Toggle
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

          <FormField label="Registration Deadline">
            <Input
              type="datetime-local"
              value={form.registrationDeadline}
              onChange={(e) => handleChange('registrationDeadline', e.target.value)}
            />
          </FormField>
        </Card>

        <Card variant="glass" className="admin-settings-card">
          <h3 className="admin-settings-section-title">Submission Phase</h3>
          <div className="admin-toggle-field">
            <Toggle
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

          <FormField label="Submission Deadline">
            <Input
              type="datetime-local"
              value={form.submissionDeadline}
              onChange={(e) => handleChange('submissionDeadline', e.target.value)}
            />
          </FormField>
        </Card>

        <Card variant="glass" className="admin-settings-card">
          <h3 className="admin-settings-section-title">Competition Rules</h3>
          <FormField
            label="Rules List (Enter one rule per line)"
            hint="Each line will be displayed as a distinct guideline to participants."
          >
            <Textarea
              rows={6}
              value={form.rulesText}
              onChange={(e) => handleChange('rulesText', e.target.value)}
              placeholder="Rule 1: All assets must be submitted before deadline&#10;Rule 2: Max team size is 3&#10;Rule 3: Plagiarism will result in immediate disqualification"
            />
          </FormField>
        </Card>

        <div className="admin-form-actions">
          <Button type="button" variant="outline" onClick={loadData} disabled={saving}>
            Reset Changes
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving Settings...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}

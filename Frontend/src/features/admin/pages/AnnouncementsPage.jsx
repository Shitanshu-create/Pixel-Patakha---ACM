import { useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import FormField from '../../../components/ui/FormField.jsx';
import Input from '../../../components/ui/Input.jsx';
import Textarea from '../../../components/ui/Textarea.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import { ConfirmDialog } from '../../../components/ui/Modal.jsx';
import useAsync from '../../common/hooks/useAsync.js';
import { getAnnouncements } from '../../common/api/announcementApi.js';
import { createAnnouncement, deleteAnnouncement } from '../api/adminApi.js';
import { formatDate } from '../../common/utils/formatDate.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { useToast } from '../../common/context/ToastContext.jsx';
import '../styles/admin.css';

export default function AnnouncementsPage() {
  useDocumentTitle('Announcements');
  const toast = useToast();

  const { data: announcements, loading, error, execute: refetch } = useAsync(getAnnouncements, true);

  const [formData, setFormData] = useState({ title: '', message: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.message.trim()) {
      setFormError('Both title and message are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createAnnouncement({
        title: formData.title.trim(),
        message: formData.message.trim(),
      });

      toast.success('Announcement broadcast successfully.');
      setFormData({ title: '', message: '' });
      refetch();
    } catch (err) {
      setFormError(err.message || 'Failed to broadcast announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAnnouncement(deleteTarget._id);
      toast.success('Announcement removed.');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete announcement.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-announcements-page">
      <PageHeader
        title="Broadcast Announcements"
        subtitle="Publish live alerts, hints, and schedule updates to participant and staff feeds."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-xl)' }}>
        {/* Post Form */}
        <Card accent="cyan" className="admin-form-card" style={{ margin: 0, maxWidth: '100%' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-m)' }}>
            Publish New Notice
          </h3>

          {formError && (
            <Alert variant="error" title="Post Error" style={{ marginBottom: 'var(--space-m)' }}>
              {formError}
            </Alert>
          )}

          <form onSubmit={handlePost} noValidate>
            <FormField id="ann-title" label="Announcement Title" required>
              <Input
                id="ann-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Round 1 Mentorship Begins in 15 Minutes"
                required
              />
            </FormField>

            <FormField id="ann-msg" label="Message Details" required>
              <Textarea
                id="ann-msg"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mentors are circulating B404 to check initial wireframes..."
                required
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-m)' }}>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Broadcast Now 📢
              </Button>
            </div>
          </form>
        </Card>

        {/* Existing Announcements */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-m)' }}>
            Active Notices History
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <Spinner size="md" text="Loading notices..." showText />
            </div>
          ) : error ? (
            <ErrorState title="Failed to load notices" onRetry={refetch} />
          ) : !announcements || announcements.length === 0 ? (
            <EmptyState
              title="No Broadcasts Found"
              description="Notices posted above will show up here and on all participant dashboards."
              icon="📢"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
              {announcements.map((ann) => (
                <Card key={ann._id} accent="muted" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-m)' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-label)' }}>
                      {formatDate(ann.createdAt)} • By {ann.createdBy?.name || 'Admin'}
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-cloud-white)', margin: '4px 0' }}>
                      {ann.title}
                    </h4>
                    <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {ann.message}
                    </p>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(ann)}
                  >
                    Delete
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        danger
        title="Delete Announcement"
        message={`Are you sure you want to remove the broadcast "${deleteTarget?.title}"?`}
        confirmText="Remove Broadcast"
      />
    </div>
  );
}

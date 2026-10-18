import { useState } from 'react';
import useAsync from '../../common/hooks/useAsync.js';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import Button from '../../../components/ui/Button.jsx';
import FormField from '../../../components/ui/FormField.jsx';
import Input from '../../../components/ui/Input.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import Modal, { ConfirmDialog } from '../../../components/ui/Modal.jsx';
import { getJudges, createJudge, deleteJudge } from '../api/adminApi.js';
import { formatDate } from '../../common/utils/formatDate.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { useToast } from '../../common/context/ToastContext.jsx';
import '../styles/admin.css';

export default function JudgesPage() {
  useDocumentTitle('Manage Judges');
  const toast = useToast();

  const { data: judgesData, loading, error, refetch: fetchJudgesList } = useAsync(getJudges, true);
  const judges = judgesData || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [judgeToDelete, setJudgeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteJudge = async () => {
    if (!judgeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteJudge(judgeToDelete._id);
      toast.success(`Judge "${judgeToDelete.name}" has been removed.`);
      setJudgeToDelete(null);
      fetchJudgesList();
    } catch (err) {
      toast.error(err.message || 'Failed to delete judge.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateJudge = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setFormError('Please fill in all judge details.');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createJudge({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success(`Judge "${formData.name}" added successfully.`);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '' });
      fetchJudgesList();
    } catch (err) {
      setFormError(err.message || 'Failed to create judge account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Judge Name',
      render: (j) => <strong>{j.name}</strong>,
    },
    {
      key: 'email',
      label: 'Email (Login ID)',
      render: (j) => j.email,
    },
    {
      key: 'role',
      label: 'Role',
      render: () => <Badge tone="purple">Judge</Badge>,
    },
    {
      key: 'createdAt',
      label: 'Added On',
      render: (j) => formatDate(j.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (j) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => setJudgeToDelete(j)}
          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
        >
          🗑 Delete
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading judges roster..." showText />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load judges" onRetry={fetchJudgesList} />;
  }

  return (
    <div className="admin-judges-page">
      <PageHeader
        title="Judge Panel"
        subtitle="Authorize and manage industry judges evaluating design entries."
      >
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          + Authorize New Judge
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={judges}
        keyExtractor={(j) => j._id}
        emptyMessage="No judges have been added yet."
      />

      {/* Create Judge Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Authorize New Judge"
        maxWidth="500px"
      >
        {formError && (
          <Alert variant="error" title="Creation Error" style={{ marginBottom: 'var(--space-m)' }}>
            {formError}
          </Alert>
        )}

        <form onSubmit={handleCreateJudge} noValidate>
          <FormField id="judge-name" label="Full Name" required>
            <Input
              id="judge-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jordan Lee"
              required
            />
          </FormField>

          <FormField id="judge-email" label="Official Email" required>
            <Input
              id="judge-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="judge@pixelpatakha.com"
              required
            />
          </FormField>

          <FormField id="judge-pass" label="Temporary Password" required hint="Minimum 6 characters">
            <Input
              id="judge-pass"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-s)', marginTop: 'var(--space-l)' }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create Judge Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Judge Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!judgeToDelete}
        onClose={() => setJudgeToDelete(null)}
        onConfirm={handleDeleteJudge}
        title="Delete Judge Account"
        message={`Are you sure you want to remove judge "${judgeToDelete?.name}" (${judgeToDelete?.email})? All reviews authored by this judge will also be deleted.`}
        confirmText="Delete Judge"
        danger
        loading={isDeleting}
      />
    </div>
  );
}

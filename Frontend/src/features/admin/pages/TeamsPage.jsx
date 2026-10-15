import { useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import Pagination from '../../../components/ui/Pagination.jsx';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import { ConfirmDialog } from '../../../components/ui/Modal.jsx';
import useAdminTeams from '../hooks/useAdminTeams.js';
import { deleteTeam } from '../api/adminApi.js';
import useDebounce from '../../common/hooks/useDebounce.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { formatDate } from '../../common/utils/formatDate.js';
import { useToast } from '../../common/context/ToastContext.jsx';
import '../styles/admin.css';

export default function TeamsPage() {
  useDocumentTitle('Manage Teams');
  const toast = useToast();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [page, setPage] = useState(1);

  // Escaping special characters in search string before sending to backend regex
  const escapedSearch = debouncedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const { teams, pagination, loading, error, refetch } = useAdminTeams(page, 10, escapedSearch);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteTeam(deleteTarget._id);
      toast.success(`Team "${deleteTarget.teamName}" removed successfully.`);
      setDeleteTarget(null);
      refetch(page, escapedSearch);
    } catch (err) {
      toast.error(err.message || 'Failed to delete team.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: 'teamName',
      label: 'Team Name',
      render: (t) => <strong>{t.teamName}</strong>,
    },
    {
      key: 'college',
      label: 'College / University',
      render: (t) => t.college,
    },
    {
      key: 'leaderEmail',
      label: 'Leader Email',
      render: (t) => t.leaderEmail,
    },
    {
      key: 'members',
      label: 'Members',
      render: (t) => `${t.members?.length || 0} Designers`,
    },
    {
      key: 'createdAt',
      label: 'Registered On',
      render: (t) => formatDate(t.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (t) => (
        <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
          <Button to={`/admin/teams/${t._id}`} variant="secondary" size="sm">
            View
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteTarget(t)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-teams-page">
      <PageHeader
        title="Registered Teams"
        subtitle="Manage participating teams, inspect rosters, and review submissions."
      />

      <div className="search-filter-bar">
        <Input
          placeholder="Search team name, leader, or college..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-filter-bar__input"
        />
        <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
          Total Teams: {pagination.total || 0}
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <Spinner size="lg" text="Loading teams..." showText />
        </div>
      ) : error ? (
        <ErrorState title="Failed to load teams" onRetry={() => refetch(page, escapedSearch)} />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={teams}
            keyExtractor={(t) => t._id}
            emptyMessage="No teams match your search criteria."
          />

          <Pagination
            page={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        danger
        title="Delete Team Confirmation"
        message={`Are you sure you want to permanently delete team "${deleteTarget?.teamName}"? This will also purge their design submission and all reviews.`}
        confirmText="Permanently Delete"
      />
    </div>
  );
}

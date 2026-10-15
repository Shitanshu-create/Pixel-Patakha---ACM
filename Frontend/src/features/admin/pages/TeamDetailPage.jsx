import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import FilePreviewGrid from '../../judge/components/FilePreviewGrid.jsx';
import { getTeamById } from '../api/adminApi.js';
import { formatDate } from '../../common/utils/formatDate.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import { ROUTES } from '../../../config/routes.js';

export default function TeamDetailPage() {
  const { id } = useParams();
  useDocumentTitle('Team Details');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeamById(id);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading team records..." showText />
      </div>
    );
  }

  if (error || !data?.team) {
    return <ErrorState title="Team record not found" onRetry={fetchDetail} />;
  }

  const { team, submission } = data;

  const memberColumns = [
    {
      key: 'role',
      label: 'Designation',
      render: (_, idx) => (
        <Badge tone={idx === 0 ? 'yellow' : 'cyan'}>
          {idx === 0 ? 'Leader' : 'Designer'}
        </Badge>
      ),
    },
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
  ];

  return (
    <div className="admin-team-detail-page">
      <div style={{ marginBottom: 'var(--space-m)' }}>
        <Button to={ROUTES.ADMIN_TEAMS} variant="ghost" size="sm">
          ← Back to Teams List
        </Button>
      </div>

      <PageHeader
        title={`Team: ${team.teamName}`}
        subtitle={`${team.college} • Registered on ${formatDate(team.createdAt)}`}
      >
        <Badge tone={submission ? 'green' : 'yellow'}>
          {submission ? 'Design Submitted' : 'Pending Submission'}
        </Badge>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-xl)' }}>
        <Card accent="cyan">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-m)' }}>
            Squad Roster ({team.members?.length || 0})
          </h3>
          <DataTable
            columns={memberColumns}
            data={team.members || []}
            keyExtractor={(m, idx) => m.email || idx}
          />
        </Card>

        <Card accent={submission ? 'green' : 'muted'}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)', marginBottom: 'var(--space-m)' }}>
            Associated Submission
          </h3>

          {submission ? (
            <div>
              <div style={{ marginBottom: 'var(--space-m)' }}>
                <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--color-success-green)', fontFamily: 'var(--font-label)' }}>
                  TITLE
                </span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-cloud-white)' }}>
                  {submission.title}
                </h4>
                <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
                  Submitted on {formatDate(submission.submittedAt)}
                </span>
              </div>

              {submission.description && (
                <div style={{ marginBottom: 'var(--space-m)', background: 'var(--color-deep-navy)', padding: 'var(--space-m)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-label)' }}>
                    DESCRIPTION & REFERENCES
                  </span>
                  <p style={{ marginTop: 'var(--space-xs)', whiteSpace: 'pre-wrap', fontSize: 'var(--fs-body)' }}>
                    {submission.description}
                  </p>
                </div>
              )}

              <FilePreviewGrid files={submission.files || []} />
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-body)' }}>
              This team has not yet submitted their design project.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import ErrorState from '../../../components/ui/ErrorState.jsx';
import AiScoreBadge from '../../../components/ui/AiScoreBadge.jsx';
import useAdminSubmissions from '../hooks/useAdminSubmissions.js';
import { formatDate } from '../../common/utils/formatDate.js';
import useDocumentTitle from '../../common/hooks/useDocumentTitle.js';
import '../styles/admin.css';

export default function SubmissionsPage() {
  useDocumentTitle('All Submissions');
  const { submissions, loading, error, refetch } = useAdminSubmissions();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('time'); // time | score | reviews | ai
  const [aiFilter, setAiFilter] = useState('all'); // all | high | medium | low

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Spinner size="lg" text="Loading submissions..." showText />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load submissions" onRetry={refetch} />;
  }

  const filtered = (submissions || []).filter((sub) => {
    const q = search.toLowerCase().trim();
    const matchesSearch = (
      !q ||
      sub.teamName?.toLowerCase().includes(q) ||
      sub.title?.toLowerCase().includes(q)
    );
    if (!matchesSearch) return false;

    if (aiFilter !== 'all') {
      const level = sub.aiDetectionSummary?.level || 'unknown';
      if (level !== aiFilter) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'ai') {
      return (b.aiDetectionSummary?.overallLikelihood || 0) - (a.aiDetectionSummary?.overallLikelihood || 0);
    }
    if (sortBy === 'score') {
      return (b.averageScore || 0) - (a.averageScore || 0);
    }
    if (sortBy === 'reviews') {
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    }
    return new Date(b.submittedAt) - new Date(a.submittedAt);
  });

  const columns = [
    {
      key: 'teamName',
      label: 'Team Name',
      render: (s) => <strong>{s.teamName}</strong>,
    },
    {
      key: 'title',
      label: 'Design Title',
      render: (s) => s.title,
    },
    {
      key: 'files',
      label: 'Files',
      render: (s) => `${s.files?.length || 0} Assets`,
    },
    {
      key: 'submittedAt',
      label: 'Submitted Time',
      render: (s) => formatDate(s.submittedAt),
    },
    {
      key: 'aiDetection',
      label: 'AI Likelihood',
      render: (s) => (
        <AiScoreBadge
          status={s.aiDetectionSummary?.status}
          likelihood={s.aiDetectionSummary?.overallLikelihood}
          level={s.aiDetectionSummary?.level}
          size="sm"
        />
      ),
    },
    {
      key: 'reviews',
      label: 'Evaluations',
      render: (s) => (
        <Badge tone={s.reviewCount > 0 ? 'cyan' : 'muted'}>
          {s.reviewCount || 0} Reviews
        </Badge>
      ),
    },
    {
      key: 'averageScore',
      label: 'Average Score',
      render: (s) => (
        <Badge tone={s.averageScore >= 80 ? 'green' : s.averageScore >= 50 ? 'yellow' : 'pink'}>
          {s.averageScore !== null ? `${s.averageScore} / 100` : 'Not Scored'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (s) => (
        <Button to={`/admin/submissions/${s._id}`} variant="secondary" size="sm">
          Inspect & Scores ↗
        </Button>
      ),
    },
  ];

  return (
    <div className="admin-submissions-page">
      <PageHeader
        title="Submissions Leaderboard"
        subtitle="Examine all uploaded participant prototypes and aggregated judge scores."
      />

      <div className="search-filter-bar">
        <Input
          placeholder="Filter by team or project title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-filter-bar__input"
        />

        <div style={{ display: 'flex', gap: 'var(--space-s)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-label)' }}>
            SORT:
          </span>
          <Button
            variant={sortBy === 'time' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('time')}
          >
            Time
          </Button>
          <Button
            variant={sortBy === 'score' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('score')}
          >
            Highest Score
          </Button>
          <Button
            variant={sortBy === 'reviews' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('reviews')}
          >
            Most Reviews
          </Button>
          <Button
            variant={sortBy === 'ai' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('ai')}
          >
            AI Likelihood
          </Button>

          <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-label)', marginLeft: 'var(--space-s)' }}>
            AI RISK:
          </span>
          <Button
            variant={aiFilter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setAiFilter('all')}
          >
            All
          </Button>
          <Button
            variant={aiFilter === 'high' ? 'danger' : 'ghost'}
            size="sm"
            onClick={() => setAiFilter('high')}
          >
            High AI
          </Button>
          <Button
            variant={aiFilter === 'medium' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setAiFilter('medium')}
          >
            Med
          </Button>
          <Button
            variant={aiFilter === 'low' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setAiFilter('low')}
          >
            Low
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={sorted}
        keyExtractor={(s) => s._id}
        emptyMessage="No submissions match your query."
      />
    </div>
  );
}

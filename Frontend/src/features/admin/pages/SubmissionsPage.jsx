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
import { extractUrls, ClickableLinkPill } from '../../common/utils/linkUtils.jsx';
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
      key: 'links',
      label: 'Prototype Links',
      render: (s) => {
        const links = extractUrls(s.workLinks, s.description);
        if (links.length === 0) {
          return <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No link</span>;
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {links.map((lnk, idx) => (
              <ClickableLinkPill key={idx} link={lnk} size="sm" />
            ))}
          </div>
        );
      },
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
      render: (s) => {
        const fileScores = (s.files || [])
          .map((f) => f.aiDetection?.percent ?? (f.aiDetection?.score ? Math.round(f.aiDetection.score * 100) : null))
          .filter((p) => p !== null && !isNaN(p));
        const fallbackLikelihood = fileScores.length > 0 ? Math.max(...fileScores) : null;
        const likelihood = s.aiDetectionSummary?.overallLikelihood ?? fallbackLikelihood;

        return (
          <AiScoreBadge
            status={s.aiDetectionSummary?.status}
            likelihood={likelihood}
            level={s.aiDetectionSummary?.level}
            size="sm"
          />
        );
      },
    },
    {
      key: 'reviews',
      label: 'Evaluations',
      render: (s) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            fontFamily: 'var(--font-label)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: s.reviewCount > 0 ? 'var(--color-electric-cyan)' : 'var(--text-secondary)',
            backgroundColor: s.reviewCount > 0 ? 'rgba(0, 217, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${s.reviewCount > 0 ? 'rgba(0, 217, 255, 0.45)' : 'var(--border-subtle)'}`,
            whiteSpace: 'nowrap',
          }}
        >
          <span>💬</span>
          <span>{s.reviewCount || 0} {s.reviewCount === 1 ? 'Review' : 'Reviews'}</span>
        </span>
      ),
    },
    {
      key: 'averageScore',
      label: 'Average Score',
      render: (s) => {
        if (s.averageScore !== null && s.averageScore !== undefined) {
          const score = Number(s.averageScore);
          const isHigh = score >= 80;
          const isMed = score >= 50;
          const color = isHigh ? 'var(--color-success-green)' : isMed ? 'var(--color-arcade-yellow)' : '#ff4d79';
          const bg = isHigh ? 'rgba(72, 224, 138, 0.18)' : isMed ? 'rgba(255, 226, 41, 0.18)' : 'rgba(255, 77, 121, 0.18)';
          const border = isHigh ? 'rgba(72, 224, 138, 0.5)' : isMed ? 'rgba(255, 226, 41, 0.5)' : 'rgba(255, 77, 121, 0.5)';
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: 800,
                fontFamily: 'var(--font-label)',
                color,
                backgroundColor: bg,
                border: `1px solid ${border}`,
                boxShadow: `0 0 10px ${bg}`,
                whiteSpace: 'nowrap',
              }}
            >
              <span>{score}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>/ 100</span>
            </span>
          );
        }
        return (
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
            }}
          >
            Not Scored
          </span>
        );
      },
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

        <div style={{ display: 'flex', gap: 'var(--space-m)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="filter-group">
            <span className="filter-group-label">SORT:</span>
            <button
              type="button"
              className={`filter-pill filter-pill--cyan ${sortBy === 'time' ? 'filter-pill--active' : ''}`}
              onClick={() => setSortBy('time')}
            >
              Time
            </button>
            <button
              type="button"
              className={`filter-pill filter-pill--cyan ${sortBy === 'score' ? 'filter-pill--active' : ''}`}
              onClick={() => setSortBy('score')}
            >
              Highest Score
            </button>
            <button
              type="button"
              className={`filter-pill filter-pill--cyan ${sortBy === 'reviews' ? 'filter-pill--active' : ''}`}
              onClick={() => setSortBy('reviews')}
            >
              Most Reviews
            </button>
            <button
              type="button"
              className={`filter-pill filter-pill--cyan ${sortBy === 'ai' ? 'filter-pill--active' : ''}`}
              onClick={() => setSortBy('ai')}
            >
              AI Likelihood
            </button>
          </div>

          <div className="filter-group">
            <span className="filter-group-label">AI RISK:</span>
            <button
              type="button"
              className={`filter-pill ${aiFilter === 'all' ? 'filter-pill--active' : ''}`}
              onClick={() => setAiFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-pill filter-pill--danger ${aiFilter === 'high' ? 'filter-pill--active' : ''}`}
              onClick={() => setAiFilter('high')}
            >
              High AI
            </button>
            <button
              type="button"
              className={`filter-pill filter-pill--warning ${aiFilter === 'medium' ? 'filter-pill--active' : ''}`}
              onClick={() => setAiFilter('medium')}
            >
              Med
            </button>
            <button
              type="button"
              className={`filter-pill filter-pill--success ${aiFilter === 'low' ? 'filter-pill--active' : ''}`}
              onClick={() => setAiFilter('low')}
            >
              Low
            </button>
          </div>
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

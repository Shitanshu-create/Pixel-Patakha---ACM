import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';

export default function RegistrationSummary({ team }) {
  if (!team) return null;

  const columns = [
    {
      key: 'role',
      label: 'Role',
      render: (m, idx) => (
        <Badge tone={idx === 0 ? 'yellow' : 'cyan'}>
          {idx === 0 ? 'Leader' : 'Member'}
        </Badge>
      ),
    },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
  ];

  return (
    <Card accent="cyan" className="registration-summary-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-m)', flexWrap: 'wrap', gap: 'var(--space-s)' }}>
        <div>
          <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--color-electric-cyan)', fontFamily: 'var(--font-label)' }}>
            TEAM REGISTRATION
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-cloud-white)' }}>
            {team.teamName}
          </h2>
          <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
            {team.college}
          </p>
        </div>

        <Badge tone="green" icon="✓">
          REGISTRATION CONFIRMED
        </Badge>
      </div>

      <div style={{ marginTop: 'var(--space-m)' }}>
        <h4 style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--fs-label)', color: 'var(--text-secondary)', marginBottom: 'var(--space-s)' }}>
          ROSTER DETAILS
        </h4>
        <DataTable
          columns={columns}
          data={team.members || []}
          keyExtractor={(m, idx) => m.email || idx}
        />
      </div>
    </Card>
  );
}

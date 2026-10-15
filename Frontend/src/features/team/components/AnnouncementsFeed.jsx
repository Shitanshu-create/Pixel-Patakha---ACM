import Card from '../../../components/ui/Card.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import useAsync from '../../common/hooks/useAsync.js';
import { getAnnouncements } from '../../common/api/announcementApi.js';
import { formatDate } from '../../common/utils/formatDate.js';

export default function AnnouncementsFeed() {
  const { data: announcements, loading, error } = useAsync(getAnnouncements, true);

  if (loading) {
    return (
      <Card accent="muted">
        <div style={{ textAlign: 'center', padding: 'var(--space-m)' }}>
          <Spinner size="sm" text="Loading updates..." showText />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card accent="muted">
        <p style={{ color: 'var(--color-error-red)', fontSize: 'var(--fs-small)' }}>
          Failed to load announcements.
        </p>
      </Card>
    );
  }

  return (
    <Card accent="muted">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-m)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cloud-white)' }}>
          Competition Announcements
        </h3>
        <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--color-arcade-yellow)', fontFamily: 'var(--font-label)' }}>
          LIVE FEED
        </span>
      </div>

      {!announcements || announcements.length === 0 ? (
        <EmptyState
          title="No Announcements Yet"
          description="Organizer notices and hints will appear here during the event."
          icon="📢"
        />
      ) : (
        <div className="announcements-feed">
          {announcements.map((ann) => (
            <div key={ann._id} className="announcement-card">
              <span className="announcement-card__time">
                {formatDate(ann.createdAt)} • By {ann.createdBy?.name || 'Admin'}
              </span>
              <h4 className="announcement-card__title">{ann.title}</h4>
              <p className="announcement-card__msg">{ann.message}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

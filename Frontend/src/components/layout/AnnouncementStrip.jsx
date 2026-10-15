import { EVENT_INFO } from '../../config/eventInfo.js';
import './AnnouncementStrip.css';

export default function AnnouncementStrip({ text = EVENT_INFO.stripNotice }) {
  return (
    <aside className="announcement-strip" aria-label="Event Notice">
      {text}
    </aside>
  );
}

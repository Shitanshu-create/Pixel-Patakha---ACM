import { Outlet } from 'react-router-dom';
import AnnouncementStrip from './AnnouncementStrip.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <AnnouncementStrip />
      <Navbar />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

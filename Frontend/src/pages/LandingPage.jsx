import HeroSection from '../components/landing/HeroSection.jsx';
import FeatureCards from '../components/landing/FeatureCards.jsx';
import TimelineSection from '../components/landing/TimelineSection.jsx';
import RulesSection from '../components/landing/RulesSection.jsx';
import ShowcaseSection from '../components/landing/ShowcaseSection.jsx';
import FaqSection from '../components/landing/FaqSection.jsx';
import useDocumentTitle from '../features/common/hooks/useDocumentTitle.js';
import '../styles/LandingPage.css';

export default function LandingPage() {
  useDocumentTitle('Design. Build. Play.');

  return (
    <div className="landing-page">
      <HeroSection />
      <FeatureCards />
      <TimelineSection />
      <RulesSection />
      <ShowcaseSection />
      <FaqSection />
    </div>
  );
}

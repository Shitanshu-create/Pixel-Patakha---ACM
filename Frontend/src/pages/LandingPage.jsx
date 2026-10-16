import HeroSection from '../components/landing/HeroSection.jsx';
import FeatureCards from '../components/landing/FeatureCards.jsx';
import TimelineSection from '../components/landing/TimelineSection.jsx';
import RulesSection from '../components/landing/RulesSection.jsx';
import ShowcaseSection from '../components/landing/ShowcaseSection.jsx';
import FaqSection from '../components/landing/FaqSection.jsx';
import useDocumentTitle from '../features/common/hooks/useDocumentTitle.js';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import '../styles/LandingPage.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function LandingPage() {
  useDocumentTitle('Design. Build. Play.');
  const pageRef = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const sections = gsap.utils.toArray('.landing-reveal-section');
      sections.forEach((section) => {
        const header = section.querySelector('.section-header');
        const revealItems = section.querySelectorAll('[data-reveal-item]');

        if (header) {
          gsap.from(header, {
            autoAlpha: 0,
            y: 14,
            duration: 0.38,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 82%', once: true },
          });
        }

        if (revealItems.length) {
          gsap.from(revealItems, {
            autoAlpha: 0,
            y: 14,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 72%', once: true },
          });
        }
      });
    });
    return () => media.revert();
  }, { scope: pageRef });

  return (
    <div className="landing-page" ref={pageRef}>
      <HeroSection />
      <FeatureCards />
      <TimelineSection />
      <RulesSection />
      <ShowcaseSection />
      <FaqSection />
    </div>
  );
}

import React from 'react';
import { PageId, StoryItem } from '../types';

interface PortfolioFieldImpactSectionProps {
  onNavigate: (page: PageId) => void;
  onSelectStory?: (story: StoryItem) => void;
}

interface PortfolioCardItem {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const PORTFOLIO_CARDS: PortfolioCardItem[] = [
  {
    id: 'voices-from-the-rift',
    category: 'Documentary Film',
    title: 'Voices from the Rift',
    description:
      'An intimate feature-length documentary exploring climate resilience and community adaptation across rural East African landscapes.',
    image: '/assets/slide-3.jpg',
    tags: ['Direction', 'Cinematography', 'Field Audio'],
  },
  {
    id: 'black-white-memories',
    category: 'Photo Essays',
    title: 'Black, White & Memories',
    description:
      'Archival and contemporary photojournalism capturing urban transitions, cultural heritage, and personal identity in Addis Ababa.',
    image: '/assets/slide-4.jpg',
    tags: ['Photojournalism', 'Exhibition Curation', 'Printing'],
  },
  {
    id: 'regional-health-innovation-forum',
    category: 'Live Broadcast & Summit',
    title: 'Regional Health & Innovation Forum',
    description:
      'Multi-camera live broadcast coverage and rapid social highlight delivery for a high-level international public health conference.',
    image: '/assets/slide-1.jpg',
    tags: ['Live Switching', 'Streaming', 'A/V Production'],
  },
  {
    id: 'institutional-impact-report-campaign',
    category: 'Brand Identity & Strategy',
    title: 'Institutional Impact Report & Campaign',
    description:
      'Comprehensive visual identity system, editorial layout, and advocacy campaign visuals designed for an international development partner.',
    image: '/assets/slide-2.jpg',
    tags: ['Brand Design', 'Editorial Design', 'Campaign Strategy'],
  },
];

const PARTNER_NAMES = [
  'ICTJ',
  'Africa CDC',
  'Global Food Banking Network',
  'WI HER',
  'Life and Peace Institute',
];

export const PortfolioFieldImpactSection: React.FC<PortfolioFieldImpactSectionProps> = ({
  onNavigate,
}) => {
  const handleScrollToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contentEl = document.getElementById('portfolioContent');
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <header className="portfolio-hero-full">
        <div
          className="hero-bg-img"
          style={{ backgroundImage: "url('/assets/slide-2.jpg')" }}
        />
        <div className="hero-dark-overlay" />

        <div className="portfolio-hero-content">
          <span className="section-tag-large">Selected Works</span>
          <h1>Visual Chronicles &amp; Impact Narratives.</h1>
          <p>
            A curated showcase of documentary films, editorial photo essays, and
            institutional campaigns produced across East Africa.
          </p>
        </div>

        <a
          href="#portfolioContent"
          onClick={handleScrollToContent}
          className="scroll-down-indicator"
        >
          <span>Explore Works</span>
          <svg viewBox="0 0 24 24">
            <path d="M7 10L12 15L17 10" />
          </svg>
        </a>
      </header>

      <main className="portfolio-main-section" id="portfolioContent">
        <div className="portfolio-grid">
          {PORTFOLIO_CARDS.map((card) => (
            <div key={card.id} className="portfolio-card">
              <div
                className="portfolio-img-wrapper"
                style={{ backgroundImage: `url('${card.image}')` }}
              />
              <div className="portfolio-info">
                <span className="portfolio-category">{card.category}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <ul className="portfolio-tags">
                  {card.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className="partners-marquee-section">
        <p className="partners-title">Trusted By International Partners &amp; Institutions</p>
        <div className="marquee-container">
          <div className="marquee-track">
            {PARTNER_NAMES.map((partner) => (
              <div key={`set1-${partner}`} className="partner-logo-item">
                {partner}
              </div>
            ))}
            {PARTNER_NAMES.map((partner) => (
              <div key={`set2-${partner}`} className="partner-logo-item">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lets-talk-section">
        <div className="lets-talk-wrapper">
          <div className="lets-talk-text">
            <h2>Have a project in mind?</h2>
            <p>
              Let&apos;s collaborate on your next documentary, live broadcast, or brand
              initiative.
            </p>
          </div>
          <div className="lets-talk-action">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              className="lets-talk-btn"
            >
              <span>Let&apos;s Talk</span>
              <span className="arrow-icon-wrapper">
                <svg viewBox="0 0 24 24">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

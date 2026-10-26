import React from 'react';
import { PageId } from '../types';

interface ServicesCapabilitiesSectionProps {
  onNavigate: (page: PageId) => void;
}

interface EditorialServiceItem {
  num: string;
  title: string;
  description: string;
  deliverables: string[];
  image: string;
}

const EDITORIAL_SERVICES: EditorialServiceItem[] = [
  {
    num: '01',
    title: 'Documentary Production, Field Films & Photography',
    description:
      'Cinema-grade storytelling and photojournalism rooted in rigorous local context, proximity, and ethical depth. We partner with international agencies and NGOs to capture authentic human narratives.',
    deliverables: [
      'Long-form & Short Documentaries',
      'Impact & Field Evaluation Films',
      '4K/8K Cinema Camera Packages',
      'Editorial Photography & Photo Essays',
    ],
    image: '/assets/slide-2.jpg',
  },
  {
    num: '02',
    title: 'Live Event Coverage & Broadcasting',
    description:
      'Seamless, multi-camera broadcast solutions and high-profile event coverage engineered for institutional milestones, conferences, and cultural summits.',
    deliverables: [
      'Multi-Camera Live Switching & Streaming',
      'High-Profile Institutional Conferences',
      'Keynote & Panel Audio/Visual Recording',
      'Rapid-Turnaround Social Highlights',
    ],
    image: '/assets/slide-3.jpg',
  },
  {
    num: '03',
    title: 'Brand Design & Visual Identity',
    description:
      'Sophisticated, high-impact brand systems and strategic visual identity design that establish institutional authority and resonate across the region.',
    deliverables: [
      'Comprehensive Brand Identity Systems',
      'Editorial Publication & Annual Reports',
      'Digital Collateral & Design Assets',
      'Exhibition & Gallery Curation',
    ],
    image: '/assets/slide-4.jpg',
  },
  {
    num: '04',
    title: 'Digital Marketing & Campaign Strategy',
    description:
      'Data-driven digital marketing campaigns, social media management, and targeted audience engagement strategies designed to amplify organizational reach.',
    deliverables: [
      'Multi-Channel Social Media Campaigns',
      'Targeted Paid Digital Advertising',
      'Content Strategy & Analytics Tracking',
      'Community Growth & Public Outreach',
    ],
    image: '/assets/slide-1.jpg',
  },
  {
    num: '05',
    title: 'Strategic Communications & Direction',
    description:
      'End-to-end creative direction and strategic messaging designed to bridge the gap between complex organizational missions and public audiences.',
    deliverables: [
      'Creative Concept & Treatment Development',
      'Advocacy Campaign Visual Direction',
      'Institutional Knowledge Documentation',
      'Advanced Color Grading & Sound Design',
    ],
    image: '/assets/slide-2.jpg',
  },
];

export const ServicesCapabilitiesSection: React.FC<ServicesCapabilitiesSectionProps> = ({
  onNavigate,
}) => {
  const handleScrollToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contentEl = document.getElementById('servicesContent');
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <header className="services-hero-full">
        <div
          className="hero-bg-img"
          style={{ backgroundImage: "url('/assets/slide-1.jpg')" }}
        />
        <div className="hero-dark-overlay" />

        <div className="services-hero-content">
          <span className="section-tag-large">Capabilities &amp; Expertise</span>
          <h1>Architecting Visual &amp; Strategic Narratives.</h1>
          <p>
            From deep field documentary filmmaking, professional photography, and live
            broadcasting to digital campaign strategy across East Africa.
          </p>
        </div>

        <a
          href="#servicesContent"
          onClick={handleScrollToContent}
          className="scroll-down-indicator"
        >
          <span>Explore Services</span>
          <svg viewBox="0 0 24 24">
            <path d="M7 10L12 15L17 10" />
          </svg>
        </a>
      </header>

      <main className="services-editorial-section" id="servicesContent">
        {EDITORIAL_SERVICES.map((service) => (
          <div key={service.num} className="service-editorial-row">
            <div className="editorial-num">{service.num}</div>
            <div className="editorial-info">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
            <div className="editorial-deliverables">
              <h4>Key Deliverables</h4>
              {service.deliverables.map((item) => (
                <div key={item} className="editorial-item">
                  {item}
                </div>
              ))}
            </div>
            <div
              className="service-preview-thumb"
              style={{ backgroundImage: `url('${service.image}')` }}
            />
          </div>
        ))}
      </main>

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

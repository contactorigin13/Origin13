import React from 'react';
import { PageId } from '../types';

interface AboutSectionProps {
  onNavigate: (page: PageId) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* HERO */}
      <header className="about-hero-full">
        <div
          className="hero-bg-img"
          style={{ backgroundImage: "url('/assets/slide-2.jpg')" }}
        />
        <div className="hero-dark-overlay" />

        <div className="portfolio-hero-content">
          <span className="section-tag-large">Our Agency</span>
          <h1>Rooted in Context. Driven by Rigor.</h1>
          <p>
            Based in Addis Ababa, Origin 13 Communication PLC bridges complex
            institutional missions and public audiences across East Africa.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="about-main-section">
        <div className="about-content-block">
          <h2>Independent Documentary &amp; Strategic Communication Agency</h2>
          <p>
            Founded with a commitment to uncompromising visual standards, Origin 13
            operates at the intersection of documentary filmmaking, photojournalism, and
            strategic communications.
          </p>
          <p>
            We partner with international organizations, UN agencies, and developmental
            institutions to produce work that carries both aesthetic weight and genuine
            human impact.
          </p>
        </div>
      </main>

      {/* LETS TALK CTA BANNER */}
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
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

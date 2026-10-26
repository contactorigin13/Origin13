import React, { useState, useEffect } from 'react';
import { PageId, StoryItem } from '@/types';
import { Navbar } from '@/components/Navbar';
import { HomeSection } from '@/components/HomeSection';
import { AboutSection } from '@/components/AboutSection';
import { ServicesCapabilitiesSection } from '@/components/ServicesCapabilitiesSection';
import { PortfolioFieldImpactSection } from '@/components/PortfolioFieldImpactSection';
import { ContactPageSection } from '@/components/ContactPageSection';
import { StoryLightboxModal } from '@/components/StoryLightboxModal';
import { Footer } from '@/components/Footer';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);

  useEffect(() => {
    const validPages: PageId[] = ['home', 'about', 'services', 'portfolio', 'contact'];

    const syncFromHash = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase() as PageId;
      if (validPages.includes(rawHash)) {
        setCurrentPage(rawHash);
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    document.body.classList.remove(
      'home-page',
      'about-body',
      'services-body',
      'portfolio-body',
      'contact-body'
    );
    if (currentPage === 'home') {
      document.body.classList.add('home-page');
    } else if (currentPage === 'about') {
      document.body.classList.add('about-body');
    } else if (currentPage === 'services') {
      document.body.classList.add('services-body');
    } else if (currentPage === 'portfolio') {
      document.body.classList.add('portfolio-body');
    } else if (currentPage === 'contact') {
      document.body.classList.add('contact-body');
    }
  }, [currentPage]);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.history.pushState(null, '', `#${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="flex-1">
        {currentPage === 'home' && (
          <HomeSection
            onNavigate={handleNavigate}
            onSelectStory={(story) => setActiveStory(story)}
          />
        )}

        {currentPage === 'about' && (
          <AboutSection onNavigate={handleNavigate} />
        )}

        {currentPage === 'services' && (
          <ServicesCapabilitiesSection onNavigate={handleNavigate} />
        )}

        {currentPage === 'portfolio' && (
          <PortfolioFieldImpactSection
            onNavigate={handleNavigate}
            onSelectStory={(story) => setActiveStory(story)}
          />
        )}

        {currentPage === 'contact' && <ContactPageSection />}
      </div>

      {currentPage !== 'home' && <Footer onNavigate={handleNavigate} />}

      <StoryLightboxModal
        story={activeStory}
        onClose={() => setActiveStory(null)}
        onPartnerInquiry={() => {
          setActiveStory(null);
          handleNavigate('contact');
        }}
      />
    </div>
  );
}

export default App;

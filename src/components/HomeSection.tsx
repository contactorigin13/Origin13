import React, { useState, useEffect, useCallback } from 'react';
import { PageId, StoryItem } from '../types';

interface HomeSectionProps {
  onNavigate: (page: PageId) => void;
  onSelectStory: (story: StoryItem) => void;
}

interface HeroSlideData {
  id: string;
  number: string;
  image: string;
  tag: string;
  title: string;
  description: string;
  linkLabel: string;
  targetPage: PageId;
}

const HERO_SLIDES: HeroSlideData[] = [
  {
    id: 'slide-1',
    number: '01',
    image: '/assets/slide-1.jpg',
    tag: 'Featured Documentary',
    title: 'Voices from the Rift',
    description:
      'An intimate exploration of climate resilience and community adaptation across rural East Africa.',
    linkLabel: 'Explore Project',
    targetPage: 'portfolio',
  },
  {
    id: 'slide-2',
    number: '02',
    image: '/assets/slide-2.jpg',
    tag: 'Photojournalism',
    title: 'Black, White & Memories',
    description:
      'Archival and contemporary visual essays capturing urban transitions and human dignity.',
    linkLabel: 'View Gallery',
    targetPage: 'portfolio',
  },
  {
    id: 'slide-3',
    number: '03',
    image: '/assets/slide-3.jpg',
    tag: 'Strategic Communications',
    title: ' amplifying Institutional Impact',
    description:
      'High-level media production and advocacy campaigns for international development partners.',
    linkLabel: 'Our Capabilities',
    targetPage: 'services',
  },
  {
    id: 'slide-4',
    number: '04',
    image: '/assets/slide-4.jpg',
    tag: 'Addis Ababa & Beyond',
    title: 'Storytelling with Proximity',
    description:
      'Bridging the gap between complex organizational missions and authentic human narratives.',
    linkLabel: 'About Origin 13',
    targetPage: 'about',
  },
];

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <main className="hero-viewport">
      <div className="slideshow-container">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`slide ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
            >
              <div
                className="slide-bg"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="slide-overlay" />
              <div className="slide-content">
                <span className="slide-tag">{slide.tag}</span>
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-desc">{slide.description}</p>
                <a
                  href={`#${slide.targetPage}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(slide.targetPage);
                  }}
                  className="slide-link"
                >
                  {slide.linkLabel} <span className="arrow">&rarr;</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Bar: Slide Indicators & Minimal Info */}
      <div className="hero-bottom-bar">
        <div className="slide-indicators">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            >
              {slide.number}
            </button>
          ))}
        </div>
        <div className="scroll-prompt">
          <span>Addis Ababa, Ethiopia</span>
        </div>
      </div>
    </main>
  );
};

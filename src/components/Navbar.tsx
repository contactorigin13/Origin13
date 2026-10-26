import React, { useState, useEffect } from 'react';
import { PageId } from '../types';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [navHidden, setNavHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      if (currentPage === 'home') {
        setNavHidden(false);
        return;
      }

      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > lastScrollTop && currentScroll > 50) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  useEffect(() => {
    setNavHidden(false);
  }, [currentPage]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: PageId) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <nav className={`floating-nav ${navHidden && !menuOpen ? 'nav-hidden' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <a
        href="#home"
        onClick={(e) => handleLinkClick(e, 'home')}
        className="brand-logo"
        aria-label="Origin 13 Communication PLC Home"
      >
        <img
          src="/assets/origin13-logo.svg"
          alt="Origin 13 Communication PLC"
          className="nav-logo-img"
        />
      </a>

      <ul className="nav-links">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className={currentPage === item.id ? 'active' : ''}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-spacer" />

      <button
        type="button"
        className="nav-toggle"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
};

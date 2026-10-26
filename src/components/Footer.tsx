import React from 'react';
import { ActivePage } from '../types';

interface FooterProps {
  onNavigate?: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-location">Addis Ababa, Ethiopia</p>
          <p className="footer-email">
            <a href="mailto:info@origin13communication.com">info@origin13communication.com</a>
          </p>
        </div>

        <div className="footer-right">
          <div className="social-links">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer">
              Vimeo
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Origin 13 Communication PLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

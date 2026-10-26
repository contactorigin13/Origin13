import React, { useEffect } from 'react';
import { DocumentaryStill } from '../types';
import { DocumentaryVisual } from './DocumentaryVisuals';
import { X, MapPin, ArrowRight, Camera, Quote } from 'lucide-react';

interface StoryLightboxModalProps {
  story: DocumentaryStill | null;
  onClose: () => void;
  onPartnerInquiry: (storyTitle: string) => void;
}

export const StoryLightboxModal: React.FC<StoryLightboxModalProps> = ({
  story,
  onClose,
  onPartnerInquiry,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (story) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [story, onClose]);

  if (!story) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#2B2B2B]/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F4F8FA]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#2B2B2B]/70">
            <span className="font-bold text-[#0095D9]">
              {story.category === 'documentary' ? 'DOCUMENTARY ARCHIVE' : 'VISUAL MEMORIES (STILLS)'}
            </span>
            <span aria-hidden="true">•</span>
            <span>{story.location}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#2B2B2B]/60 hover:text-[#2B2B2B] rounded-md hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            aria-label="Close story viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Visual Media */}
        <div className="relative w-full h-72 sm:h-96 md:h-[420px] bg-[#2B2B2B]">
          <DocumentaryVisual
            id={story.id}
            imageUrl={story.imageUrl}
            title={story.title}
            location={story.location}
            className="w-full h-full"
          />
        </div>

        {/* Story Body */}
        <div className="p-6 sm:p-10 space-y-8 max-h-[calc(85vh-380px)] overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0095D9] mb-2 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{story.location}</span>
              {story.partner && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>Partner: {story.partner}</span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2B2B] mb-3">
              {story.title}
            </h2>
            <p className="text-base text-[#2B2B2B]/85 leading-relaxed font-medium">
              {story.subtitle}
            </p>
          </div>

          {/* Synopsis */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#2B2B2B]/60 font-semibold">
              Field Synopsis & Context
            </h4>
            <p className="text-sm text-[#2B2B2B]/90 leading-relaxed font-normal">
              {story.synopsis}
            </p>
          </div>

          {/* Field Notes & Methodology */}
          <div className="p-5 rounded-xl bg-[#F4F8FA] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0095D9] font-bold">
              <Camera className="w-4 h-4 text-[#0095D9]" />
              <span>Field Technical & Ethical Notes</span>
            </div>
            <p className="text-xs sm:text-sm text-[#2B2B2B]/80 leading-relaxed">
              {story.fieldNotes}
            </p>
          </div>

          {/* Quote / Reflection */}
          {story.quote && (
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-white relative">
              <Quote className="w-8 h-8 text-[#0095D9]/15 absolute top-4 right-4 pointer-events-none" />
              <p className="text-sm italic text-[#2B2B2B] leading-relaxed mb-2">
                “{story.quote}”
              </p>
              <span className="text-xs font-mono text-[#2B2B2B]/60">
                — Field Director Journal Entry, Origin 13
              </span>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-[#E2E8F0] bg-[#F4F8FA]">
          <span className="text-xs font-mono text-[#2B2B2B]/60">
            Origin 13 Communication PLC · Addis Ababa
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#2B2B2B]/70 hover:text-[#2B2B2B] cursor-pointer"
            >
              Close Viewer
            </button>
            <button
              onClick={() => {
                onClose();
                onPartnerInquiry(story.title);
              }}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#0095D9] hover:bg-[#0082BD] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Commission Similar Field Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartProject: () => void;
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject, onExploreWork }) => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-white/[0.06]">
      {/* Ambient architectural lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-blue-500/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Split-Screen Hero Grid (items-stretch) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed Kicker with typographic separator · */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400 tracking-wider uppercase mb-6">
              <span className="text-amber-400">Origin 13</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Digital Creative Studio</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Available for Q3/Q4 2026</span>
            </div>

            {/* Display Headline with text-wrap balance */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6 [text-wrap:balance]">
              Digital experiences engineered for indelible impression.
            </h1>

            {/* Lead copy with 65-75ch measure */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-10 font-normal">
              Origin 13 partners with ambitious founders and design-forward brands to forge iconic visual identities, immersive web flagships, and high-performance digital products that translate vision into lasting commercial velocity.
            </p>

            {/* Action Zone: Primary + Secondary */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onStartProject}
                className="group px-6 py-3.5 text-sm font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-md transition-all duration-200 shadow-md flex items-center gap-3 active:scale-95 whitespace-nowrap"
              >
                <span>Initiate Project Consultation</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreWork}
                className="px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                Explore Selected Works
              </button>
            </div>

            {/* Micro Trust Marker (Unboxed metadata) */}
            <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
              <span className="text-slate-300 font-semibold">Specializations:</span>
              <span>Brand Architecture</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span>Digital Flagships</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span>Motion Systems</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span>TypeScript Engineering</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Container at Matching Height */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full h-full min-h-[380px] lg:min-h-full rounded-xl overflow-hidden border border-white/[0.08] bg-[#0e1014] p-8 flex flex-col justify-between group">
              {/* Background Geometric Grid & Radial Ambient Gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-blue-500/5 to-transparent pointer-events-none" />
              
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hero-grid)" />
                </svg>
              </div>

              {/* Dynamic Studio Visual Element: Kinetic Studio Monogram */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                  ORIGIN 13 · CORE ARCHITECTURE
                </div>
                <div className="text-xs font-mono tabular-nums text-amber-400">
                  REV 2.6
                </div>
              </div>

              {/* Central Abstract Kinetic Monolith SVG */}
              <div className="relative z-10 my-auto py-8 flex items-center justify-center">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  <svg className="w-full h-full text-slate-200 transition-transform duration-700 group-hover:scale-105" viewBox="0 0 200 200" fill="none">
                    {/* Architectural nested isometric frames */}
                    <rect x="30" y="30" width="140" height="140" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <rect x="50" y="50" width="100" height="100" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeDasharray="4 2" />
                    <rect x="70" y="70" width="60" height="60" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" />
                    
                    {/* Axis crosshairs */}
                    <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />
                    
                    {/* Focal points */}
                    <circle cx="100" cy="100" r="4" fill="#F59E0B" />
                    <circle cx="50" cy="50" r="2.5" fill="#3B82F6" />
                    <circle cx="150" cy="150" r="2.5" fill="#3B82F6" />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold font-mono tracking-tighter text-white opacity-90">13</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Meta: Human Editorial Notice */}
              <div className="relative z-10 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>BESPOKE ARTIFACT PRODUCTION</span>
                <span className="text-slate-300 font-medium">NEW YORK · ZURICH · REMOTE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

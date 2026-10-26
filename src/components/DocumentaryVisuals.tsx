import React from 'react';

interface VisualProps {
  id: string;
  className?: string;
  title?: string;
  location?: string;
  imageUrl?: string | undefined;
}

export const DocumentaryVisual: React.FC<VisualProps> = ({ id, className = '', title, location, imageUrl }) => {
  const photoSrc = imageUrl || (id === 'still-gfn-seedlings' || id === 'hero-gfn-nursery' || id === 'proj-food-banking-resilience' ? '/assets/aistudio/GFN_1_72323ee2.jpg' : null);

  if (photoSrc) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#14232c] ${className}`}>
        <img
          src={photoSrc}
          alt={title || "Documentary still - seedling nursery in East Africa"}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('aistudio')) {
              target.src = '/assets/GFN_1_72323ee2.jpg';
            }
          }}
        />
        {/* Subtle cinematic gradient vignette along base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  switch (id) {
    case 'still-coffee-highlands':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#1b3a4b] via-[#243f52] to-[#14232c] flex items-center justify-center ${className}`}>
          {/* Subtle dawn light overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14232c]/90 via-[#14232c]/30 to-transparent pointer-events-none" />
          
          <svg className="w-full h-full p-8 text-[#E2E8F0] transition-transform duration-700 hover:scale-[1.02]" viewBox="0 0 600 360" fill="none">
            {/* Misty mountain contours of Gedeo & Yirgacheffe */}
            <path d="M 0 240 Q 150 180, 300 220 T 600 190 L 600 360 L 0 360 Z" fill="#14232c" fillOpacity="0.8" />
            <path d="M 0 200 Q 180 130, 360 170 T 600 140 L 600 360 L 0 360 Z" fill="#1b3a4b" fillOpacity="0.5" />
            <path d="M 0 160 Q 200 90, 420 130 T 600 110 L 600 360 L 0 360 Z" fill="#0095D9" fillOpacity="0.2" />

            {/* Terraced washing tables & coffee cherry sorting racks */}
            <line x1="80" y1="260" x2="260" y2="260" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="100" y1="280" x2="300" y2="280" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="120" y1="300" x2="340" y2="300" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Rising dawn solar rays */}
            <circle cx="480" cy="90" r="45" fill="#0095D9" fillOpacity="0.15" />
            <line x1="480" y1="30" x2="480" y2="150" stroke="#0095D9" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.6" />
            <line x1="420" y1="90" x2="540" y2="90" stroke="#0095D9" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.6" />

            {/* Editorial stamp */}
            <text x="40" y="50" fill="#E2E8F0" fontSize="12" fontFamily="monospace" letterSpacing="0.2em">ORIGIN 13 // 06:14 AM DAWN</text>
            <text x="40" y="70" fill="#0095D9" fontSize="10" fontFamily="monospace">GEDEO ZONE, SNNPR · 50MM F/1.4</text>
          </svg>
        </div>
      );

    case 'still-addis-transit':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-[#334155] via-[#1E293B] to-[#14232c] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#14232c]/90 via-[#14232c]/20 to-transparent pointer-events-none" />
          
          <svg className="w-full h-full p-8 text-[#F1F5F9] transition-transform duration-700 hover:scale-[1.02]" viewBox="0 0 600 360" fill="none">
            {/* Historic Piazza Stone Arcade Archways */}
            <path d="M 60 320 L 60 160 A 50 50 0 0 1 160 160 L 160 320" stroke="#E2E8F0" strokeWidth="2" fill="none" opacity="0.8" />
            <path d="M 180 320 L 180 160 A 50 50 0 0 1 280 160 L 280 320" stroke="#E2E8F0" strokeWidth="2" fill="none" opacity="0.8" />
            <path d="M 300 320 L 300 160 A 50 50 0 0 1 400 160 L 400 320" stroke="#E2E8F0" strokeWidth="2" fill="none" opacity="0.8" />
            <path d="M 420 320 L 420 160 A 50 50 0 0 1 520 160 L 520 320" stroke="#E2E8F0" strokeWidth="2" fill="none" opacity="0.8" />

            {/* Contemporary Light Rail Transit vector line cutting across */}
            <line x1="20" y1="270" x2="580" y2="230" stroke="#0095D9" strokeWidth="2.5" />
            <line x1="20" y1="274" x2="580" y2="234" stroke="#66C4EE" strokeWidth="1" strokeDasharray="4 2" />

            {/* Archival metadata */}
            <text x="40" y="50" fill="#F8FAFC" fontSize="12" fontFamily="monospace" letterSpacing="0.2em">ARCHIVAL STILL // PIAZZA</text>
            <text x="40" y="70" fill="#0095D9" fontSize="10" fontFamily="monospace">ADDIS ABABA · MEDIUM FORMAT MONOCHROME</text>
          </svg>
        </div>
      );

    case 'still-africa-cdc-coldchain':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#0c2b3d] via-[#103a52] to-[#174e6d] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c2b3d]/90 via-transparent to-transparent pointer-events-none" />
          
          <svg className="w-full h-full p-8 text-[#0095D9] transition-transform duration-700 hover:scale-[1.02]" viewBox="0 0 600 360" fill="none">
            {/* Topographic rift lines */}
            <path d="M 40 280 Q 200 240, 350 290 T 560 260" stroke="#0095D9" strokeWidth="1.5" fill="none" opacity="0.8" />
            <path d="M 40 310 Q 220 270, 370 320 T 560 290" stroke="#66C4EE" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />

            {/* Cold chain telemetry node hub */}
            <circle cx="280" cy="160" r="50" stroke="#0095D9" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="280" cy="160" r="30" stroke="#66C4EE" strokeWidth="1.5" />
            <circle cx="280" cy="160" r="8" fill="#0095D9" />

            {/* Temperature range indicator */}
            <text x="280" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontFamily="monospace" fontWeight="bold">+2°C TO +8°C</text>
            <text x="280" y="185" textAnchor="middle" fill="#66C4EE" fontSize="9" fontFamily="monospace">ACTIVE SOLAR VACCINE HUB</text>

            {/* Remote dispatch points */}
            <line x1="280" y1="160" x2="460" y2="90" stroke="#0095D9" strokeWidth="1.5" strokeDasharray="4 2" />
            <circle cx="460" cy="90" r="5" fill="#0095D9" />
            <text x="475" y="94" fill="#E2E8F0" fontSize="10" fontFamily="monospace">AFAR OUTPOST 04</text>

            <line x1="280" y1="160" x2="120" y2="100" stroke="#0095D9" strokeWidth="1.5" strokeDasharray="4 2" />
            <circle cx="120" cy="100" r="5" fill="#0095D9" />
            <text x="40" y="104" fill="#E2E8F0" fontSize="10" fontFamily="monospace">SOMALI DISPATCH</text>

            <text x="40" y="45" fill="#FFFFFF" fontSize="12" fontFamily="monospace" letterSpacing="0.2em">AFRICA CDC FIELD ARCHIVE</text>
            <text x="40" y="65" fill="#66C4EE" fontSize="10" fontFamily="monospace">GENOMIC SURVEILLANCE & LOGISTICS</text>
          </svg>
        </div>
      );

    case 'proj-transitional-justice':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#122838] via-[#1a384d] to-[#0e1d29] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d29] via-transparent to-transparent pointer-events-none" />
          
          <svg className="w-full h-full p-8 text-[#CBD5E1]" viewBox="0 0 600 360" fill="none">
            {/* Concentric Community Truth & Dialogue Circles */}
            <circle cx="300" cy="180" r="110" stroke="#64748B" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
            <circle cx="300" cy="180" r="80" stroke="#94A3B8" strokeWidth="1.2" opacity="0.6" />
            <circle cx="300" cy="180" r="50" stroke="#0095D9" strokeWidth="1.5" opacity="0.8" />
            <circle cx="300" cy="180" r="6" fill="#0095D9" />

            {/* Listening nodes representing community council */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 300 + 80 * Math.cos(rad);
              const y = 180 + 80 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="3" fill="#0095D9" />;
            })}

            <text x="40" y="50" fill="#FFFFFF" fontSize="12" fontFamily="monospace" letterSpacing="0.15em">ICTJ INSTITUTIONAL PARTNERSHIP</text>
            <text x="40" y="70" fill="#0095D9" fontSize="10" fontFamily="monospace">60+ GRASSROOTS SURVIVOR TESTIMONIES</text>
            <text x="300" y="320" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="serif" letterSpacing="0.05em">"AGENCY OVER PITY · RESTORATIVE JUSTICE"</text>
          </svg>
        </div>
      );

    case 'proj-cold-chain-africa-cdc':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#0c2b3d] via-[#103a52] to-[#174e6d] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c2b3d] via-transparent to-transparent pointer-events-none" />
          <svg className="w-full h-full p-8 text-[#0095D9]" viewBox="0 0 600 360" fill="none">
            {/* Laboratory Bio-Repository Grid */}
            <rect x="80" y="90" width="440" height="180" rx="8" stroke="#0095D9" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="80" y1="150" x2="520" y2="150" stroke="#0095D9" strokeWidth="0.75" opacity="0.3" />
            <line x1="80" y1="210" x2="520" y2="210" stroke="#0095D9" strokeWidth="0.75" opacity="0.3" />

            <circle cx="160" cy="150" r="24" stroke="#66C4EE" strokeWidth="1.5" />
            <circle cx="300" cy="150" r="24" stroke="#66C4EE" strokeWidth="1.5" />
            <circle cx="440" cy="150" r="24" stroke="#66C4EE" strokeWidth="1.5" />

            <text x="160" y="154" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">-80°C</text>
            <text x="300" y="154" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">GENOMIC</text>
            <text x="440" y="154" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">SURVEILLANCE</text>

            <text x="40" y="50" fill="#FFFFFF" fontSize="12" fontFamily="monospace" letterSpacing="0.15em">AFRICA CDC CONTINENTAL PRODUCTION</text>
            <text x="40" y="70" fill="#0095D9" fontSize="10" fontFamily="monospace">4K CINEMA FIELD DOCUMENTATION</text>
          </svg>
        </div>
      );

    case 'proj-food-banking-resilience':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#1b3a4b] via-[#243f52] to-[#14232c] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#14232c] via-transparent to-transparent pointer-events-none" />
          <svg className="w-full h-full p-8 text-[#CBD5E1]" viewBox="0 0 600 360" fill="none">
            {/* Grain Silos & Community Food Redistribution Paths */}
            <path d="M 120 280 L 120 170 Q 150 140, 180 170 L 180 280 Z" stroke="#E2E8F0" strokeWidth="1.5" fill="#14232c" fillOpacity="0.6" />
            <path d="M 200 280 L 200 150 Q 240 110, 280 150 L 280 280 Z" stroke="#E2E8F0" strokeWidth="1.5" fill="#14232c" fillOpacity="0.6" />
            <path d="M 300 280 L 300 180 Q 330 150, 360 180 L 360 280 Z" stroke="#E2E8F0" strokeWidth="1.5" fill="#14232c" fillOpacity="0.6" />

            {/* School feeding distribution arrows */}
            <path d="M 380 220 Q 450 180, 520 220" stroke="#0095D9" strokeWidth="2" strokeDasharray="4 2" fill="none" />
            <text x="450" y="170" textAnchor="middle" fill="#0095D9" fontSize="10" fontFamily="monospace">NUTRITION SAFETY NET</text>

            <text x="40" y="50" fill="#FFFFFF" fontSize="12" fontFamily="monospace" letterSpacing="0.15em">GLOBAL FOOD BANKING NETWORK</text>
            <text x="40" y="70" fill="#CBD5E1" fontSize="10" fontFamily="monospace">LONGITUDINAL FIELD ESSAY · 4 HARVESTS</text>
          </svg>
        </div>
      );

    case 'proj-wi-her-maternal-health':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#122838] via-[#1a384d] to-[#0e1d29] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d29] via-transparent to-transparent pointer-events-none" />
          <svg className="w-full h-full p-8 text-[#E2E8F0]" viewBox="0 0 600 360" fill="none">
            {/* Maternal Care Pulse Wave & Cradle Contour */}
            <path d="M 60 200 L 180 200 L 200 140 L 220 240 L 240 180 L 260 210 L 280 200 L 540 200" stroke="#0095D9" strokeWidth="2" fill="none" />
            <circle cx="300" cy="160" r="45" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="300" cy="160" r="15" fill="#0095D9" fillOpacity="0.3" stroke="#0095D9" strokeWidth="1.5" />

            <text x="40" y="50" fill="#FFFFFF" fontSize="12" fontFamily="monospace" letterSpacing="0.15em">WI HER · MATERNAL HEALTH EQUITY</text>
            <text x="40" y="70" fill="#0095D9" fontSize="10" fontFamily="monospace">COMMUNITY HEALTH WORKERS · AFAR</text>
            <text x="300" y="320" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="serif">"GENDER-RESPONSIVE PUBLIC HEALTH ADVOCACY"</text>
          </svg>
        </div>
      );

    case 'proj-lpi-peace-dialogues':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#1b3a4b] via-[#243f52] to-[#14232c] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#14232c] via-transparent to-transparent pointer-events-none" />
          <svg className="w-full h-full p-8 text-[#E2E8F0]" viewBox="0 0 600 360" fill="none">
            {/* Broad Acacia Peace Tree Canopy */}
            <path d="M 300 240 L 300 180" stroke="#E2E8F0" strokeWidth="4" />
            <path d="M 160 160 Q 300 90, 440 160 Q 300 130, 160 160 Z" stroke="#E2E8F0" strokeWidth="1.5" fill="#243f52" fillOpacity="0.4" />
            
            {/* Council circle beneath canopy */}
            <ellipse cx="300" cy="260" rx="140" ry="25" stroke="#0095D9" strokeWidth="1.5" strokeDasharray="4 2" />

            <text x="40" y="50" fill="#FFFFFF" fontSize="12" fontFamily="monospace" letterSpacing="0.15em">LIFE & PEACE INSTITUTE (LPI)</text>
            <text x="40" y="70" fill="#0095D9" fontSize="10" fontFamily="monospace">CROSS-BORDER PEACE ARCHIVE · BORENA</text>
          </svg>
        </div>
      );

    case 'proj-piazza-monochrome':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-[#475569] via-[#1E293B] to-[#14232c] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#14232c] via-transparent to-transparent pointer-events-none" />
          <svg className="w-full h-full p-8 text-[#F8FAFC]" viewBox="0 0 600 360" fill="none">
            {/* Architectural Isometric Perspective Grid */}
            <line x1="80" y1="280" x2="520" y2="280" stroke="#E2E8F0" strokeWidth="1.5" />
            <line x1="140" y1="280" x2="260" y2="100" stroke="#0095D9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="460" y1="280" x2="340" y2="100" stroke="#0095D9" strokeWidth="1" strokeDasharray="3 3" />

            <rect x="240" y="110" width="120" height="170" stroke="#E2E8F0" strokeWidth="1.5" fill="#14232c" fillOpacity="0.5" />
            <text x="300" y="190" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontFamily="serif" letterSpacing="0.2em">PIAZZA 1934</text>

            <text x="40" y="50" fill="#FFFFFF" fontSize="12" fontFamily="monospace" letterSpacing="0.15em">VISUAL MEMORIES // MONOCHROME STILLS</text>
            <text x="40" y="70" fill="#0095D9" fontSize="10" fontFamily="monospace">35-PLATE ARCHIVAL PRINT COLLECTION</text>
          </svg>
        </div>
      );

    case 'proj-danakil-salt-caravans':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#334155] via-[#1E293B] to-[#14232c] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#14232c] via-transparent to-transparent pointer-events-none" />
          <svg className="w-full h-full p-8 text-[#E2E8F0]" viewBox="0 0 600 360" fill="none">
            {/* Hexagonal Salt Crust Tessellation */}
            <polygon points="120,240 150,220 180,240 180,270 150,290 120,270" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.6" />
            <polygon points="180,240 210,220 240,240 240,270 210,290 180,270" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.6" />
            <polygon points="240,240 270,220 300,240 300,270 270,290 240,270" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.6" />
            <polygon points="300,240 330,220 360,240 360,270 330,290 300,270" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.6" />

            <line x1="40" y1="200" x2="560" y2="200" stroke="#0095D9" strokeWidth="2" />
            <text x="450" y="185" fill="#E2E8F0" fontSize="10" fontFamily="monospace">-120M SEA LEVEL</text>

            <text x="40" y="50" fill="#FFFFFF" fontSize="12" fontFamily="monospace" letterSpacing="0.15em">DANAKIL DEPRESSION · AFAR</text>
            <text x="40" y="70" fill="#0095D9" fontSize="10" fontFamily="monospace">SALT PAN GEOMETRIES & CARAVAN ROUTES</text>
          </svg>
        </div>
      );

    case 'proj-dorze-weavers':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#1b3a4b] via-[#243f52] to-[#14232c] flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#14232c] via-transparent to-transparent pointer-events-none" />
          <svg className="w-full h-full p-8 text-[#E2E8F0]" viewBox="0 0 600 360" fill="none">
            {/* Bamboo Weave Lattice & Loom Threads */}
            {[100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500].map((x) => (
              <line key={x} x1={x} y1="90" x2={x} y2="280" stroke="#94A3B8" strokeWidth="0.75" opacity="0.5" />
            ))}
            <line x1="80" y1="180" x2="520" y2="180" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="80" y1="200" x2="520" y2="200" stroke="#0095D9" strokeWidth="2" strokeDasharray="6 3" />

            <text x="40" y="50" fill="#FFFFFF" fontSize="12" fontFamily="monospace" letterSpacing="0.15em">GAMO HIGHLANDS ARCHIVE</text>
            <text x="40" y="70" fill="#0095D9" fontSize="10" fontFamily="monospace">DORZE & KONSO INDIGENOUS WEAVING</text>
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative w-full h-full overflow-hidden bg-[#14232c] flex items-center justify-center text-white ${className}`}>
          <div className="text-xs font-mono text-[#0095D9]">Origin 13 Documentary Visual</div>
        </div>
      );
  }
};

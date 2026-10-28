import { useState } from 'react';
import { Ruler, Eye, EyeOff, Info, ArrowUpRight, Check } from 'lucide-react';
import { HERO_ROOM } from '../data/products';

export default function MeasurementVisualizer({ onSelectProduct }) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [activeLighting, setActiveLighting] = useState('daylight'); // daylight | golden | evening
  const [activeHotspot, setActiveHotspot] = useState(null);

  const lightingFilters = {
    daylight: 'brightness(1.02) contrast(1.01) saturate(1.0)',
    golden: 'brightness(0.98) sepia(0.18) contrast(1.04) hue-rotate(-8deg)',
    evening: 'brightness(0.85) contrast(1.08) saturate(0.9) hue-rotate(5deg)',
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Spatial Room Measurement Visualizer">
      
      {/* Outer Editorial Container with Stone Border */}
      <div className="bg-[#FFFDFA] border border-[#D8D2C8] p-4 sm:p-6 lg:p-7 shadow-xs">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#D8D2C8]">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-[#62694A]"></div>
            <div>
              <h2 className="text-xs sm:text-sm uppercase tracking-wider font-semibold text-[#292923]">
                Room Lighting &amp; Reference Proportions
              </h2>
              <p className="text-xs text-[#4A463D] mt-0.5">
                Archival Residence 04 · Stockholms län, Sweden (Demo Scene)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            {/* Lighting Mood Switcher */}
            <div className="inline-flex items-center p-0.5 bg-[#F5F1E9] border border-[#D8D2C8] rounded-xs">
              <button
                type="button"
                onClick={() => setActiveLighting('daylight')}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm uppercase tracking-wider font-sans transition-all cursor-pointer ${
                  activeLighting === 'daylight'
                    ? 'bg-[#FFFDFA] text-[#292923] shadow-xs font-medium'
                    : 'text-[#4A463D] hover:text-[#292923]'
                }`}
                title="11:00 AM Natural Daylight"
              >
                Daylight
              </button>
              <button
                type="button"
                onClick={() => setActiveLighting('golden')}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm uppercase tracking-wider font-sans transition-all cursor-pointer ${
                  activeLighting === 'golden'
                    ? 'bg-[#FFFDFA] text-[#292923] shadow-xs font-medium'
                    : 'text-[#4A463D] hover:text-[#292923]'
                }`}
                title="17:30 PM Golden Hour"
              >
                Golden Hour
              </button>
              <button
                type="button"
                onClick={() => setActiveLighting('evening')}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm uppercase tracking-wider font-sans transition-all cursor-pointer ${
                  activeLighting === 'evening'
                    ? 'bg-[#FFFDFA] text-[#292923] shadow-xs font-medium'
                    : 'text-[#4A463D] hover:text-[#292923]'
                }`}
                title="20:00 PM Ambient Dusk"
              >
                Evening
              </button>
            </div>

            {/* Toggle Overlay Button */}
            <button
              type="button"
              onClick={() => setShowOverlay(!showOverlay)}
              className="min-h-[44px] inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
              aria-pressed={showOverlay}
            >
              {showOverlay ? <EyeOff className="w-4 h-4 text-[#62694A]" /> : <Eye className="w-4 h-4 text-[#62694A]" />}
              <span>{showOverlay ? 'Hide Measurements' : 'Show Measurements'}</span>
            </button>
          </div>
        </div>

        {/* The Main High-Quality Living-Room Image Stage */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] overflow-hidden bg-[#EAE5DC] border border-[#D8D2C8]">
          <img
            src={HERO_ROOM.image}
            alt="Sample Scandinavian living room with serene ivory daylight, linen modular sofa and travertine plinth"
            className="w-full h-full object-cover transition-all duration-700 ease-out"
            style={{ filter: lightingFilters[activeLighting] }}
            loading="eager"
          />

          {/* Tasteful Furniture Measurement Overlay */}
          {showOverlay && (
            <div className="absolute inset-0 pointer-events-auto transition-opacity duration-300">
              
              {/* Top Room Dimension Watermark Badge */}
              <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center space-x-2 px-3.5 py-2 bg-[#FFFDFA]/95 backdrop-blur-xs border border-[#D8D2C8] text-[#292923] text-xs font-mono shadow-xs">
                <Ruler className="w-3.5 h-3.5 text-[#62694A]" />
                <span>Room Envelope: 4.80m × 6.20m · Ceiling 3.20m (Sample)</span>
              </div>

              {/* Verified Specification Disclaimer Badge (Honest UI) */}
              <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 px-3.5 py-2 bg-[#FFFDFA]/95 backdrop-blur-xs border border-[#D8D2C8] text-[#292923] text-xs shadow-xs">
                <Info className="w-4 h-4 text-[#62694A] shrink-0" />
                <span className="font-mono text-[#4A463D]">
                  Sample reference dimensions · For proportion estimation
                </span>
              </div>

              {/* Visual Architectural Dimension Lines */}
              {/* 1. Main Sofa Width Line */}
              <div
                className="absolute left-[28%] top-[56%] w-[42%] pointer-events-none"
                style={{ transform: 'translateY(-50%)' }}
              >
                <div className="relative flex flex-col items-center">
                  <span className="mb-1.5 px-2.5 py-1 bg-[#FFFDFA]/95 backdrop-blur-xs border border-[#292923]/40 text-[#292923] font-mono text-xs sm:text-sm font-medium tracking-tight shadow-sm">
                    W: 240 cm (94.5 in) · 3-Seat Span
                  </span>
                  <div className="w-full flex items-center">
                    <div className="w-2.5 h-2.5 border-l border-b border-white rotate-45 shrink-0 bg-[#292923]"></div>
                    <div className="h-[2px] w-full bg-white/95 shadow-sm border-t border-[#292923]/60"></div>
                    <div className="w-2.5 h-2.5 border-r border-t border-white rotate-45 shrink-0 bg-[#292923]"></div>
                  </div>
                </div>
              </div>

              {/* 2. Sofa Depth & Height Callout Line */}
              <div
                className="absolute left-[24%] top-[62%] h-[18%] pointer-events-none hidden sm:flex flex-row items-center"
                style={{ transform: 'translateX(-50%)' }}
              >
                <div className="w-[2px] h-full bg-white/95 border-l border-[#292923]/60 relative">
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#292923] border border-white"></div>
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#292923] border border-white"></div>
                </div>
                <span className="ml-2 px-2 py-0.5 bg-[#FFFDFA]/95 border border-[#292923]/40 text-[#292923] font-mono text-xs whitespace-nowrap shadow-sm">
                  D: 98 cm · H: 76 cm
                </span>
              </div>

              {/* 3. Coffee Table Clearance Line */}
              <div
                className="absolute left-[40%] top-[72%] w-[24%] pointer-events-none"
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-full flex items-center">
                    <div className="w-2 h-2 bg-[#62694A] shrink-0"></div>
                    <div className="h-[2px] w-full border-t border-dashed border-[#FFFDFA] shadow-xs"></div>
                    <div className="w-2 h-2 bg-[#62694A] shrink-0"></div>
                  </div>
                  <span className="mt-1 px-2 py-0.5 bg-[#62694A] text-[#FFFDFA] font-mono text-xs tracking-tight shadow-sm">
                    48 cm Walkway Clearance
                  </span>
                </div>
              </div>

              {/* Interactive Hotspot Pins on Furniture */}
              {HERO_ROOM.hotspots.map((spot) => {
                const isSelected = activeHotspot === spot.id;
                return (
                  <div
                    key={spot.id}
                    className="absolute z-20"
                    style={{ left: spot.x, top: spot.y }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      {/* Pulse Ring */}
                      <span className="absolute -inset-1.5 rounded-full bg-[#62694A]/40 animate-ping opacity-75 pointer-events-none"></span>

                      {/* Hotspot Button */}
                      <button
                        type="button"
                        onClick={() => setActiveHotspot(isSelected ? null : spot.id)}
                        className="relative min-h-[36px] min-w-[36px] w-9 h-9 rounded-full bg-[#FFFDFA] border-2 border-[#62694A] text-[#292923] flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-[#62694A]"
                        aria-label={`Inspect ${spot.label}`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#62694A]"></span>
                      </button>

                      {/* Hotspot Floating Tooltip Card */}
                      {isSelected && (
                        <div className="absolute bottom-11 left-1/2 -translate-x-1/2 w-64 sm:w-72 bg-[#FFFDFA] border border-[#D8D2C8] p-4 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150">
                          <p className="text-xs uppercase tracking-wider text-[#62694A] font-semibold">
                            Archival Specimen
                          </p>
                          <p className="font-serif text-base text-[#292923] font-normal mt-0.5">
                            {spot.label}
                          </p>
                          <p className="text-xs font-mono text-[#4A463D] mt-1">
                            {spot.dimension}
                          </p>
                          <div className="mt-3 pt-2.5 border-t border-[#D8D2C8] flex justify-between items-center">
                            <span className="text-xs text-[#4A463D]">Proportion guide</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveHotspot(null);
                                onSelectProduct(spot.targetProductId);
                              }}
                              className="min-h-[44px] inline-flex items-center space-x-1 text-xs uppercase tracking-wider text-[#62694A] font-medium hover:underline cursor-pointer"
                            >
                              <span>Stage in Room</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* Bottom Bar overlay indicator */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#292923]/60 via-[#292923]/20 to-transparent p-4 flex items-end justify-between pointer-events-none">
            <div className="text-white">
              <span className="text-xs uppercase tracking-widest font-mono text-white/90">
                Spatial Coordinate Axis
              </span>
              <p className="text-xs sm:text-sm font-light text-white/95">
                Archival Living Room · 2D Proportion Study
              </p>
            </div>
            <div className="text-right text-white/90 font-mono text-xs hidden sm:block">
              <span>Standard Metric Proportions</span>
            </div>
          </div>

        </div>

        {/* Bottom Architectural Specification Metadata Ribbon */}
        <div className="mt-5 pt-4 border-t border-[#D8D2C8] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm font-sans">
          <div>
            <span className="text-[#4A463D] uppercase text-xs tracking-wider block font-mono">Total Area</span>
            <span className="text-[#292923] font-mono font-medium">38.5 m² (Sample)</span>
          </div>
          <div>
            <span className="text-[#4A463D] uppercase text-xs tracking-wider block font-mono">Ceiling Clearance</span>
            <span className="text-[#292923] font-mono font-medium">3.20 m (Sample)</span>
          </div>
          <div>
            <span className="text-[#4A463D] uppercase text-xs tracking-wider block font-mono">Daylight Mood</span>
            <span className="text-[#292923] font-mono font-medium">Simulated Tone</span>
          </div>
          <div>
            <span className="text-[#4A463D] uppercase text-xs tracking-wider block font-mono">Circulation Index</span>
            <span className="text-[#62694A] font-mono font-medium flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>48cm Recommended Path</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

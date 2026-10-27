import { ArrowUpRight, Compass, ShieldCheck, Ruler } from 'lucide-react';

export default function Hero({ onPreviewInRoom, onExploreCollection }) {
  return (
    <section className="relative pt-12 pb-14 md:pt-20 md:pb-20 overflow-hidden" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Brand Tagline */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-[1px] bg-[#62694A]"></div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#62694A] font-medium font-sans">
            Curated Furniture &amp; Spatial Room Planning
          </span>
        </div>

        {/* Editorial Headline & Supporting Copy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-baseline">
          
          <div className="lg:col-span-8">
            <h1
              id="hero-heading"
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#292923] font-medium leading-[1.04]"
            >
              Your room. <br />
              <span className="italic font-normal text-[#292923]/95">Reimagined.</span>
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 lg:pl-4">
            <p className="text-base sm:text-lg text-[#3C3932] leading-relaxed font-sans font-normal">
              Discover exceptional furniture staged directly within your room photograph. Explore pieces, test spatial proportions, and preview layout balance before purchasing.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onPreviewInRoom}
                className="min-h-[44px] inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] transition-all duration-200 border border-[#62694A] cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
              >
                <span>Preview in your room</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreCollection}
                className="min-h-[44px] inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm uppercase tracking-wider font-medium bg-transparent hover:bg-[#FFFDFA] text-[#292923] border border-[#D8D2C8] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#62694A]"
              >
                <span>Explore Pieces</span>
              </button>
            </div>
          </div>
        </div>

        {/* Architectural Pillars Strip (Honest UI per Phase 5) */}
        <div className="mt-12 pt-8 border-t border-[#D8D2C8] grid grid-cols-1 md:grid-cols-3 gap-6 text-[#3C3932]">
          <div className="flex items-start space-x-3.5">
            <Ruler className="w-5 h-5 text-[#62694A] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm uppercase tracking-wider font-semibold text-[#292923]">Sample Spatial Proportions</p>
              <p className="text-xs sm:text-sm text-[#4A463D] mt-1 leading-relaxed">
                Manufacturer reference measurements provide clear 2D circulation and proportion estimates for your layout.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <Compass className="w-5 h-5 text-[#62694A] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm uppercase tracking-wider font-semibold text-[#292923]">Atmospheric Ambient Lighting</p>
              <p className="text-xs sm:text-sm text-[#4A463D] mt-1 leading-relaxed">
                Simulate natural morning and golden-hour lighting filters across tactile bouclé and honed travertine materials.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <ShieldCheck className="w-5 h-5 text-[#62694A] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm uppercase tracking-wider font-semibold text-[#292923]">Private In-Browser Staging</p>
              <p className="text-xs sm:text-sm text-[#4A463D] mt-1 leading-relaxed">
                Your room photos stay on your personal device and are saved locally using browser IndexedDB.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

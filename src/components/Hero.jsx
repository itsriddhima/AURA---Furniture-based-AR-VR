import { ArrowUpRight, Compass, ShieldCheck, Ruler } from 'lucide-react';

export default function Hero({ onPreviewInRoom, onExploreCollection }) {
  return (
    <section className="relative pt-8 pb-10 md:pt-14 md:pb-14 overflow-hidden" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Understated Section Tag */}
        <div className="flex items-center space-x-2.5 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#62694A]"></span>
          <span className="text-xs uppercase tracking-wider text-[#62694A] font-semibold font-sans">
            Furniture Discovery &amp; Room Planning
          </span>
        </div>

        {/* Headline & Practical Supporting Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-baseline">
          
          <div className="lg:col-span-7">
            <h1
              id="hero-heading"
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#292923] font-medium leading-[1.08]"
            >
              Your room. <br />
              <span className="italic font-normal text-[#292923]/90">Reimagined.</span>
            </h1>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 lg:pl-2">
            <p className="text-base text-[#3C3932] leading-relaxed font-sans font-normal">
              Stage curated furniture directly onto your room photo. Transparent cutouts and adjustable contact floor shadows make each piece blend naturally into your space.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onPreviewInRoom}
                className="min-h-[44px] inline-flex items-center justify-center space-x-2 px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] transition-all duration-200 border border-[#62694A] cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
              >
                <span>Open Room Planner</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreCollection}
                className="min-h-[44px] inline-flex items-center justify-center space-x-2 px-5 py-3 text-xs sm:text-sm uppercase tracking-wider font-medium bg-[#FFFDFA] hover:bg-[#EAE5DC] text-[#292923] border border-[#D8D2C8] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#62694A]"
              >
                <span>Browse Furniture</span>
              </button>
            </div>
          </div>
        </div>

        {/* Practical Features Strip */}
        <div className="mt-10 pt-6 border-t border-[#D8D2C8] grid grid-cols-1 md:grid-cols-3 gap-6 text-[#3C3932]">
          <div className="flex items-start space-x-3">
            <Ruler className="w-4 h-4 text-[#62694A] mt-1 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#292923]">Realistic Proportions</p>
              <p className="text-xs text-[#4A463D] mt-0.5 leading-relaxed">
                Manufacturer reference measurements provide practical 2D dimensions and clearance estimates.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Compass className="w-4 h-4 text-[#62694A] mt-1 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#292923]">Lighting &amp; Contact Shadow</p>
              <p className="text-xs text-[#4A463D] mt-0.5 leading-relaxed">
                Ground staged pieces with adjustable contact floor shadows, brightness, and warmth filters.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-4 h-4 text-[#62694A] mt-1 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#292923]">Private In-Browser Storage</p>
              <p className="text-xs text-[#4A463D] mt-0.5 leading-relaxed">
                Your room photos and staged layouts stay locally on your device in browser IndexedDB.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

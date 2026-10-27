import { useState } from 'react';
import { ArrowUp, Check } from 'lucide-react';

export default function Footer({ onScrollTo, onStartDesigning }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F5F1E9] border-t border-[#D8D2C8] pt-16 pb-12 text-[#292923]" aria-label="Site Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#D8D2C8]">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-serif text-3xl font-medium tracking-[0.22em] uppercase text-[#292923] block">
              A U R A
            </span>
            <p className="text-xs uppercase tracking-widest text-[#62694A] font-mono font-semibold">
              Spatial Furniture Discovery &amp; Planning
            </p>
            <p className="text-sm sm:text-base text-[#4A463D] font-normal leading-relaxed max-w-sm">
              Discover archival and contemporary furniture staged within your personal living space. Test proportions, save layouts, and plan peaceful rooms with quiet luxury.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#292923] font-semibold">
              Collection
            </p>
            <ul className="space-y-2.5 text-sm text-[#4A463D]">
              <li>
                <button
                  type="button"
                  onClick={() => onScrollTo && onScrollTo('curated-pieces')}
                  className="hover:text-[#62694A] transition-colors cursor-pointer text-left py-1"
                >
                  Lounge Seating
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onScrollTo && onScrollTo('curated-pieces')}
                  className="hover:text-[#62694A] transition-colors cursor-pointer text-left py-1"
                >
                  Low Tables &amp; Plinths
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onScrollTo && onScrollTo('curated-pieces')}
                  className="hover:text-[#62694A] transition-colors cursor-pointer text-left py-1"
                >
                  Tailored Modular Sofas
                </button>
              </li>
              <li>
                <span className="text-[#4A463D]/70 italic py-1 block">Archival Lighting (Upcoming)</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#292923] font-semibold">
              Room Planning
            </p>
            <ul className="space-y-2.5 text-sm text-[#4A463D]">
              <li>
                <button
                  type="button"
                  onClick={onStartDesigning}
                  className="hover:text-[#62694A] transition-colors cursor-pointer text-left py-1 font-medium text-[#292923]"
                >
                  Launch Room Planner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onScrollTo && onScrollTo('how-it-works')}
                  className="hover:text-[#62694A] transition-colors cursor-pointer text-left py-1"
                >
                  Clearance Standards
                </button>
              </li>
              <li>
                <span className="text-[#4A463D] py-1 block">
                  Local Browser Storage
                </span>
              </li>
              <li>
                <span className="text-[#4A463D] py-1 block">
                  Proportion Guides
                </span>
              </li>
            </ul>
          </div>

          {/* Private Atelier Dispatch (Newsletter) */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#292923] font-semibold">
              The Atelier Dispatch
            </p>
            <p className="text-sm text-[#4A463D] font-normal leading-relaxed">
              Receive quarterly previews of limited edition furniture releases, interior proportion studies, and spatial design dispatches.
            </p>

            {subscribed ? (
              <div className="p-3.5 bg-[#FFFDFA] border border-[#62694A] flex items-center space-x-2 text-sm text-[#62694A]">
                <Check className="w-4 h-4 shrink-0" />
                <span>You have been added to our private dispatch list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  required
                  aria-label="Email address for private dispatch"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FFFDFA] border border-[#D8D2C8] text-[#292923] placeholder-[#4A463D]/60 focus-visible:outline-2 focus-visible:outline-[#62694A]"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 text-xs sm:text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] border border-[#62694A] cursor-pointer shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#62694A]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Prototype Transparency Disclosure (Phase 5 Honest UI) */}
        <div className="py-6 border-b border-[#D8D2C8] text-xs font-mono text-[#4A463D] leading-relaxed flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p>
            <strong className="text-[#292923] uppercase">Prototype Notice:</strong> All furniture imagery, dimensions, pricing, and spatial layouts represent sample prototype data. Room photos are processed and stored locally in your browser (IndexedDB).
          </p>
          <span className="text-[#62694A] shrink-0 font-medium">v1.1 · Room Planner Prototype</span>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-[#4A463D] gap-4">
          <p>
            © {new Date().getFullYear()} AURA Spatial Technologies. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="min-h-[44px] inline-flex items-center space-x-1.5 hover:text-[#292923] transition-colors cursor-pointer py-1 text-xs uppercase tracking-wider font-mono focus-visible:outline-2 focus-visible:outline-[#62694A]"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 text-[#62694A]" />
          </button>
        </div>

      </div>
    </footer>
  );
}

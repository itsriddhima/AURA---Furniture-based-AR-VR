import { useState } from 'react';
import { Bookmark, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({
  savedCount = 0,
  onOpenSaved,
  onStartDesigning,
  onScrollTo,
  currentView = 'home',
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onScrollTo) {
      onScrollTo(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5F1E9]/95 backdrop-blur-md border-b border-[#D8D2C8] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Wordmark */}
        <div className="flex items-baseline space-x-3">
          <a
            href="#"
            onClick={(e) => {
              if (currentView !== 'home') {
                e.preventDefault();
                window.location.hash = '';
              }
            }}
            className="group flex items-baseline space-x-2 text-[#292923] focus-visible:outline-2 focus-visible:outline-[#62694A] rounded-sm"
            aria-label="AURA Home"
          >
            <span className="font-serif text-2xl sm:text-3xl font-medium tracking-[0.22em] uppercase text-[#292923]">
              A U R A
            </span>
          </a>
          <span className="hidden md:inline-block text-xs uppercase tracking-widest text-[#4A463D] pl-3 border-l border-[#D8D2C8] font-sans font-medium">
            Room Discovery
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm tracking-wide text-[#292923]" aria-label="Main navigation">
          <button
            type="button"
            onClick={() => handleNavClick('curated-pieces')}
            className="hover:text-[#62694A] transition-colors cursor-pointer py-2 text-sm tracking-wider uppercase font-medium focus-visible:outline-2 focus-visible:outline-[#62694A] rounded-sm"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-[#62694A] transition-colors cursor-pointer py-2 text-sm tracking-wider uppercase font-medium focus-visible:outline-2 focus-visible:outline-[#62694A] rounded-sm"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={onStartDesigning}
            className="hover:text-[#62694A] transition-colors cursor-pointer py-2 text-sm tracking-wider uppercase font-medium focus-visible:outline-2 focus-visible:outline-[#62694A] rounded-sm flex items-center space-x-1"
          >
            <span>Room Planner</span>
          </button>
          
          {/* Saved Designs trigger */}
          <button
            type="button"
            onClick={onOpenSaved}
            className="relative flex items-center space-x-2 hover:text-[#62694A] transition-colors cursor-pointer py-2 text-sm tracking-wider uppercase font-medium focus-visible:outline-2 focus-visible:outline-[#62694A] rounded-sm"
            aria-label={`Saved Designs: ${savedCount} items`}
          >
            <Bookmark className="w-4 h-4 text-[#62694A]" />
            <span>Saved Designs</span>
            <span
              className={`inline-flex items-center justify-center text-xs font-mono px-2 py-0.5 rounded border transition-colors ${
                savedCount > 0
                  ? 'bg-[#62694A] text-[#FFFDFA] border-[#62694A] font-semibold'
                  : 'bg-[#FFFDFA] text-[#4A463D] border-[#D8D2C8]'
              }`}
            >
              {savedCount}
            </span>
          </button>
        </nav>

        {/* Right CTA / Action */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            type="button"
            onClick={onStartDesigning}
            className="min-h-[44px] inline-flex items-center space-x-2 px-6 py-2.5 text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] transition-all duration-200 border border-[#62694A] cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
          >
            <span>Start Designing</span>
            <ArrowUpRight className="w-4 h-4 opacity-90" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            type="button"
            onClick={onOpenSaved}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center relative p-2 text-[#292923] hover:text-[#62694A] focus-visible:outline-2 focus-visible:outline-[#62694A]"
            aria-label={`Saved Designs (${savedCount})`}
          >
            <Bookmark className="w-5 h-5 text-[#62694A]" />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 text-xs bg-[#62694A] text-[#FFFDFA] rounded-full flex items-center justify-center font-mono font-semibold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#292923] hover:text-[#62694A] focus-visible:outline-2 focus-visible:outline-[#62694A] border border-[#D8D2C8] bg-[#FFFDFA]"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D8D2C8] bg-[#FFFDFA] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-md">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            <button
              type="button"
              onClick={() => handleNavClick('curated-pieces')}
              className="text-left py-2.5 text-sm uppercase tracking-wider text-[#292923] hover:text-[#62694A] border-b border-[#D8D2C8]/50"
            >
              Shop Curated Collection
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('how-it-works')}
              className="text-left py-2.5 text-sm uppercase tracking-wider text-[#292923] hover:text-[#62694A] border-b border-[#D8D2C8]/50"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartDesigning();
              }}
              className="text-left py-2.5 text-sm uppercase tracking-wider text-[#292923] hover:text-[#62694A] border-b border-[#D8D2C8]/50 flex items-center justify-between"
            >
              <span>Room Planner (Editor)</span>
              <ArrowUpRight className="w-4 h-4 text-[#62694A]" />
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSaved();
              }}
              className="text-left py-2.5 text-sm uppercase tracking-wider text-[#292923] hover:text-[#62694A] flex items-center justify-between border-b border-[#D8D2C8]/50"
            >
              <span>Saved Designs</span>
              <span className="text-xs font-mono px-2 py-0.5 bg-[#F5F1E9] border border-[#D8D2C8] text-[#292923]">
                {savedCount}
              </span>
            </button>
          </nav>
          
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartDesigning();
              }}
              className="w-full min-h-[44px] py-3 text-sm uppercase tracking-wider font-medium bg-[#62694A] text-[#FFFDFA] hover:bg-[#4B5237] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <span>Launch Room Planner</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

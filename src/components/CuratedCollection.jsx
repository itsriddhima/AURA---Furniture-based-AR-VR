import { useState } from 'react';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function CuratedCollection({
  savedProductIds = [],
  onToggleSave,
  onStageProduct,
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProducts = PRODUCTS.filter((item) => {
    if (activeFilter === 'seating') return item.category.toLowerCase().includes('seating');
    if (activeFilter === 'tables') return item.category.toLowerCase().includes('table');
    return true;
  });

  return (
    <section id="curated-pieces" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="curated-heading">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#D8D2C8]">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#62694A] font-medium mb-3">
            <span>Atelier Collection</span>
            <span className="text-[#D8D2C8]">/</span>
            <span>Series 01</span>
          </div>
          <h2 id="curated-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#292923] font-medium tracking-tight">
            Curated Furniture
          </h2>
          <p className="mt-2 text-base text-[#4A463D] max-w-xl font-normal leading-relaxed">
            Meticulously proportioned archival silhouettes with sample reference dimensions. Stage any piece directly onto your room photograph.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-[#FFFDFA] border border-[#D8D2C8] rounded-xs text-xs sm:text-sm self-start md:self-end">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`min-h-[40px] px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#62694A] text-[#FFFDFA] font-medium'
                : 'text-[#4A463D] hover:text-[#292923]'
            }`}
          >
            All Pieces (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('seating')}
            className={`min-h-[40px] px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer ${
              activeFilter === 'seating'
                ? 'bg-[#62694A] text-[#FFFDFA] font-medium'
                : 'text-[#4A463D] hover:text-[#292923]'
            }`}
          >
            Seating
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('tables')}
            className={`min-h-[40px] px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer ${
              activeFilter === 'tables'
                ? 'bg-[#62694A] text-[#FFFDFA] font-medium'
                : 'text-[#4A463D] hover:text-[#292923]'
            }`}
          >
            Low Tables
          </button>
        </div>
      </div>

      {/* 3 Curated Product Cards Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {filteredProducts.map((product) => {
          const isSaved = savedProductIds.includes(product.id);

          return (
            <article
              key={product.id}
              className="group bg-[#FFFDFA] border border-[#D8D2C8] flex flex-col justify-between hover:border-[#62694A]/70 transition-all duration-300 shadow-xs"
            >
              <div>
                {/* Product Card Image Container */}
                <div className="relative aspect-[4/3] bg-[#EAE5DC] overflow-hidden border-b border-[#D8D2C8]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={() => onToggleSave(product.id)}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center absolute top-3 right-3 p-2.5 border transition-all cursor-pointer shadow-xs ${
                      isSaved
                        ? 'bg-[#62694A] text-[#FFFDFA] border-[#62694A]'
                        : 'bg-[#FFFDFA]/95 text-[#292923] border-[#D8D2C8] hover:bg-[#FFFDFA]'
                    } focus-visible:outline-2 focus-visible:outline-[#62694A]`}
                    aria-label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>

                  {/* Category & Cutout Ready Pills */}
                  <div className="absolute bottom-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-0.5 bg-[#FFFDFA]/95 backdrop-blur-xs border border-[#D8D2C8] text-[11px] uppercase tracking-wider font-mono text-[#4A463D]">
                      {product.category}
                    </span>
                    {product.hasCutout && (
                      <span className="px-2 py-0.5 bg-[#62694A] text-[#FFFDFA] border border-[#62694A] text-[10px] uppercase tracking-wider font-mono">
                        Cutout Ready
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Details Content */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Name and Tagline */}
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#292923] font-medium leading-snug group-hover:text-[#62694A] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A463D] mt-1 font-normal line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Materials & Origin */}
                  <div className="pt-2 border-t border-[#D8D2C8]/60 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start justify-between">
                      <span className="text-[#4A463D] uppercase tracking-wider text-xs font-mono">Material</span>
                      <span className="text-[#292923] text-right font-medium">{product.materials}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-[#4A463D] uppercase tracking-wider text-xs font-mono">Provenance</span>
                      <span className="text-[#4A463D] text-right">{product.origin}</span>
                    </div>
                  </div>

                  {/* Reference Dimensions Box */}
                  <div className="p-3.5 bg-[#F5F1E9] border border-[#D8D2C8] space-y-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#62694A] font-semibold">
                      <span>Sample Dimensions</span>
                      <span className="font-mono">Reference Proportions</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#D8D2C8]/60 text-center font-mono text-xs sm:text-sm text-[#292923]">
                      <div>
                        <span className="block text-[10px] text-[#4A463D] uppercase">Width</span>
                        <span>{product.dimensions.width.split(' ')[0]}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#4A463D] uppercase">Depth</span>
                        <span>{product.dimensions.depth.split(' ')[0]}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#4A463D] uppercase">Height</span>
                        <span>{product.dimensions.height.split(' ')[0]}</span>
                      </div>
                    </div>
                    <div className="text-xs text-[#4A463D] pt-1 text-center font-mono border-t border-[#D8D2C8]/40">
                      Clearance needed: {product.dimensions.clearanceNeeded}
                    </div>
                  </div>

                  {/* Price Block clearly marked as Sample Data */}
                  <div className="pt-1 flex items-baseline justify-between">
                    <div>
                      <span className="font-serif text-2xl font-normal text-[#292923]">
                        {product.price}
                      </span>
                      <span className="block text-xs uppercase tracking-wider text-[#4A463D] font-mono mt-0.5">
                        {product.priceNote}
                      </span>
                    </div>
                    <span className="text-xs text-[#62694A] uppercase tracking-wider font-mono">
                      Metric Reference
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-5 sm:p-6 pt-0">
                <button
                  type="button"
                  onClick={() => onStageProduct(product)}
                  className="w-full min-h-[44px] inline-flex items-center justify-center space-x-2 py-3 px-4 text-xs sm:text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] transition-colors border border-[#62694A] cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
                >
                  <span>Stage in Room</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Sample Data Disclosure Banner */}
      <div className="mt-10 p-4 border border-[#D8D2C8] bg-[#FFFDFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#4A463D]">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#62694A]"></div>
          <span className="font-mono uppercase text-xs text-[#292923] font-semibold">Prototype Catalog Status</span>
          <span className="hidden sm:inline text-[#D8D2C8]">·</span>
          <span>Sample pricing and reference dimensions for demonstration purposes.</span>
        </div>
        <div className="font-mono text-xs uppercase tracking-wider text-[#62694A]">
          Interactive Room Planner Ready
        </div>
      </div>

    </section>
  );
}

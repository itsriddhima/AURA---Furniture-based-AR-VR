import { useEffect } from 'react';
import { X, Plus, Info } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

export default function FurnitureCatalogDrawer({
  isOpen,
  onClose,
  onAddProductToRoom,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#292923]/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalog-drawer-title"
    >
      <div className="relative w-full max-w-md bg-[#FFFDFA] border-l border-[#D8D2C8] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#D8D2C8] flex items-center justify-between bg-[#F5F1E9]">
          <div>
            <h2 id="catalog-drawer-title" className="font-serif text-xl sm:text-2xl text-[#292923] font-normal">
              Furniture Catalog
            </h2>
            <p className="text-xs uppercase tracking-wider text-[#4A463D] font-mono mt-0.5">
              Select Pieces to Stage
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#292923] hover:text-[#62694A] border border-[#D8D2C8] bg-[#FFFDFA] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#62694A]"
            aria-label="Close Catalog Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Callout (Honest UI) */}
        <div className="p-3.5 bg-[#F5F1E9] border-b border-[#D8D2C8] flex items-start space-x-2.5 text-xs text-[#4A463D]">
          <Info className="w-4 h-4 text-[#62694A] mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            Pieces feature transparent cutouts and adjustable contact shadows to blend cleanly into your room photo without box backgrounds.
          </p>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="p-4 bg-[#F5F1E9] border border-[#D8D2C8] hover:border-[#62694A]/70 transition-colors flex flex-col space-y-3"
            >
              <div className="flex space-x-3.5">
                <div className="w-24 h-24 bg-[#FFFDFA] border border-[#D8D2C8] p-1 flex items-center justify-center shrink-0">
                  <img
                    src={product.cutoutImage || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-[#62694A] font-semibold block">
                      {product.category}
                    </span>
                    {product.hasCutout && (
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-[#FFFDFA] border border-[#D8D2C8] text-[#62694A]">
                        Cutout
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-base text-[#292923] truncate mt-0.5">
                    {product.name}
                  </h4>
                  <p className="font-mono text-sm text-[#292923] mt-0.5 font-medium">
                    {product.price}{' '}
                    <span className="text-xs font-normal text-[#4A463D]">(Sample)</span>
                  </p>
                  <p className="font-mono text-xs text-[#4A463D] mt-0.5">
                    {product.dimensions.width} × {product.dimensions.depth}
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#4A463D] border-t border-[#D8D2C8]/70 pt-2 space-y-1">
                <p>
                  <strong className="text-[#292923]">Material:</strong> {product.materials}
                </p>
                <p className="italic text-[11px] text-[#62694A]">
                  Clearance: {product.dimensions.clearanceNeeded}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddProductToRoom(product);
                  onClose();
                }}
                className="w-full min-h-[44px] inline-flex items-center justify-center space-x-2 py-2.5 px-4 text-xs sm:text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] transition-colors border border-[#62694A] cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Room Canvas</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D8D2C8] bg-[#F5F1E9] text-center text-xs text-[#4A463D] font-mono">
          <span>AURA Archival Series · Prototype Catalog</span>
        </div>

      </div>
    </div>
  );
}

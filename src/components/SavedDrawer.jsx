import { useEffect } from 'react';
import { X, Bookmark, Trash2, ArrowUpRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function SavedDrawer({
  isOpen,
  onClose,
  savedProductIds = [],
  onRemoveSaved,
  onStageProduct,
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

  const savedProducts = PRODUCTS.filter((p) => savedProductIds.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#292923]/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-drawer-title"
    >
      <div className="relative w-full max-w-md bg-[#FFFDFA] border-l border-[#D8D2C8] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#D8D2C8] flex items-center justify-between bg-[#F5F1E9]">
          <div className="flex items-center space-x-2.5">
            <Bookmark className="w-5 h-5 text-[#62694A]" />
            <h2 id="saved-drawer-title" className="font-serif text-2xl text-[#292923] font-normal">
              Saved Designs
            </h2>
            <span className="font-mono text-xs px-2.5 py-0.5 bg-[#FFFDFA] border border-[#D8D2C8] text-[#4A463D] font-medium">
              {savedProductIds.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#292923] hover:text-[#62694A] border border-[#D8D2C8] bg-[#FFFDFA] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#62694A]"
            aria-label="Close Saved Designs Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {savedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F5F1E9] border border-[#D8D2C8] flex items-center justify-center text-[#4A463D]">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <p className="font-serif text-xl text-[#292923]">No saved designs yet</p>
                <p className="text-sm text-[#4A463D] mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Click the bookmark icon on any piece in our curated collection to compare dimensions and stage them in your room layout.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wider text-[#4A463D] font-mono font-medium">
                Archival Selection for Room Staging
              </p>

              {savedProducts.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#F5F1E9] border border-[#D8D2C8] flex flex-col space-y-3"
                >
                  <div className="flex space-x-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover border border-[#D8D2C8] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-[#62694A] font-semibold">
                        {item.category}
                      </p>
                      <h4 className="font-serif text-lg text-[#292923] truncate">
                        {item.name}
                      </h4>
                      <p className="font-mono text-sm text-[#292923] mt-0.5 font-medium">
                        {item.price} <span className="text-xs text-[#4A463D]">(Sample)</span>
                      </p>
                      <p className="font-mono text-xs text-[#4A463D] truncate mt-1">
                        {item.dimensions.width} × {item.dimensions.depth}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D8D2C8]/70 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onStageProduct(item);
                      }}
                      className="min-h-[44px] inline-flex items-center space-x-1.5 text-xs sm:text-sm uppercase tracking-wider text-[#62694A] font-medium hover:underline cursor-pointer"
                    >
                      <span>Stage in Room Planner</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveSaved(item.id)}
                      className="min-h-[44px] inline-flex items-center space-x-1.5 text-xs text-[#4A463D] hover:text-[#7A271A] cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {savedProducts.length > 0 && (
          <div className="p-6 border-t border-[#D8D2C8] bg-[#F5F1E9] space-y-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onStageProduct(savedProducts[0]);
              }}
              className="w-full min-h-[44px] py-3 text-xs sm:text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] transition-colors border border-[#62694A] flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <span>Stage in Room Planner</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <p className="text-xs font-mono text-center text-[#4A463D]">
              Sample staging collection · Ready for 2D room canvas
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

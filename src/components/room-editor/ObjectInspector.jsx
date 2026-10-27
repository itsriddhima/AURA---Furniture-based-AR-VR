import { Sliders, Layers, Trash2, Copy, Ruler } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

export default function ObjectInspector({
  selectedItem,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
  onBringForward,
  onSendBackward,
  onDeselect,
}) {
  if (!selectedItem) {
    return (
      <aside className="w-full lg:w-80 bg-[#FFFDFA] border-t lg:border-t-0 lg:border-l border-[#D8D2C8] p-5 sm:p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#D8D2C8]">
            <Sliders className="w-4 h-4 text-[#62694A]" />
            <h3 className="text-xs uppercase tracking-widest font-mono text-[#292923] font-medium">
              Spatial Inspector
            </h3>
          </div>

          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F1E9] border border-[#D8D2C8] flex items-center justify-center text-[#4A463D]">
              <Ruler className="w-5 h-5" />
            </div>
            <p className="font-serif text-lg text-[#292923]">No Object Selected</p>
            <p className="text-xs sm:text-sm text-[#4A463D] font-light leading-relaxed max-w-xs mx-auto">
              Click or tap any furniture piece on the room canvas to adjust its scale, rotation angle, layer position, or dimensions.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#D8D2C8] text-xs text-[#4A463D] font-mono">
          <p>Tip: You can also drag the handles directly on the canvas to resize and rotate.</p>
        </div>
      </aside>
    );
  }

  const product = PRODUCTS.find((p) => p.id === selectedItem.productId);
  const scalePercent = Math.round(selectedItem.scale * 100);
  const rotationDegrees = Math.round(selectedItem.rotation % 360);

  const handleScaleChange = (newScale) => {
    onUpdateItem(selectedItem.instanceId, { scale: Math.max(0.3, Math.min(3.0, newScale)) });
  };

  const handleRotationChange = (newRotation) => {
    let normalized = Math.round(newRotation) % 360;
    if (normalized < 0) normalized += 360;
    onUpdateItem(selectedItem.instanceId, { rotation: normalized });
  };

  return (
    <aside className="w-full lg:w-80 bg-[#FFFDFA] border-t lg:border-t-0 lg:border-l border-[#D8D2C8] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-full">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D2C8]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#62694A]"></span>
            <h3 className="text-xs uppercase tracking-widest font-mono text-[#292923] font-medium">
              Selected Specimen
            </h3>
          </div>
          <button
            type="button"
            onClick={onDeselect}
            className="text-xs uppercase tracking-wider text-[#4A463D] hover:text-[#292923] cursor-pointer"
          >
            Deselect
          </button>
        </div>

        {/* Product Identity */}
        <div className="flex space-x-3.5">
          {product && (
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover border border-[#D8D2C8] shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-[#62694A] font-semibold block">
              {product?.category || 'Furniture Piece'}
            </span>
            <h4 className="font-serif text-base text-[#292923] truncate">
              {product?.name || 'Curated Piece'}
            </h4>
            <p className="font-mono text-xs text-[#292923] mt-0.5">
              {product?.price} <span className="text-[10px] text-[#4A463D]">(Sample)</span>
            </p>
          </div>
        </div>

        {/* Sample Reference Dimensions Box */}
        {product && (
          <div className="p-3 bg-[#F5F1E9] border border-[#D8D2C8] space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#62694A] font-medium">
              <span>Sample Dimensions</span>
              <span>1:1 Reference</span>
            </div>
            <div className="grid grid-cols-3 gap-1 font-mono text-[11px] text-[#292923] text-center pt-1 border-t border-[#D8D2C8]/60">
              <div>
                <span className="block text-[9px] text-[#4A463D] uppercase">Width</span>
                <span>{product.dimensions.width.split(' ')[0]}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#4A463D] uppercase">Depth</span>
                <span>{product.dimensions.depth.split(' ')[0]}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#4A463D] uppercase">Height</span>
                <span>{product.dimensions.height.split(' ')[0]}</span>
              </div>
            </div>
            <p className="text-[10px] text-[#4A463D] pt-1 border-t border-[#D8D2C8]/40">
              Clearance required: {product.dimensions.clearanceNeeded}
            </p>
          </div>
        )}

        {/* Scale Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#292923] font-medium uppercase tracking-wider text-[11px]">Proportion Scale</span>
            <span className="text-[#62694A] font-semibold">{scalePercent}%</span>
          </div>
          <input
            type="range"
            min="40"
            max="220"
            step="5"
            value={scalePercent}
            onChange={(e) => handleScaleChange(Number(e.target.value) / 100)}
            className="w-full accent-[#62694A] cursor-pointer"
            aria-label="Object scale percentage"
          />
          <div className="flex justify-between items-center text-[10px] font-mono text-[#4A463D]">
            <span>Smaller (40%)</span>
            <button
              type="button"
              onClick={() => handleScaleChange(1.0)}
              className="px-2 py-0.5 border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] cursor-pointer"
            >
              Reset 100%
            </button>
            <span>Larger (220%)</span>
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#292923] font-medium uppercase tracking-wider text-[11px]">Rotation Angle</span>
            <span className="text-[#62694A] font-semibold">{rotationDegrees}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={rotationDegrees}
            onChange={(e) => handleRotationChange(Number(e.target.value))}
            className="w-full accent-[#62694A] cursor-pointer"
            aria-label="Object rotation angle"
          />
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[0, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => handleRotationChange(deg)}
                className={`py-1 text-xs font-mono border transition-colors cursor-pointer ${
                  rotationDegrees === deg
                    ? 'bg-[#62694A] text-[#FFFDFA] border-[#62694A]'
                    : 'bg-[#F5F1E9] text-[#292923] border-[#D8D2C8] hover:bg-[#EAE5DC]'
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>

        {/* Layer Arranging */}
        <div className="space-y-2 pt-2 border-t border-[#D8D2C8]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#292923] block">
            Layer Stacking
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onBringForward(selectedItem.instanceId)}
              className="min-h-[40px] px-3 py-1.5 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bring Forward</span>
            </button>
            <button
              type="button"
              onClick={() => onSendBackward(selectedItem.instanceId)}
              className="min-h-[40px] px-3 py-1.5 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5 rotate-180" />
              <span>Send Back</span>
            </button>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="pt-5 border-t border-[#D8D2C8] space-y-2">
        <button
          type="button"
          onClick={() => onDuplicateItem(selectedItem.instanceId)}
          className="w-full min-h-[44px] inline-flex items-center justify-center space-x-2 py-2.5 px-4 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
        >
          <Copy className="w-4 h-4" />
          <span>Duplicate Piece</span>
        </button>

        <button
          type="button"
          onClick={() => onDeleteItem(selectedItem.instanceId)}
          className="w-full min-h-[44px] inline-flex items-center justify-center space-x-2 py-2.5 px-4 text-xs uppercase tracking-wider font-medium border border-[#E0B4AD] bg-[#FFF8F7] hover:bg-[#FDF2F0] text-[#7A271A] transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
        >
          <Trash2 className="w-4 h-4" />
          <span>Remove From Room</span>
        </button>
      </div>
    </aside>
  );
}

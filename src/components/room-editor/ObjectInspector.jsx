import { useState, useRef } from 'react';
import {
  Sliders,
  Layers,
  Trash2,
  Copy,
  Ruler,
  Sun,
  Sparkles,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { removeBackground, readUploadedCutout } from '../../utils/backgroundRemoval';

export default function ObjectInspector({
  selectedItem,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
  onBringForward,
  onSendBackward,
  onDeselect,
}) {
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState({ percent: 0, statusText: '' });
  const [bgError, setBgError] = useState(null);
  const fileInputRef = useRef(null);

  if (!selectedItem) {
    return (
      <aside className="w-full lg:w-84 bg-[#FFFDFA] border-t lg:border-t-0 lg:border-l border-[#D8D2C8] p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#D8D2C8]">
            <Sliders className="w-4 h-4 text-[#62694A]" />
            <h3 className="text-xs uppercase tracking-wider font-mono text-[#292923] font-medium">
              Item Inspector
            </h3>
          </div>

          <div className="py-10 text-center space-y-2.5">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#F5F1E9] border border-[#D8D2C8] flex items-center justify-center text-[#4A463D]">
              <Ruler className="w-4 h-4" />
            </div>
            <p className="font-serif text-base text-[#292923]">No Item Selected</p>
            <p className="text-xs text-[#4A463D] font-normal leading-relaxed max-w-xs mx-auto">
              Select any staged furniture piece on your room canvas to adjust position, contact shadow, room lighting, scale, or cutout properties.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#D8D2C8] text-[11px] text-[#4A463D] font-mono leading-relaxed">
          Tip: Use corner handles on canvas to scale, or top handle to rotate.
        </div>
      </aside>
    );
  }

  const product = PRODUCTS.find((p) => p.id === selectedItem.productId);
  const scalePercent = Math.round(selectedItem.scale * 100);
  const rotationDegrees = Math.round(selectedItem.rotation % 360);

  const isUsingCutout = selectedItem.useCutout !== false;
  const hasCustomCutout = Boolean(selectedItem.customCutoutUrl);

  const lighting = {
    brightness: 100,
    contrast: 100,
    warmth: 0,
    shadowIntensity: 45,
    shadowBlur: 14,
    shadowOffsetY: 8,
    ...(selectedItem.lighting || {}),
  };

  const handleScaleChange = (newScale) => {
    onUpdateItem(selectedItem.instanceId, { scale: Math.max(0.3, Math.min(3.0, newScale)) });
  };

  const handleRotationChange = (newRotation) => {
    let normalized = Math.round(newRotation) % 360;
    if (normalized < 0) normalized += 360;
    onUpdateItem(selectedItem.instanceId, { rotation: normalized });
  };

  const handleLightingChange = (key, value) => {
    onUpdateItem(selectedItem.instanceId, {
      lighting: {
        ...lighting,
        [key]: value,
      },
    });
  };

  const handleResetLighting = () => {
    onUpdateItem(selectedItem.instanceId, {
      lighting: {
        brightness: 100,
        contrast: 100,
        warmth: 0,
        shadowIntensity: 45,
        shadowBlur: 14,
        shadowOffsetY: 8,
      },
    });
  };

  const handleTriggerRemoveBg = async () => {
    if (!product?.image) return;
    setIsRemovingBg(true);
    setBgError(null);
    setBgProgress({ percent: 15, statusText: 'Initializing canvas isolation...' });

    const result = await removeBackground(product.image, {
      cacheKey: product.id,
      onProgress: (pct, msg) => setBgProgress({ percent: pct, statusText: msg }),
    });

    setIsRemovingBg(false);
    if (result.success && result.dataUrl) {
      onUpdateItem(selectedItem.instanceId, {
        customCutoutUrl: result.dataUrl,
        useCutout: true,
      });
    } else {
      setBgError(result.message || 'Background isolation failed.');
    }
  };

  const handleUploadCutout = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readUploadedCutout(file);
      onUpdateItem(selectedItem.instanceId, {
        customCutoutUrl: dataUrl,
        useCutout: true,
      });
      setBgError(null);
    } catch (err) {
      setBgError(err.message || 'Failed to read image.');
    }
    e.target.value = '';
  };

  return (
    <aside className="w-full lg:w-84 bg-[#FFFDFA] border-t lg:border-t-0 lg:border-l border-[#D8D2C8] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto max-h-[60vh] lg:max-h-full">
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#D8D2C8]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#62694A]"></span>
            <h3 className="text-xs uppercase tracking-wider font-mono text-[#292923] font-medium">
              Item Inspector
            </h3>
          </div>
          <button
            type="button"
            onClick={onDeselect}
            className="text-xs text-[#4A463D] hover:text-[#292923] cursor-pointer"
          >
            Deselect
          </button>
        </div>

        {/* Product Identity */}
        <div className="flex items-start space-x-3">
          {product && (
            <img
              src={selectedItem.customCutoutUrl || product.cutoutImage || product.image}
              alt={product.name}
              className="w-14 h-14 object-contain bg-[#F5F1E9] border border-[#D8D2C8] p-1 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-[#62694A] font-semibold block">
              {product?.category || 'Furniture Piece'}
            </span>
            <h4 className="font-serif text-sm font-medium text-[#292923] truncate">
              {product?.name || 'Selected Piece'}
            </h4>
            <p className="font-mono text-xs text-[#292923] mt-0.5">
              {product?.dimensions.width.split(' ')[0]} × {product?.dimensions.depth.split(' ')[0]}
            </p>
          </div>
        </div>

        {/* 1. Realistic Cutout & Asset Management */}
        <div className="p-3 bg-[#F5F1E9] border border-[#D8D2C8] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#292923] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#62694A]" />
              <span>Background Cutout</span>
            </span>

            <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFDFA] border border-[#D8D2C8] text-[#62694A]">
              <CheckCircle2 className="w-3 h-3 text-[#62694A]" />
              <span>{isUsingCutout ? (hasCustomCutout ? 'Custom Cutout' : 'Cutout Active') : 'Photo Card'}</span>
            </span>
          </div>

          <p className="text-[11px] text-[#4A463D] leading-relaxed">
            {isUsingCutout
              ? 'Transparent pixels enable independent placement over room surfaces without box edges.'
              : 'Original rectangular photograph card is currently active.'}
          </p>

          {/* Background Removal Progress State */}
          {isRemovingBg && (
            <div className="p-2.5 bg-[#FFFDFA] border border-[#D8D2C8] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#292923]">
                <span className="flex items-center space-x-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#62694A]" />
                  <span>{bgProgress.statusText}</span>
                </span>
                <span>{bgProgress.percent}%</span>
              </div>
              <div className="w-full bg-[#EAE5DC] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#62694A] h-full transition-all duration-200"
                  style={{ width: `${bgProgress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Background Removal Error State */}
          {bgError && (
            <div className="p-2 bg-[#FFF8F7] border border-[#E0B4AD] text-[11px] text-[#7A271A] space-y-1.5">
              <div className="flex items-start space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <p>{bgError}</p>
              </div>
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleTriggerRemoveBg}
                  className="underline hover:text-[#5C1C13] cursor-pointer"
                >
                  Retry Analysis
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="underline hover:text-[#5C1C13] cursor-pointer"
                >
                  Upload PNG Cutout
                </button>
              </div>
            </div>
          )}

          {/* Actions: Toggle Mode / Re-isolate / Upload Cutout */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => onUpdateItem(selectedItem.instanceId, { useCutout: !isUsingCutout })}
              className="py-1.5 px-2 text-[11px] border border-[#D8D2C8] bg-[#FFFDFA] hover:bg-[#EAE5DC] text-[#292923] text-center cursor-pointer transition-colors"
            >
              {isUsingCutout ? 'View Original' : 'Use Cutout'}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-1.5 px-2 text-[11px] border border-[#D8D2C8] bg-[#FFFDFA] hover:bg-[#EAE5DC] text-[#292923] text-center cursor-pointer transition-colors flex items-center justify-center space-x-1"
            >
              <Upload className="w-3 h-3 text-[#62694A]" />
              <span>Upload PNG</span>
            </button>
          </div>

          {/* Hidden File Input for uploading custom cutout */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/webp"
            onChange={handleUploadCutout}
            className="hidden"
            aria-label="Upload transparent cutout PNG"
          />
        </div>

        {/* 2. Realistic Lighting & Contact Shadow Controls */}
        <div className="p-3 bg-[#F5F1E9] border border-[#D8D2C8] space-y-3 text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#D8D2C8]/70">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#292923] flex items-center space-x-1.5">
              <Sun className="w-3.5 h-3.5 text-[#62694A]" />
              <span>Room Lighting &amp; Shadow</span>
            </span>
            <button
              type="button"
              onClick={handleResetLighting}
              className="text-[10px] text-[#4A463D] hover:text-[#292923] underline cursor-pointer"
              title="Reset lighting parameters"
            >
              Reset
            </button>
          </div>

          {/* Contact Floor Shadow Intensity */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-[#292923]">
              <span>Contact Shadow</span>
              <span className="text-[#62694A] font-semibold">{lighting.shadowIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={lighting.shadowIntensity}
              onChange={(e) => handleLightingChange('shadowIntensity', Number(e.target.value))}
              className="w-full accent-[#62694A] cursor-pointer h-1.5"
              aria-label="Contact floor shadow intensity"
            />
          </div>

          {/* Shadow Softness (Blur) */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-[#292923]">
              <span>Shadow Softness</span>
              <span className="text-[#62694A] font-semibold">{lighting.shadowBlur}px</span>
            </div>
            <input
              type="range"
              min="2"
              max="36"
              step="2"
              value={lighting.shadowBlur}
              onChange={(e) => handleLightingChange('shadowBlur', Number(e.target.value))}
              className="w-full accent-[#62694A] cursor-pointer h-1.5"
              aria-label="Contact floor shadow blur softness"
            />
          </div>

          {/* Brightness Adjustment */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-[#292923]">
              <span>Brightness</span>
              <span className="text-[#62694A] font-semibold">{lighting.brightness}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="130"
              step="2"
              value={lighting.brightness}
              onChange={(e) => handleLightingChange('brightness', Number(e.target.value))}
              className="w-full accent-[#62694A] cursor-pointer h-1.5"
              aria-label="Atmospheric brightness adjustment"
            />
          </div>

          {/* Warmth (Color Temperature) */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-[#292923]">
              <span>Atmospheric Warmth</span>
              <span className="text-[#62694A] font-semibold">
                {lighting.warmth > 0 ? `+${lighting.warmth} Warm` : lighting.warmth < 0 ? `${lighting.warmth} Cool` : 'Neutral'}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="2"
              value={lighting.warmth}
              onChange={(e) => handleLightingChange('warmth', Number(e.target.value))}
              className="w-full accent-[#62694A] cursor-pointer h-1.5"
              aria-label="Atmospheric warmth temperature adjustment"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-[#292923]">
              <span>Contrast</span>
              <span className="text-[#62694A] font-semibold">{lighting.contrast}%</span>
            </div>
            <input
              type="range"
              min="75"
              max="125"
              step="2"
              value={lighting.contrast}
              onChange={(e) => handleLightingChange('contrast', Number(e.target.value))}
              className="w-full accent-[#62694A] cursor-pointer h-1.5"
              aria-label="Contrast adjustment"
            />
          </div>
        </div>

        {/* 3. Scale Controls */}
        <div className="space-y-1.5 pt-1">
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
            className="w-full accent-[#62694A] cursor-pointer h-1.5"
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

        {/* 4. Rotation Controls */}
        <div className="space-y-1.5">
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
            className="w-full accent-[#62694A] cursor-pointer h-1.5"
            aria-label="Object rotation angle"
          />
          <div className="grid grid-cols-4 gap-1 pt-0.5">
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

        {/* 5. Layer Arranging */}
        <div className="space-y-1.5 pt-2 border-t border-[#D8D2C8]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#292923] block">
            Layer Stacking
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onBringForward(selectedItem.instanceId)}
              className="min-h-[38px] px-2.5 py-1 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bring Forward</span>
            </button>
            <button
              type="button"
              onClick={() => onSendBackward(selectedItem.instanceId)}
              className="min-h-[38px] px-2.5 py-1 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5 rotate-180" />
              <span>Send Back</span>
            </button>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#D8D2C8] space-y-2 mt-4">
        <button
          type="button"
          onClick={() => onDuplicateItem(selectedItem.instanceId)}
          className="w-full min-h-[40px] inline-flex items-center justify-center space-x-2 py-2 px-3 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate Piece</span>
        </button>

        <button
          type="button"
          onClick={() => onDeleteItem(selectedItem.instanceId)}
          className="w-full min-h-[40px] inline-flex items-center justify-center space-x-2 py-2 px-3 text-xs uppercase tracking-wider font-medium border border-[#E0B4AD] bg-[#FFF8F7] hover:bg-[#FDF2F0] text-[#7A271A] transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove Piece</span>
        </button>
      </div>
    </aside>
  );
}

import { useRef, useState, useEffect } from 'react';
import { RotateCw, Trash2, Move, Info } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

export default function RoomCanvas({
  roomImage,
  placedItems = [],
  selectedId,
  onSelectItem,
  onUpdateItem,
  onDeleteItem,
  onRecordHistory,
}) {
  const containerRef = useRef(null);
  const [imageAspectRatio, setImageAspectRatio] = useState('16/10');
  const [activeDrag, setActiveDrag] = useState(null);
  const dragSnapshotRef = useRef(null);
  const hasMovedRef = useRef(false);

  // When roomImage changes, detect natural aspect ratio to prevent cropping
  useEffect(() => {
    if (!roomImage?.url) return;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setImageAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
      }
    };
    img.src = roomImage.url;
  }, [roomImage?.url]);

  const handlePointerDown = (e, item, actionType = 'move') => {
    e.stopPropagation();
    e.preventDefault();

    onSelectItem(item.instanceId);

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const itemPixelX = (item.x / 100) * rect.width;
    const itemPixelY = (item.y / 100) * rect.height;
    const centerClientX = rect.left + itemPixelX;
    const centerClientY = rect.top + itemPixelY;

    // Snapshot state BEFORE drag/resize/rotate starts for rock-solid Undo
    dragSnapshotRef.current = JSON.parse(JSON.stringify(placedItems));
    hasMovedRef.current = false;

    const initialDistance = Math.hypot(e.clientX - centerClientX, e.clientY - centerClientY);

    setActiveDrag({
      type: actionType,
      instanceId: item.instanceId,
      pointerStartX: e.clientX,
      pointerStartY: e.clientY,
      initialItemX: item.x,
      initialItemY: item.y,
      initialScale: item.scale,
      initialRotation: item.rotation,
      centerClientX,
      centerClientY,
      initialDistance: Math.max(initialDistance, 10),
      containerWidth: rect.width,
      containerHeight: rect.height,
    });
  };

  useEffect(() => {
    if (!activeDrag) return;

    const handlePointerMove = (e) => {
      const {
        type,
        instanceId,
        pointerStartX,
        pointerStartY,
        initialItemX,
        initialItemY,
        initialScale,
        centerClientX,
        centerClientY,
        initialDistance,
        containerWidth,
        containerHeight,
      } = activeDrag;

      const deltaX = e.clientX - pointerStartX;
      const deltaY = e.clientY - pointerStartY;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        hasMovedRef.current = true;
      }

      if (type === 'move') {
        const deltaXPercent = (deltaX / containerWidth) * 100;
        const deltaYPercent = (deltaY / containerHeight) * 100;

        const newX = Math.max(5, Math.min(95, initialItemX + deltaXPercent));
        const newY = Math.max(5, Math.min(95, initialItemY + deltaYPercent));

        onUpdateItem(instanceId, { x: newX, y: newY }, false);
      } else if (type === 'resize') {
        // True radial distance scaling: moving away from center expands; moving toward center shrinks
        const currentDistance = Math.hypot(e.clientX - centerClientX, e.clientY - centerClientY);
        const scaleMultiplier = currentDistance / initialDistance;
        const newScale = Math.max(0.35, Math.min(2.8, initialScale * scaleMultiplier));

        onUpdateItem(instanceId, { scale: newScale }, false);
      } else if (type === 'rotate') {
        // Absolute angle relative to center: handle starts pointing straight up (-90 deg)
        const currentAngle = Math.atan2(e.clientY - centerClientY, e.clientX - centerClientX) * (180 / Math.PI);
        let deg = Math.round(currentAngle + 90) % 360;
        if (deg < 0) deg += 360;

        onUpdateItem(instanceId, { rotation: deg }, false);
      }
    };

    const handlePointerUp = () => {
      if (hasMovedRef.current && dragSnapshotRef.current && onRecordHistory) {
        // Push the snapshot from BEFORE the drag started
        onRecordHistory(dragSnapshotRef.current);
      }
      setActiveDrag(null);
      dragSnapshotRef.current = null;
      hasMovedRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [activeDrag, onUpdateItem, onRecordHistory]);

  const handleCanvasClick = (e) => {
    if (e.target === containerRef.current || e.target.tagName === 'IMG') {
      onSelectItem(null);
    }
  };

  return (
    <div className="relative w-full flex-1 flex items-center justify-center p-3 sm:p-6 bg-[#EAE5DC] overflow-auto select-none">
      
      {/* 2D Room Canvas Stage */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        className="relative max-w-full max-h-[75vh] bg-[#F5F1E9] border border-[#D8D2C8] shadow-md overflow-hidden cursor-crosshair touch-none transition-all duration-300"
        style={{
          aspectRatio: imageAspectRatio,
          width: 'auto',
          maxWidth: '100%',
          maxHeight: '75vh',
        }}
      >
        {/* Background Room Photo */}
        <img
          src={roomImage.url}
          alt={roomImage.name || 'Room background stage'}
          className="w-full h-full object-contain pointer-events-none"
          draggable="false"
        />

        {/* Demo Room Indicator if using sample image */}
        {roomImage.isDemo && (
          <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-[#FFFDFA]/95 backdrop-blur-xs border border-[#D8D2C8] text-xs font-mono text-[#4A463D] shadow-xs flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#62694A]"></span>
            <span>Sample Demo Room · Stockholm Archipelago</span>
          </div>
        )}

        {/* Canvas Scale Axis Markings */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center space-x-2 px-2.5 py-1 bg-[#FFFDFA]/90 text-xs font-mono text-[#4A463D] border border-[#D8D2C8]">
          <Info className="w-3.5 h-3.5 text-[#62694A]" />
          <span>2D Room Canvas · Drag to position · Corner handles to resize · Top stalk to rotate</span>
        </div>

        {/* Placed Furniture Objects Layer */}
        {placedItems.map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId);
          const isSelected = selectedId === item.instanceId;

          // Normalized relative sizing based on furniture footprint
          const baseWidth = item.productId === 'njord-modular-sofa' ? 260 : item.productId === 'alabaster-coffee-table' ? 180 : 140;
          const displayWidth = baseWidth * item.scale;

          const displayImageSrc =
            item.useCutout !== false
              ? (item.customCutoutUrl || product?.cutoutImage || product?.image)
              : product?.image;

          const lighting = {
            brightness: 100,
            contrast: 100,
            warmth: 0,
            shadowIntensity: 45,
            shadowBlur: 14,
            shadowOffsetY: 8,
            ...(item.lighting || {}),
          };

          return (
            <div
              key={item.instanceId}
              onPointerDown={(e) => handlePointerDown(e, item, 'move')}
              className="absolute group touch-none"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                width: `${displayWidth}px`,
                zIndex: isSelected ? 40 : item.zIndex || 10,
                cursor: isSelected ? 'grab' : 'pointer',
              }}
            >
              {/* Furniture Object Container */}
              <div
                className={`relative transition-all duration-150 ${
                  isSelected
                    ? 'outline outline-1 outline-[#62694A] outline-offset-3'
                    : 'hover:outline hover:outline-1 hover:outline-[#62694A]/40'
                }`}
              >
                {/* Dynamic Contact Floor Shadow */}
                {lighting.shadowIntensity > 0 && (
                  <div
                    className="absolute pointer-events-none transition-all duration-150"
                    style={{
                      left: '50%',
                      bottom: `${-lighting.shadowOffsetY}px`,
                      transform: 'translateX(-50%)',
                      width: `${displayWidth * 0.86}px`,
                      height: `${Math.max(14, displayWidth * 0.22)}px`,
                      borderRadius: '50%',
                      background: `radial-gradient(ellipse at center, rgba(35, 32, 28, ${(lighting.shadowIntensity / 100) * 0.85}) 0%, rgba(35, 32, 28, ${(lighting.shadowIntensity / 100) * 0.45}) 40%, rgba(35, 32, 28, 0) 72%)`,
                      filter: `blur(${Math.max(2, lighting.shadowBlur)}px)`,
                      zIndex: -1,
                    }}
                  />
                )}

                {/* Furniture Image (Pure Cutout without bounding card) */}
                <div className="relative overflow-visible select-none">
                  <img
                    src={displayImageSrc}
                    alt={product?.name || 'Placed Furniture'}
                    className="w-full h-auto object-contain pointer-events-none select-none drop-shadow-xs transition-all duration-75"
                    draggable="false"
                    style={{
                      filter: `brightness(${lighting.brightness}%) contrast(${lighting.contrast}%) sepia(${
                        lighting.warmth > 0 ? (lighting.warmth / 100) * 0.42 : 0
                      }) hue-rotate(${lighting.warmth < 0 ? lighting.warmth * 0.7 : 0}deg)`,
                    }}
                  />
                </div>

                {/* Visible Handles and Controls when Selected */}
                {isSelected && (
                  <>
                    {/* Top Rotation Stalk & Handle */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                      <button
                        type="button"
                        onPointerDown={(e) => handlePointerDown(e, item, 'rotate')}
                        className="w-7 h-7 rounded-full bg-[#FFFDFA] border-2 border-[#62694A] flex items-center justify-center text-[#62694A] shadow-md hover:scale-115 transition-transform cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[#62694A]"
                        title="Drag to rotate piece"
                        aria-label="Rotate piece"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <div className="w-[2px] h-3.5 bg-[#62694A]"></div>
                    </div>

                    {/* Corner Resize Handles with generous touch target */}
                    {['nw', 'ne', 'se', 'sw'].map((corner) => {
                      const posClass =
                        corner === 'nw'
                          ? '-top-3 -left-3'
                          : corner === 'ne'
                          ? '-top-3 -right-3'
                          : corner === 'se'
                          ? '-bottom-3 -right-3'
                          : '-bottom-3 -left-3';

                      return (
                        <div
                          key={corner}
                          onPointerDown={(e) => handlePointerDown(e, item, 'resize')}
                          className={`absolute ${posClass} w-6 h-6 flex items-center justify-center cursor-nwse-resize z-30 touch-none`}
                          title="Drag to scale piece"
                          aria-label="Resize handle"
                        >
                          <div className="w-3.5 h-3.5 bg-[#FFFDFA] border-2 border-[#62694A] rounded-xs shadow-sm" />
                        </div>
                      );
                    })}

                    {/* Quick Floating Action Bar for Selected Piece */}
                    <div
                      className="absolute -bottom-11 left-1/2 -translate-x-1/2 flex items-center space-x-1 px-2.5 py-1 bg-[#FFFDFA] border border-[#D8D2C8] shadow-md rounded-xs z-30 pointer-events-auto whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const newRot = (item.rotation + 15) % 360;
                          onUpdateItem(item.instanceId, { rotation: newRot }, true);
                        }}
                        className="p-1.5 text-[#4A463D] hover:text-[#292923] cursor-pointer"
                        title="Rotate +15°"
                        aria-label="Rotate 15 degrees clockwise"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-xs font-mono text-[#4A463D] px-1.5 border-x border-[#D8D2C8]">
                        {Math.round(item.rotation)}°
                      </span>

                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.instanceId)}
                        className="p-1.5 text-[#7A271A] hover:bg-[#FDF2F0] cursor-pointer"
                        title="Delete piece"
                        aria-label="Delete selected piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty Placed State Guide if room is present but no furniture */}
        {placedItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
            <div className="bg-[#FFFDFA]/95 border border-[#D8D2C8] p-5 sm:p-7 text-center max-w-sm shadow-md pointer-events-auto">
              <Move className="w-7 h-7 text-[#62694A] mx-auto mb-2.5" />
              <p className="font-serif text-xl text-[#292923]">Room Ready for Staging</p>
              <p className="text-sm text-[#4A463D] mt-1.5 leading-relaxed font-normal">
                Click <strong>“Add Furniture”</strong> in the top toolbar to choose pieces from our catalog to place in this room.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

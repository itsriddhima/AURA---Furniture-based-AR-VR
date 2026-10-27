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
  const [activeDrag, setActiveDrag] = useState(null); // { type: 'move'|'resize'|'rotate', instanceId, startX, startY, origX, origY, origScale, origRot, centerX, centerY }

  const handlePointerDown = (e, item, actionType = 'move') => {
    e.stopPropagation();
    e.preventDefault();

    onSelectItem(item.instanceId);

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const itemPixelX = (item.x / 100) * rect.width;
    const itemPixelY = (item.y / 100) * rect.height;

    setActiveDrag({
      type: actionType,
      instanceId: item.instanceId,
      pointerStartX: e.clientX,
      pointerStartY: e.clientY,
      initialItemX: item.x,
      initialItemY: item.y,
      initialScale: item.scale,
      initialRotation: item.rotation,
      itemPixelCenterX: itemPixelX,
      itemPixelCenterY: itemPixelY,
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
        initialRotation,
        itemPixelCenterX,
        itemPixelCenterY,
        containerWidth,
        containerHeight,
      } = activeDrag;

      const deltaX = e.clientX - pointerStartX;
      const deltaY = e.clientY - pointerStartY;

      if (type === 'move') {
        const deltaXPercent = (deltaX / containerWidth) * 100;
        const deltaYPercent = (deltaY / containerHeight) * 100;

        const newX = Math.max(5, Math.min(95, initialItemX + deltaXPercent));
        const newY = Math.max(5, Math.min(95, initialItemY + deltaYPercent));

        onUpdateItem(instanceId, { x: newX, y: newY }, false);
      } else if (type === 'resize') {
        const distanceDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const sign = deltaX + deltaY > 0 ? 1 : -1;
        const scaleChange = (sign * distanceDelta) / 250;
        const newScale = Math.max(0.4, Math.min(2.5, initialScale + scaleChange));

        onUpdateItem(instanceId, { scale: newScale }, false);
      } else if (type === 'rotate') {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const currentCenterX = rect.left + itemPixelCenterX;
        const currentCenterY = rect.top + itemPixelCenterY;

        const startAngle = Math.atan2(pointerStartY - currentCenterY, pointerStartX - currentCenterX);
        const currentAngle = Math.atan2(e.clientY - currentCenterY, e.clientX - currentCenterX);
        const diffDegrees = ((currentAngle - startAngle) * 180) / Math.PI;

        let newRotation = Math.round((initialRotation + diffDegrees) % 360);
        if (newRotation < 0) newRotation += 360;

        onUpdateItem(instanceId, { rotation: newRotation }, false);
      }
    };

    const handlePointerUp = () => {
      setActiveDrag(null);
      if (onRecordHistory) {
        onRecordHistory();
      }
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
    <div className="relative w-full flex-1 flex items-center justify-center p-3 sm:p-6 bg-[#EAE5DC] overflow-hidden select-none">
      
      {/* 2D Room Canvas Stage */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        className="relative max-w-full max-h-[75vh] aspect-[4/3] sm:aspect-[16/10] bg-[#F5F1E9] border border-[#D8D2C8] shadow-md overflow-hidden cursor-crosshair touch-none"
        style={{ width: '100%', height: 'auto' }}
      >
        {/* Background Room Photo */}
        <img
          src={roomImage.url}
          alt={roomImage.name || 'Room background stage'}
          className="w-full h-full object-cover pointer-events-none"
          draggable="false"
        />

        {/* Demo Room Indicator if using sample image */}
        {roomImage.isDemo && (
          <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-[#FFFDFA]/95 backdrop-blur-xs border border-[#D8D2C8] text-[11px] font-mono text-[#4A463D] shadow-xs flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#62694A]"></span>
            <span>Sample Demo Room · Stockholm Archipelago</span>
          </div>
        )}

        {/* Subtle Canvas Scale Axis Markings */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center space-x-2 px-2.5 py-1 bg-[#FFFDFA]/90 text-[10px] font-mono text-[#4A463D] border border-[#D8D2C8]">
          <Info className="w-3 h-3 text-[#62694A]" />
          <span>2D Room Layout Canvas · Drag to position · Corner handle to scale</span>
        </div>

        {/* Placed Furniture Objects Layer */}
        {placedItems.map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId);
          const isSelected = selectedId === item.instanceId;

          // Base dimensions for furniture display (normalized relative sizing)
          const baseWidth = item.productId === 'njord-modular-sofa' ? 240 : item.productId === 'alabaster-coffee-table' ? 160 : 130;
          const displayWidth = baseWidth * item.scale;

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
                className={`relative transition-shadow duration-150 ${
                  isSelected
                    ? 'ring-2 ring-[#62694A] ring-offset-2 ring-offset-[#FFFDFA] shadow-xl'
                    : 'hover:ring-1 hover:ring-[#62694A]/60 shadow-sm'
                }`}
              >
                {/* Product Image Stage */}
                <div className="relative bg-[#FFFDFA] border border-[#D8D2C8] p-1.5 overflow-hidden">
                  <img
                    src={product?.image || ''}
                    alt={product?.name || 'Placed Furniture'}
                    className="w-full aspect-[4/3] object-cover pointer-events-none"
                    draggable="false"
                  />

                  {/* Dimension Tag */}
                  <div className="mt-1 px-1 py-0.5 bg-[#F5F1E9] border-t border-[#D8D2C8] flex items-center justify-between text-[9px] font-mono text-[#292923]">
                    <span className="truncate max-w-[85px] font-sans font-medium">{product?.name.split(' ')[0]}</span>
                    <span>{product?.dimensions.width.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Visible Handles when Selected */}
                {isSelected && (
                  <>
                    {/* Top Rotation Stalk & Handle */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                      <button
                        type="button"
                        onPointerDown={(e) => handlePointerDown(e, item, 'rotate')}
                        className="w-6 h-6 rounded-full bg-[#FFFDFA] border-2 border-[#62694A] flex items-center justify-center text-[#62694A] shadow-md hover:scale-115 transition-transform cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[#62694A]"
                        title="Drag to rotate"
                        aria-label="Rotate piece"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-[1.5px] h-3 bg-[#62694A]"></div>
                    </div>

                    {/* Corner Resize Handles */}
                    {['nw', 'ne', 'se', 'sw'].map((corner) => {
                      const posClass =
                        corner === 'nw'
                          ? '-top-2 -left-2'
                          : corner === 'ne'
                          ? '-top-2 -right-2'
                          : corner === 'se'
                          ? '-bottom-2 -right-2'
                          : '-bottom-2 -left-2';

                      return (
                        <div
                          key={corner}
                          onPointerDown={(e) => handlePointerDown(e, item, 'resize')}
                          className={`absolute ${posClass} w-3.5 h-3.5 bg-[#FFFDFA] border-2 border-[#62694A] rounded-xs shadow-sm hover:scale-125 transition-transform cursor-nwse-resize z-30`}
                          title="Drag to resize"
                        />
                      );
                    })}

                    {/* Quick Floating Action Bar for Selected Piece */}
                    <div
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-1 px-2 py-1 bg-[#FFFDFA] border border-[#D8D2C8] shadow-md rounded-xs z-30 pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const newRot = (item.rotation + 15) % 360;
                          onUpdateItem(item.instanceId, { rotation: newRot }, true);
                        }}
                        className="p-1 text-[#4A463D] hover:text-[#292923] cursor-pointer"
                        title="Rotate +15°"
                        aria-label="Rotate 15 degrees clockwise"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[10px] font-mono text-[#4A463D] px-1 border-x border-[#D8D2C8]">
                        {Math.round(item.rotation)}°
                      </span>

                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.instanceId)}
                        className="p-1 text-[#7A271A] hover:bg-[#FDF2F0] cursor-pointer"
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
            <div className="bg-[#FFFDFA]/95 border border-[#D8D2C8] p-4 sm:p-6 text-center max-w-sm shadow-md pointer-events-auto">
              <Move className="w-6 h-6 text-[#62694A] mx-auto mb-2" />
              <p className="font-serif text-lg text-[#292923]">Room Ready for Staging</p>
              <p className="text-xs text-[#4A463D] mt-1 leading-relaxed">
                Click <strong>“Add Furniture”</strong> in the top toolbar to choose pieces from our catalog to place in this room.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

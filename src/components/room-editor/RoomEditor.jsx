import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Plus,
  Undo2,
  RotateCcw,
  Image as ImageIcon,
  Check,
  AlertCircle,
  FilePlus,
  Trash2
} from 'lucide-react';
import RoomUploadEmptyState from './RoomUploadEmptyState';
import RoomCanvas from './RoomCanvas';
import ObjectInspector from './ObjectInspector';
import FurnitureCatalogDrawer from './FurnitureCatalogDrawer';
import {
  saveSceneData,
  loadSceneData,
  saveRoomImageRecord,
  loadRoomImageRecord,
  clearCurrentDesign
} from '../../utils/storage';

export default function RoomEditor({
  onBackToHome,
  initialStagedProduct = null,
  onShowToast,
}) {
  const [roomImage, setRoomImage] = useState(null);
  const [placedItems, setPlacedItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [newDesignConfirmOpen, setNewDesignConfirmOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error

  const replaceFileInputRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Record a snapshot of the placed items for undo
  const pushHistory = useCallback((currentItems) => {
    setHistory((prev) => [...prev.slice(-25), JSON.parse(JSON.stringify(currentItems))]);
  }, []);

  // Initial load from IndexedDB
  useEffect(() => {
    let isMounted = true;

    async function restoreFromStorage() {
      setIsInitialLoading(true);
      try {
        const [savedImg, savedScene] = await Promise.all([
          loadRoomImageRecord(),
          loadSceneData(),
        ]);

        if (!isMounted) return;

        if (savedImg && savedImg.url) {
          setRoomImage({
            url: savedImg.url,
            name: savedImg.name || 'Restored Room Photo',
            isDemo: Boolean(savedImg.isDemo),
          });
        }

        if (savedScene && Array.isArray(savedScene.placedItems)) {
          setPlacedItems(savedScene.placedItems);
        } else if (initialStagedProduct) {
          // If launched from homepage with a specific piece
          const initialItem = {
            instanceId: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            productId: initialStagedProduct.id,
            x: 50,
            y: 65,
            scale: 1.0,
            rotation: 0,
            zIndex: 1,
          };
          setPlacedItems([initialItem]);
          setSelectedId(initialItem.instanceId);
        }

        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to load from storage:', err);
        setSaveStatus('error');
      } finally {
        if (isMounted) setIsInitialLoading(false);
      }
    }

    restoreFromStorage();

    return () => {
      isMounted = false;
    };
  }, [initialStagedProduct]);

  // Debounced auto-save scene to IndexedDB
  useEffect(() => {
    if (isInitialLoading) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const success = await saveSceneData({
          placedItems,
          itemCount: placedItems.length,
          lastModified: Date.now(),
        });
        setSaveStatus(success ? 'saved' : 'error');
      } catch {
        setSaveStatus('error');
      }
    }, 600);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [placedItems, isInitialLoading]);

  // Handle room image load
  const handleRoomImageLoaded = async (imgData) => {
    setRoomImage(imgData);
    setSaveStatus('saving');
    try {
      await saveRoomImageRecord({
        url: imgData.url,
        name: imgData.name,
        type: imgData.type,
        isDemo: imgData.isDemo,
      });
      setSaveStatus('saved');
      if (onShowToast) {
        onShowToast(imgData.isDemo ? 'Sample demo room loaded.' : 'Room photo saved to local browser storage.');
      }
    } catch {
      setSaveStatus('error');
    }
  };

  // Replace photo file picker
  const handleReplaceFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a valid JPEG, PNG, or WebP photo.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      handleRoomImageLoaded({
        url: ev.target.result,
        name: file.name,
        type: file.type,
        size: file.size,
        isDemo: false,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Remove photo action
  const handleRemovePhoto = async () => {
    setRoomImage(null);
    try {
      await saveRoomImageRecord({ url: null, name: null });
      if (onShowToast) onShowToast('Room photo removed.');
    } catch {
      // ignore
    }
  };

  // Add piece from catalog
  const handleAddProduct = (product) => {
    pushHistory(placedItems);

    const newItem = {
      instanceId: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      x: 45 + (placedItems.length % 5) * 4,
      y: 55 + (placedItems.length % 5) * 4,
      scale: 1.0,
      rotation: 0,
      zIndex: placedItems.length + 1,
    };

    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.instanceId);
    if (onShowToast) onShowToast(`Added "${product.name}" to room canvas.`);
  };

  // Update piece
  const handleUpdateItem = (instanceId, updates, recordUndo = false) => {
    if (recordUndo) {
      pushHistory(placedItems);
    }
    setPlacedItems((prev) =>
      prev.map((item) => (item.instanceId === instanceId ? { ...item, ...updates } : item))
    );
  };

  // Delete piece
  const handleDeleteItem = useCallback((instanceId) => {
    setHistory((prevHistory) => [...prevHistory.slice(-25), JSON.parse(JSON.stringify(placedItems))]);
    setPlacedItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
    setSelectedId((prev) => (prev === instanceId ? null : prev));
    if (onShowToast) onShowToast('Removed piece from room.');
  }, [placedItems, onShowToast]);

  // Duplicate piece
  const handleDuplicateItem = (instanceId) => {
    const itemToDup = placedItems.find((p) => p.instanceId === instanceId);
    if (!itemToDup) return;

    pushHistory(placedItems);
    const duplicated = {
      ...itemToDup,
      instanceId: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      x: Math.min(90, itemToDup.x + 6),
      y: Math.min(90, itemToDup.y + 6),
      zIndex: placedItems.length + 1,
    };

    setPlacedItems((prev) => [...prev, duplicated]);
    setSelectedId(duplicated.instanceId);
    if (onShowToast) onShowToast('Duplicated piece.');
  };

  // Layer ordering
  const handleBringForward = (instanceId) => {
    pushHistory(placedItems);
    setPlacedItems((prev) => {
      const maxZ = Math.max(...prev.map((i) => i.zIndex || 0), 0);
      return prev.map((item) =>
        item.instanceId === instanceId ? { ...item, zIndex: maxZ + 1 } : item
      );
    });
  };

  const handleSendBackward = (instanceId) => {
    pushHistory(placedItems);
    setPlacedItems((prev) => {
      const minZ = Math.min(...prev.map((i) => i.zIndex || 0), 1);
      return prev.map((item) =>
        item.instanceId === instanceId ? { ...item, zIndex: Math.max(1, minZ - 1) } : item
      );
    });
  };

  // Undo action
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setPlacedItems(previousState);
    if (onShowToast) onShowToast('Undo last transformation.');
  }, [history, onShowToast]);

  // Keyboard shortcuts (Ctrl+Z, Delete)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = document.activeElement?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && selectedId) {
          e.preventDefault();
          handleDeleteItem(selectedId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, handleUndo, handleDeleteItem]);

  // Reset Scene
  const handleConfirmReset = () => {
    pushHistory(placedItems);
    setPlacedItems([]);
    setSelectedId(null);
    setResetConfirmOpen(false);
    if (onShowToast) onShowToast('Room layout reset. (You can Undo if needed).');
  };

  // Start New Design
  const handleConfirmNewDesign = async () => {
    setPlacedItems([]);
    setRoomImage(null);
    setSelectedId(null);
    setHistory([]);
    setNewDesignConfirmOpen(false);
    await clearCurrentDesign();
    if (onShowToast) onShowToast('Started a new room design.');
  };

  const selectedItem = placedItems.find((p) => p.instanceId === selectedId) || null;

  return (
    <div className="min-h-screen bg-[#F5F1E9] text-[#292923] flex flex-col font-sans">
      
      {/* Hidden File Input for Replacing Photo */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleReplaceFileChange}
        className="hidden"
        aria-label="Replace room photograph"
      />

      {/* Top Application Toolbar */}
      <header className="sticky top-0 z-40 bg-[#FFFDFA] border-b border-[#D8D2C8] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        
        {/* Left: Exit & Brand */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="min-h-[44px] min-w-[44px] flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm uppercase tracking-wider font-medium text-[#292923] hover:text-[#62694A] border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#62694A]"
            aria-label="Return to AURA Homepage"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Atelier</span>
          </button>

          <div className="border-l border-[#D8D2C8] pl-3 sm:pl-4">
            <h1 className="font-serif text-lg sm:text-xl font-normal tracking-wide text-[#292923]">
              AURA Room Planner
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-[#4A463D] font-mono">
              2D Spatial Staging
            </p>
          </div>
        </div>

        {/* Center: Persistence Status Indicator */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-mono">
          {saveStatus === 'saving' && (
            <span className="flex items-center space-x-1.5 text-[#4A463D]">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <span>Saving to browser...</span>
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center space-x-1.5 text-[#62694A]">
              <Check className="w-3.5 h-3.5" />
              <span>Saved locally (IndexedDB)</span>
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center space-x-1.5 text-[#7A271A]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Storage Notice</span>
            </span>
          )}
        </div>

        {/* Right: Actions (Undo, Reset, Add Furniture, New Design) */}
        <div className="flex items-center space-x-2">
          
          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className={`min-h-[44px] px-3 py-2 text-xs uppercase tracking-wider font-medium border transition-colors flex items-center space-x-1.5 ${
              history.length > 0
                ? 'border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] cursor-pointer'
                : 'border-[#D8D2C8]/50 bg-[#F5F1E9]/50 text-[#4A463D]/40 cursor-not-allowed'
            } focus-visible:outline-2 focus-visible:outline-[#62694A]`}
            title="Undo last change (Ctrl+Z)"
            aria-label="Undo last change"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          {/* Reset Layout */}
          {placedItems.length > 0 && (
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="min-h-[44px] px-3 py-2 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors cursor-pointer flex items-center space-x-1.5 focus-visible:outline-2 focus-visible:outline-[#62694A]"
              title="Reset placed items"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#4A463D]" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Replace Photo Button (when image is loaded) */}
          {roomImage && (
            <button
              type="button"
              onClick={() => replaceFileInputRef.current?.click()}
              className="min-h-[44px] px-3 py-2 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors cursor-pointer hidden md:flex items-center space-x-1.5 focus-visible:outline-2 focus-visible:outline-[#62694A]"
              title="Replace current room photograph"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#62694A]" />
              <span>Replace Photo</span>
            </button>
          )}

          {/* Add Furniture Button */}
          <button
            type="button"
            onClick={() => setCatalogOpen(true)}
            className="min-h-[44px] px-4 py-2 text-xs sm:text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] border border-[#62694A] transition-colors cursor-pointer shadow-xs flex items-center space-x-1.5 focus-visible:outline-2 focus-visible:outline-[#62694A]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Furniture</span>
          </button>

          {/* New Design Button */}
          <button
            type="button"
            onClick={() => setNewDesignConfirmOpen(true)}
            className="min-h-[44px] px-3 py-2 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#FFFDFA] hover:bg-[#F5F1E9] text-[#4A463D] transition-colors cursor-pointer hidden lg:flex items-center space-x-1.5 focus-visible:outline-2 focus-visible:outline-[#62694A]"
            title="Start new room layout"
          >
            <FilePlus className="w-3.5 h-3.5 text-[#4A463D]" />
            <span>New Design</span>
          </button>

        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {isInitialLoading ? (
          <div className="flex-1 flex items-center justify-center p-12 text-[#4A463D] space-x-3">
            <div className="w-6 h-6 border-2 border-[#62694A] border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-sm">Restoring room planner session...</span>
          </div>
        ) : !roomImage ? (
          /* Empty State: Upload or Load Demo Room */
          <div className="flex-1 flex items-center justify-center overflow-y-auto">
            <RoomUploadEmptyState onRoomImageLoaded={handleRoomImageLoaded} />
          </div>
        ) : (
          /* Interactive Room Canvas + Inspector Sidebar */
          <>
            <div className="flex-1 flex flex-col relative overflow-hidden">
              
              {/* Photo Management Sub-bar */}
              <div className="px-4 py-2 bg-[#F5F1E9] border-b border-[#D8D2C8] flex items-center justify-between text-xs text-[#4A463D]">
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-medium text-[#292923] truncate">{roomImage.name}</span>
                  {roomImage.isDemo && (
                    <span className="px-1.5 py-0.2 bg-[#FFFDFA] border border-[#D8D2C8] text-[10px] font-mono text-[#62694A]">
                      Demo Scene
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => replaceFileInputRef.current?.click()}
                    className="hover:text-[#62694A] underline cursor-pointer text-xs"
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="hover:text-[#7A271A] cursor-pointer text-xs flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3 text-[#7A271A]" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* 2D Canvas */}
              <RoomCanvas
                roomImage={roomImage}
                placedItems={placedItems}
                selectedId={selectedId}
                onSelectItem={setSelectedId}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onRecordHistory={() => pushHistory(placedItems)}
              />
            </div>

            {/* Inspector Sidebar */}
            <ObjectInspector
              selectedItem={selectedItem}
              onUpdateItem={(instId, updates) => handleUpdateItem(instId, updates, true)}
              onDeleteItem={handleDeleteItem}
              onDuplicateItem={handleDuplicateItem}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              onDeselect={() => setSelectedId(null)}
            />
          </>
        )}

      </div>

      {/* Catalog Drawer */}
      <FurnitureCatalogDrawer
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onAddProductToRoom={handleAddProduct}
      />

      {/* Reset Layout Confirmation Modal */}
      {resetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292923]/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div className="bg-[#FFFDFA] border border-[#D8D2C8] p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 id="reset-modal-title" className="font-serif text-2xl text-[#292923]">
              Reset Room Layout?
            </h3>
            <p className="text-sm text-[#4A463D] leading-relaxed">
              This will remove all {placedItems.length} placed furniture piece(s) from the current room layout. Your background photo will remain. (You can also Undo this action).
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="min-h-[44px] px-5 py-2 text-xs uppercase tracking-wider font-medium bg-[#7A271A] hover:bg-[#5C1C13] text-[#FFFDFA] cursor-pointer"
              >
                Yes, Reset Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Design Confirmation Modal */}
      {newDesignConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292923]/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-design-title"
        >
          <div className="bg-[#FFFDFA] border border-[#D8D2C8] p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 id="new-design-title" className="font-serif text-2xl text-[#292923]">
              Start New Design?
            </h3>
            <p className="text-sm text-[#4A463D] leading-relaxed">
              Starting a new design will clear the current room layout and background photo from browser storage so you can upload a new room from scratch.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setNewDesignConfirmOpen(false)}
                className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-medium border border-[#D8D2C8] bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmNewDesign}
                className="min-h-[44px] px-5 py-2 text-xs uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] cursor-pointer"
              >
                Start New Design
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

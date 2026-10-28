import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MeasurementVisualizer from './components/MeasurementVisualizer';
import CuratedCollection from './components/CuratedCollection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import SavedDrawer from './components/SavedDrawer';
import Toast from './components/Toast';
import RoomEditor from './components/room-editor/RoomEditor';
import { PRODUCTS } from './data/products';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'editor'
  const [savedProductIds, setSavedProductIds] = useState(['soren-lounge-chair']);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [stagedProduct, setStagedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const handleToggleSave = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const title = product ? product.name : 'Piece';

    if (savedProductIds.includes(productId)) {
      setSavedProductIds((prev) => prev.filter((id) => id !== productId));
      showToast(`Removed "${title}" from Saved Designs.`);
    } else {
      setSavedProductIds((prev) => [...prev, productId]);
      showToast(`Saved "${title}" to your private collection.`);
    }
  };

  // Open Room Editor with a specific piece
  const handleStageProduct = (product) => {
    setStagedProduct(product);
    setCurrentView('editor');
    showToast(`Opening Room Planner with "${product.name}".`);
  };

  // Open Room Editor without a specific piece
  const handleOpenEditor = () => {
    setStagedProduct(null);
    setCurrentView('editor');
  };

  const handleSelectFromHotspot = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      handleStageProduct(product);
    }
  };

  const handleScrollTo = (id) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        if (id) {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else if (id) {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E9] text-[#292923] flex flex-col font-sans selection:bg-[#62694A] selection:text-[#FFFDFA]">
      
      {currentView === 'home' ? (
        <>
          {/* Header */}
          <Navbar
            savedCount={savedProductIds.length}
            onOpenSaved={() => setSavedDrawerOpen(true)}
            onStartDesigning={handleOpenEditor}
            onScrollTo={handleScrollTo}
            currentView="home"
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {/* 1. Editorial Hero */}
            <Hero
              onPreviewInRoom={handleOpenEditor}
              onExploreCollection={() => handleScrollTo('curated-pieces')}
            />

            {/* 2. Living-Room Photograph with Measurement Overlay */}
            <MeasurementVisualizer
              onSelectProduct={handleSelectFromHotspot}
            />

            {/* 3. Curated Furniture Section */}
            <CuratedCollection
              savedProductIds={savedProductIds}
              onToggleSave={handleToggleSave}
              onStageProduct={handleStageProduct}
            />

            {/* 4. How It Works */}
            <HowItWorks
              onStartDesigning={handleOpenEditor}
            />
          </main>

          {/* 5. Refined Footer */}
          <Footer
            onScrollTo={handleScrollTo}
            onStartDesigning={handleOpenEditor}
          />
        </>
      ) : (
        /* Dedicated Room Editor View (Phase 2, 3, 4) */
        <RoomEditor
          onBackToHome={() => setCurrentView('home')}
          initialStagedProduct={stagedProduct}
          onShowToast={showToast}
        />
      )}

      {/* Saved Designs Drawer */}
      <SavedDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        savedProductIds={savedProductIds}
        onRemoveSaved={handleToggleSave}
        onStageProduct={handleStageProduct}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

    </div>
  );
}

export default App;

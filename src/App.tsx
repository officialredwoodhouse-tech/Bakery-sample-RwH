import React from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DessertShowcase } from './components/DessertShowcase';
import { TableReservation } from './components/TableReservation';
import { BookNowOrder } from './components/BookNowOrder';
import { AboutUs } from './components/AboutUs';
import { ReviewsHub } from './components/ReviewsHub';
import { DessertDetailModal } from './components/DessertDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SocialConnect } from './components/SocialConnect';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeView, selectedDessertModal, setSelectedDessertModal } = useBakery();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 selection:bg-[#C5A059]/20 selection:text-stone-900">
      {/* Top Bar Contract Compliant Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'showcase' && (
          <>
            <HeroSection />
            <DessertShowcase />
            <SocialConnect />
          </>
        )}

        {activeView === 'table-booking' && <TableReservation />}

        {activeView === 'order-now' && <BookNowOrder />}

        {activeView === 'about-us' && <AboutUs />}

        {activeView === 'reviews-hub' && <ReviewsHub />}
      </main>

      {/* Quick View & Review Modal for Desserts */}
      {selectedDessertModal && (
        <DessertDetailModal
          dessert={selectedDessertModal}
          onClose={() => setSelectedDessertModal(null)}
        />
      )}

      {/* Slide-over Order Bag Drawer */}
      <CartDrawer />

      {/* Clean Editorial Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BakeryProvider>
      <AppContent />
    </BakeryProvider>
  );
}

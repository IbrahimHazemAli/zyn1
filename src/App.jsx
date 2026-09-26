import React, { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LanguageGateModal } from './components/common/LanguageGateModal';
import { SplashWalkthrough } from './components/common/SplashWalkthrough';
import { SearchOverlay } from './components/common/SearchOverlay';
import { QuickViewModal } from './components/shop/QuickViewModal';
import { SizeGuideModal } from './components/shop/SizeGuideModal';
import { SelectSizeModal } from './components/shop/SelectSizeModal';
import { AddedToBagModal } from './components/shop/AddedToBagModal';
import { OrderTrackingModal } from './components/shop/OrderTrackingModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { useCart } from './context/CartContext';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { StoresPage } from './pages/StoresPage';
import { LookbookPage } from './pages/LookbookPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminPage } from './pages/AdminPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { FavoritesPage } from './pages/FavoritesPage';

export function App() {
  const { showLanguageGate, showChangeModal, closeChangeLanguageModal } = useLanguage();
  const { products } = useStore();

  // Navigation State with immediate admin hash detection
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    const isDirectAdmin = window.location.pathname.includes('/admin') || window.location.hash.includes('admin');
    if (isDirectAdmin) return 'admin';
    const hash = (window.location.hash || '').replace('#', '');
    if (hash === 'stores' || hash === 'lookbook' || hash === 'shop' || hash === 'checkout' || hash === 'discover' || hash === 'favorites') {
      return hash;
    }
    return 'home';
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Walkthrough splash loader: Plays on every website start & restart (except direct admin access)
  const [showWalkthrough, setShowWalkthrough] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isDirectAdmin = window.location.pathname.includes('/admin') || window.location.hash.includes('admin');
    return !isDirectAdmin;
  });

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState('women');
  const [sizeModalProduct, setSizeModalProduct] = useState(null);
  const [addedItem, setAddedItem] = useState(null);
  const [trackingModalState, setTrackingModalState] = useState({
    isOpen: false,
    orderId: '',
    phone: ''
  });

  const { addToCart, openCart } = useCart();

  // Synchronize URL hash & path with currentPage in real-time
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';
      if (hash.includes('admin') || path.includes('/admin')) {
        setCurrentPage('admin');
        setShowWalkthrough(false);
      } else if (hash.includes('stores')) {
        setCurrentPage('stores');
      } else if (hash.includes('lookbook')) {
        setCurrentPage('lookbook');
      } else if (hash.includes('shop')) {
        setCurrentPage('shop');
      } else if (hash.includes('checkout')) {
        setCurrentPage('checkout');
      } else if (hash.includes('discover')) {
        setCurrentPage('discover');
      } else if (hash.includes('favorites')) {
        setCurrentPage('favorites');
      } else if (hash === '' || hash === '#' || hash === '#home') {
        setCurrentPage(prev => (prev === 'admin' ? 'home' : prev));
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const navigateTo = (page, params = {}) => {
    if (page === 'about') {
      page = 'shop';
    }
    if (params.category) {
      setSelectedCategory(params.category);
    }
    if (page === 'admin') {
      window.location.hash = 'admin';
      setShowWalkthrough(false);
    } else if (page === 'home') {
      if (window.location.hash.includes('admin')) {
        window.location.hash = '';
      }
    } else {
      if (window.location.hash.includes('admin')) {
        window.location.hash = page;
      }
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleOpenSizeGuide = (category = 'women') => {
    setSizeGuideCategory(category);
    setSizeGuideOpen(true);
  };

  const handleQuickAdd = (product) => {
    const isOneSize = product.category === 'bags' || product.category === 'accessories' || (product.sizes && product.sizes.length === 1 && product.sizes[0].toLowerCase().includes('one'));
    if (isOneSize) {
      const color = product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Default', hex: '#111111' };
      addToCart(product, 'One Size', color, 1, false);
      setAddedItem({
        ...product,
        size: 'One Size',
        color,
        price: product.salePrice || product.price,
        image: (product.images && product.images[0]) || product.image || '/placeholder-luxury.svg'
      });
      return;
    }
    setSizeModalProduct(product);
  };

  const handleSizeSelected = (product, size, color) => {
    addToCart(product, size, color, 1, false);
    setSizeModalProduct(null);
    setAddedItem({
      ...product,
      size,
      color,
      price: product.salePrice || product.price,
      image: (product.images && product.images[0]) || product.image || '/placeholder-luxury.svg'
    });
  };

  const handleContinueShopping = () => {
    setAddedItem(null);
  };

  const handleViewBagFromConfirmation = () => {
    setAddedItem(null);
    openCart();
  };

  const handleOrderPlaced = (order) => {
    setCompletedOrder(order);
    setCurrentPage('order_success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrderTracking = (orderId = '', phone = '') => {
    setTrackingModalState({
      isOpen: true,
      orderId: orderId || '',
      phone: phone || ''
    });
  };

  return (
    <div className="sanaria-app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. MANDATORY FORCED FIRST-TIME LANGUAGE SELECTION (Bypassed for Admin Portal) */}
      {showLanguageGate && !showWalkthrough && currentPage !== 'admin' && (
        <LanguageGateModal isChangeMode={false} />
      )}

      {/* 2. CHANGE LANGUAGE MODAL (WHEN REQUESTED - Bypassed for Admin Portal) */}
      {showChangeModal && currentPage !== 'admin' && (
        <LanguageGateModal isChangeMode={true} onClose={closeChangeLanguageModal} />
      )}

      {/* 3. PROFESSIONAL SANARIA WALKTHROUGH INTRO (Bypassed for Admin Portal) */}
      {showWalkthrough && currentPage !== 'admin' && (
        <SplashWalkthrough onComplete={() => setShowWalkthrough(false)} />
      )}

      {/* Global Header (Except on Admin Page or Full-Screen Discover Feed) */}
      {currentPage !== 'admin' && currentPage !== 'discover' && (
        <Header
          currentPage={currentPage}
          activeCategory={selectedCategory}
          onNavigate={(page, params) => navigateTo(page, params)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenOrderTracking={handleOpenOrderTracking}
        />
      )}

      {/* Main Pages Content View */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage
            onNavigateShop={(params) => navigateTo('shop', params)}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onQuickView={handleOpenQuickView}
            onNavigateAbout={() => navigateTo('about')}
            onNavigateStores={() => navigateTo('stores')}
            onNavigateLookbook={() => navigateTo('lookbook')}
            onNavigateDiscover={() => navigateTo('discover')}
          />
        )}

        {currentPage === 'discover' && (
          <DiscoverPage
            onBackToStore={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            initialTab={selectedCategory !== 'all' ? selectedCategory : 'for_you'}
          />
        )}

        {currentPage === 'favorites' && (
          <FavoritesPage
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onNavigateDiscover={() => navigateTo('discover')}
            onNavigateShop={() => navigateTo('shop')}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            initialCategory={selectedCategory}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onQuickView={handleOpenQuickView}
            onNavigateLookbook={() => navigateTo('lookbook')}
          />
        )}

        {currentPage === 'lookbook' && (
          <LookbookPage
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onNavigateShop={(params) => navigateTo('shop', params)}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBackToShop={() => navigateTo('shop')}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onOpenSelectSize={(prod, size, color) => {
              if (!size) {
                setSizeModalProduct(prod);
              } else {
                handleSizeSelected(prod, size, color);
              }
            }}
            onOpenSizeGuide={handleOpenSizeGuide}
            onProceedToCheckout={() => navigateTo('checkout')}
          />
        )}

        {currentPage === 'stores' && (
          <StoresPage />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onOrderPlaced={handleOrderPlaced}
            onBackToCart={() => navigateTo('shop')}
          />
        )}

        {currentPage === 'order_success' && (
          <OrderSuccessPage
            order={completedOrder}
            onBackHome={() => navigateTo('home')}
            onTrackOrder={handleOpenOrderTracking}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            onBackToStore={() => navigateTo('home')}
            onNavigate={(page, params) => navigateTo(page, params)}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* Global Footer (Except on Admin Page or Full-Screen Discover Feed) */}
      {currentPage !== 'admin' && currentPage !== 'discover' && (
        <Footer
          onNavigate={(page, params) => navigateTo(page, params)}
          onReplayIntro={() => setShowWalkthrough(true)}
          onOpenOrderTracking={handleOpenOrderTracking}
        />
      )}


      {/* Slide-Over Shopping Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => navigateTo('checkout')}
        onNavigateShop={() => navigateTo('shop')}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onSelectProduct={handleSelectProduct}
        onOpenSizeGuide={handleOpenSizeGuide}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        initialTab={sizeGuideCategory}
        onClose={() => setSizeGuideOpen(false)}
      />

      {/* Live Search Modal */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Select Size Modal (XXS - XXL with Clear Availability) */}
      <SelectSizeModal
        product={sizeModalProduct}
        isOpen={Boolean(sizeModalProduct)}
        onClose={() => setSizeModalProduct(null)}
        onSizeSelected={handleSizeSelected}
        onOpenSizeGuide={handleOpenSizeGuide}
      />

      {/* Added to Bag Post-Action Confirmation (Continue Shopping vs View Bag) */}
      <AddedToBagModal
        item={addedItem}
        isOpen={Boolean(addedItem)}
        onContinueShopping={handleContinueShopping}
        onViewBag={handleViewBagFromConfirmation}
      />

      {/* Customer Real-Time Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={trackingModalState.isOpen}
        onClose={() => setTrackingModalState(prev => ({ ...prev, isOpen: false }))}
        initialOrderId={trackingModalState.orderId}
        initialPhone={trackingModalState.phone}
      />
    </div>
  );
}
export default App;

import React, { useState, useEffect } from 'react';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useFavorites } from '../../context/FavoritesContext';
import {
  ShoppingBag,
  Search,
  Globe,
  Menu,
  X,
  Phone,
  MapPin,
  ArrowUpRight,
  Heart,
  Film,
  Package
} from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

export const Header = ({
  onNavigate,
  currentPage,
  activeCategory = 'all',
  onOpenSearch,
  onOpenOrderTracking
}) => {
  const { t, language, selectLanguage, openChangeLanguageModal, isRtl } = useLanguage();
  const { totalItems, openCart } = useCart();
  const { favoritesCount } = useFavorites();
  const { cms, businessSettings, categories } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const announcementText = typeof cms.banners?.announcement === 'object'
    ? cms.banners.announcement[language] || cms.banners.announcement.en || t('topbar.announcement')
    : cms.banners?.announcement || t('topbar.announcement');

  // Clean, high-fashion curated navigation items
  const desktopNavItems = [
    {
      key: 'home',
      label: t('nav.home') || (isRtl ? 'الرئيسية' : 'Home'),
      page: 'home',
      isActive: currentPage === 'home'
    },
    {
      key: 'new',
      label: t('nav.newIn') || (isRtl ? 'وصل حديثاً' : 'New In'),
      page: 'shop',
      params: { category: 'new' },
      isNew: true,
      isActive: currentPage === 'shop' && activeCategory === 'new'
    },
    {
      key: 'dresses',
      label: language === 'ar' ? 'فساتين' : language === 'ku' ? 'فستان' : language === 'tr' ? 'Elbise' : 'Dresses',
      page: 'shop',
      params: { category: 'dresses' },
      isActive: currentPage === 'shop' && activeCategory === 'dresses'
    },
    {
      key: 'tops',
      label: language === 'ar' ? 'قمصان' : language === 'ku' ? 'کراس' : language === 'tr' ? 'Üstler' : 'Tops',
      page: 'shop',
      params: { category: 'tops' },
      isActive: currentPage === 'shop' && activeCategory === 'tops'
    },
    {
      key: 'jackets',
      label: language === 'ar' ? 'جاكيتات وبلايزر' : language === 'ku' ? 'چاکەت و بلەیزەر' : language === 'tr' ? 'Ceket & Blazer' : 'Jackets & Blazers',
      page: 'shop',
      params: { category: 'jackets' },
      isActive: currentPage === 'shop' && activeCategory === 'jackets'
    },
    {
      key: 'pants',
      label: language === 'ar' ? 'بناطيل' : language === 'ku' ? 'پانتۆڵ' : language === 'tr' ? 'Pantolon' : 'Pants & Trousers',
      page: 'shop',
      params: { category: 'pants' },
      isActive: currentPage === 'shop' && activeCategory === 'pants'
    },
    {
      key: 'skirts',
      label: language === 'ar' ? 'تنانير' : language === 'ku' ? 'تەنورە' : language === 'tr' ? 'Etek' : 'Skirts',
      page: 'shop',
      params: { category: 'skirts' },
      isActive: currentPage === 'shop' && activeCategory === 'skirts'
    },
    {
      key: 'accessories',
      label: language === 'ar' ? 'إكسسوارات' : language === 'ku' ? 'ئێکسسوارات' : language === 'tr' ? 'Aksesuar' : 'Accessories',
      page: 'shop',
      params: { category: 'accessories' },
      isActive: currentPage === 'shop' && activeCategory === 'accessories'
    },
    {
      key: 'perfumes',
      label: language === 'ar' ? 'عطور وبخور' : language === 'ku' ? 'بۆن و عەتر' : language === 'tr' ? 'Parfüm' : 'Perfumes',
      page: 'shop',
      params: { category: 'perfumes' },
      isActive: currentPage === 'shop' && activeCategory === 'perfumes'
    },
    {
      key: 'other',
      label: language === 'ar' ? 'أخرى' : language === 'ku' ? 'هی تر' : language === 'tr' ? 'Diğer' : 'Other',
      page: 'shop',
      params: { category: 'other' },
      isActive: currentPage === 'shop' && activeCategory === 'other'
    },
    {
      key: 'lookbook',
      label: t('nav.lookbook') || (isRtl ? 'دفتر الإطلالات' : 'Lookbook'),
      page: 'lookbook',
      isEditorial: true,
      isActive: currentPage === 'lookbook'
    },
    {
      key: 'discover',
      label: t('nav.discover') || (isRtl ? 'اكتشف' : 'Discover'),
      page: 'discover',
      isSpecial: true,
      isActive: currentPage === 'discover'
    },
    {
      type: 'divider'
    },
    {
      key: 'stores',
      label: t('nav.stores') || (isRtl ? 'فروعنا' : 'Our Stores'),
      page: 'stores',
      isStores: true,
      isActive: currentPage === 'stores'
    }
  ];

  return (
    <>
      {/* 1. TOP REFINED ANNOUNCEMENT BAR */}
      <div className="seneria-topbar">
        <div className="container-luxury seneria-topbar-inner">
          {/* Center: Official Brand Announcement */}
          <div className="seneria-topbar-center">
            <span className="seneria-topbar-sparkle">✦</span>
            <span className="seneria-topbar-text">
              {isRtl
                ? 'متجر سناريا فاشن الرسمي — شحن سريع لكافة محافظات العراق'
                : 'Official Sanaria Fashion Boutique — Express Delivery Across All Iraq'}
            </span>
            <span className="seneria-topbar-sparkle">✦</span>
          </div>

          {/* Right: Track Order & Secondary Staff Portal Link */}
          <div className="seneria-topbar-right">
            {onOpenOrderTracking && (
              <button
                onClick={onOpenOrderTracking}
                className="seneria-topbar-link"
                title="Track Your Order"
              >
                <Package size={11} color="#C5A880" strokeWidth={1.75} />
                <span>{t('nav.trackOrder') || (isRtl ? 'تتبع طلبك' : 'Track Order')}</span>
              </button>
            )}
            <span className="seneria-topbar-separator">|</span>
            <button
              onClick={() => onNavigate('admin')}
              className="seneria-topbar-utility"
              title="Boutique Staff Administration"
            >
              <span>{t('nav.admin') || 'Staff Portal'}</span>
              <ArrowUpRight size={10} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Sticky & Compacting) */}
      <header className={`seneria-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="container-luxury seneria-header-row">
          {/* Left Column: Search (Desktop) / Mobile Toggles */}
          <div className="seneria-header-col-left">
            {/* Mobile Menu & Search Buttons */}
            <div className="seneria-mobile-toggles">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="seneria-icon-btn"
                aria-label="Open menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
              <button
                onClick={onOpenSearch}
                className="seneria-icon-btn"
                aria-label="Search collection"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Desktop Minimal Luxury Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="seneria-desktop-search"
              aria-label={t('nav.searchPlaceholder') || 'Search the collection'}
              title="Search the collection"
            >
              <Search size={15} strokeWidth={1.6} className="seneria-search-icon" />
              <span className="seneria-search-label">
                {t('nav.searchPlaceholder') || (isRtl ? 'ابحث في التشكيلة...' : 'Search the collection...')}
              </span>
            </button>
          </div>

          {/* Center Column: Uncrowded, Mathematically Centered Logo */}
          <div
            className="seneria-header-col-center"
            onClick={() => onNavigate('home')}
            role="button"
            tabIndex={0}
            aria-label="Sanaria Fashion - Return to Home"
          >
            <div className="seneria-brand-anchor">
              <img
                src={getAssetUrl('/logo.png')}
                alt="Sanaria Fashion Logo"
                className="seneria-brand-logo"
              />
              <div className="seneria-brand-text">
                <span className="seneria-brand-name">
                  SANARIA FASHION
                </span>
                <span className="seneria-brand-tagline">
                  SINCE 1992
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Actions (Language, Track, Wishlist, Cart) */}
          <div className="seneria-header-col-right">
            {/* Language Selector */}
            <button
              onClick={openChangeLanguageModal}
              className="seneria-lang-btn"
              title={t('langModal.changeLang') || 'Select Language'}
              aria-label="Change Language"
            >
              <Globe size={14} strokeWidth={1.6} color="#B89358" />
              <span className="seneria-lang-text">{currentLangObj.native}</span>
            </button>

            {/* Track Order (Desktop Secondary Action) */}
            {onOpenOrderTracking && (
              <button
                onClick={onOpenOrderTracking}
                className="seneria-track-btn"
                title="Track Order Status"
              >
                <Package size={15} strokeWidth={1.6} color="#8E8A83" />
                <span className="seneria-track-text">{t('nav.trackOrder') || (isRtl ? 'تتبع الطلب' : 'Track Order')}</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('favorites')}
              className="seneria-action-icon-btn"
              aria-label="View Wishlist"
              title={t('nav.favorites') || 'Wishlist'}
            >
              <Heart
                size={20}
                strokeWidth={1.6}
                color={currentPage === 'favorites' || favoritesCount > 0 ? '#C5A880' : '#121212'}
                fill={currentPage === 'favorites' ? '#C5A880' : 'none'}
              />
              {favoritesCount > 0 && (
                <span className="seneria-badge seneria-badge-wishlist">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="seneria-action-icon-btn"
              aria-label="Open Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag size={20} strokeWidth={1.6} color="#121212" />
              {totalItems > 0 && (
                <span className="seneria-badge seneria-badge-cart">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. DESKTOP EDITORIAL SUB-NAVIGATION BAR (Zero Wrapping) */}
        <nav className="seneria-desktop-nav" aria-label="Main Navigation">
          <div className="container-luxury seneria-desktop-nav-container">
            {desktopNavItems.map((item, idx) => {
              if (item.type === 'divider') {
                return <span key={`divider-${idx}`} className="seneria-nav-divider" />;
              }

              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.page, item.params || {})}
                  className={`seneria-nav-link ${item.isActive ? 'active' : ''} ${item.isNew ? 'is-new' : ''} ${item.isSpecial ? 'is-special' : ''} ${item.isStores ? 'is-stores' : ''}`}
                >
                  {item.isSpecial && (
                    <Film size={11} strokeWidth={1.75} color="#C5A880" className="seneria-nav-sparkle" />
                  )}
                  {item.isStores && (
                    <MapPin size={11} strokeWidth={1.75} color="#8E8A83" className="seneria-nav-pin" />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="seneria-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="seneria-mobile-drawer"
            dir={isRtl ? 'rtl' : 'ltr'}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header: Brand + Close */}
            <div className="seneria-drawer-top">
              <div
                className="seneria-drawer-brand"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('home');
                }}
              >
                <img src={getAssetUrl('/logo.png')} alt="Sanaria Logo" className="seneria-drawer-logo" />
                <div>
                  <span className="seneria-drawer-title">SANARIA FASHION</span>
                  <span className="seneria-drawer-subtitle">SINCE 1992</span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="seneria-drawer-close"
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Drawer Quick Search */}
            <div className="seneria-drawer-search-wrap">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="seneria-drawer-search-btn"
              >
                <Search size={15} strokeWidth={1.6} color="#C5A880" />
                <span>{t('nav.searchPlaceholder') || (isRtl ? 'ابحث في التشكيلة...' : 'Search the collection...')}</span>
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div className="seneria-drawer-nav-list">
              {/* Highlights Section */}
              <div className="seneria-drawer-section">
                <span className="seneria-drawer-section-title">
                  {isRtl ? 'المجموعات الحصرية' : 'CURATED HIGHLIGHTS'}
                </span>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('home');
                  }}
                  className={`seneria-drawer-link ${currentPage === 'home' ? 'active' : ''}`}
                >
                  <span>{t('nav.home') || (isRtl ? 'الرئيسية' : 'Home')}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('shop', { category: 'new' });
                  }}
                  className={`seneria-drawer-link is-new ${currentPage === 'shop' && activeCategory === 'new' ? 'active' : ''}`}
                >
                  <span className="seneria-drawer-new-label">
                    <span>{t('nav.newIn') || (isRtl ? 'وصل حديثاً' : 'New In')}</span>
                    <span className="seneria-new-tag">{isRtl ? 'جديد' : 'NEW'}</span>
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('discover');
                  }}
                  className={`seneria-drawer-link is-special ${currentPage === 'discover' ? 'active' : ''}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Film size={14} color="#C5A880" />
                    <span>{t('nav.discover') || (isRtl ? 'اكتشف' : 'Discover')}</span>
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('lookbook');
                  }}
                  className={`seneria-drawer-link ${currentPage === 'lookbook' ? 'active' : ''}`}
                >
                  <span>{t('nav.lookbook') || (isRtl ? 'دفتر الإطلالات' : 'Lookbook')}</span>
                </button>
              </div>

              {/* Categories Section */}
              <div className="seneria-drawer-section">
                <span className="seneria-drawer-section-title">
                  {isRtl ? 'أقسام الأزياء' : 'READY-TO-WEAR'}
                </span>

                {[
                  { id: 'dresses', label: language === 'ar' ? 'فساتين' : language === 'ku' ? 'فستان' : language === 'tr' ? 'Elbise' : 'Dresses' },
                  { id: 'tops', label: language === 'ar' ? 'قمصان' : language === 'ku' ? 'کراس' : language === 'tr' ? 'Üstler' : 'Tops' },
                  { id: 'jackets', label: language === 'ar' ? 'جاكيتات وبلايزر' : language === 'ku' ? 'چاکەت و بلەیزەر' : language === 'tr' ? 'Ceket & Blazer' : 'Jackets & Blazers' },
                  { id: 'pants', label: language === 'ar' ? 'بناطيل' : language === 'ku' ? 'پانتۆڵ' : language === 'tr' ? 'Pantolon' : 'Pants & Trousers' },
                  { id: 'skirts', label: language === 'ar' ? 'تنانير' : language === 'ku' ? 'تەنورە' : language === 'tr' ? 'Etek' : 'Skirts' },
                  { id: 'accessories', label: language === 'ar' ? 'إكسسوارات' : language === 'ku' ? 'ئێکسسوارات' : language === 'tr' ? 'Aksesuar' : 'Accessories' },
                  { id: 'other', label: language === 'ar' ? 'أخرى' : language === 'ku' ? 'هی تر' : language === 'tr' ? 'Diğer' : 'Other' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate('shop', { category: cat.id });
                    }}
                    className={`seneria-drawer-link ${currentPage === 'shop' && activeCategory === cat.id ? 'active' : ''}`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Services & Network Section */}
              <div className="seneria-drawer-section">
                <span className="seneria-drawer-section-title">
                  {isRtl ? 'الخدمات وشبكة الفروع' : 'SERVICES & BOUTIQUES'}
                </span>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('stores');
                  }}
                  className={`seneria-drawer-link ${currentPage === 'stores' ? 'active' : ''}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="#C5A880" />
                    <span>{t('nav.stores') || (isRtl ? 'فروعنا' : 'Our Stores')}</span>
                  </span>
                </button>

                {onOpenOrderTracking && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenOrderTracking();
                    }}
                    className="seneria-drawer-link"
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={14} color="#C5A880" />
                      <span>{t('nav.trackOrder') || (isRtl ? 'تتبع طلبك' : 'Track Order')}</span>
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('favorites');
                  }}
                  className="seneria-drawer-link"
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={14} color="#C5A880" />
                    <span>{t('nav.favorites') || (isRtl ? 'المفضلة' : 'Wishlist')}</span>
                  </span>
                  {favoritesCount > 0 && (
                    <span className="seneria-drawer-badge">{favoritesCount}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Drawer Footer: Language & Staff Portal */}
            <div className="seneria-drawer-footer">
              <div className="seneria-drawer-lang-grid">
                {LANGUAGES.map(l => {
                  const isCur = language === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        selectLanguage(l.code, false);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`seneria-drawer-lang-pill ${isCur ? 'active' : ''}`}
                    >
                      {l.native}
                    </button>
                  );
                })}
              </div>

              <div className="seneria-drawer-bottom-bar">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('admin');
                  }}
                  className="seneria-drawer-staff-link"
                >
                  <span>{t('nav.admin') || 'Staff Portal'}</span>
                  <ArrowUpRight size={12} />
                </button>

                <span className="seneria-drawer-copy">Sanaria Fashion • 1992</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MASTER HIGH-FASHION HEADER STYLES */}
      <style>{`
        /* --- 1. Top Announcement Bar --- */
        .seneria-topbar {
          background-color: #121212;
          color: #D6D0C7;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          position: relative;
          z-index: 55;
          font-family: var(--font-sans);
        }
        .seneria-topbar-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 35px;
          font-size: 0.71875rem;
          letter-spacing: 0.08em;
        }
        .seneria-topbar-right {
          position: absolute;
          inset-inline-end: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .seneria-topbar-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #B5AFA6;
          background: transparent;
          border: none;
          font-size: inherit;
          letter-spacing: inherit;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 2px 0;
          text-decoration: none;
        }
        .seneria-topbar-link:hover {
          color: #FAF8F5;
        }
        .seneria-topbar-separator {
          color: rgba(255, 255, 255, 0.15);
        }
        .seneria-topbar-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
          color: #FDFCFA;
          font-weight: 500;
          letter-spacing: 0.08em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: calc(100% - 280px);
          margin: 0 auto;
          padding: 0 12px;
          font-size: clamp(0.65rem, 0.72vw, 0.71875rem);
        }
        .seneria-topbar-sparkle {
          color: #C5A880;
          font-size: 0.625rem;
        }
        .seneria-topbar-utility {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #8E8A83;
          background: transparent;
          border: none;
          font-size: 0.65625rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .seneria-topbar-utility:hover {
          color: #C5A880;
        }

        /* --- 2. Main Header --- */
        .seneria-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background-color: var(--color-bg, #FAF8F5);
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .seneria-header.is-scrolled {
          background-color: rgba(253, 252, 250, 0.98);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border-bottom-color: rgba(0, 0, 0, 0.09);
        }
        .seneria-header-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 76px;
          transition: height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .seneria-header.is-scrolled .seneria-header-row {
          height: 64px;
        }

        /* Columns */
        .seneria-header-col-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .seneria-header-col-center {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          padding: 0 16px;
        }
        .seneria-header-col-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }

        /* Desktop Minimal Search Button */
        .seneria-desktop-search {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: rgba(0, 0, 0, 0.025);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 8px 18px;
          max-width: 230px;
          width: 100%;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .seneria-desktop-search:hover {
          background-color: rgba(0, 0, 0, 0.04);
          border-color: rgba(197, 168, 128, 0.6);
        }
        .seneria-search-icon {
          color: #8E8A83;
          flex-shrink: 0;
          transition: color 0.2s ease;
        }
        .seneria-desktop-search:hover .seneria-search-icon {
          color: #121212;
        }
        .seneria-search-label {
          font-size: 0.78125rem;
          color: #76716A;
          letter-spacing: 0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Mobile Toggles */
        .seneria-mobile-toggles {
          display: none;
          align-items: center;
          gap: 6px;
        }
        .seneria-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          color: #121212;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        /* Brand Logo & Title */
        .seneria-brand-anchor {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: center;
          transition: opacity 0.2s ease;
        }
        .seneria-brand-anchor:hover {
          opacity: 0.9;
        }
        .seneria-brand-logo {
          height: 38px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
          transition: height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .seneria-header.is-scrolled .seneria-brand-logo {
          height: 30px;
        }
        .seneria-brand-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        [dir="rtl"] .seneria-brand-text {
          align-items: flex-end;
        }
        .seneria-brand-name {
          font-family: 'Cinzel', 'Cormorant Garamond', 'Amiri', serif;
          font-size: 1.28rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: #121212;
          line-height: 1.1;
          white-space: nowrap;
          transition: font-size 0.3s ease;
        }
        .seneria-header.is-scrolled .seneria-brand-name {
          font-size: 1.15rem;
        }
        .seneria-brand-tagline {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.32em;
          color: #B89358;
          text-transform: uppercase;
          line-height: 1.2;
          margin-top: 2px;
        }

        /* Customer Actions (Right) */
        .seneria-lang-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          background: transparent;
          color: #222222;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .seneria-lang-btn:hover {
          border-color: #C5A880;
          color: #B89358;
        }
        .seneria-track-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          background: transparent;
          border: none;
          color: #666666;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .seneria-track-btn:hover {
          color: #121212;
        }
        .seneria-action-icon-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          background: transparent;
          border: none;
          color: #121212;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .seneria-action-icon-btn:hover {
          transform: scale(1.08);
        }
        .seneria-badge {
          position: absolute;
          top: -2px;
          font-size: 0.625rem;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
        .seneria-badge-wishlist {
          background-color: #121212;
          color: #FFFFFF;
          right: -4px;
        }
        [dir="rtl"] .seneria-badge-wishlist {
          right: auto;
          left: -4px;
        }
        .seneria-badge-cart {
          background-color: #C5A880;
          color: #121212;
          right: -4px;
        }
        [dir="rtl"] .seneria-badge-cart {
          right: auto;
          left: -4px;
        }

        /* --- 3. Desktop Sub-Navigation Bar --- */
        .seneria-desktop-nav {
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          background-color: rgba(253, 252, 250, 0.7);
        }
        .seneria-desktop-nav-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 1.2vw, 20px);
          height: 44px;
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
          overflow-x: auto;
          scrollbar-width: none; /* Hide scrollbar Firefox */
        }
        .seneria-desktop-nav-container::-webkit-scrollbar {
          display: none; /* Hide scrollbar Chrome/Safari */
        }
        .seneria-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          color: #4A4640;
          font-family: var(--font-sans);
          font-size: clamp(0.6875rem, 0.72vw, 0.75rem);
          font-weight: 500;
          letter-spacing: clamp(0.08em, 0.1vw, 0.13em);
          text-transform: uppercase;
          padding: 8px 3px;
          cursor: pointer;
          white-space: nowrap !important;
          flex-shrink: 0;
          transition: color 0.2s ease;
        }
        .seneria-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1.5px;
          background-color: var(--color-gold, #C5A880);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .seneria-nav-link:hover {
          color: #121212;
        }
        .seneria-nav-link:hover::after,
        .seneria-nav-link.active::after {
          transform: scaleX(1);
        }
        .seneria-nav-link.active {
          color: #121212;
          font-weight: 600;
        }
        .seneria-nav-link.is-new {
          color: #121212;
          font-weight: 600;
        }
        .seneria-nav-link.is-special {
          color: var(--color-gold-dark, #8C6D3B);
          font-weight: 600;
        }
        .seneria-nav-link.is-stores {
          color: #666666;
        }
        .seneria-nav-divider {
          width: 1px;
          height: 14px;
          background-color: rgba(0, 0, 0, 0.12);
          margin: 0 4px;
          flex-shrink: 0;
        }

        /* --- 4. Mobile Drawer --- */
        .seneria-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: seneriaFadeIn 0.2s ease-out;
        }
        .seneria-mobile-drawer {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 85%;
          max-width: 380px;
          background-color: #111111;
          color: #FDFCFA;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
          animation: seneriaSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [dir="rtl"] .seneria-mobile-drawer {
          left: auto;
          right: 0;
          animation: seneriaSlideInRtl 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .seneria-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 18px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .seneria-drawer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .seneria-drawer-logo {
          height: 32px;
          width: auto;
        }
        .seneria-drawer-title {
          font-family: 'Cinzel', 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          display: block;
          color: #FFFFFF;
        }
        .seneria-drawer-subtitle {
          font-size: 0.58rem;
          letter-spacing: 0.24em;
          color: #B89358;
          display: block;
        }
        .seneria-drawer-close {
          color: #A19D95;
          background: transparent;
          border: none;
          padding: 6px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .seneria-drawer-close:hover {
          color: #FFFFFF;
        }
        .seneria-drawer-search-wrap {
          padding: 16px 24px 8px 24px;
        }
        .seneria-drawer-search-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 10px 16px;
          color: #CCCCCC;
          font-size: 0.8125rem;
          cursor: pointer;
          text-align: left;
        }
        [dir="rtl"] .seneria-drawer-search-btn {
          text-align: right;
        }
        .seneria-drawer-nav-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .seneria-drawer-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .seneria-drawer-section-title {
          font-size: 0.65625rem;
          letter-spacing: 0.2em;
          color: #8E8A83;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .seneria-drawer-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          color: #E2DDD5;
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          padding: 8px 0;
          text-align: left;
          cursor: pointer;
          transition: color 0.15s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        [dir="rtl"] .seneria-drawer-link {
          text-align: right;
        }
        .seneria-drawer-link:hover,
        .seneria-drawer-link.active {
          color: #FFFFFF;
          font-weight: 600;
        }
        .seneria-drawer-link.is-special {
          color: #C5A880;
        }
        .seneria-drawer-new-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .seneria-new-tag {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          background-color: #B89358;
          color: #121212;
          padding: 1px 6px;
          border-radius: 2px;
        }
        .seneria-drawer-badge {
          background-color: #C5A880;
          color: #121212;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 10px;
        }
        .seneria-drawer-footer {
          padding: 18px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background-color: #0D0D0D;
        }
        .seneria-drawer-lang-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 14px;
        }
        .seneria-drawer-lang-pill {
          padding: 7px 2px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          text-align: center;
          background-color: rgba(255, 255, 255, 0.05);
          color: #CCCCCC;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .seneria-drawer-lang-pill.active {
          background-color: rgba(197, 168, 128, 0.2);
          color: #C5A880;
          border-color: #C5A880;
        }
        .seneria-drawer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 4px;
        }
        .seneria-drawer-staff-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #8E8A83;
          background: transparent;
          border: none;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          cursor: pointer;
        }
        .seneria-drawer-staff-link:hover {
          color: #C5A880;
        }
        .seneria-drawer-copy {
          font-size: 0.65rem;
          color: #666666;
          letter-spacing: 0.08em;
        }

        /* --- 5. Responsive Behavior --- */
        @media (max-width: 1240px) {
          .seneria-topbar-phone,
          .seneria-topbar-dot {
            display: none !important;
          }
        }

        @media (max-width: 1023px) {
          .seneria-topbar-left,
          .seneria-topbar-right {
            display: none !important;
          }
          .seneria-topbar-center {
            max-width: 100% !important;
            margin: 0 auto;
            font-size: 0.6875rem;
          }
          .seneria-desktop-search {
            display: none !important;
          }
          .seneria-mobile-toggles {
            display: flex !important;
          }
          .seneria-lang-btn,
          .seneria-track-btn {
            display: none !important;
          }
          .seneria-desktop-nav {
            display: none !important;
          }
          .seneria-brand-name {
            font-size: 1.1rem !important;
            letter-spacing: 0.16em !important;
          }
          .seneria-brand-logo {
            height: 30px !important;
          }
        }

        @media (max-width: 480px) {
          .seneria-header-row {
            height: 64px !important;
          }
          .seneria-brand-name {
            font-size: 0.95rem !important;
            letter-spacing: 0.12em !important;
          }
          .seneria-brand-tagline {
            font-size: 0.52rem !important;
            letter-spacing: 0.22em !important;
          }
          .seneria-brand-logo {
            height: 26px !important;
          }
          .seneria-header-col-right {
            gap: 10px !important;
          }
        }

        @keyframes seneriaFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes seneriaSlideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes seneriaSlideInRtl {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

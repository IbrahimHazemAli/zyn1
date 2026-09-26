import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import {
  Heart,
  Share2,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Check,
  ArrowRight,
  Info,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

const SIZES_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const DiscoverPage = ({
  onBackToStore,
  onSelectProduct,
  initialTab = 'for_you'
}) => {
  const { language, isRtl, t } = useLanguage();
  const { products, discoverConfig } = useStore();
  const { addToCart, openCart } = useCart();
  const { isFavorite, toggleFavorite, favoritesCount } = useFavorites();

  // Active Tab: for_you | new_arrivals | women | men | accessories
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activePhotoIndices, setActivePhotoIndices] = useState({});
  const [likeAnimationId, setLikeAnimationId] = useState(null);

  // Quick Size Bottom Sheet State
  const [sizeSheetProduct, setSizeSheetProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Sound generator using Web Audio API for luxury runway sound effect
  const audioContextRef = useRef(null);
  const playLuxuryChime = useCallback(() => {
    try {
      if (!isAudioPlaying) return;
      const ctx = audioContextRef.current || new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz Solfeggio / luxury harmony
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isAudioPlaying]);

  // Feed Items for Active Tab computed from discoverConfig and catalog
  const feedItems = useMemo(() => {
    const tabEntries = (discoverConfig && discoverConfig[activeTab]) || [];
    const items = [];

    tabEntries.forEach(entry => {
      if (entry.isHidden) return;
      const product = products.find(p => p.id === entry.productId);
      if (product && !product.isHidden) {
        items.push({
          ...product,
          isDiscoverFeatured: entry.isFeatured
        });
      }
    });

    // Fallback if empty tab: load matching category or all
    if (items.length === 0) {
      const fallback = products.filter(p => {
        if (p.isHidden) return false;
        if (activeTab === 'women') return p.category === 'women' || p.category === 'cat-dresses' || p.category === 'cat-abayas';
        if (activeTab === 'men') return p.category === 'men';
        if (activeTab === 'accessories') return p.category === 'bags' || p.category === 'accessories';
        if (activeTab === 'new_arrivals') return p.isNew;
        return true;
      });
      return fallback;
    }

    return items;
  }, [discoverConfig, activeTab, products]);

  // Reset index on tab switch
  useEffect(() => {
    setCurrentIndex(0);
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab]);

  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  // Scroll to index helper
  const scrollToIndex = useCallback((index) => {
    if (index < 0 || index >= feedItems.length) return;
    const targetCard = cardRefs.current[index];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentIndex(index);
      playLuxuryChime();
    }
  }, [feedItems.length, playLuxuryChime]);

  // Handle Scroll Observer to update currentIndex
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const height = container.clientHeight;
          if (height > 0) {
            const index = Math.round(container.scrollTop / height);
            if (index !== currentIndex && index >= 0 && index < feedItems.length) {
              setCurrentIndex(index);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, feedItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (sizeSheetProduct) return; // ignore when modal is open
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, scrollToIndex, sizeSheetProduct]);

  // Like with burst animation
  const handleLike = (product, e) => {
    if (e) e.stopPropagation();
    toggleFavorite(product.id, product.name);
    setLikeAnimationId(product.id);
    setTimeout(() => setLikeAnimationId(null), 900);
    playLuxuryChime();
  };

  // Share
  const handleShare = async (product, e) => {
    if (e) e.stopPropagation();
    const productName = typeof product.name === 'object' ? product.name[language] || product.name.en : product.name;
    const shareUrl = `${window.location.origin}/#product-${product.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Sanaria Fashion — ${productName}`,
          text: `Discover ${productName} at Sanaria Fashion Since 1992.`,
          url: shareUrl
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Product link copied to clipboard!');
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${productName} on Sanaria Fashion: ${shareUrl}`)}`, '_blank');
    }
  };

  // Open Size Sheet or Direct Add if One Size
  const handleAddToCartClick = (product, e) => {
    if (e) e.stopPropagation();
    const isOneSize = product.category === 'bags' || product.category === 'accessories' || (product.sizes && product.sizes.length === 1 && product.sizes[0].toLowerCase().includes('one'));

    if (isOneSize) {
      const color = product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Default', hex: '#111111' };
      addToCart(product, 'One Size', color, 1, false);
      setSizeSheetProduct(product);
      setSelectedSize('One Size');
      setSelectedColor(color);
      setAddedSuccess(true);
      playLuxuryChime();
      return;
    }

    // Multiple sizes: open sheet
    setSizeSheetProduct(product);
    setSelectedSize(null);
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null);
    setAddedSuccess(false);
  };

  const confirmAddSize = (size) => {
    if (!sizeSheetProduct) return;
    const color = selectedColor || (sizeSheetProduct.colors && sizeSheetProduct.colors.length > 0 ? sizeSheetProduct.colors[0] : { name: 'Default', hex: '#111111' });
    addToCart(sizeSheetProduct, size, color, 1, false);
    setSelectedSize(size);
    setAddedSuccess(true);
    playLuxuryChime();
  };

  const handleNextPhoto = (productId, totalPhotos, e) => {
    if (e) e.stopPropagation();
    setActivePhotoIndices(prev => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current + 1) % totalPhotos };
    });
  };

  const handlePrevPhoto = (productId, totalPhotos, e) => {
    if (e) e.stopPropagation();
    setActivePhotoIndices(prev => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current - 1 + totalPhotos) % totalPhotos };
    });
  };

  const tabs = [
    { key: 'for_you', label: t('discover.tabs.forYou') || 'FOR YOU' },
    { key: 'new_arrivals', label: t('discover.tabs.newArrivals') || 'NEW ARRIVALS' },
    { key: 'women', label: t('discover.tabs.women') || 'WOMEN' },
    { key: 'accessories', label: t('discover.tabs.accessories') || 'ACCESSORIES' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        backgroundColor: '#0A0A0A',
        color: '#FFFFFF',
        fontFamily: "'Montserrat', sans-serif",
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none'
      }}
    >
      {/* =================================================================== */}
      {/* 1. TOP HEADER & DISCOVERY TABS BAR                                  */}
      {/* =================================================================== */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 75%, transparent 100%)',
          padding: '16px 20px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Back / Exit Button */}
          <button
            onClick={onBackToStore}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(197, 168, 128, 0.3)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
          >
            <ChevronLeft size={16} />
            <span>{isRtl ? 'المتجر' : 'Boutique'}</span>
          </button>

          {/* Sanaria Haute Couture Crest */}
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                fontFamily: "'Cinzel', 'Amiri', serif",
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#C5A880',
                textTransform: 'uppercase',
                display: 'block'
              }}
            >
              SANARIA DISCOVER
            </span>
            <span style={{ fontSize: '0.625rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              SINCE 1992 · VERTICAL FEED
            </span>
          </div>

          {/* Sound & Bag Shortcut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsAudioPlaying(!isAudioPlaying)}
              title={isAudioPlaying ? 'Mute Audio' : 'Play Runway Chime'}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: isAudioPlaying ? '#C5A880' : '#FFFFFF',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={openCart}
              style={{
                backgroundColor: 'rgba(197, 168, 128, 0.25)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #C5A880',
                color: '#C5A880',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>

        {/* 5 Fashion Discovery Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  backgroundColor: isActive ? 'rgba(197, 168, 128, 0.95)' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#0A0A0A' : 'rgba(255,255,255,0.85)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  border: isActive ? '1px solid #C5A880' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. MAIN FULL-SCREEN VERTICAL FEED CONTAINER                         */}
      {/* =================================================================== */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          width: '100%',
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          position: 'relative'
        }}
      >
        {feedItems.length === 0 ? (
          <div
            style={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '24px'
            }}
          >
            <Film size={36} color="#C5A880" style={{ marginBottom: '16px', opacity: 0.8 }} />
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: '#FAF8F5', marginBottom: '8px' }}>
              NO PIECES IN THIS EDIT YET
            </h3>
            <p style={{ color: '#888', maxWidth: '340px', fontSize: '0.875rem', marginBottom: '24px' }}>
              Switch to "FOR YOU" or explore other collections to discover Sanaria Fashion's runway creations.
            </p>
            <button
              onClick={() => setActiveTab('for_you')}
              className="btn-gold"
              style={{ padding: '12px 28px', fontSize: '0.8125rem' }}
            >
              EXPLORE FOR YOU
            </button>
          </div>
        ) : (
          feedItems.map((product, idx) => {
            const productName = typeof product.name === 'object' ? product.name[language] || product.name.en : product.name;
            const productDesc = typeof product.description === 'object' ? product.description[language] || product.description.en : product.description;
            const currentPhotoIdx = activePhotoIndices[product.id] || 0;
            const images = product.images && product.images.length > 0 ? product.images : ['/placeholder-luxury.svg'];
            const activeImage = images[currentPhotoIdx] || images[0];
            const liked = isFavorite(product.id);
            const isLikedAnimating = likeAnimationId === product.id;

            return (
              <section
                key={product.id}
                ref={el => (cardRefs.current[idx] = el)}
                style={{
                  height: '100vh',
                  width: '100%',
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#0E0E0E'
                }}
              >
                {/* Desktop Ambient Glow Backdrop */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: activeImage && !activeImage.includes('placeholder') && !activeImage.includes('unsplash') ? `url(${activeImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(35px) brightness(0.28)',
                    transform: 'scale(1.15)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Vertical Central Luxury Runway Card Frame */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '520px',
                    height: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#000000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 0 60px rgba(0,0,0,0.85)'
                  }}
                >
                  {/* FULL-SCREEN PRODUCT PHOTO / CAROUSEL */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 1,
                      overflow: 'hidden'
                    }}
                    onClick={() => {
                      if (images.length > 1) {
                        handleNextPhoto(product.id, images.length);
                      }
                    }}
                  >
                    {product.videoUrl ? (
                      <video
                        src={product.videoUrl}
                        autoPlay
                        loop
                        muted={!isAudioPlaying}
                        playsInline
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                    ) : (
                      <img
                        src={activeImage}
                        alt={productName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: currentIndex === idx ? 'scale(1.02)' : 'scale(1)'
                        }}
                      />
                    )}

                    {/* Gradient Vignette Overlays for Maximum Text Readability */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 22%, transparent 55%, rgba(0,0,0,0.92) 88%, #000000 100%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Multiple Image Indicators (Top Dots) */}
                    {images.length > 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '108px',
                          left: '20px',
                          right: '20px',
                          display: 'flex',
                          gap: '4px',
                          zIndex: 10
                        }}
                      >
                        {images.map((_, pIdx) => (
                          <div
                            key={pIdx}
                            style={{
                              flex: 1,
                              height: '2.5px',
                              backgroundColor: pIdx === currentPhotoIdx ? '#C5A880' : 'rgba(255,255,255,0.3)',
                              borderRadius: '2px',
                              transition: 'background-color 0.3s ease'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* DOUBLE-TAP / LIKE HEART BURST ANIMATION */}
                  {isLikedAnimating && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        animation: 'heartPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                      }}
                    >
                      <Heart
                        size={110}
                        color="#E53E3E"
                        fill="#E53E3E"
                        style={{ filter: 'drop-shadow(0 0 25px rgba(229, 62, 62, 0.8))' }}
                      />
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* 3. RIGHT FLOATING ACTION RAIL                           */}
                  {/* ======================================================= */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '16px',
                      bottom: '150px',
                      zIndex: 30,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '18px'
                    }}
                  >
                    {/* Item Counter (e.g. 03 / 12) */}
                    <div
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: '#C5A880',
                        border: '1px solid rgba(197, 168, 128, 0.3)',
                        marginBottom: '4px'
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')} / {String(feedItems.length).padStart(2, '0')}
                    </div>

                    {/* Heart / Favorite Button */}
                    <button
                      onClick={(e) => handleLike(product, e)}
                      aria-label="Favorite"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: liked ? 'rgba(229, 62, 62, 0.2)' : 'rgba(18, 18, 18, 0.65)',
                        backdropFilter: 'blur(14px)',
                        border: liked ? '1.5px solid #E53E3E' : '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transform: liked ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                      }}
                    >
                      <Heart
                        size={24}
                        color={liked ? '#E53E3E' : '#FFFFFF'}
                        fill={liked ? '#E53E3E' : 'none'}
                        style={{
                          transition: 'all 0.2s ease',
                          filter: liked ? 'drop-shadow(0 0 8px rgba(229, 62, 62, 0.6))' : 'none'
                        }}
                      />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={(e) => handleShare(product, e)}
                      aria-label="Share"
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(18, 18, 18, 0.65)',
                        backdropFilter: 'blur(14px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Share2 size={20} />
                    </button>

                    {/* View Details Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectProduct) onSelectProduct(product);
                      }}
                      title="View Full Product Page"
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(18, 18, 18, 0.65)',
                        backdropFilter: 'blur(14px)',
                        border: '1px solid rgba(197, 168, 128, 0.4)',
                        color: '#C5A880',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                      }}
                    >
                      <Info size={20} />
                    </button>

                    {/* Up / Down Navigation Chevrons for Desktop or Easy Click */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToIndex(idx - 1);
                        }}
                        disabled={idx === 0}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: idx === 0 ? '#555' : '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: idx === 0 ? 'default' : 'pointer'
                        }}
                      >
                        <ChevronUp size={18} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToIndex(idx + 1);
                        }}
                        disabled={idx === feedItems.length - 1}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: idx === feedItems.length - 1 ? '#555' : '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: idx === feedItems.length - 1 ? 'default' : 'pointer'
                        }}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </div>

                  {/* ======================================================= */}
                  {/* 4. BOTTOM EDITORIAL PRODUCT DISPLAY OVERLAY             */}
                  {/* ======================================================= */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 25,
                      padding: '20px 20px 24px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      pointerEvents: 'auto'
                    }}
                  >
                    {/* Collection / Availability Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {product.modelCode && (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                            backgroundColor: '#C5A880',
                            color: '#0A0A0A',
                            padding: '3px 9px',
                            borderRadius: '8px'
                          }}
                        >
                          كود {product.modelCode}
                        </span>
                      )}

                      {product.videoUrl && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            backgroundColor: 'rgba(229, 62, 62, 0.25)',
                            color: '#FF7B7B',
                            border: '1px solid rgba(229, 62, 62, 0.5)',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textTransform: 'uppercase'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E53E3E' }} />
                          LIVE RUNWAY
                        </span>
                      )}

                      {product.isDiscoverFeatured && !product.videoUrl && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            backgroundColor: 'rgba(197, 168, 128, 0.25)',
                            color: '#C5A880',
                            border: '1px solid #C5A880',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            textTransform: 'uppercase'
                          }}
                        >
                          RUNWAY EDIT
                        </span>
                      )}

                      {product.isSale && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            backgroundColor: 'rgba(229, 62, 62, 0.25)',
                            color: '#FC8181',
                            border: '1px solid rgba(229, 62, 62, 0.4)',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            textTransform: 'uppercase'
                          }}
                        >
                          EXCLUSIVE SALE
                        </span>
                      )}

                      <span
                        style={{
                          fontSize: '0.625rem',
                          letterSpacing: '0.08em',
                          color: 'rgba(255,255,255,0.7)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#48BB78' }} />
                        {t('discover.boutiquesAvailable') || 'Baghdad & Erbil Available'}
                      </span>
                    </div>

                    {/* PRODUCT NAME */}
                    <h2
                      style={{
                        margin: 0,
                        fontFamily: "'Cinzel', 'Amiri', serif",
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        lineHeight: 1.25,
                        color: '#FAF8F5',
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                      }}
                    >
                      {productName}
                    </h2>

                    {/* PRICE IN IQD */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          color: '#C5A880',
                          fontFamily: "'Montserrat', sans-serif",
                          letterSpacing: '0.04em'
                        }}
                      >
                        {Number(product.salePrice || product.price).toLocaleString()} IQD
                      </span>
                      {product.salePrice && product.salePrice < product.price && (
                        <span
                          style={{
                            fontSize: '0.875rem',
                            color: 'rgba(255,255,255,0.4)',
                            textDecoration: 'line-through'
                          }}
                        >
                          {Number(product.price).toLocaleString()} IQD
                        </span>
                      )}
                    </div>

                    {/* Short Description */}
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8125rem',
                        lineHeight: 1.4,
                        color: 'rgba(240, 240, 240, 0.82)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textShadow: '0 1px 4px rgba(0,0,0,0.6)'
                      }}
                    >
                      {productDesc}
                    </p>

                    {/* BUTTONS: [ ADD TO MY CART ] & [ VIEW DETAILS ] */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        onClick={(e) => handleAddToCartClick(product, e)}
                        style={{
                          flex: 2,
                          padding: '14px 18px',
                          backgroundColor: '#C5A880',
                          color: '#111111',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 6px 20px rgba(197, 168, 128, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = '#D6B991';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = '#C5A880';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <ShoppingBag size={17} />
                        <span>{t('discover.addToMyCart') || 'ADD TO MY CART'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectProduct) onSelectProduct(product);
                        }}
                        style={{
                          flex: 1,
                          padding: '14px 12px',
                          backgroundColor: 'rgba(255,255,255,0.12)',
                          backdropFilter: 'blur(10px)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255,255,255,0.25)',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                      >
                        <span>{t('discover.viewDetails') || 'DETAILS'}</span>
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* =================================================================== */}
      {/* 5. INTEGRATED QUICK SIZE BOTTOM SHEET MODAL                         */}
      {/* =================================================================== */}
      {sizeSheetProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setSizeSheetProduct(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              margin: '0 auto',
              backgroundColor: '#141414',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              border: '1px solid rgba(197, 168, 128, 0.25)',
              padding: '24px 24px 32px 24px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'rgba(255,255,255,0.25)',
                margin: '0 auto 18px auto'
              }}
            />

            {!addedSuccess ? (
              <>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: '#FAF8F5'
                      }}
                    >
                      {t('discover.selectSize') || 'SELECT YOUR SIZE'}
                    </h3>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#A0AEC0' }}>
                      {typeof sizeSheetProduct.name === 'object' ? sizeSheetProduct.name[language] || sizeSheetProduct.name.en : sizeSheetProduct.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSizeSheetProduct(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#888',
                      cursor: 'pointer',
                      padding: '6px'
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Color preview if multiple */}
                {sizeSheetProduct.colors && sizeSheetProduct.colors.length > 0 && (
                  <div style={{ marginBottom: '18px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#C5A880', fontWeight: 600, letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                      COLOR: {typeof (selectedColor || sizeSheetProduct.colors[0]).name === 'object' ? (selectedColor || sizeSheetProduct.colors[0]).name[language] || (selectedColor || sizeSheetProduct.colors[0]).name.en : (selectedColor || sizeSheetProduct.colors[0]).name}
                    </span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {sizeSheetProduct.colors.map((c, cIdx) => {
                        const isChosen = (selectedColor?.hex || sizeSheetProduct.colors[0].hex) === c.hex;
                        return (
                          <button
                            key={cIdx}
                            onClick={() => setSelectedColor(c)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: c.hex,
                              border: isChosen ? '2.5px solid #C5A880' : '1.5px solid rgba(255,255,255,0.2)',
                              outline: isChosen ? '2px solid rgba(197, 168, 128, 0.4)' : 'none',
                              cursor: 'pointer'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sizes Matrix: XXS, XS, S, M, L, XL, XXL */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {SIZES_ORDER.map(size => {
                      const isAvailable = (sizeSheetProduct.availableSizes || []).includes(size);
                      const stockQty = sizeSheetProduct.sizeStock ? sizeSheetProduct.sizeStock[size] : null;
                      const isOutOfStock = !isAvailable || (stockQty !== null && stockQty <= 0);

                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (!isOutOfStock) {
                              confirmAddSize(size);
                            }
                          }}
                          disabled={isOutOfStock}
                          style={{
                            padding: '14px 6px',
                            borderRadius: '8px',
                            backgroundColor: isOutOfStock ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                            border: isOutOfStock ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(197, 168, 128, 0.4)',
                            color: isOutOfStock ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={e => {
                            if (!isOutOfStock) {
                              e.currentTarget.style.backgroundColor = '#C5A880';
                              e.currentTarget.style.color = '#111';
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isOutOfStock) {
                              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                              e.currentTarget.style.color = '#FFFFFF';
                            }
                          }}
                        >
                          <span>{size}</span>
                          <span style={{ fontSize: '0.625rem', fontWeight: 500, opacity: 0.75 }}>
                            {isOutOfStock ? 'Sold Out' : 'Available'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p style={{ fontSize: '0.6875rem', color: '#718096', textAlign: 'center', margin: 0 }}>
                  Tailored by Sanaria Fashion artisans. Free delivery on orders over 150,000 IQD.
                </p>
              </>
            ) : (
              /* Success confirmation with CONTINUE DISCOVERING and VIEW CART */
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(72, 187, 120, 0.15)',
                    border: '2px solid #48BB78',
                    color: '#48BB78',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto'
                  }}
                >
                  <Check size={28} />
                </div>

                <h3
                  style={{
                    margin: '0 0 6px 0',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '1.25rem',
                    color: '#FAF8F5'
                  }}
                >
                  {t('discover.addedToBag') || 'Added to your bag'}
                </h3>

                <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: '#A0AEC0' }}>
                  {typeof sizeSheetProduct.name === 'object' ? sizeSheetProduct.name[language] || sizeSheetProduct.name.en : sizeSheetProduct.name}
                  {selectedSize && ` · Size: ${selectedSize}`}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => setSizeSheetProduct(null)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: '#C5A880',
                      color: '#111111',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    {t('discover.continueDiscovering') || 'CONTINUE DISCOVERING'}
                  </button>

                  <button
                    onClick={() => {
                      setSizeSheetProduct(null);
                      openCart();
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: 'transparent',
                      color: '#FAF8F5',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    {t('discover.viewCart') || 'VIEW BAG'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global CSS animations */}
      <style>{`
        @keyframes heartPop {
          0% { transform: scale(0.3); opacity: 0; }
          45% { transform: scale(1.25); opacity: 1; }
          70% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

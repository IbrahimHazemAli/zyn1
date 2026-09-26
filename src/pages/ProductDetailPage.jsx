import React, { useState, useMemo, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/shop/ProductCard';
import { STANDARD_SIZES } from '../components/shop/SelectSizeModal';
import { FullscreenImageViewer } from '../components/shop/FullscreenImageViewer';
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  Ruler,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film
} from 'lucide-react';

export const ProductDetailPage = ({
  product,
  onBackToShop,
  onSelectProduct,
  onQuickAdd,
  onOpenSelectSize,
  onOpenSizeGuide,
  onProceedToCheckout
}) => {
  const { language, t, isRtl } = useLanguage();
  const { addToCart } = useCart();
  const { products } = useStore();
  const { showToast } = useToast();

  if (!product) return null;

  const title = typeof product.name === 'object' ? product.name[language] || product.name.en : product.name;
  const description = typeof product.description === 'object' ? product.description[language] || product.description.en : product.description;
  const details = typeof product.details === 'object' ? product.details[language] || product.details.en : product.details;
  const hasSale = product.salePrice && product.salePrice < product.price;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Default', hex: '#111111' });
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFullscreenViewerOpen, setIsFullscreenViewerOpen] = useState(false);
  const hasRealPhotos = product.images && product.images.length > 0 && !product.images[0].includes('placeholder');
  const [isVideoActive, setIsVideoActive] = useState(Boolean(product.videoUrl && !hasRealPhotos));
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const pdpVideoRef = useRef(null);

  // Mobile Touch Swiping
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;
    if (isRtl) {
      if (isLeftSwipe) prevImage();
      if (isRightSwipe) nextImage();
    } else {
      if (isLeftSwipe) nextImage();
      if (isRightSwipe) prevImage();
    }
  };

  // Extract all configured sizes for this product
  const rawProductSizes = useMemo(() => {
    if (Array.isArray(product.sizes) && product.sizes.length > 0) return product.sizes;
    if (Array.isArray(product.availableSizes) && product.availableSizes.length > 0) return product.availableSizes;
    if (product.sizeStock && Object.keys(product.sizeStock).length > 0) return Object.keys(product.sizeStock);
    return [];
  }, [product]);

  const isOneSize = product.category === 'bags' || 
    product.category === 'accessories' || 
    (rawProductSizes.length === 1 && (String(rawProductSizes[0]).toLowerCase().includes('one') || String(rawProductSizes[0]).toLowerCase().includes('standard')));

  const sizesToDisplay = isOneSize 
    ? ['One Size'] 
    : rawProductSizes.length > 0 
    ? rawProductSizes 
    : STANDARD_SIZES;

  const productAvailableSizes = useMemo(() => {
    if (Array.isArray(product.availableSizes) && product.availableSizes.length > 0) return product.availableSizes;
    if (rawProductSizes.length > 0) return rawProductSizes;
    return sizesToDisplay;
  }, [product, rawProductSizes, sizesToDisplay]);

  // Calculate total stock across sizes or fallback to product.stock
  const effectiveTotalStock = useMemo(() => {
    if (product.sizeStock && Object.keys(product.sizeStock).length > 0) {
      return Object.values(product.sizeStock).reduce((sum, q) => sum + (Number(q) || 0), 0);
    }
    return product.stock !== undefined ? Number(product.stock) : 10;
  }, [product]);

  const isProductOutOfStock = effectiveTotalStock <= 0;

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  // When customer clicks "ADD TO BAG"
  const handleAddToBagClick = () => {
    const size = isOneSize ? 'One Size' : selectedSize;
    if (!size) {
      setSizeError(true);
      showToast(isRtl ? 'يرجى اختيار المقاس أولاً' : 'Please select a size first.', 'error');
      const el = document.getElementById('pdp-size-selection-area');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSizeError(false);
    addToCart(product, size, selectedColor, quantity, false);
    showToast(isRtl ? '✓ تمت الإضافة إلى حقيبة التسوق' : '✓ Added to your cart', 'success');
  };

  // When customer clicks "BUY NOW" (Direct one-tap checkout)
  const handleBuyNowClick = () => {
    const size = isOneSize ? 'One Size' : selectedSize;
    if (!size) {
      setSizeError(true);
      showToast(isRtl ? 'يرجى اختيار المقاس أولاً' : 'Please select a size first.', 'error');
      const el = document.getElementById('pdp-size-selection-area');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSizeError(false);
    addToCart(product, size, selectedColor, quantity, false);
    onProceedToCheckout();
  };

  const nextImage = () => {
    const len = product.images?.length || 1;
    setActiveImageIndex((prev) => (prev + 1) % len);
  };

  const prevImage = () => {
    const len = product.images?.length || 1;
    setActiveImageIndex((prev) => (prev - 1 + len) % len);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '24px 0 110px 0' }}>
      <div className="container-luxury">
        {/* Top Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '0.8125rem', color: '#777' }}>
          <button
            onClick={onBackToShop}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--color-text-primary)', cursor: 'pointer' }}
          >
            <ArrowLeft size={14} className="icon-flip-rtl" />
            <span>{t('nav.shop')}</span>
          </button>
          <span>/</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>{product.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--color-gold-dark)', fontWeight: 600 }}>{product.sku}</span>
          {product.modelCode && (
            <span
              style={{
                backgroundColor: '#C5A880',
                color: '#0A0A0A',
                fontWeight: 800,
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.06em'
              }}
            >
              كود {product.modelCode}
            </span>
          )}
        </div>

        {/* ---------------- PRODUCT MASTER SHOWCASE (60% / 40% EDITORIAL SPLIT) ---------------- */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '64px',
            alignItems: 'start',
            marginBottom: '90px'
          }}
          className="pdp-editorial-layout"
        >
          {/* LEFT: DOMINANT PHOTOGRAPHY GALLERY / VIDEO SHOWCASE */}
          <div>
            <div
              style={{
                width: '100%',
                aspectRatio: '3 / 4',
                backgroundColor: '#0A0A0A',
                overflow: 'hidden',
                position: 'relative',
                cursor: isVideoActive ? 'default' : 'zoom-in',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)'
              }}
              onClick={() => {
                if (!isVideoActive) setIsFullscreenViewerOpen(true);
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isVideoActive && product.videoUrl ? (
                <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000000' }}>
                  <video
                    ref={pdpVideoRef}
                    src={product.videoUrl}
                    autoPlay
                    loop
                    muted={isVideoMuted}
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Video Control Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      right: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      zIndex: 10
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (pdpVideoRef.current) {
                            if (isVideoPlaying) {
                              pdpVideoRef.current.pause();
                              setIsVideoPlaying(false);
                            } else {
                              pdpVideoRef.current.play();
                              setIsVideoPlaying(true);
                            }
                          }
                        }}
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: '#FAF8F5',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '50%',
                          width: '38px',
                          height: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        {isVideoPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (pdpVideoRef.current) {
                            pdpVideoRef.current.muted = !isVideoMuted;
                            setIsVideoMuted(!isVideoMuted);
                          }
                        }}
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: isVideoMuted ? 'rgba(255,255,255,0.6)' : '#C5A880',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '50%',
                          width: '38px',
                          height: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        {isVideoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsVideoActive(false);
                      }}
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: '#FAF8F5',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      عرض الصور • Photos
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={(product.images && (product.images[activeImageIndex] || product.images[0])) || '/placeholder-luxury.svg'}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    className="pdp-master-img"
                  />

                  {/* Watch Runway Video Overlay Pill */}
                  {product.videoUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsVideoActive(true);
                        setIsVideoPlaying(true);
                      }}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        [isRtl ? 'left' : 'right']: '16px',
                        backgroundColor: '#C5A880',
                        color: '#0A0A0A',
                        padding: '8px 16px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: '24px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                        zIndex: 10
                      }}
                    >
                      <Play size={13} fill="#0A0A0A" />
                      <span>{language === 'ar' ? 'فيديو الموديل على المنصة' : 'Watch Runway Video'}</span>
                    </button>
                  )}

                  {/* Lightbox / Zoom Hint Pill */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullscreenViewerOpen(true);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      [isRtl ? 'left' : 'right']: '16px',
                      backgroundColor: 'rgba(18, 18, 18, 0.82)',
                      color: '#FAF8F5',
                      padding: '8px 14px',
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(6px)',
                      cursor: 'pointer'
                    }}
                  >
                    <Maximize2 size={13} />
                    <span>Zoom Fullscreen</span>
                  </button>

                  {/* Navigation Chevrons */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          [isRtl ? 'right' : 'left']: '14px',
                          transform: 'translateY(-50%)',
                          width: '44px',
                          height: '44px',
                          backgroundColor: 'rgba(255, 255, 255, 0.88)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#121212',
                          cursor: 'pointer',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      >
                        <ChevronLeft size={20} className="icon-flip-rtl" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          [isRtl ? 'left' : 'right']: '14px',
                          transform: 'translateY(-50%)',
                          width: '44px',
                          height: '44px',
                          backgroundColor: 'rgba(255, 255, 255, 0.88)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#121212',
                          cursor: 'pointer',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      >
                        <ChevronRight size={20} className="icon-flip-rtl" />
                      </button>
                    </>
                  )}
                </>
              )}

              {/* New badge */}
              {product.isNew && (
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    [isRtl ? 'right' : 'left']: '16px',
                    backgroundColor: 'rgba(18, 18, 18, 0.85)',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.2em',
                    fontWeight: 600
                  }}
                >
                  NEW SEASON
                </span>
              )}
            </div>

            {/* High-Resolution Thumbnail Strip */}
            {(product.images.length > 1 || product.videoUrl) && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto' }}>
                {product.videoUrl && (
                  <button
                    onClick={() => {
                      setIsVideoActive(true);
                      setIsVideoPlaying(true);
                    }}
                    title="مشاهدة فيديو المنصة"
                    style={{
                      width: '84px',
                      height: '112px',
                      border: isVideoActive ? '2px solid #C5A880' : '1px solid var(--color-border)',
                      padding: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      backgroundColor: '#111111',
                      color: '#C5A880',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      flexShrink: 0,
                      opacity: isVideoActive ? 1 : 0.85,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Play size={22} fill="#C5A880" />
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {language === 'ar' ? 'فيديو المنصة' : 'Runway'}
                    </span>
                  </button>
                )}

                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsVideoActive(false);
                      setActiveImageIndex(i);
                    }}
                    style={{
                      width: '84px',
                      height: '112px',
                      border: !isVideoActive && activeImageIndex === i ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                      padding: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      opacity: !isVideoActive && activeImageIndex === i ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: CAMPAIGN SELECTION & CHECKOUT ACTIONS */}
          <div>
            {/* Brand Heritage Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.78125rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600 }}>
                SANARIA FASHION · SINCE 1992
              </span>
              <span style={{ color: '#CCC' }}>|</span>
              <span style={{ fontSize: '0.75rem', color: '#276749', fontWeight: 600 }}>
                ● {t('product.inStock')} ({product.stock} in stock)
              </span>
            </div>

            {/* Product Title */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                fontSize: 'clamp(2.2rem, 3.6vw, 3.2rem)',
                fontWeight: 400,
                color: 'var(--color-text-primary)',
                lineHeight: 1.18,
                margin: '0 0 16px 0'
              }}
            >
              {title}
            </h1>

            {/* Pricing in IQD */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '20px' }}>
              {hasSale ? (
                <>
                  <span style={{ fontSize: '2rem', fontWeight: 600, color: '#8C2525' }}>
                    {product.salePrice.toLocaleString()} {t('shop.currency')}
                  </span>
                  <span style={{ fontSize: '1.2rem', color: '#999', textDecoration: 'line-through' }}>
                    {product.price.toLocaleString()} {t('shop.currency')}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {product.price.toLocaleString()} {t('shop.currency')}
                </span>
              )}
            </div>

            {/* Short Narrative Description */}
            <p style={{ fontSize: '0.925rem', lineHeight: 1.7, color: '#666', margin: '0 0 28px 0' }}>
              {description}
            </p>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '28px' }} />

            {/* Color Swatch Options */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  {t('product.color')}: <strong style={{ color: 'var(--color-gold-dark)' }}>{typeof selectedColor.name === 'object' ? selectedColor.name[language] || selectedColor.name.en : selectedColor.name}</strong>
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: selectedColor.hex === c.hex ? '2px solid var(--color-gold)' : '1px solid #CCC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      {selectedColor.hex === c.hex && (
                        <Check size={16} color={c.hex === '#FFFFFF' || c.hex === '#F5EFEB' ? '#121212' : '#FFFFFF'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection (XXS to XXL) with Availability & Size Guide */}
            <div id="pdp-size-selection-area" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {t('product.size')}: {selectedSize ? <strong style={{ color: 'var(--color-gold-dark)' }}>{selectedSize}</strong> : <span style={{ color: sizeError ? '#E53E3E' : '#C05621' }}>{sizeError ? (isRtl ? '(يرجى تحديد المقاس)' : '(Select Size First)') : '(Select Size)'}</span>}
                </span>

                <button
                  onClick={() => onOpenSizeGuide(product.category)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78125rem',
                    color: 'var(--color-gold-dark)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  <Ruler size={14} />
                  <span>{t('product.sizeGuide')}</span>
                </button>
              </div>

              {sizeError && !selectedSize && (
                <div style={{ color: '#E53E3E', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚠️</span>
                  <span>{isRtl ? 'يرجى اختيار المقاس أولاً' : 'Please select a size first.'}</span>
                </div>
              )}

              {/* Large, Clear, Easy-to-Tap Size Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isOneSize ? '1fr' : 'repeat(auto-fit, minmax(76px, 1fr))', gap: '8px' }}>
                {sizesToDisplay.map(size => {
                  const isSizeStopped = (product.stoppedSizes || []).includes(size);
                  const sizeQty = product.sizeStock ? product.sizeStock[size] : undefined;
                  const isSoldOut = sizeQty !== undefined 
                    ? Number(sizeQty) <= 0 
                    : isProductOutOfStock;

                  const cleanSize = String(size).trim().toUpperCase();
                  const isConfiguredAvailable = isOneSize || productAvailableSizes.some(s => {
                    const cleanS = String(s).trim().toUpperCase();
                    return cleanS === cleanSize || cleanS.includes(cleanSize) || cleanSize.includes(cleanS);
                  });

                  const isAvailable = isConfiguredAvailable && !isSizeStopped && !isSoldOut;

                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      style={{
                        minHeight: '56px',
                        padding: '10px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? '#121212' : isAvailable ? '#FFFFFF' : '#F7F7F7',
                        color: isSelected ? '#FFFFFF' : isAvailable ? '#121212' : '#AAA',
                        border: isSelected ? '2px solid #C5A880' : isAvailable ? (sizeError ? '2px solid #FEB2B2' : '1px solid var(--color-border)') : '1px dashed #DDD',
                        boxShadow: isSelected ? '0 0 0 2px rgba(197, 168, 128, 0.35)' : 'none',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        opacity: isAvailable ? 1 : 0.45,
                        transition: 'all 0.18s ease'
                      }}
                    >
                      <span style={{ fontSize: '1rem', fontWeight: 600, textDecoration: isAvailable ? 'none' : 'line-through' }}>
                        {size}
                      </span>
                      <span style={{ fontSize: '0.65rem', marginTop: '2px', color: isSelected ? '#C5A880' : isAvailable ? '#276749' : '#C53030' }}>
                        {isSizeStopped 
                          ? (isRtl ? '✕ متوقف' : '✕ Paused') 
                          : isSoldOut 
                          ? (isRtl ? '✕ نفذت الكمية' : '✕ Sold Out') 
                          : isAvailable 
                          ? (isRtl ? '✓ متوفر' : '✓ In Stock') 
                          : (isRtl ? '✕ غير متوفر' : '✕ Unavailable')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {t('product.quantity')}
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '8px 14px', color: '#666', cursor: 'pointer' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 14px', fontSize: '0.875rem', fontWeight: 600 }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '8px 14px', color: '#666', cursor: 'pointer' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Out of Stock / Orders Paused Warning Banner */}
            {product.ordersStopped && (
              <div style={{
                backgroundColor: '#FFF5F5',
                border: '1px solid #FEB2B2',
                borderRadius: '4px',
                padding: '14px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '1.25rem' }}>⏸️</span>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#C53030' }}>
                    {isRtl ? 'الطلبات متوقفة مؤقتاً على هذه القطعة' : 'ORDERS TEMPORARILY PAUSED'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#742A2A', marginTop: '2px' }}>
                    {isRtl ? 'أوقف متجر سناريا استقبال الطلبات الجديدة لهذه القطعة حالياً.' : 'Ordering is temporarily paused for this piece.'}
                  </div>
                </div>
              </div>
            )}

            {!product.ordersStopped && isProductOutOfStock && (
              <div style={{
                backgroundColor: '#F7FAFC',
                border: '1px solid #CBD5E0',
                borderRadius: '4px',
                padding: '14px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '1.25rem' }}>❌</span>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4A5568' }}>
                    {isRtl ? 'نفذت الكمية بالكامل (Sold Out)' : 'CURRENTLY OUT OF STOCK'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '2px' }}>
                    {isRtl ? 'هذه القطعة نفذت من المخزن حالياً.' : 'All stock for this piece has sold out.'}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons: ADD TO BAG, BUY NOW */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
              {/* Primary: ADD TO BAG */}
              <button
                onClick={handleAddToBagClick}
                disabled={product.ordersStopped || isProductOutOfStock}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '0.875rem',
                  opacity: (product.ordersStopped || isProductOutOfStock) ? 0.45 : 1,
                  cursor: (product.ordersStopped || isProductOutOfStock) ? 'not-allowed' : 'pointer',
                  backgroundColor: product.ordersStopped ? '#742A2A' : (isProductOutOfStock ? '#4A5568' : '#121212')
                }}
              >
                <ShoppingBag size={18} />
                <span>
                  {product.ordersStopped
                    ? (isRtl ? 'الطلبات متوقفة' : 'ORDERS PAUSED')
                    : isProductOutOfStock
                    ? (isRtl ? 'نفذت الكمية' : 'OUT OF STOCK')
                    : selectedSize
                    ? t('product.addToBag')
                    : (isRtl ? 'أضف إلى السلة — اختر المقاس' : 'ADD TO BAG — SELECT SIZE')}
                </span>
              </button>

              {/* Direct: BUY NOW (One-Tap Checkout) */}
              {!(product.ordersStopped || isProductOutOfStock) && (
                <button
                  onClick={handleBuyNowClick}
                  className="btn-gold"
                  style={{ width: '100%', padding: '16px', fontSize: '0.85rem' }}
                >
                  <Zap size={16} />
                  <span>BUY NOW · DIRECT CHECKOUT</span>
                </button>
              )}
            </div>

            {/* Iraqi Delivery Trust Callout */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={18} color="var(--color-gold-dark)" />
                <span style={{ fontSize: '0.8125rem', color: '#555' }}>
                  {t('product.shippingInfo')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={18} color="var(--color-gold-dark)" />
                <span style={{ fontSize: '0.8125rem', color: '#555' }}>
                  Inspection allowed upon receipt. Complimentary delivery across Iraq on orders over 150,000 IQD.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', padding: '36px', marginBottom: '72px' }}>
          <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '14px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{
                fontSize: '0.85rem',
                fontWeight: activeTab === 'description' ? 600 : 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: activeTab === 'description' ? '#121212' : '#888',
                borderBottom: activeTab === 'description' ? '2px solid var(--color-gold)' : 'none',
                paddingBottom: '14px',
                cursor: 'pointer'
              }}
            >
              {t('product.description')}
            </button>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                fontSize: '0.85rem',
                fontWeight: activeTab === 'details' ? 600 : 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: activeTab === 'details' ? '#121212' : '#888',
                borderBottom: activeTab === 'details' ? '2px solid var(--color-gold)' : 'none',
                paddingBottom: '14px',
                cursor: 'pointer'
              }}
            >
              {t('product.details')}
            </button>
          </div>

          <div style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: '#555', maxWidth: '820px' }}>
            {activeTab === 'description' && <p style={{ margin: 0 }}>{description}</p>}
            {activeTab === 'details' && <p style={{ margin: 0 }}>{details}</p>}
          </div>
        </div>

        {/* Related Pieces Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                CURATED COMPLEMENTS
              </span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', 'Amiri', serif", fontSize: '2.2rem', fontWeight: 400, margin: 0 }}>
                {t('product.relatedTitle')}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '28px' }}>
              {relatedProducts.map(rel => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onSelectProduct={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <FullscreenImageViewer
        images={product.images}
        initialIndex={activeImageIndex}
        isOpen={isFullscreenViewerOpen}
        onClose={() => setIsFullscreenViewerOpen(false)}
        title={title}
      />

      {/* Mobile Sticky Bar with Add to Bag & Buy Now */}
      <div
        className="mobile-only-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 800,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-border)',
          padding: '12px 18px',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', color: '#888' }}>
            {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {(product.salePrice || product.price).toLocaleString()} {t('shop.currency')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleAddToBagClick}
            className="btn-primary"
            style={{ padding: '12px 18px', fontSize: '0.78125rem' }}
          >
            <ShoppingBag size={14} />
            <span>{selectedSize ? 'ADD' : 'SIZE'}</span>
          </button>

          <button
            onClick={handleBuyNowClick}
            className="btn-gold"
            style={{ padding: '12px 18px', fontSize: '0.78125rem' }}
          >
            <Zap size={14} />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>

      <style>{`
        .pdp-editorial-layout:hover .pdp-master-img {
          transform: scale(1.02);
        }
        .mobile-only-bar { display: none !important; }
        @media (max-width: 900px) {
          .pdp-editorial-layout {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .mobile-only-bar { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

import React, { useState, useRef, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

export const RunwayReelsShowcase = ({ onSelectProduct, onNavigateDiscover, onQuickAdd }) => {
  const { language, isRtl } = useLanguage();
  const { products, businessSettings } = useStore();
  const { addToCart } = useCart();

  const runwayVideos = useMemo(() => {
    // Only real sellable user products that have a video attached
    return (products || [])
      .filter(p => p.videoUrl && p.videoUrl.trim() !== '')
      .map(p => ({
        id: p.id,
        productId: p.id,
        code: p.modelCode || p.sku || '',
        videoUrl: p.videoUrl,
        title: p.name,
        price: p.salePrice || p.price,
        sizes: Array.isArray(p.sizes) ? p.sizes.join(' - ') : (p.sizes || '38 - 48'),
        category: p.category,
        badge: p.isFeatured ? (language === 'ar' ? 'الأكثر طلباً • BESTSELLER' : 'BESTSELLER') : (language === 'ar' ? 'فيديو المنصة • RUNWAY' : 'RUNWAY PIECE'),
        rawProduct: p
      }));
  }, [products, language]);

  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [mutedVideoId, setMutedVideoId] = useState(null); // default all sound off unless toggled
  const videoRefs = useRef({});

  if (runwayVideos.length === 0) return null;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' د.ع';
  };

  const handleTogglePlay = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingVideoId === id && !video.paused) {
      video.pause();
      setPlayingVideoId(null);
    } else {
      // Pause others
      Object.keys(videoRefs.current).forEach(k => {
        if (k !== id && videoRefs.current[k]) {
          videoRefs.current[k].pause();
        }
      });
      video.play().catch(() => {});
      setPlayingVideoId(id);
    }
  };

  const handleToggleSound = (id, e) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    if (mutedVideoId === id) {
      video.muted = true;
      setMutedVideoId(null);
    } else {
      // Mute others
      Object.keys(videoRefs.current).forEach(k => {
        if (videoRefs.current[k]) videoRefs.current[k].muted = true;
      });
      video.muted = false;
      setMutedVideoId(id);
    }
  };

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    const targetId = item.productId || item.id;
    const foundProduct = products.find(p => p.id === targetId || p.sku === item.id);
    if (foundProduct) {
      if (onQuickAdd) {
        onQuickAdd(foundProduct);
      } else {
        addToCart(
          foundProduct,
          foundProduct.sizes?.[0] || 'Standard',
          foundProduct.colors?.[0] || { name: 'Default', hex: '#111111' },
          1
        );
      }
    } else {
      const fallbackProduct = {
        id: item.id,
        sku: `SF-${item.code}`,
        title: item.title,
        price: item.price,
        sizes: ['38', '40', '42', '44', '46', '48'],
        category: item.category || 'women',
        image: '/images/sanaria-reels-poster.jpg'
      };
      if (onQuickAdd) {
        onQuickAdd(fallbackProduct);
      } else {
        addToCart(fallbackProduct, '38', { name: 'Default', hex: '#111111' }, 1);
      }
    }
  };

  const handleCardClick = (item) => {
    const targetId = item.productId || item.id;
    const foundProduct = products.find(p => p.id === targetId || p.sku === item.id);
    if (foundProduct && onSelectProduct) {
      onSelectProduct(foundProduct);
    } else {
      handleTogglePlay(item.id);
    }
  };

  return (
    <section
      style={{
        backgroundColor: '#0D0D0D',
        color: '#FAF8F5',
        padding: '90px 0 100px 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(197, 168, 128, 0.2)',
        borderBottom: '1px solid rgba(197, 168, 128, 0.2)'
      }}
    >
      <div className="container-luxury" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                color: '#C5A880',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: '12px',
                fontFamily: "'Cinzel', 'Amiri', serif"
              }}
            >
              <span style={{ width: '24px', height: '1px', backgroundColor: '#C5A880' }} />
              <span>
                {language === 'ar'
                  ? 'أزياء سناريا في حركة حية'
                  : language === 'ku'
                  ? 'مۆدێلە ڕاستەوخۆکان لە جوڵەدا'
                  : 'HAUTE COUTURE IN MOTION'}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Cinzel', 'Amiri', serif",
                fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                lineHeight: 1.25,
                margin: '0 0 12px 0',
                color: '#FFFFFF'
              }}
            >
              {language === 'ar'
                ? 'عروض المنصة التفاعلية — كودات الموديلات'
                : language === 'ku'
                ? 'نمایشی ڕاستەوخۆی مۆدێلەکان بە ڤیدیۆ'
                : 'The Runway In Motion'}
            </h2>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#A8A29E',
                maxWidth: '620px',
                lineHeight: 1.7,
                margin: 0
              }}
            >
              {language === 'ar'
                ? 'شاهدي تفاصيل وحركة كل فستان وقطعة في إطلالات حية على العارضات مع إمكانية الطلب الفوري والمباشر.'
                : language === 'ku'
                ? 'وردەکاری قوماش و جوڵەی مۆدێلەکان ببینە بە ڕاستەوخۆ لەگەڵ کڕینی ئۆنلاین.'
                : language === 'tr'
                ? 'Gerçek butik videolarında kumaş dökümünü ve hareketini deneyimleyin. Favori parçalarınızı doğrudan sepetinize ekleyin.'
                : 'Watch each garment move on the runway. Experience the silhouette and texture before securing your piece.'}
            </p>
          </div>

          {onNavigateDiscover && (
            <button
              onClick={onNavigateDiscover}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(197, 168, 128, 0.4)',
                color: '#FAF8F5',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <span>
                {language === 'ar'
                  ? 'فتح خلاصة الفيديوهات (Reels)'
                  : language === 'ku'
                  ? 'بینینی هەموو ڕیڵزەکان'
                  : 'Open Full Reels Feed'}
              </span>
              <ChevronRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
            </button>
          )}
        </div>

        {/* Video Cards Grid (Responsive 3 columns on desktop, 2 on tablet, 1 on mobile) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {runwayVideos.map((item) => {
            const isPlaying = playingVideoId === item.id;
            const isSoundOn = mutedVideoId === item.id;
            const itemTitle = typeof item.title === 'object' ? item.title[language] || item.title.ar : item.title;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                style={{
                  position: 'relative',
                  aspectRatio: '9 / 16',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#161616',
                  border: isPlaying ? '1px solid #C5A880' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isPlaying ? '0 12px 36px rgba(197, 168, 128, 0.25)' : '0 8px 24px rgba(0, 0, 0, 0.4)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Video Element */}
                <video
                  ref={(el) => (videoRefs.current[item.id] = el)}
                  src={getAssetUrl(item.videoUrl)}
                  loop
                  muted={!isSoundOn}
                  playsInline
                  autoPlay={item.id === 'sf-runway-7051'} // start first one automatically
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Subtle Gradient Overlays */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.5) 100%)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Top Badge & Sound Button */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    right: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 10
                  }}
                >
                  {/* Category / Collection Badge */}
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(197, 168, 128, 0.4)',
                      color: '#C5A880',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.badge}
                  </span>

                  {/* Audio Toggle Button */}
                  <button
                    onClick={(e) => handleToggleSound(item.id, e)}
                    title={isSoundOn ? 'كتم الصوت / Mute' : 'تشغيل الصوت / Unmute'}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: isSoundOn ? '#C5A880' : 'rgba(0,0,0,0.65)',
                      color: isSoundOn ? '#0D0D0D' : '#FAF8F5',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                </div>

                {/* Center Play/Pause indicator */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 8,
                    pointerEvents: 'none',
                    opacity: isPlaying ? 0 : 0.88,
                    transition: 'opacity 0.25s ease'
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      border: '1px solid #C5A880',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C5A880',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <Play size={24} style={{ marginLeft: isRtl ? '-2px' : '2px' }} />
                  </div>
                </div>

                {/* Bottom Information Card */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px 16px',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  {/* Model Code & Price Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: '#C5A880',
                        color: '#0D0D0D',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.06em'
                      }}
                    >
                      كود {item.code}
                    </span>

                    {item.isShowcaseOnly ? (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: '#C5A880',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase'
                        }}
                      >
                        عرض كوتور • LOOKBOOK
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#FAF8F5'
                        }}
                      >
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>

                  {/* Title & Sizes */}
                  <div>
                    <h3
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        lineHeight: 1.35
                      }}
                    >
                      {itemTitle}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#B3B3B3' }}>
                      {language === 'ar'
                        ? 'القياسات المتوفرة: '
                        : language === 'ku'
                        ? 'قەبارە بەردەستەکان: '
                        : language === 'tr'
                        ? 'Mevcut Bedenler: '
                        : 'Available Sizes: '}
                      <strong style={{ color: '#E5E5E5' }}>{item.sizes}</strong>
                    </div>
                  </div>

                  {/* Action Buttons: Add to Cart & View Product Details */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '8px',
                      marginTop: '4px'
                    }}
                  >
                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        backgroundColor: '#C5A880',
                        color: '#121212',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '9px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 10px rgba(197, 168, 128, 0.25)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#D4AF37';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#C5A880';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <ShoppingBag size={15} />
                      <span>
                        {language === 'ar'
                          ? 'إضافة إلى السلة'
                          : language === 'ku'
                          ? 'خستنە سەبەتە'
                          : language === 'tr'
                          ? 'Sepete Ekle'
                          : 'Add to Cart'}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(item);
                      }}
                      title="عرض التفاصيل والقياسات"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(8px)',
                        color: '#FAF8F5',
                        border: '1px solid rgba(255,255,255,0.25)',
                        borderRadius: '8px',
                        padding: '9px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { NewArrivalsScroll } from '../components/home/NewArrivalsScroll';
import { RunwayReelsShowcase } from '../components/home/RunwayReelsShowcase';
import { StoresPreview } from '../components/home/StoresPreview';
import { IraqDelivery } from '../components/home/IraqDelivery';
import { InstagramFeed } from '../components/home/InstagramFeed';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Compass } from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';

export const HomePage = ({
  onNavigateShop,
  onSelectProduct,
  onQuickAdd,
  onQuickView,
  onNavigateStores,
  onNavigateLookbook,
  onNavigateDiscover
}) => {
  const { products, cms } = useStore();
  const { language, isRtl } = useLanguage();

  // Sort sections by their admin-defined order and filter visible ones
  const activeSections = [...(cms.sections || [])]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .filter(sec => sec.isVisible !== false);

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'hero':
        return (
          <HeroBanner
            key="hero"
            onNavigateShop={() => onNavigateShop()}
            onExplore={() => {
              const el = document.getElementById('new-arrivals-gallery-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        );

      case 'categories':
        return (
          <CategoryGrid
            key="categories"
            onSelectCategory={cat => onNavigateShop({ category: cat })}
            onNavigateShop={onNavigateShop}
          />
        );

      case 'runway_reels':
        return (
          <RunwayReelsShowcase
            key="runway_reels"
            onNavigateDiscover={onNavigateDiscover}
            onNavigateShop={onNavigateShop}
            onNavigateLookbook={onNavigateLookbook}
          />
        );

      case 'new_arrivals':
        return (
          <React.Fragment key="new_arrivals">
            <div id="new-arrivals-gallery-section">
              <NewArrivalsScroll
                products={products.filter(p => !p.isHidden)}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
                onNavigateShop={onNavigateShop}
              />
            </div>

            {/* Editorial Vertical Discover Showcase Callout */}
            <section
              style={{
                backgroundColor: '#111111',
                color: '#FAF8F5',
                padding: '64px 24px',
                borderTop: '1px solid rgba(197, 168, 128, 0.25)',
                borderBottom: '1px solid rgba(197, 168, 128, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div className="container-luxury" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 380px', maxWidth: '560px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#C5A880', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: '14px', fontFamily: "'Cinzel', 'Amiri', serif" }}>
                    <span style={{ width: '20px', height: '1px', backgroundColor: '#C5A880' }} />
                    <span>{isRtl ? 'أرشيف المنصة • إطلالات حية' : 'THE RUNWAY ARCHIVE • SANARIA'}</span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Cinzel', 'Amiri', serif",
                      fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      lineHeight: 1.2,
                      margin: '0 0 16px 0',
                      color: '#FAF8F5'
                    }}
                  >
                    {isRtl ? 'إطلالات الموسم في حركة حية' : 'CURATED LOOKS IN MOTION'}
                  </h2>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#A0AEC0', marginBottom: '28px' }}>
                    {isRtl
                      ? 'شاهدي انسيابية الأقمشة، دقة الخياطة والتطريز، وقصات الأزياء الراقية من خلال عروض المنصة بالفيديو مع إمكانية تحديد مقاسك والطلب الفوري.'
                      : 'Experience the drape, movement, and silhouette of Sanaria’s signature tailoring. Explore our runway pieces in motion and secure your size with bespoke Iraqi delivery.'}
                  </p>
                  <div>
                    <button
                      onClick={onNavigateDiscover}
                      className="btn-gold"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 32px' }}
                    >
                      <Compass size={16} />
                      <span>{isRtl ? 'استكشفي عروض المنصة' : 'EXPLORE RUNWAY PIECES'}</span>
                    </button>
                  </div>
                </div>

                <div
                  onClick={onNavigateDiscover}
                  style={{
                    flex: '0 1 320px',
                    height: '420px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                    border: '1.5px solid rgba(197, 168, 128, 0.4)',
                    cursor: 'pointer',
                    margin: '0 auto'
                  }}
                >
                  <video
                    src={getAssetUrl(products.find(p => p.videoUrl && p.videoUrl.trim() !== '')?.videoUrl || '/videos/showcase-couture-6998.mp4')}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', color: '#C5A880', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {isRtl ? 'عرض المنصة التفاعلي' : 'RUNWAY IN MOTION'}
                    </span>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.95rem', color: '#FFF', fontWeight: 600 }}>
                      {isRtl ? 'اضغطي لمشاهدة العرض' : 'CLICK TO VIEW IN MOTION'}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </React.Fragment>
        );

      case 'promotional_banner': {
        const promo = cms.banners?.promotionalBanner;
        if (!promo || promo.isVisible === false) return null;

        const title = typeof promo.title === 'object'
          ? promo.title[language] || promo.title.en || 'THE NEW SEASON'
          : promo.title;
        const subtitle = typeof promo.subtitle === 'object'
          ? promo.subtitle[language] || promo.subtitle.en || ''
          : promo.subtitle;
        const btnText = typeof promo.buttonText === 'object'
          ? promo.buttonText[language] || promo.buttonText.en || 'DISCOVER'
          : promo.buttonText || 'DISCOVER';

        return (
          <section
            key="promotional_banner"
            style={{
              position: 'relative',
              minHeight: '460px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0E0E0E',
              overflow: 'hidden',
              margin: '60px 0'
            }}
          >
            {promo.image && !promo.image.includes('placeholder') ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${promo.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                  opacity: 0.45
                }}
              />
            ) : (
              <video
                src={getAssetUrl('/videos/showcase-runway-6998.mp4')}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.35
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(14,14,14,0.92) 0%, rgba(14,14,14,0.5) 50%, rgba(14,14,14,0.92) 100%)'
              }}
            />

            <div
              className="container-luxury"
              style={{
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                color: '#FFFFFF',
                padding: '60px 24px',
                maxWidth: '820px'
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '16px',
                  fontFamily: "'Cinzel', 'Amiri', serif"
                }}
              >
                <span style={{ width: '28px', height: '1px', backgroundColor: 'var(--color-gold)' }} />
                <span>SANARIA EDITORIAL CAMPAIGN</span>
                <span style={{ width: '28px', height: '1px', backgroundColor: 'var(--color-gold)' }} />
              </span>

              <h2
                style={{
                  fontFamily: "'Cinzel', 'Amiri', serif",
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '0 0 16px 0',
                  lineHeight: 1.15
                }}
              >
                {title}
              </h2>

              {subtitle && (
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#D8CEBE',
                    lineHeight: 1.6,
                    margin: '0 auto 32px auto',
                    maxWidth: '640px'
                  }}
                >
                  {subtitle}
                </p>
              )}

              <button
                onClick={() => onNavigateShop({ category: promo.linkCategory || 'all' })}
                className="btn-gold"
                style={{ padding: '14px 36px', fontSize: '0.8125rem' }}
              >
                <span>{btnText}</span>
                <ArrowRight size={15} className="icon-flip-rtl" />
              </button>
            </div>
          </section>
        );
      }

      case 'stores':
        return <StoresPreview key="stores" onNavigateStores={onNavigateStores} />;

      case 'delivery':
        return <IraqDelivery key="delivery" />;

      case 'instagram':
        return <InstagramFeed key="instagram" />;

      default:
        return null;
    }
  };

  return (
    <div>
      {activeSections.map(sec => renderSection(sec.id))}
      {!activeSections.some(s => s.id === 'runway_reels') && (
        <RunwayReelsShowcase
          key="runway_reels_fallback"
          onNavigateDiscover={onNavigateDiscover}
          onNavigateShop={onNavigateShop}
          onNavigateLookbook={onNavigateLookbook}
        />
      )}
    </div>
  );
};

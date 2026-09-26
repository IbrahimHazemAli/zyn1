import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Award } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

export const EditorialStory = ({ onNavigateAbout }) => {
  const { t, isRtl } = useLanguage();
  const { cms } = useStore();

  return (
    <section
      style={{
        padding: '110px 0',
        backgroundColor: '#111111',
        color: '#FDFCFA',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container-luxury">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center'
          }}
        >
          {/* Left Text & Heritage */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                color: '#C5A880',
                fontSize: '0.72rem',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                fontWeight: 600,
                fontFamily: "'Cinzel', 'Amiri', serif"
              }}
            >
              <span style={{ width: '24px', height: '1px', backgroundColor: '#C5A880' }} />
              <span>SINCE 1992 — 34 YEARS OF HERITAGE</span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                color: '#FFFFFF',
                margin: '0 0 24px 0'
              }}
            >
              {cms.story.heading || t('home.heritageTitle')}
            </h2>

            <div style={{ width: '60px', height: '2px', backgroundColor: '#C5A880', marginBottom: '28px' }} />

            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: '#CBC5BA',
                marginBottom: '20px',
                fontFamily: "'Cormorant Garamond', 'Amiri', Georgia, serif",
                fontWeight: 400
              }}
            >
              {cms.story.text || t('home.heritageStory')}
            </p>

            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.7,
                color: '#9E998F',
                marginBottom: '36px'
              }}
            >
              Today, Sanaria Fashion operates premier boutiques across the capital Baghdad (Jadriya Mall & Iraq Mall) and Erbil (Tablo, Majidi Mall & Family Mall), accompanied by insured delivery across all 18 Iraqi governorates.
            </p>

            <button
              onClick={onNavigateAbout}
              className="btn-gold"
              style={{ padding: '14px 34px', fontSize: '0.8125rem' }}
            >
              <span>Explore Our Story</span>
            </button>
          </div>

          {/* Right Image Composition */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '4 / 5',
                position: 'relative',
                border: '1px solid rgba(197, 168, 128, 0.25)',
                overflow: 'hidden'
              }}
            >
              {cms.banners?.lookbookImage ? (
                <img
                  src={cms.banners.lookbookImage}
                  alt="Sanaria Fashion Heritage"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <video
                  src={getAssetUrl('/videos/showcase-couture-6998.mp4')}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(17, 17, 17, 0.6) 0%, transparent 60%)'
                }}
              />
            </div>

            {/* Overlapping Stamp Box */}
            <div
              style={{
                position: 'absolute',
                bottom: '-24px',
                [isRtl ? 'right' : 'left']: '-20px',
                backgroundColor: '#1E1E1E',
                border: '1px solid #C5A880',
                padding: '20px 24px',
                maxWidth: '260px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)'
              }}
            >
              <span style={{ fontSize: '0.6875rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', display: 'block', marginBottom: '4px' }}>
                SANARIA BOUTIQUES
              </span>
              <span style={{ fontSize: '1.15rem', fontFamily: "'Cinzel', serif", color: '#FFFFFF', fontWeight: 600, display: 'block' }}>
                BAGHDAD & ERBIL
              </span>
              <span style={{ fontSize: '0.75rem', color: '#A19D95' }}>
                Established 1992
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { Sparkles, MapPin, Truck, Award } from 'lucide-react';

export const BrandStoryPage = ({ onNavigateShop, onNavigateStores }) => {
  const { t, isRtl } = useLanguage();
  const { cms, products } = useStore();
  const brandVideo = cms.hero?.videoUrl || products.find(p => p.videoUrl && p.videoUrl.trim() !== '')?.videoUrl;

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '60px 0 120px 0' }}>
      <div className="container-luxury">
        {/* Header Title */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              color: 'var(--color-gold-dark)',
              fontSize: '0.72rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '16px',
              fontFamily: "'Cinzel', 'Amiri', serif"
            }}
          >
            <span style={{ width: '32px', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.5)' }} />
            <span>ESTABLISHED 1992 • SULAYMANIYAH & ERBIL</span>
            <span style={{ width: '32px', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.5)' }} />
          </div>

          <h1
            style={{
              fontFamily: "'Cinzel', 'Amiri', serif",
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '0 0 16px 0'
            }}
          >
            {t('about.title')}
          </h1>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', Georgia, serif",
              fontSize: '1.35rem',
              color: 'var(--color-gold-dark)',
              fontStyle: 'italic',
              margin: 0
            }}
          >
            {t('about.subtitle')}
          </p>
        </div>

        {/* Hero Portrait Spread */}
        <div
          style={{
            width: '100%',
            height: '480px',
            backgroundColor: '#111111',
            marginBottom: '70px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--color-border)'
          }}
        >
          {brandVideo ? (
            <video
              src={brandVideo}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'radial-gradient(ellipse at center, #1E1E24 0%, #0A0A0C 100%)',
                opacity: 0.95
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(12, 12, 12, 0.75) 0%, transparent 60%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '40px'
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                color: '#FFFFFF',
                letterSpacing: '0.15em',
                fontWeight: 600
              }}
            >
              34 YEARS OF LUXURY SARTORIAL EXCELLENCE IN IRAQ
            </span>
          </div>
        </div>

        {/* Story Paragraphs */}
        <div style={{ maxWidth: '820px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.9, color: '#3A3835' }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', Georgia, serif",
              fontSize: '1.45rem',
              lineHeight: 1.7,
              color: 'var(--color-text-primary)',
              marginBottom: '32px'
            }}
          >
            {t('about.p1')}
          </p>

          <p style={{ marginBottom: '28px' }}>
            {t('about.p2')}
          </p>

          <p style={{ marginBottom: '48px' }}>
            {t('about.p3')}
          </p>

          {/* Key Milestones */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              padding: '36px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              margin: '40px 0'
            }}
          >
            <div>
              <span style={{ fontSize: '2.4rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'var(--color-gold)', display: 'block' }}>
                1992
              </span>
              <strong style={{ fontSize: '0.85rem', color: '#121212', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Founding Year
              </strong>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0 0' }}>
                Established in Iraq as a premier haute couture fashion atelier.
              </p>
            </div>

            <div>
              <span style={{ fontSize: '2.4rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'var(--color-gold)', display: 'block' }}>
                6
              </span>
              <strong style={{ fontSize: '0.85rem', color: '#121212', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Flagship Boutiques
              </strong>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0 0' }}>
                Jadriya & Iraq Mall (Baghdad); Majidi & Family Mall (Erbil); Family & Majidi Mall (Sulaymaniyah).
              </p>
            </div>

            <div>
              <span style={{ fontSize: '2.4rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'var(--color-gold)', display: 'block' }}>
                18
              </span>
              <strong style={{ fontSize: '0.85rem', color: '#121212', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Governorates Served
              </strong>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0 0' }}>
                Direct express delivery from Zakho to Basra with inspection rights.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '48px', flexWrap: 'wrap' }}>
            <button onClick={onNavigateShop} className="btn-gold" style={{ padding: '14px 36px' }}>
              <span>Shop Current Collection</span>
            </button>
            <button onClick={onNavigateStores} className="btn-secondary" style={{ padding: '14px 36px' }}>
              <span>Visit Our Boutiques</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

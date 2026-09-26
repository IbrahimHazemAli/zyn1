import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Volume2, VolumeX, Play, Pause, Film } from 'lucide-react';

export const HeroBanner = ({ onNavigateShop, onExplore }) => {
  const { language, t, isRtl } = useLanguage();
  const { cms, editorialPlacements } = useStore();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const heroTitle = 'SANARIA FASHION';

  const heroTagline = typeof cms.hero?.tagline === 'object'
    ? cms.hero.tagline[language] || cms.hero.tagline.en || ''
    : cms.hero?.tagline || t('hero.tagline');

  const heroSince = typeof cms.hero?.since === 'object'
    ? cms.hero.since[language] || cms.hero.since.en || 'SINCE 1992'
    : cms.hero?.since || t('brand.est');

  const rawPrimaryBtn = typeof cms.hero?.primaryButtonText === 'object'
    ? cms.hero.primaryButtonText[language] || cms.hero.primaryButtonText.en
    : cms.hero?.primaryButtonText;

  const primaryBtn = (!rawPrimaryBtn || rawPrimaryBtn === 'SHOP COLLECTION' || rawPrimaryBtn === 'تسوق التشكيلة')
    ? (isRtl ? 'تسوق تشكيلة النساء' : "SHOP WOMEN'S COLLECTION")
    : rawPrimaryBtn;

  const secondaryBtn = typeof cms.hero?.secondaryButtonText === 'object'
    ? cms.hero.secondaryButtonText[language] || cms.hero.secondaryButtonText.en || t('hero.lookbook')
    : cms.hero?.secondaryButtonText || t('hero.lookbook');

  const effectiveVideoUrl = editorialPlacements?.hero_banner?.videoUrl || cms.hero?.videoUrl || '/videos/showcase-couture-6998.mp4';

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#0A0A0A'
      }}
    >
      {/* Background Image or Video with Dark Vignette */}
      {effectiveVideoUrl ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          src={effectiveVideoUrl}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.62
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: cms.hero?.image ? `url(${cms.hero.image})` : 'radial-gradient(ellipse at center, #1a1a1f 0%, #0a0a0a 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            opacity: 0.62,
            transform: 'scale(1.02)',
            transition: 'transform 8s ease'
          }}
        />
      )}

      {/* Luxury Gradient Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.75) 80%, #0A0A0A 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 40%, transparent 40%, rgba(0, 0, 0, 0.7) 100%)'
        }}
      />

      {/* Hero Content Box */}
      <div
        className="container-luxury"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          color: '#FDFCFA',
          padding: '80px 24px'
        }}
      >
        {/* Heritage Editorial Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}
        >
          <span style={{ width: '36px', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.5)' }} />
          <span
            style={{
              color: '#C5A880',
              fontSize: '0.72rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 600,
              fontFamily: "'Cinzel', 'Amiri', serif"
            }}
          >
            {heroSince} • SULAYMANIYAH & ERBIL
          </span>
          <span style={{ width: '36px', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.5)' }} />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cinzel', 'Amiri', serif",
            fontSize: 'clamp(2.5rem, 6.5vw, 5rem)',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            margin: '0 0 16px 0',
            color: '#FFFFFF',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          {heroTitle}
        </h1>

        {/* Elegant Tagline */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', 'Amiri', serif",
            fontSize: 'clamp(1.15rem, 2.2vw, 1.65rem)',
            fontWeight: 300,
            letterSpacing: '0.04em',
            color: '#EFEAE2',
            maxWidth: '720px',
            margin: '0 auto 44px auto',
            lineHeight: 1.5
          }}
        >
          {heroTagline}
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <button
            onClick={() => onNavigateShop()}
            className="btn-gold"
            style={{
              padding: '14px 28px',
              fontSize: '0.8125rem',
              flex: '1 1 140px',
              maxWidth: '220px',
              boxSizing: 'border-box'
            }}
          >
            <span>{primaryBtn}</span>
            <ArrowRight size={15} className="icon-flip-rtl" />
          </button>

          <button
            onClick={() => onExplore()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FAF8F5',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '0.78125rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.25s ease',
              flex: '1 1 140px',
              maxWidth: '220px',
              boxSizing: 'border-box'
            }}
          >
            <span>{secondaryBtn}</span>
          </button>
        </div>
      </div>

      {/* Floating Runway Video Controller (Placed on the opposite side of WhatsApp so they never overlap) */}
      {effectiveVideoUrl && (
        <div
          style={{
            position: 'absolute',
            bottom: '68px',
            [isRtl ? 'right' : 'left']: '16px',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(10, 10, 10, 0.78)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(197, 168, 128, 0.4)',
            padding: '7px 12px',
            borderRadius: '24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#E53E3E',
                display: 'inline-block',
                boxShadow: '0 0 6px #E53E3E'
              }}
            />
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#FAF8F5',
                fontWeight: 600
              }}
            >
              RUNWAY
            </span>
          </div>

          <div style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'تشغيل الصوت / Unmute' : 'كتم الصوت / Mute'}
            style={{
              background: 'none',
              border: 'none',
              color: isMuted ? 'rgba(255,255,255,0.7)' : '#C5A880',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              transition: 'color 0.2s'
            }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Play/Pause Toggle */}
          <button
            onClick={togglePlay}
            title={isPlaying ? 'إيقاف مؤقت / Pause' : 'تشغيل / Play'}
            style={{
              background: 'none',
              border: 'none',
              color: '#FAF8F5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      )}

      {/* Stores Ribbon at Bottom of Hero */}
      <div
        className="hero-stores-ribbon"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(18, 18, 18, 0.92)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '8px 16px',
          boxSizing: 'border-box'
        }}
      >
        <div
          className="container-luxury"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '0.6875rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#BDB7AD',
            flexWrap: 'wrap',
            textAlign: 'center',
            lineHeight: 1.4
          }}
        >
          <span>{isRtl ? 'بغداد: الجادرية مول • العراق مول' : 'BAGHDAD: Jadriya Mall • Iraq Mall'}</span>
          <span style={{ color: '#C5A880' }}>|</span>
          <span>{isRtl ? 'أربيل: مجيدي مول • فاميلي مول' : 'ERBIL: Majidi Mall • Family Mall'}</span>
          <span style={{ color: '#C5A880' }}>|</span>
          <span>{isRtl ? 'السليمانية: فاميلي مول • مجيدي مول' : 'SULAYMANIYAH: Family Mall • Majidi Mall'}</span>
          <span style={{ color: '#C5A880' }}>|</span>
          <span style={{ color: '#C5A880' }}>{isRtl ? 'توصيل مؤمن لكافة محافظات العراق' : 'DELIVERY ACROSS ALL IRAQ'}</span>
        </div>
      </div>
    </section>
  );
};

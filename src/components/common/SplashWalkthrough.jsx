import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SplashWalkthrough = ({ onComplete }) => {
  const { t, isRtl } = useLanguage();
  const [phase, setPhase] = useState(1); // 1: Brand intro, 2: Discover collection
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Phase 1 -> Phase 2 after 1.2s
    const timer1 = setTimeout(() => {
      setPhase(2);
    }, 1200);

    // Auto complete after 2.8s
    const timer2 = setTimeout(() => {
      handleComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#090909',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(197, 168, 128, 0.09) 0%, rgba(9, 9, 9, 0.98) 70%)',
        color: '#FFFFFF',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto'
      }}
    >
      {/* Skip Button */}
      <button
        onClick={handleComplete}
        style={{
          position: 'absolute',
          top: '20px',
          [isRtl ? 'left' : 'right']: '20px',
          padding: '8px 16px',
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#A19D95',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.borderColor = '#C5A880';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#A19D95';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }}
      >
        {t('intro.skip')}
      </button>

      {/* Center Cinematic Content */}
      <div style={{ textAlign: 'center', maxWidth: '640px', padding: '0 24px' }}>
        {phase === 1 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src="/logo.png"
              alt="Sanaria Fashion Logo"
              style={{
                height: '72px',
                width: 'auto',
                marginBottom: '20px',
                filter: 'drop-shadow(0 4px 16px rgba(197, 168, 128, 0.3))'
              }}
            />
            <h1
              style={{
                fontFamily: "'Cinzel', 'Amiri', serif",
                fontSize: '2.5rem',
                fontWeight: 500,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                color: '#FFFFFF'
              }}
            >
              SANARIA FASHION
            </h1>
            <p
              style={{
                fontSize: '0.875rem',
                letterSpacing: '0.36em',
                color: '#C5A880',
                textTransform: 'uppercase',
                margin: 0,
                fontWeight: 500
              }}
            >
              SINCE 1992
            </p>
          </div>
        )}

        {phase === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: 'rgba(197, 168, 128, 0.1)',
                border: '1px solid rgba(197, 168, 128, 0.3)',
                color: '#C5A880',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '20px'
              }}
            >
              <span style={{ width: '20px', height: '1px', backgroundColor: '#C5A880' }} />
              <span>EST. 1992</span>
              <span style={{ width: '20px', height: '1px', backgroundColor: '#C5A880' }} />
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                fontSize: '2.4rem',
                fontWeight: 400,
                letterSpacing: '0.08em',
                margin: '0 0 28px 0',
                color: '#FDFCFA',
                lineHeight: 1.3
              }}
            >
              {t('intro.discover')}
            </h2>

            <button
              onClick={handleComplete}
              className="btn-gold"
              style={{
                padding: '12px 32px',
                fontSize: '0.8125rem'
              }}
            >
              <span>{t('hero.shopCollection')}</span>
              <ArrowRight size={15} className="icon-flip-rtl" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: '#C5A880',
            width: phase === 1 ? '55%' : '100%',
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 0 10px rgba(197, 168, 128, 0.6)'
          }}
        />
      </div>
    </div>
  );
};

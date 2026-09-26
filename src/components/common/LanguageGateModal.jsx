import React from 'react';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import { ArrowRight, ArrowLeft, Check, X, Sparkles, ShieldCheck } from 'lucide-react';

export const LanguageGateModal = ({ isChangeMode = false, onClose }) => {
  const { language, selectLanguage, isRtl } = useLanguage();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && isChangeMode && onClose) {
      onClose();
    }
  };

  const getSubLabel = (code) => {
    switch (code) {
      case 'ar':
        return 'العراق • IQ (الرسمية)';
      case 'en':
        return 'International • EN';
      case 'ku':
        return 'كوردستان • KR (سۆرانی)';
      case 'tr':
        return 'Türkiye • TR';
      default:
        return '';
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(8, 8, 8, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '16px',
        overflowY: 'auto',
        animation: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        boxSizing: 'border-box'
      }}
    >
      {/* Decorative ambient radial glow */}
      <div
        style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(500px, 90vw)',
          height: 'min(400px, 60vh)',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Main Luxury Modal Card */}
      <div
        className="sanaria-lang-modal-card"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '480px',
          maxHeight: 'calc(100dvh - 32px)',
          margin: 'auto',
          overflowY: 'auto',
          backgroundColor: '#121212',
          backgroundImage: 'linear-gradient(180deg, #161616 0%, #0F0F0F 100%)',
          border: '1px solid rgba(197, 168, 128, 0.35)',
          borderRadius: '16px',
          padding: '28px 20px 24px 20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 1px 1px rgba(197, 168, 128, 0.25)',
          color: '#FDFCFA',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #C5A880, transparent)',
            borderRadius: '2px'
          }}
        />

        {/* Top Close Button (Available in Change Mode or with onClose) */}
        {isChangeMode && onClose && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '16px',
              [isRtl ? 'left' : 'right']: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#A19D95',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#C5A880';
              e.currentTarget.style.backgroundColor = 'rgba(197, 168, 128, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A19D95';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '22px' }}>
          {/* Logo Plaque */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: '#FAF8F5',
              border: '1px solid rgba(197, 168, 128, 0.5)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
            }}
          >
            <img
              src="/logo.png"
              alt="Sanaria Fashion Since 1992"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h2
            style={{
              fontFamily: "'Cinzel', 'Amiri', serif",
              fontSize: 'clamp(1.25rem, 4.5vw, 1.6rem)',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: '#FFFFFF',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
              lineHeight: 1.2
            }}
          >
            SANARIA FASHION
          </h2>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.6875rem',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: '#C5A880',
              fontWeight: 600
            }}
          >
            <span style={{ width: '16px', height: '1px', backgroundColor: '#C5A880' }} />
            <span>SINCE 1992</span>
            <span style={{ width: '16px', height: '1px', backgroundColor: '#C5A880' }} />
          </div>
        </div>

        {/* Separator / Instruction */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '18px'
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.25)', maxWidth: '50px' }} />
          <span
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#B0AAA0',
              fontWeight: 500
            }}
          >
            SELECT LANGUAGE / اختر لغتك
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.25)', maxWidth: '50px' }} />
        </div>

        {/* Language Options List (Touch-friendly and strictly frame-contained) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px'
          }}
        >
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            const ArrowIcon = lang.dir === 'rtl' ? ArrowLeft : ArrowRight;

            return (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code, !isChangeMode)}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? 'rgba(197, 168, 128, 0.14)' : 'rgba(28, 28, 28, 0.75)',
                  border: isSelected ? '1.5px solid #C5A880' : '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: lang.dir === 'rtl' ? 'right' : 'left',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C5A880';
                  e.currentTarget.style.backgroundColor = 'rgba(197, 168, 128, 0.18)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(28, 28, 28, 0.75)';
                  }
                }}
              >
                {/* Text Block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: isSelected ? '#C5A880' : '#FFFFFF',
                        fontFamily: lang.code === 'ar' || lang.code === 'ku' ? "'Noto Sans Arabic', 'Amiri', sans-serif" : "'Montserrat', sans-serif",
                        lineHeight: 1.2
                      }}
                    >
                      {lang.native}
                    </span>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? 'rgba(197, 168, 128, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#C5A880' : '#8E8A83',
                        letterSpacing: '0.08em',
                        fontWeight: 600
                      }}
                    >
                      {lang.dir.toUpperCase()}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: isSelected ? '#DDD3C4' : '#88847D',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {getSubLabel(lang.code)}
                  </span>
                </div>

                {/* Right Selection / Indicator Icon */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: isSelected ? '1.5px solid #C5A880' : '1px solid rgba(255, 255, 255, 0.18)',
                    backgroundColor: isSelected ? '#C5A880' : 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#121212' : '#8E8A83',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSelected ? (
                    <Check size={15} strokeWidth={2.6} />
                  ) : (
                    <ArrowIcon size={13} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Boutique Guarantee Trust Line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.72rem',
            color: '#8A857D',
            lineHeight: 1.5,
            padding: '9px 12px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: isChangeMode ? '14px' : '0'
          }}
        >
          <ShieldCheck size={14} color="#C5A880" style={{ flexShrink: 0 }} />
          <span>بغداد وأربيل • توصيل مؤمن لكافة محافظات العراق</span>
        </div>

        {/* Dismiss Button in Change Mode */}
        {isChangeMode && (
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '11px 20px',
              fontSize: '0.78125rem',
              color: '#FAF8F5',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              transition: 'all 0.2s ease',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C5A880';
              e.currentTarget.style.color = '#C5A880';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.color = '#FAF8F5';
            }}
          >
            {isRtl ? 'إغلاق ومتابعة التسوق' : 'Close & Continue Shopping'}
          </button>
        )}
      </div>
    </div>
  );
};

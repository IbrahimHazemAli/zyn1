import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FullscreenImageViewer = ({
  images = [],
  initialIndex = 0,
  isOpen,
  onClose,
  title = 'Sanaria Fashion'
}) => {
  const { isRtl } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const nextImage = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        backgroundColor: 'rgba(9, 9, 9, 0.96)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={() => {
        if (isZoomed) setIsZoomed(false);
        else onClose();
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#E8E2D8',
          zIndex: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.9rem', letterSpacing: '0.14em', color: '#FFFFFF' }}>
            SANARIA HAUTE COUTURE
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
          <span style={{ fontSize: '0.8125rem', color: '#A19D95' }}>
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            {isZoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
            <span>{isZoomed ? 'Reset View' : 'Zoom In'}</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
            title="Close Lightbox"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '20px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`${title} - view ${currentIndex + 1}`}
          onClick={() => setIsZoomed(!isZoomed)}
          style={{
            maxWidth: isZoomed ? '160%' : '90vw',
            maxHeight: isZoomed ? '160%' : '80vh',
            objectFit: 'contain',
            transform: isZoomed ? 'scale(1.4)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.2, 1, 0.3, 1)',
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6)'
          }}
        />

        {/* Navigation Chevrons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                top: '50%',
                [isRtl ? 'right' : 'left']: '28px',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
            >
              <ChevronLeft size={24} className="icon-flip-rtl" />
            </button>

            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                top: '50%',
                [isRtl ? 'left' : 'right']: '28px',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
            >
              <ChevronRight size={24} className="icon-flip-rtl" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnails */}
      {images.length > 1 && (
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            zIndex: 10
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setIsZoomed(false);
                setCurrentIndex(i);
              }}
              style={{
                width: '54px',
                height: '72px',
                padding: 0,
                border: currentIndex === i ? '2px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.2)',
                opacity: currentIndex === i ? 1 : 0.5,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: '#111'
              }}
            >
              <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export const StoreMapVisual = ({ store, language = 'en', isRtl = false, height = 240 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cityName = typeof store.cityName === 'object' ? store.cityName[language] || store.cityName.en : store.cityName;
  const mallName = typeof store.mallName === 'object' ? store.mallName[language] || store.mallName.en : store.mallName;

  const lat = store.coordinates?.lat || 33.2833904;
  const lng = store.coordinates?.lng || 44.3936062;
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=${language}&z=15&output=embed`;

  return (
    <a
      href={store.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`${mallName} - Open Google Maps`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'block',
        width: '100%',
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#E5E3DF',
        textDecoration: 'none',
        cursor: 'pointer',
        borderBottom: '1px solid var(--color-border)'
      }}
    >
      {/* Real Google Maps Embed Iframe */}
      <iframe
        title={`${mallName} Map`}
        src={embedUrl}
        width="100%"
        height="100%"
        style={{
          border: 0,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          filter: isHovered ? 'contrast(1.05) saturate(1.15)' : 'contrast(1.02) saturate(1.05)',
          transform: isHovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease'
        }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Subtle Map Header Ribbon */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          [isRtl ? 'right' : 'left']: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(18, 18, 18, 0.88)',
          backdropFilter: 'blur(8px)',
          color: '#E0C097',
          padding: '5px 12px',
          fontSize: '0.6875rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 600,
          borderRadius: '2px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          zIndex: 2
        }}
      >
        <MapPin size={12} color="#C5A880" />
        <span>{cityName}</span>
      </div>

      {/* GPS Coordinates Pill */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          [isRtl ? 'left' : 'right']: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(6px)',
          color: '#333333',
          padding: '4px 10px',
          fontSize: '0.65rem',
          fontWeight: 600,
          fontFamily: 'monospace',
          letterSpacing: '0.04em',
          borderRadius: '2px',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          zIndex: 2
        }}
      >
        {lat.toFixed(3)}° N, {lng.toFixed(3)}° E
      </div>

      {/* Hover Callout: Direct Google Maps Launch */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 4px)',
          opacity: isHovered ? 1 : 0.9,
          backgroundColor: isHovered ? '#121212' : 'rgba(18, 18, 18, 0.82)',
          color: '#FFFFFF',
          padding: '7px 16px',
          fontSize: '0.71875rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          borderRadius: '20px',
          border: '1px solid rgba(197, 168, 128, 0.4)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.25s ease',
          zIndex: 2,
          whiteSpace: 'nowrap'
        }}
      >
        <Navigation size={12} color="#C5A880" />
        <span>{language === 'ar' ? 'عرض على خرائط Google' : language === 'ku' ? 'لە Google Maps بیکەرەوە' : 'View on Google Maps'}</span>
        <ExternalLink size={11} color="#C5A880" />
      </div>
    </a>
  );
};

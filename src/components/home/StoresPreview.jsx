import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Navigation, ExternalLink, ArrowRight } from 'lucide-react';
import { StoreMapVisual } from '../common/StoreMapVisual';

export const StoresPreview = ({ onNavigateStores }) => {
  const { t, language, isRtl } = useLanguage();
  const { stores } = useStore();
  const [filterCity, setFilterCity] = useState('all');

  const filteredStores = filterCity === 'all'
    ? stores
    : stores.filter(s => s.city === filterCity);

  return (
    <section style={{ padding: '90px 0', backgroundColor: 'var(--color-bg)' }}>
      <div className="container-luxury">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              PHYSICAL BOUTIQUES
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 400,
                color: 'var(--color-text-primary)',
                margin: 0
              }}
            >
              {t('home.storesTitle') || 'Our Mall Boutiques'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '8px 0 0 0' }}>
              {t('home.storesSubtitle') || 'Visit our physical boutiques in Baghdad, Erbil, and Sulaymaniyah.'}
            </p>
          </div>

          {/* City Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterCity('all')}
              style={{
                padding: '8px 18px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: filterCity === 'all' ? '#121212' : '#FFFFFF',
                color: filterCity === 'all' ? '#FFFFFF' : '#121212',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t('stores.filterAll')}
            </button>
            <button
              onClick={() => setFilterCity('baghdad')}
              style={{
                padding: '8px 18px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: filterCity === 'baghdad' ? '#121212' : '#FFFFFF',
                color: filterCity === 'baghdad' ? '#FFFFFF' : '#121212',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t('stores.baghdad')}
            </button>
            <button
              onClick={() => setFilterCity('erbil')}
              style={{
                padding: '8px 18px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: filterCity === 'erbil' ? '#121212' : '#FFFFFF',
                color: filterCity === 'erbil' ? '#FFFFFF' : '#121212',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t('stores.erbil')}
            </button>
            <button
              onClick={() => setFilterCity('sulaymaniyah')}
              style={{
                padding: '8px 18px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: filterCity === 'sulaymaniyah' ? '#121212' : '#FFFFFF',
                color: filterCity === 'sulaymaniyah' ? '#FFFFFF' : '#121212',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t('stores.sulaymaniyah') || (language === 'ar' ? 'السليمانية' : language === 'ku' ? 'سلێمانی' : 'Sulaymaniyah')}
            </button>
          </div>
        </div>

        {/* Stores Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}
        >
          {filteredStores.map(store => {
            const cityName = typeof store.cityName === 'object' ? store.cityName[language] || store.cityName.en : store.cityName;
            const mallName = typeof store.mallName === 'object' ? store.mallName[language] || store.mallName.en : store.mallName;
            const details = typeof store.locationDetails === 'object' ? store.locationDetails[language] || store.locationDetails.en : store.locationDetails;

            return (
              <div
                key={store.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                }}
              >
                {/* Real Live Map Visual (Zero Fake Photos) */}
                <StoreMapVisual
                  store={store}
                  language={language}
                  isRtl={isRtl}
                  height={220}
                />

                {/* Details */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-gold-dark)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {cityName}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>
                      {mallName}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                      {details}
                    </p>
                    <div style={{ fontSize: '0.78125rem', color: '#888', marginBottom: '8px' }}>
                      <strong>{t('stores.openHours') || 'Hours'}:</strong> {store.hours}
                    </div>
                  </div>

                  {/* Actions: Directions Only (WhatsApp Removed) */}
                  <div
                    style={{
                      paddingTop: '16px',
                      borderTop: '1px solid var(--color-border-subtle)',
                      marginTop: '16px'
                    }}
                  >
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        backgroundColor: '#121212',
                        color: '#FFFFFF',
                        border: '1px solid #121212',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        boxSizing: 'border-box',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <Navigation size={13} color="#C5A880" />
                      <span>{t('stores.directions') || 'Get Directions'}</span>
                      <ExternalLink size={12} style={{ opacity: 0.7 }} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Boutiques Link */}
        {onNavigateStores && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={onNavigateStores}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              <span>{language === 'ar' ? 'عرض شبكة الفروع بالكامل' : language === 'ku' ? 'بینینی هەموو لقەکان' : 'View Full Boutique Network'}</span>
              <ArrowRight size={14} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

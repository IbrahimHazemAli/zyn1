import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { Clock, Phone, Navigation, ExternalLink, Sparkles, MapPin } from 'lucide-react';
import { StoreMapVisual } from '../components/common/StoreMapVisual';

export const StoresPage = () => {
  const { t, language, isRtl } = useLanguage();
  const { stores } = useStore();
  const [selectedCity, setSelectedCity] = useState('all');

  const filteredStores = selectedCity === 'all'
    ? stores
    : stores.filter(s => s.city === selectedCity);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '60px 0 100px 0' }}>
      <div className="container-luxury">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 50px auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              color: 'var(--color-gold-dark)',
              fontSize: '0.72rem',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '16px',
              fontFamily: "'Cinzel', 'Amiri', serif"
            }}
          >
            <span style={{ width: '28px', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.5)' }} />
            <span>SANARIA BOUTIQUE NETWORK • EST. 1992</span>
            <span style={{ width: '28px', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.5)' }} />
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', serif",
              fontSize: 'clamp(2.4rem, 4.2vw, 3.5rem)',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
              margin: '0 0 12px 0'
            }}
          >
            {t('stores.title')}
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {t('stores.subtitle')}
          </p>

          {/* Filter City Buttons: All, Baghdad, Erbil, Sulaymaniyah */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '32px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCity('all')}
              style={{
                padding: '10px 22px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                backgroundColor: selectedCity === 'all' ? '#121212' : '#FFFFFF',
                color: selectedCity === 'all' ? '#FFFFFF' : '#121212',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t('stores.filterAll')}
            </button>
            <button
              onClick={() => setSelectedCity('baghdad')}
              style={{
                padding: '10px 22px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                backgroundColor: selectedCity === 'baghdad' ? '#121212' : '#FFFFFF',
                color: selectedCity === 'baghdad' ? '#FFFFFF' : '#121212',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t('stores.baghdad')}
            </button>
            <button
              onClick={() => setSelectedCity('erbil')}
              style={{
                padding: '10px 22px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                backgroundColor: selectedCity === 'erbil' ? '#121212' : '#FFFFFF',
                color: selectedCity === 'erbil' ? '#FFFFFF' : '#121212',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t('stores.erbil')}
            </button>
            <button
              onClick={() => setSelectedCity('sulaymaniyah')}
              style={{
                padding: '10px 22px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                backgroundColor: selectedCity === 'sulaymaniyah' ? '#121212' : '#FFFFFF',
                color: selectedCity === 'sulaymaniyah' ? '#FFFFFF' : '#121212',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px'
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
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                {/* Real Live Map Visual (Zero Fake Photos) */}
                <StoreMapVisual
                  store={store}
                  language={language}
                  isRtl={isRtl}
                  height={260}
                />

                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.71875rem',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'var(--color-gold-dark)',
                          fontWeight: 600
                        }}
                      >
                        {cityName}
                      </span>
                      <span style={{ fontSize: '0.71875rem', color: '#999', letterSpacing: '0.05em' }}>
                        SANARIA OFFICIAL
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                        fontSize: '1.65rem',
                        fontWeight: 500,
                        margin: '0 0 10px 0',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      {mallName}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                      {details}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: '#555', marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={15} color="var(--color-gold-dark)" />
                        <span><strong>{t('stores.openHours') || 'Hours'}:</strong> {store.hours}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={15} color="var(--color-gold-dark)" />
                        <span><strong>{t('stores.phone') || 'Phone'}:</strong> {store.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Directions Only (WhatsApp Removed) */}
                  <div style={{ paddingTop: '18px', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-directions-btn"
                      style={{
                        width: '100%',
                        padding: '13px 20px',
                        backgroundColor: '#121212',
                        color: '#FFFFFF',
                        border: '1px solid #121212',
                        textAlign: 'center',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        boxSizing: 'border-box',
                        transition: 'background-color 0.2s ease, transform 0.2s ease'
                      }}
                    >
                      <Navigation size={15} color="#C5A880" />
                      <span>{t('stores.directions') || 'Get Directions'}</span>
                      <ExternalLink size={13} style={{ opacity: 0.7 }} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

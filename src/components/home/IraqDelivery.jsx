import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';

export const IraqDelivery = () => {
  const { t } = useLanguage();

  const governoratesSample = [
    'بغداد (Baghdad)', 'أربيل (Erbil)', 'السليمانية (Sulaymaniyah)', 'البصرة (Basra)',
    'دهوك (Duhok)', 'كركوك (Kirkuk)', 'النجف (Najaf)', 'كربلاء (Karbala)',
    'نينوى (Nineveh)', 'بابل (Babil)', 'الأنبار (Anbar)', 'ديالى (Diyala)'
  ];

  return (
    <section
      style={{
        padding: '80px 0',
        backgroundColor: '#F3EFE9',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)'
      }}
    >
      <div className="container-luxury">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}>
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
              marginBottom: '14px',
              fontWeight: 600,
              fontFamily: "'Cinzel', 'Amiri', serif"
            }}
          >
            <span style={{ width: '28px', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.5)' }} />
            <span>NATIONWIDE CONCIERGE & DELIVERY</span>
            <span style={{ width: '28px', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.5)' }} />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', serif",
              fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
              margin: '0 0 12px 0'
            }}
          >
            {t('home.deliveryTitle')}
          </h2>

          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {t('home.deliverySubtitle')}
          </p>
        </div>

        {/* 3 Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}
        >
          <div style={{ padding: '28px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
            <Clock size={24} color="var(--color-gold-dark)" style={{ marginBottom: '14px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
              Express 24-48h Delivery
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#666', margin: 0, lineHeight: 1.5 }}>
              Dedicated priority couriers active in Baghdad, Erbil, and major metropolitan areas daily.
            </p>
          </div>

          <div style={{ padding: '28px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
            <ShieldCheck size={24} color="var(--color-gold-dark)" style={{ marginBottom: '14px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
              Full Right of Inspection
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#666', margin: 0, lineHeight: 1.5 }}>
              You may open and inspect your garments upon courier arrival before finalizing payment.
            </p>
          </div>

          <div style={{ padding: '28px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
            <MapPin size={24} color="var(--color-gold-dark)" style={{ marginBottom: '14px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
              All 18 Iraqi Governorates
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#666', margin: 0, lineHeight: 1.5 }}>
              Direct home and office dispatch throughout every city, district, and governorate in Iraq.
            </p>
          </div>
        </div>

        {/* Governorates Ticker/Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {governoratesSample.map((gov, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.75rem',
                padding: '6px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid #D8CEBE',
                color: '#555'
              }}
            >
              {gov}
            </span>
          ))}
          <span
            style={{
              fontSize: '0.75rem',
              padding: '6px 14px',
              backgroundColor: '#121212',
              color: '#FFFFFF',
              fontWeight: 600
            }}
          >
            + All Other Iraqi Provinces
          </span>
        </div>
      </div>
    </section>
  );
};

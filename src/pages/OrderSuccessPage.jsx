import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Printer, ArrowRight, PackageCheck, MapPin, ExternalLink } from 'lucide-react';

export const OrderSuccessPage = ({ order, onBackHome, onTrackOrder }) => {
  const { t, language, isRtl } = useLanguage();

  if (!order) return null;

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '60px 0 100px 0' }}>
      <div className="container-luxury" style={{ maxWidth: '780px' }}>
        {/* Success Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            padding: '44px 36px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}
        >
          {/* Top Icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#F0FFF4',
              border: '2px solid #276749',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              color: '#276749'
            }}
          >
            <CheckCircle2 size={38} />
          </div>

          <span style={{ fontSize: '0.75rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            SANARIA FASHION • SINCE 1992
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', serif",
              fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              margin: '0 0 12px 0'
            }}
          >
            {t('orderSuccess.title')}
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', maxWidth: '540px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            {t('orderSuccess.subtitle')}
          </p>

          {/* Reference Badge */}
          <div
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              backgroundColor: '#FAF8F5',
              border: '1px dashed var(--color-gold)',
              marginBottom: '40px'
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#666', display: 'block' }}>
              {t('orderSuccess.orderRef')}
            </span>
            <span style={{ fontSize: '1.4rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {order.id}
            </span>
          </div>

          {/* Order Details Grid */}
          <div
            style={{
              textAlign: isRtl ? 'right' : 'left',
              borderTop: '1px solid var(--color-border)',
              paddingTop: '28px',
              marginBottom: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontSize: '0.875rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>{t('orderSuccess.customer')}:</span>
              <strong>{order.customer.fullName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>{t('orderSuccess.phone')}:</span>
              <strong>{order.customer.phone}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>{t('orderSuccess.address')}:</span>
              <span>{order.customer.governorateName} — {order.customer.city}, {order.customer.address}</span>
            </div>

            {(order.location || order.customer?.location) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0FDF4', padding: '6px 10px', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
                <span style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <MapPin size={14} />
                  <span>{isRtl ? 'موقع GPS المعتمد:' : 'GPS Pinpoint Attached:'}</span>
                </span>
                <a
                  href={order.location?.mapsUrl || order.customer?.location?.mapsUrl || `https://www.google.com/maps?q=${(order.location || order.customer?.location).lat},${(order.location || order.customer?.location).lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#15803D', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  <span>{isRtl ? 'معاينة على الخريطة' : 'View on Google Maps'}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>{t('orderSuccess.payment')}:</span>
              <strong>{order.paymentMethodLabel}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>{t('orderSuccess.status')}:</span>
              <span style={{ padding: '2px 8px', backgroundColor: '#FEFCBF', color: '#744210', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px', marginTop: '6px' }}>
              <span style={{ color: '#888', display: 'block', marginBottom: '10px' }}>{t('orderSuccess.items')}:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {order.items.map(item => {
                  const name = typeof item.name === 'object' ? item.name[language] || item.name.en : item.name;
                  return (
                    <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>{name} ({item.size}) × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} IQD</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 600 }}>
              <span>{t('orderSuccess.total')}:</span>
              <span style={{ color: 'var(--color-gold-dark)' }}>{order.total.toLocaleString()} {t('shop.currency')}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {onTrackOrder && (
              <button
                onClick={() => onTrackOrder(order.id, order.customer?.phone || '')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  backgroundColor: '#0F172A',
                  color: '#FAF8F5',
                  border: '1px solid #334155',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  cursor: 'pointer'
                }}
              >
                <PackageCheck size={18} color="#C5A880" />
                <span>{isRtl ? '📍 تتبع مسار هذا الطلب مباشرة' : '📍 Track This Order Live'}</span>
              </button>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePrintReceipt}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
              >
                <Printer size={16} />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={onBackHome}
                className="btn-primary"
                style={{ flex: 1, padding: '12px', fontSize: '0.8125rem' }}
              >
                <span>{t('orderSuccess.backHome')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import {
  Instagram,
  Phone,
  PackageCheck,
  MapPin,
  Globe,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const Footer = ({ onNavigate, onReplayIntro, onOpenOrderTracking }) => {
  const { t, openChangeLanguageModal, isRtl } = useLanguage();
  const { businessSettings, stores, hasCustomerPurchased, latestCustomerOrder } = useStore();

  return (
    <footer
      style={{
        backgroundColor: '#0D0D0D',
        color: '#E8E2D8',
        paddingTop: '80px',
        paddingBottom: '40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}
    >
      <div className="container-luxury">
        {/* Top Trust Features Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            paddingBottom: '60px',
            marginBottom: '60px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ color: '#C5A880', marginTop: '4px' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFFFF', margin: '0 0 6px 0' }}>
                {t('home.deliveryTitle')}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#8E8A83', margin: 0, lineHeight: 1.5 }}>
                {t('home.deliveryGovernorates')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ color: '#C5A880', marginTop: '4px' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFFFF', margin: '0 0 6px 0' }}>
                Inspection Before Payment
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#8E8A83', margin: 0, lineHeight: 1.5 }}>
                Examine your luxury pieces upon delivery before cash or electronic payment.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ color: '#C5A880', marginTop: '4px' }}>
              <PackageCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFFFF', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{isRtl ? 'تتبع فوري ومباشر للطلبات' : 'Live Order Tracking'}</span>
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#8E8A83', margin: 0, lineHeight: 1.5 }}>
                {isRtl
                  ? 'متابعة مسار شحنتك لحظة بلحظة إلكترونياً عبر المتجر بأعلى دقة واحترافية.'
                  : 'Track your order status and courier dispatch in real-time directly on our website.'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '64px'
          }}
        >
          {/* Column 1: Brand Info */}
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="/logo.png" alt="Sanaria Fashion Logo" style={{ height: '44px', width: 'auto' }} />
              <div>
                <span
                  style={{
                    fontFamily: "'Cinzel', 'Amiri', serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    color: '#FFFFFF',
                    display: 'block',
                    textTransform: 'uppercase'
                  }}
                >
                  SANARIA FASHION
                </span>
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.28em', color: '#C5A880', fontWeight: 600 }}>
                  EST. 1992
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#8E8A83', lineHeight: 1.6, marginBottom: '24px' }}>
              {t('footer.brandDesc')}
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <a
                href={businessSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram @sanaria.fashion"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C5A880',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#C5A880';
                  e.currentTarget.style.color = '#121212';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#C5A880';
                }}
              >
                <Instagram size={17} />
              </a>

            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                marginBottom: '20px'
              }}
            >
              {t('footer.quickLinks')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <button onClick={() => onNavigate('home')} style={{ color: '#8E8A83', fontSize: '0.8125rem', transition: 'color 0.2s ease' }} onMouseEnter={e => e.target.style.color = '#C5A880'} onMouseLeave={e => e.target.style.color = '#8E8A83'}>
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} style={{ color: '#8E8A83', fontSize: '0.8125rem', transition: 'color 0.2s ease' }} onMouseEnter={e => e.target.style.color = '#C5A880'} onMouseLeave={e => e.target.style.color = '#8E8A83'}>
                  {t('nav.shop')}
                </button>
              </li>
              {onOpenOrderTracking && (
                <li>
                  <button
                    onClick={() => onOpenOrderTracking()}
                    style={{ color: '#C5A880', fontWeight: 600, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s ease' }}
                    onMouseEnter={e => e.target.style.color = '#FAF8F5'}
                    onMouseLeave={e => e.target.style.color = '#C5A880'}
                  >
                    <span>📍</span>
                    <span>{isRtl ? 'تتبع حالة طلبك' : 'Track Your Order'}</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onNavigate('shop', { category: 'women' })} style={{ color: '#8E8A83', fontSize: '0.8125rem', transition: 'color 0.2s ease' }} onMouseEnter={e => e.target.style.color = '#C5A880'} onMouseLeave={e => e.target.style.color = '#8E8A83'}>
                  {t('nav.women')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'cat-dresses' })} style={{ color: '#8E8A83', fontSize: '0.8125rem', transition: 'color 0.2s ease' }} onMouseEnter={e => e.target.style.color = '#C5A880'} onMouseLeave={e => e.target.style.color = '#8E8A83'}>
                  {isRtl ? 'فساتين السهرة' : 'Evening Gowns'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'bags' })} style={{ color: '#8E8A83', fontSize: '0.8125rem', transition: 'color 0.2s ease' }} onMouseEnter={e => e.target.style.color = '#C5A880'} onMouseLeave={e => e.target.style.color = '#8E8A83'}>
                  {t('nav.bagsAccessories')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lookbook')} style={{ color: '#8E8A83', fontSize: '0.8125rem', transition: 'color 0.2s ease' }} onMouseEnter={e => e.target.style.color = '#C5A880'} onMouseLeave={e => e.target.style.color = '#8E8A83'}>
                  {isRtl ? 'دفتر الإطلالات (Lookbook)' : 'Lookbook Campaign'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Store Locations */}
          <div>
            <h4
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                marginBottom: '20px'
              }}
            >
              {t('footer.stores')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8125rem', color: '#8E8A83' }}>
              <div>
                <strong style={{ color: '#C5A880', display: 'block', marginBottom: '4px' }}>
                  {t('stores.baghdad')}
                </strong>
                <span>• Jadriya Mall (الجادرية مول)</span><br />
                <span>• Iraq Mall (العراق مول)</span>
              </div>
              <div>
                <strong style={{ color: '#C5A880', display: 'block', marginBottom: '4px' }}>
                  {t('stores.erbil')}
                </strong>
                <span>• Majidi Mall (مجيدي مول)</span><br />
                <span>• Family Mall (فاميلي مول)</span>
              </div>
              <div>
                <strong style={{ color: '#C5A880', display: 'block', marginBottom: '4px' }}>
                  {t('stores.sulaymaniyah') || 'Sulaymaniyah'}
                </strong>
                <span>• Family Mall (فاميلي مول)</span><br />
                <span>• Majidi Mall (مجيدي مول)</span>
              </div>
              <button
                onClick={() => onNavigate('stores')}
                style={{
                  color: '#FFFFFF',
                  textAlign: isRtl ? 'right' : 'left',
                  textDecoration: 'underline',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                View all mall boutiques →
              </button>
            </div>
          </div>

          {/* Column 4: Customer Concierge */}
          <div>
            <h4
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                marginBottom: '20px'
              }}
            >
              {t('footer.customerCare')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem', color: '#8E8A83' }}>
              <p style={{ margin: 0 }}>
                {isRtl ? 'هاتف خدمة الزبائن والمتابعة:' : 'Customer Care Hotline:'}<br />
                <a
                  href={`tel:${businessSettings.phone}`}
                  style={{ color: '#C5A880', fontWeight: 600 }}
                >
                  {businessSettings.phone}
                </a>
              </p>
              <p style={{ margin: 0 }}>
                Instagram Official:<br />
                <a
                  href={businessSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#FFFFFF' }}
                >
                  {businessSettings.instagram}
                </a>
              </p>

              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={openChangeLanguageModal}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    width: 'fit-content'
                  }}
                >
                  <Globe size={14} color="#C5A880" />
                  <span>{t('langModal.changeLang')}</span>
                </button>

                {onReplayIntro && (
                  <button
                    onClick={onReplayIntro}
                    style={{
                      color: '#8E8A83',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      textDecoration: 'underline',
                      textAlign: isRtl ? 'right' : 'left',
                      cursor: 'pointer'
                    }}
                  >
                    Replay 1992 Walkthrough
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Iraqi Flag Pride */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.75rem',
            color: '#6E6B65'
          }}
        >
          <div>
            © {new Date().getFullYear()} {t('brand.name')} — {t('brand.since')}. {t('footer.rights')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>{t('footer.nationwideDelivery')}</span>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              style={{ color: '#8E8A83', textDecoration: 'underline', cursor: 'pointer' }}
            >
              {t('nav.admin')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

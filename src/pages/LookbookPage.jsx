import React, { useState } from 'react';
import { LOOKBOOK_CAMPAIGNS } from '../data/lookbookData';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, ArrowRight, X, Plus, Eye } from 'lucide-react';

export const LookbookPage = ({
  onSelectProduct,
  onQuickAdd,
  onNavigateShop
}) => {
  const { products } = useStore();
  const { language, t, isRtl } = useLanguage();
  const [activeLook, setActiveLook] = useState(null); // Look opened in drawer
  const [activePinProduct, setActivePinProduct] = useState(null);

  // Match tagged productId with live store product
  const getProduct = (productId) => products.find(p => p.id === productId);

  return (
    <div style={{ backgroundColor: '#101010', color: '#FDFCFA', minHeight: '100vh', padding: '60px 0 120px 0' }}>
      <div className="container-luxury">
        {/* Editorial Magazine Masthead */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '12px'
            }}
          >
            SANARIA EDITORIAL · VOLUME XXIV
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', serif",
              fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              margin: '0 0 16px 0',
              lineHeight: 1.1
            }}
          >
            {isRtl ? 'دفتر الإطلالات الحصرية' : 'The Haute Lookbook'}
          </h1>

          <p
            style={{
              fontFamily: "'Cinzel', 'Amiri', serif",
              fontSize: '0.9rem',
              letterSpacing: '0.18em',
              color: '#BDB7AA',
              maxWidth: '640px',
              margin: '0 auto',
              textTransform: 'uppercase'
            }}
          >
            {isRtl ? 'تسوق الإطلالات الكاملة مباشرة بنقرة واحدة' : 'Explore full campaign looks · Tap garments to shop the look'}
          </p>
        </div>

        {/* Campaign Spreads (Magazine Style) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '110px' }}>
          {LOOKBOOK_CAMPAIGNS.map((campaign, index) => {
            const title = typeof campaign.title === 'object' ? campaign.title[language] || campaign.title.en : campaign.title;
            const subtitle = typeof campaign.subtitle === 'object' ? campaign.subtitle[language] || campaign.subtitle.en : campaign.subtitle;

            return (
              <article
                key={campaign.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                {/* Look Meta Information Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                    paddingBottom: '16px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.6875rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                      LOOK {String(index + 1).padStart(2, '0')} · {campaign.season}
                    </span>
                    <h2
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                        fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                        fontWeight: 400,
                        margin: '4px 0 0 0',
                        color: '#FFFFFF'
                      }}
                    >
                      {title}
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveLook(campaign)}
                    className="btn-gold"
                    style={{ padding: '10px 24px', fontSize: '0.75rem' }}
                  >
                    <ShoppingBag size={14} />
                    <span>{isRtl ? 'تسوق تفاصيل الإطلالة' : 'SHOP THIS LOOK'}</span>
                  </button>
                </div>

                {/* Massive Campaign Photography Canvas with Hotspot Pins */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    minHeight: '440px',
                    overflow: 'hidden',
                    backgroundColor: '#1E1E1E',
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveLook(campaign)}
                >
                  <img
                    src={campaign.coverImage}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 1.2s cubic-bezier(0.2, 1, 0.3, 1)'
                    }}
                    className="lookbook-hero-img"
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(10, 10, 10, 0.75) 0%, transparent 60%)'
                    }}
                  />

                  {/* Interactive Hotspot Pins */}
                  {campaign.items.map((item, i) => {
                    const prod = getProduct(item.productId);
                    const itemTitle = typeof item.title === 'object' ? item.title[language] || item.title.en : item.title;

                    return (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          top: `${item.pin.y}%`,
                          left: `${item.pin.x}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 10
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (prod) {
                            setActivePinProduct(prod);
                          } else {
                            setActiveLook(campaign);
                          }
                        }}
                      >
                        {/* Pulsing Pin Marker */}
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.92)',
                            color: '#121212',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 0 6px rgba(197, 168, 128, 0.4)',
                            cursor: 'pointer',
                            animation: 'pulse 2s infinite'
                          }}
                          className="hotspot-pin"
                          title={`Click to view: ${itemTitle}`}
                        >
                          <Plus size={16} />
                        </div>
                      </div>
                    );
                  })}

                  {/* Editorial Quote at Bottom Left */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '28px',
                      left: '32px',
                      right: '32px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                        fontStyle: 'italic',
                        fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                        color: '#E8E2D8',
                        margin: 0,
                        maxWidth: '680px'
                      }}
                    >
                      {campaign.editorialQuote}
                    </p>

                    <span style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A19D95' }}>
                      {campaign.location}
                    </span>
                  </div>
                </div>

                {/* Garments in this look preview bar */}
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap',
                    padding: '16px 20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Pieces in this look:
                  </span>
                  {campaign.items.map((item, idx) => {
                    const prod = getProduct(item.productId);
                    const name = typeof item.title === 'object' ? item.title[language] || item.title.en : item.title;
                    return (
                      <button
                        key={idx}
                        onClick={() => prod ? onSelectProduct(prod) : setActiveLook(campaign)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '0.8125rem',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{name}</span>
                        <span style={{ color: 'var(--color-gold)' }}>({item.price.toLocaleString()} IQD)</span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ---------------- SLIDE-OVER "SHOP THE LOOK" DRAWER ---------------- */}
      {activeLook && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: isRtl ? 'flex-start' : 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setActiveLook(null)}
        >
          <div
            style={{
              backgroundColor: '#161616',
              color: '#FFFFFF',
              width: '100%',
              maxWidth: '520px',
              height: '100vh',
              overflowY: 'auto',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
              animation: 'slideLeft 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                  SHOP THE LOOK
                </span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', 'Amiri', serif", fontSize: '1.6rem', margin: '4px 0 0 0' }}>
                  {typeof activeLook.title === 'object' ? activeLook.title[language] || activeLook.title.en : activeLook.title}
                </h3>
              </div>

              <button onClick={() => setActiveLook(null)} style={{ color: '#888', cursor: 'pointer', padding: '6px' }}>
                <X size={22} />
              </button>
            </div>

            {/* Look Outfits List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
              {activeLook.items.map((item, i) => {
                const prod = getProduct(item.productId);
                if (!prod) return null;
                const title = typeof prod.name === 'object' ? prod.name[language] || prod.name.en : prod.name;
                const price = prod.salePrice || prod.price;

                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '18px',
                      padding: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <img
                      src={(prod.images && prod.images[0]) || '/placeholder-luxury.svg'}
                      alt={title}
                      style={{
                        width: '90px',
                        height: '120px',
                        objectFit: 'cover',
                        backgroundColor: '#222',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setActiveLook(null);
                        onSelectProduct(prod);
                      }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                          {prod.sku}
                        </span>
                        <h4
                          style={{
                            fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                            fontSize: '1.15rem',
                            margin: '2px 0 6px 0',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setActiveLook(null);
                            onSelectProduct(prod);
                          }}
                        >
                          {title}
                        </h4>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>
                          {price.toLocaleString()} {t('shop.currency')}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        {onQuickAdd && (
                          <button
                            onClick={() => {
                              setActiveLook(null);
                              onQuickAdd(prod);
                            }}
                            className="btn-gold"
                            style={{ flex: 1, padding: '10px', fontSize: '0.75rem' }}
                          >
                            <span>SELECT SIZE & ADD</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActiveLook(null);
                            onSelectProduct(prod);
                          }}
                          style={{
                            padding: '10px',
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#FFFFFF',
                            cursor: 'pointer'
                          }}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- POPUP WHEN PIN IS CLICKED ---------------- */}
      {activePinProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActivePinProduct(null)}
        >
          <div
            style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                FEATURED IN THIS LOOK
              </span>
              <button onClick={() => setActivePinProduct(null)} style={{ color: '#888', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <img
                src={(activePinProduct.images && activePinProduct.images[0]) || '/placeholder-luxury.svg'}
                alt="Garment"
                style={{ width: '80px', height: '110px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', 'Amiri', serif", fontSize: '1.2rem', margin: '0 0 6px 0' }}>
                  {typeof activePinProduct.name === 'object' ? activePinProduct.name[language] || activePinProduct.name.en : activePinProduct.name}
                </h4>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-gold)' }}>
                  {(activePinProduct.salePrice || activePinProduct.price).toLocaleString()} {t('shop.currency')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {onQuickAdd && (
                <button
                  onClick={() => {
                    const prod = activePinProduct;
                    setActivePinProduct(null);
                    onQuickAdd(prod);
                  }}
                  className="btn-gold"
                  style={{ width: '100%', padding: '12px', fontSize: '0.78125rem' }}
                >
                  <ShoppingBag size={15} />
                  <span>SELECT SIZE & ADD TO BAG</span>
                </button>
              )}

              <button
                onClick={() => {
                  const prod = activePinProduct;
                  setActivePinProduct(null);
                  onSelectProduct(prod);
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.78125rem' }}
              >
                <span>VIEW FULL PRODUCT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .lookbook-hero-img:hover {
          transform: scale(1.02);
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(197, 168, 128, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(197, 168, 128, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(197, 168, 128, 0); }
        }
      `}</style>
    </div>
  );
};

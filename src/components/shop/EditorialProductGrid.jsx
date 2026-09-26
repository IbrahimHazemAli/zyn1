import React from 'react';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ArrowRight, ShoppingBag, Eye, Ruler } from 'lucide-react';

export const EditorialProductGrid = ({
  products = [],
  onSelectProduct,
  onQuickAdd,
  onQuickView,
  onExploreCampaign
}) => {
  const { language, t, isRtl } = useLanguage();

  if (!products || products.length === 0) return null;

  // Split into curated groups for art-directed presentation
  const firstBatch = products.slice(0, 3);
  const featuredSpotlight = products.find(p => p.isFeatured) || products[0];
  const secondBatch = products.slice(3, 7);
  const thirdBatch = products.slice(7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
      {/* ---------------- 1. EDITORIAL CLUSTER A: HERO + PAIR ---------------- */}
      {firstBatch.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: firstBatch.length >= 3 ? '1.4fr 1fr 1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}
          className="editorial-cluster-a"
        >
          {/* Card 1: Hero Large Feature Card */}
          <div style={{ gridColumn: firstBatch.length >= 3 ? 'span 1' : 'auto' }}>
            <ProductCard
              product={firstBatch[0]}
              onSelectProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
              onQuickView={onQuickView}
              variant="tall"
              aspectRatio="3 / 4.4"
            />
          </div>

          {/* Cards 2 & 3: Refined Companion Cards */}
          {firstBatch.slice(1).map(product => (
            <div key={product.id}>
              <ProductCard
                product={product}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
                variant="standard"
                aspectRatio="3 / 4"
              />
            </div>
          ))}
        </div>
      )}

      {/* ---------------- 2. EDITORIAL CAMPAIGN MOMENT (FULL-WIDTH BANNER) ---------------- */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '440px',
          overflow: 'hidden',
          backgroundColor: '#111111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 32px'
        }}
        className="campaign-interlude-banner"
      >
        {/* Ambient Campaign Background Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, #231f1a 0%, #0d0d0f 100%)'
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(14, 14, 14, 0.4) 0%, rgba(10, 10, 10, 0.88) 100%)'
          }}
        />

        {/* Campaign Typography Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '720px',
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '14px'
            }}
          >
            HAUTE COUTURE CAMPAIGN · 2026
          </span>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', serif",
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              margin: '0 0 16px 0',
              lineHeight: 1.15
            }}
          >
            “THE NEW SEASON”
          </h2>

          <p
            style={{
              fontFamily: "'Cinzel', 'Amiri', serif",
              fontSize: '0.95rem',
              letterSpacing: '0.16em',
              color: '#D4CDBD',
              margin: '0 auto 28px auto',
              textTransform: 'uppercase'
            }}
          >
            Sanaria Fashion — Since 1992 · Baghdad & Erbil
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onExploreCampaign && onExploreCampaign()}
              className="btn-gold"
              style={{ padding: '14px 36px', fontSize: '0.8125rem' }}
            >
              <span>{isRtl ? 'استكشف الحملة الإعلانية' : 'EXPLORE CAMPAIGN'}</span>
              <ArrowRight size={15} className="icon-flip-rtl" />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- 3. FEATURED PRODUCTS SPOTLIGHT (SPLIT-SCREEN CAMPAIGN) ---------------- */}
      {featuredSpotlight && (
        <section
          style={{
            backgroundColor: '#FAF8F5',
            border: '1px solid var(--color-border)',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="featured-spotlight-section"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '56px',
              alignItems: 'center'
            }}
          >
            {/* Left: Huge Campaign Product Image */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '3 / 4',
                overflow: 'hidden',
                backgroundColor: '#EDE8E1',
                boxShadow: '0 20px 48px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer'
              }}
              onClick={() => onSelectProduct(featuredSpotlight)}
            >
              <img
                src={featuredSpotlight.images[0]}
                alt="Featured Masterpiece"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                className="featured-img"
              />

              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  [isRtl ? 'right' : 'left']: '16px',
                  backgroundColor: '#121212',
                  color: '#FAF8F5',
                  padding: '6px 14px',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
              >
                FEATURED SPOTLIGHT
              </div>
            </div>

            {/* Right: Rich Editorial Information */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ width: '20px', height: '1px', backgroundColor: 'var(--color-gold-dark)' }} />
                <span
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold-dark)',
                    fontWeight: 600
                  }}
                >
                  SANARIA ATELIER PIECE
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                  fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                  fontWeight: 400,
                  color: 'var(--color-text-primary)',
                  margin: '0 0 16px 0',
                  lineHeight: 1.2
                }}
              >
                {typeof featuredSpotlight.name === 'object'
                  ? featuredSpotlight.name[language] || featuredSpotlight.name.en
                  : featuredSpotlight.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {(featuredSpotlight.salePrice || featuredSpotlight.price).toLocaleString()} {t('shop.currency')}
                </span>
                {featuredSpotlight.salePrice && (
                  <span style={{ fontSize: '1.1rem', color: '#999', textDecoration: 'line-through' }}>
                    {featuredSpotlight.price.toLocaleString()} {t('shop.currency')}
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: '0.925rem',
                  lineHeight: 1.7,
                  color: '#666',
                  maxWidth: '520px',
                  margin: '0 0 28px 0'
                }}
              >
                {typeof featuredSpotlight.description === 'object'
                  ? featuredSpotlight.description[language] || featuredSpotlight.description.en
                  : featuredSpotlight.description}
              </p>

              {/* Available Sizes Display */}
              <div style={{ marginBottom: '32px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#777',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '10px'
                  }}
                >
                  Available Sizes:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => {
                    const isAvail = (featuredSpotlight.availableSizes || featuredSpotlight.sizes || []).some(s =>
                      s.toUpperCase().includes(sz)
                    );
                    return (
                      <span
                        key={sz}
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.78125rem',
                          fontWeight: 600,
                          backgroundColor: isAvail ? '#FFFFFF' : '#F0F0F0',
                          border: isAvail ? '1px solid var(--color-border)' : '1px dashed #DDD',
                          color: isAvail ? '#121212' : '#AAA',
                          textDecoration: isAvail ? 'none' : 'line-through',
                          display: 'inline-block'
                        }}
                      >
                        {sz}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onSelectProduct(featuredSpotlight)}
                  className="btn-primary"
                  style={{ padding: '16px 36px', fontSize: '0.8125rem' }}
                >
                  <Eye size={16} />
                  <span>{t('shop.viewDetails') || 'VIEW DETAILS'}</span>
                </button>

                {onQuickAdd && (
                  <button
                    onClick={() => onQuickAdd(featuredSpotlight)}
                    className="btn-gold"
                    style={{ padding: '16px 32px', fontSize: '0.8125rem' }}
                  >
                    <ShoppingBag size={16} />
                    <span>QUICK ADD</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 4. EDITORIAL CLUSTER B (2-COLUMN & STANDARD CARDS) ---------------- */}
      {secondBatch.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '36px'
          }}
        >
          {secondBatch.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
              onQuickView={onQuickView}
              variant={idx === 0 ? 'tall' : 'standard'}
            />
          ))}
        </div>
      )}

      {/* ---------------- 5. EDITORIAL CLUSTER C (REMAINING PIECES) ---------------- */}
      {thirdBatch.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '36px'
          }}
        >
          {thirdBatch.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .editorial-cluster-a {
            grid-template-columns: 1fr !important;
          }
          .featured-spotlight-section {
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

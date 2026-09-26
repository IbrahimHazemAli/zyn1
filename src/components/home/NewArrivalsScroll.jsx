import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCard } from '../shop/ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const NewArrivalsScroll = ({
  products = [],
  onSelectProduct,
  onQuickAdd,
  onQuickView,
  onNavigateShop
}) => {
  const { t, isRtl } = useLanguage();
  const scrollRef = useRef(null);

  // Filter newest items
  const newArrivals = products.filter(p => p.isNew || p.isFeatured);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = isRtl ? 380 : -380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = isRtl ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (newArrivals.length === 0) return null;

  return (
    <section style={{ padding: '90px 0', backgroundColor: '#FAF8F5', overflow: 'hidden' }}>
      <div className="container-luxury">
        {/* Top Header with Navigation Arrows */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '40px'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                color: 'var(--color-gold-dark)',
                fontSize: '0.72rem',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '8px',
                fontFamily: "'Cinzel', 'Amiri', serif"
              }}
            >
              <span style={{ width: '20px', height: '1px', backgroundColor: 'var(--color-gold)' }} />
              <span>{isRtl ? 'وصل حديثاً' : 'NEW ARRIVALS'}</span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 400,
                color: 'var(--color-text-primary)',
                margin: '0 0 6px 0',
                lineHeight: 1.2
              }}
            >
              {isRtl ? 'أحدث تصاميم سناريا فاشن' : 'Discover the latest from Sanaria'}
            </h2>

            <p style={{ fontSize: '0.875rem', color: '#777', margin: 0 }}>
              {isRtl ? 'إصدارات الموسم الجديد المختارة بعناية لحضور استثنائي' : 'Curated seasonal pieces crafted for distinguished presence'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* View All button */}
            <button
              onClick={() => onNavigateShop({ category: 'new' })}
              className="btn-ghost"
              style={{ padding: '8px 0', fontSize: '0.8125rem' }}
            >
              <span>{isRtl ? 'عرض الكل' : 'VIEW ALL'}</span>
              <ArrowRight size={15} className="icon-flip-rtl" />
            </button>

            {/* Scroll Navigation Chevrons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={scrollLeft}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#121212',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#121212';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#121212';
                }}
                title="Scroll Left"
              >
                <ChevronLeft size={20} className="icon-flip-rtl" />
              </button>

              <button
                onClick={scrollRight}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#121212',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#121212';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#121212';
                }}
                title="Scroll Right"
              >
                <ChevronRight size={20} className="icon-flip-rtl" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Track */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '20px'
          }}
          className="horizontal-product-track"
        >
          {newArrivals.map(product => (
            <div
              key={product.id}
              style={{
                flex: '0 0 300px',
                scrollSnapAlign: 'start'
              }}
            >
              <ProductCard
                product={product}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
                variant="tall"
                aspectRatio="3 / 4.2"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .horizontal-product-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

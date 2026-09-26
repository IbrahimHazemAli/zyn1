import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Eye, ArrowUpRight } from 'lucide-react';

export const ProductCard = ({
  product,
  onSelectProduct,
  onQuickAdd,
  onQuickView,
  variant = 'standard', // 'standard' | 'tall' | 'featured'
  aspectRatio = '3 / 4'
}) => {
  const { language, t, isRtl } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const title = typeof product.name === 'object' ? product.name[language] || product.name.en : product.name;
  const hasSale = product.salePrice && product.salePrice < product.price;
  const activePrice = product.salePrice || product.price;

  const displaySizes = React.useMemo(() => {
    if (product.category === 'accessories' || product.category === 'bags') return ['One Size'];
    if (Array.isArray(product.availableSizes) && product.availableSizes.length > 0) return product.availableSizes;
    if (product.sizeStock && Object.keys(product.sizeStock).length > 0) {
      const inStockSizes = Object.keys(product.sizeStock).filter(s => (Number(product.sizeStock[s]) || 0) > 0);
      if (inStockSizes.length > 0) return inStockSizes;
    }
    if (Array.isArray(product.sizes) && product.sizes.length > 0) return product.sizes;
    return [];
  }, [product]);

  const totalStockCount = React.useMemo(() => {
    if (product.sizeStock && Object.keys(product.sizeStock).length > 0) {
      return Object.values(product.sizeStock).reduce((sum, q) => sum + (Number(q) || 0), 0);
    }
    return product.stock !== undefined ? Number(product.stock) : 10;
  }, [product]);

  const isOutOfStock = Boolean(product.ordersStopped || totalStockCount <= 0);

  return (
    <div
      className="editorial-product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        transition: 'transform 0.4s ease'
      }}
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Master Photography Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: variant === 'tall' ? '2 / 3' : aspectRatio,
          overflow: 'hidden',
          backgroundColor: '#ECE7E1'
        }}
      >
        {/* Authentic Runway Video Preview or Editorial Image */}
        {product.videoUrl ? (
          <video
            src={product.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 1.2s cubic-bezier(0.2, 1, 0.3, 1)'
            }}
          />
        ) : (
          <img
            src={(product.images && product.images[0]) ? product.images[0] : '/placeholder-luxury.svg'}
            alt={title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 1.2s cubic-bezier(0.2, 1, 0.3, 1), opacity 0.8s ease',
              opacity: isHovered && product.images && product.images[1] ? 0 : 1
            }}
          />
        )}

        {/* Secondary Editorial Image (Crossfades on hover) */}
        {product.images && product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${title} alternate perspective`}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.04)' : 'scale(1.01)',
              transition: 'transform 1.2s cubic-bezier(0.2, 1, 0.3, 1), opacity 0.8s ease',
              opacity: isHovered ? 1 : 0
            }}
          />
        )}

        {/* Luxury Badges (Minimal & Editorial) */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            [isRtl ? 'right' : 'left']: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 3
          }}
        >
          {product.ordersStopped ? (
            <span
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 700,
                backgroundColor: '#1E1E1E',
                color: '#E2E8F0',
                padding: '4px 10px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              ORDERS PAUSED
            </span>
          ) : isOutOfStock ? (
            <span
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 700,
                backgroundColor: '#742A2A',
                color: '#FFFFFF',
                padding: '4px 10px'
              }}
            >
              OUT OF STOCK
            </span>
          ) : (
            <>
              {product.isNew && (
                <span
                  style={{
                    fontSize: '0.625rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    backgroundColor: 'rgba(18, 18, 18, 0.82)',
                    color: '#FAF8F5',
                    padding: '4px 10px',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {t('shop.newBadge') || 'NEW SEASON'}
                </span>
              )}
              {hasSale && (
                <span
                  style={{
                    fontSize: '0.625rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    backgroundColor: '#7A1D1D',
                    color: '#FFFFFF',
                    padding: '4px 10px'
                  }}
                >
                  {t('shop.saleBadge') || 'SALE'}
                </span>
              )}
            </>
          )}
        </div>

        {/* Subtle Bottom Hover Actions Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 14px',
            background: 'linear-gradient(to top, rgba(14, 14, 14, 0.78) 0%, rgba(14, 14, 14, 0.3) 60%, transparent 100%)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            zIndex: 4
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Add Button */}
          {onQuickAdd && (
            <button
              disabled={isOutOfStock}
              onClick={() => !isOutOfStock && onQuickAdd(product)}
              style={{
                flex: 1,
                padding: '11px 14px',
                backgroundColor: (product.ordersStopped || product.stock <= 0) ? '#2A2A2A' : '#FFFFFF',
                color: (product.ordersStopped || product.stock <= 0) ? '#888888' : '#121212',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: (product.ordersStopped || product.stock <= 0) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease, color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!(product.ordersStopped || product.stock <= 0)) {
                  e.currentTarget.style.backgroundColor = 'var(--color-gold)';
                  e.currentTarget.style.color = '#121212';
                }
              }}
              onMouseLeave={(e) => {
                if (!(product.ordersStopped || product.stock <= 0)) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#121212';
                }
              }}
            >
              <Plus size={14} />
              <span>
                {product.ordersStopped
                  ? 'Orders Paused'
                  : product.stock <= 0
                  ? 'Out of Stock'
                  : 'Quick Add'}
              </span>
            </button>
          )}

          {/* Quick Inspect View */}
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                color: '#121212',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'background-color 0.2s ease'
              }}
              title="Quick View"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)')}
            >
              <Eye size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Editorial Typography & Product Details */}
      <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Collection & Color Swatches Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-dark)',
              fontWeight: 600
            }}
          >
            {product.category} · {product.sku}
          </span>

          {product.colors && product.colors.length > 0 && (
            <div style={{ display: 'flex', gap: '5px' }}>
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: '1px solid rgba(0, 0, 0, 0.18)',
                    display: 'inline-block'
                  }}
                  title={typeof c.name === 'object' ? c.name[language] || c.name.en : c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Clean Product Name */}
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', 'Amiri', serif",
            fontSize: '1.2rem',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            margin: '2px 0 4px 0',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {title}
        </h3>

        {/* Price in IQD */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 600, color: hasSale ? '#8C2525' : 'var(--color-text-primary)' }}>
            {activePrice.toLocaleString()} {t('shop.currency')}
          </span>
          {hasSale && (
            <span style={{ fontSize: '0.8125rem', color: '#999', textDecoration: 'line-through' }}>
              {product.price.toLocaleString()} {t('shop.currency')}
            </span>
          )}
        </div>

        {/* Available Sizes & Stock Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem', flexWrap: 'wrap', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {displaySizes.slice(0, 4).map(sz => (
              <span
                key={sz}
                style={{
                  padding: '1px 5px',
                  borderRadius: '2px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#475569',
                  fontSize: '0.67rem',
                  fontWeight: 600
                }}
              >
                {sz}
              </span>
            ))}
            {displaySizes.length > 4 && (
              <span style={{ fontSize: '0.65rem', color: '#94A3B8', alignSelf: 'center' }}>
                +{displaySizes.length - 4}
              </span>
            )}
          </div>

          <span
            style={{
              fontWeight: 700,
              fontSize: '0.6875rem',
              color: product.ordersStopped ? '#B45309' : isOutOfStock ? '#DC2626' : '#15803D'
            }}
          >
            {product.ordersStopped
              ? (isRtl ? 'الطلبات متوقفة' : 'Paused')
              : isOutOfStock
              ? (isRtl ? 'نفذت الكمية' : 'OUT OF STOCK')
              : (isRtl ? 'متوفر' : 'In Stock')}
          </span>
        </div>
      </div>
    </div>
  );
};

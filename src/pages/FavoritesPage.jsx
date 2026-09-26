import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, Trash2, ShoppingBag, ArrowRight, Share2, Compass } from 'lucide-react';

export const FavoritesPage = ({
  onSelectProduct,
  onQuickAdd,
  onNavigateDiscover,
  onNavigateShop
}) => {
  const { language, isRtl, t } = useLanguage();
  const { products } = useStore();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '80vh', padding: '48px 0 80px 0' }}>
      <div className="container-luxury">
        {/* Header Title Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '24px',
            marginBottom: '40px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-dark)', marginBottom: '8px' }}>
              <Heart size={18} fill="#C5A880" color="#C5A880" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {t('favorites.subtitle') || 'Personal Wishlist'}
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Cinzel', 'Amiri', serif",
                fontSize: '2rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'var(--color-text-primary)'
              }}
            >
              {t('favorites.title') || 'SAVED PIECES'}
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {favoriteProducts.length} {t('favorites.count') || 'Pieces Liked'}
            </p>
          </div>

          {favoriteProducts.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleShareWishlist}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.78125rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-gold)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                <Share2 size={15} color="var(--color-gold)" />
                <span>{copiedLink ? (isRtl ? 'تم نسخ الرابط بنجاح' : 'Link Copied!') : (isRtl ? 'مشاركة القائمة' : 'Share Wishlist')}</span>
              </button>

              <button
                onClick={clearFavorites}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {favoriteProducts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '8px',
              maxWidth: '640px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 168, 128, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: 'var(--color-gold-dark)'
              }}
            >
              <Heart size={32} />
            </div>

            <h2
              style={{
                fontFamily: "'Cinzel', 'Amiri', serif",
                fontSize: '1.45rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '10px'
              }}
            >
              {t('favorites.emptyTitle') || 'Your Wishlist is Empty'}
            </h2>

            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                maxWidth: '440px',
                margin: '0 auto 30px auto'
              }}
            >
              {t('favorites.emptyDesc') || 'You have not saved any garments yet. Explore our vertical Discover feed to swipe and like your favorite pieces.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={onNavigateDiscover}
                className="btn-gold"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px' }}
              >
                <Compass size={16} />
                <span>{t('favorites.startDiscovering') || 'START DISCOVERING'}</span>
              </button>

              <button
                onClick={onNavigateShop}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.78125rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  cursor: 'pointer'
                }}
              >
                VIEW CATALOG
              </button>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px'
            }}
          >
            {favoriteProducts.map(product => {
              const productName = typeof product.name === 'object' ? product.name[language] || product.name.en : product.name;
              const image = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-luxury.svg';
              const price = Number(product.salePrice || product.price);

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  }}
                >
                  {/* Photo with Remove Trigger */}
                  <div
                    style={{ position: 'relative', height: '360px', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#F0EFEA' }}
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                  >
                    <img
                      src={image}
                      alt={productName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />

                    {/* Remove Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(product.id);
                      }}
                      title="Remove from favorites"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        [isRtl ? 'left' : 'right']: '12px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        color: '#E53E3E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>

                    {product.isSale && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          [isRtl ? 'right' : 'left']: '12px',
                          backgroundColor: '#111',
                          color: '#FFF',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          padding: '4px 8px',
                          borderRadius: '2px'
                        }}
                      >
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Info & Actions */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          letterSpacing: '0.14em',
                          color: 'var(--color-gold-dark)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          display: 'block',
                          marginBottom: '4px'
                        }}
                      >
                        {product.sku}
                      </span>
                      <h3
                        onClick={() => onSelectProduct && onSelectProduct(product)}
                        style={{
                          margin: '0 0 8px 0',
                          fontFamily: "'Cinzel', 'Amiri', serif",
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          cursor: 'pointer',
                          lineHeight: 1.3
                        }}
                      >
                        {productName}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          {price.toLocaleString()} IQD
                        </span>
                        {product.salePrice && product.salePrice < product.price && (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                            {Number(product.price).toLocaleString()} IQD
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => onQuickAdd && onQuickAdd(product)}
                        className="btn-gold"
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <ShoppingBag size={14} />
                        <span>{t('favorites.quickAdd') || 'Add to Bag'}</span>
                      </button>

                      <button
                        onClick={() => onSelectProduct && onSelectProduct(product)}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {t('discover.viewDetails') || 'Details'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

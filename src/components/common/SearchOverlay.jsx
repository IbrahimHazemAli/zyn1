import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchOverlay = ({ isOpen, onClose, onSelectProduct }) => {
  const { t, language, isRtl } = useLanguage();
  const { products } = useStore();
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(p => {
      const name = typeof p.name === 'object'
        ? (p.name[language] || p.name.en || '').toLowerCase()
        : p.name.toLowerCase();
      const sku = (p.sku || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      return name.includes(q) || sku.includes(q) || cat.includes(q);
    });
  }, [query, products, language]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(10, 10, 10, 0.88)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.2s ease-out',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '880px',
          margin: '40px auto 0 auto',
          padding: '0 24px',
          color: '#FDFCFA'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button
            onClick={onClose}
            style={{
              color: '#A19D95',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem'
            }}
          >
            <span>ESC / {isRtl ? 'إغلاق' : 'Close'}</span>
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div
          style={{
            position: 'relative',
            borderBottom: '2px solid #C5A880',
            paddingBottom: '16px',
            marginBottom: '36px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Search size={28} color="#C5A880" />
            <input
              type="text"
              autoFocus
              placeholder={t('nav.searchPlaceholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '1.4rem',
                fontFamily: "'Cormorant Garamond', 'Amiri', serif"
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: '#888', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div>
          {query.trim() && (
            <p style={{ fontSize: '0.78125rem', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              {filteredProducts.length} {t('shop.itemsCount')}
            </p>
          )}

          <div style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredProducts.map(product => {
              const name = typeof product.name === 'object' ? product.name[language] || product.name.en : product.name;
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(197, 168, 128, 0.12)';
                    e.currentTarget.style.borderColor = '#C5A880';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={(product.images && product.images[0]) || product.image || '/placeholder-luxury.svg'}
                      alt={name}
                      style={{ width: '48px', height: '64px', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#C5A880', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                        {product.sku}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 500, margin: '2px 0', color: '#FFFFFF' }}>
                        {name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'capitalize' }}>
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: isRtl ? 'left' : 'right', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#C5A880' }}>
                      {(product.salePrice || product.price).toLocaleString()} {t('shop.currency')}
                    </span>
                    <ArrowRight size={16} color="#A19D95" className="icon-flip-rtl" />
                  </div>
                </div>
              );
            })}

            {query.trim() && filteredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#8E8A83' }}>
                <p style={{ margin: 0 }}>{t('shop.noProducts')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Ruler, Check, Ban } from 'lucide-react';

export const STANDARD_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const SelectSizeModal = ({
  product,
  isOpen,
  onClose,
  onSizeSelected,
  onOpenSizeGuide
}) => {
  const { language, t, isRtl } = useLanguage();

  if (!isOpen || !product) return null;

  const title = typeof product.name === 'object' ? product.name[language] || product.name.en : product.name;
  const price = product.salePrice || product.price;

  // Determine available sizes dynamically
  const rawProductSizes = (Array.isArray(product.sizes) && product.sizes.length > 0)
    ? product.sizes
    : (Array.isArray(product.availableSizes) && product.availableSizes.length > 0)
    ? product.availableSizes
    : (product.sizeStock && Object.keys(product.sizeStock).length > 0)
    ? Object.keys(product.sizeStock)
    : [];

  const isOneSize = product.category === 'bags' || 
    product.category === 'accessories' || 
    (rawProductSizes.length === 1 && (String(rawProductSizes[0]).toLowerCase().includes('one') || String(rawProductSizes[0]).toLowerCase().includes('standard')));

  const sizesToDisplay = isOneSize 
    ? ['One Size'] 
    : rawProductSizes.length > 0 
    ? rawProductSizes 
    : STANDARD_SIZES;

  const productAvailableSizes = (Array.isArray(product.availableSizes) && product.availableSizes.length > 0)
    ? product.availableSizes
    : rawProductSizes.length > 0
    ? rawProductSizes
    : sizesToDisplay;

  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Default', hex: '#111111' });

  const handleSelectSize = (size, isAvailable) => {
    if (!isAvailable) return;
    onSizeSelected(product, size, selectedColor);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
        animation: 'fadeIn 0.2s ease-out',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '500px',
          maxHeight: 'calc(100dvh - 32px)',
          overflowY: 'auto',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          animation: 'slideUp 0.25s ease-out',
          boxSizing: 'border-box'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-bg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={(product.images && product.images[0]) || product.image || '/placeholder-luxury.svg'}
              alt={title}
              style={{ width: '40px', height: '52px', objectFit: 'cover' }}
            />
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 2px 0', color: '#111' }}>
                {title}
              </h4>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}>
                {price.toLocaleString()} {t('shop.currency')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ color: '#888', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 24px' }}>
          {/* Title and Size Guide trigger */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3
                style={{
                  fontFamily: "'Cinzel', 'Amiri', serif",
                  fontSize: '1.2rem',
                  letterSpacing: '0.12em',
                  margin: '0 0 4px 0',
                  color: 'var(--color-text-primary)',
                  textTransform: 'uppercase'
                }}
              >
                SELECT YOUR SIZE
              </h3>
              <span style={{ fontSize: '0.78125rem', color: '#777' }}>
                {isRtl ? 'اختر مقاسك للإضافة إلى حقيبة التسوق' : 'Tap your size to add to bag'}
              </span>
            </div>

            {!isOneSize && (
              <button
                onClick={() => onOpenSizeGuide(product.category)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-gold-dark)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                <Ruler size={13} />
                <span>Size Guide</span>
              </button>
            )}
          </div>

          {/* Color choice if multiple */}
          {product.colors && product.colors.length > 1 && (
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Color: {typeof selectedColor.name === 'object' ? selectedColor.name[language] || selectedColor.name.en : selectedColor.name}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: selectedColor.hex === c.hex ? '2px solid var(--color-gold)' : '1px solid #CCC',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Large Easy-to-Tap Size Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isOneSize ? '1fr' : 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}
          >
            {sizesToDisplay.map(size => {
              // Check availability and stock
              const isSizeStockEmpty = product.sizeStock && product.sizeStock[size] !== undefined && Number(product.sizeStock[size]) <= 0;
              const cleanSize = String(size).split(' ')[0].trim().toUpperCase();
              const isAvailable = !isSizeStockEmpty && (isOneSize || productAvailableSizes.some(s => {
                const cleanS = String(s).split(' ')[0].trim().toUpperCase();
                return cleanS === cleanSize || cleanS.includes(cleanSize) || cleanSize.includes(cleanS);
              }));

              return (
                <button
                  key={size}
                  disabled={!isAvailable}
                  onClick={() => handleSelectSize(size, isAvailable)}
                  style={{
                    minHeight: '62px',
                    padding: '12px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isAvailable ? '#FAF8F5' : '#F7F7F7',
                    border: isAvailable ? '1px solid var(--color-border)' : '1px dashed #DDD',
                    color: isAvailable ? 'var(--color-text-primary)' : '#AAA',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    opacity: isAvailable ? 1 : 0.45,
                    transition: 'all 0.18s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    if (isAvailable) {
                      e.currentTarget.style.borderColor = 'var(--color-gold)';
                      e.currentTarget.style.backgroundColor = '#121212';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={e => {
                    if (isAvailable) {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.backgroundColor = '#FAF8F5';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                    }
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textDecoration: isAvailable ? 'none' : 'line-through'
                    }}
                  >
                    {size}
                  </span>

                  <span
                    style={{
                      fontSize: '0.6875rem',
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 500,
                      color: isAvailable ? '#276749' : '#999'
                    }}
                  >
                    {isAvailable ? '✓ Available' : '✕ Sold Out'}
                  </span>
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, textAlign: 'center' }}>
            {isRtl ? 'اضغط على المقاس المطلوب لإضافته مباشرة إلى الحقيبة' : 'Select your size to proceed with one tap'}
          </p>
        </div>
      </div>
    </div>
  );
};

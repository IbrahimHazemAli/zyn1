import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { X, Check, ShoppingBag, ArrowRight, Ruler } from 'lucide-react';

export const QuickViewModal = ({ product, isOpen, onClose, onSelectProduct, onOpenSizeGuide }) => {
  const { language, t, isRtl } = useLanguage();
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const title = typeof product.name === 'object' ? product.name[language] || product.name.en : product.name;
  const description = typeof product.description === 'object' ? product.description[language] || product.description.en : product.description;
  const hasSale = product.salePrice && product.salePrice < product.price;

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Default', hex: '#111111' });
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '880px',
          maxHeight: 'calc(100dvh - 32px)',
          overflowY: 'auto',
          borderRadius: '12px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          position: 'relative',
          boxSizing: 'border-box'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            [isRtl ? 'left' : 'right']: '16px',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            padding: '8px',
            borderRadius: '50%',
            color: '#121212',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Gallery Left */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#F0ECE6' }}>
            <img
              src={selectedImage}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '60px',
                    height: '80px',
                    border: selectedImage === img ? '2px solid var(--color-gold)' : '1px solid #DDD',
                    padding: 0,
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Right */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600 }}>
              {product.sku}
            </span>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                fontSize: '1.8rem',
                margin: '6px 0 12px 0',
                color: 'var(--color-text-primary)',
                lineHeight: 1.3
              }}
            >
              {title}
            </h2>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
              {hasSale ? (
                <>
                  <span style={{ fontSize: '1.35rem', fontWeight: 600, color: '#8C2525' }}>
                    {product.salePrice.toLocaleString()} {t('shop.currency')}
                  </span>
                  <span style={{ fontSize: '0.95rem', color: '#999', textDecoration: 'line-through' }}>
                    {product.price.toLocaleString()} {t('shop.currency')}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {product.price.toLocaleString()} {t('shop.currency')}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, marginBottom: '24px' }}>
              {description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '0.78125rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  {t('product.color')}: {typeof selectedColor.name === 'object' ? selectedColor.name[language] || selectedColor.name.en : selectedColor.name}
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedColor.hex === c.hex && (
                        <Check size={14} color={c.hex === '#FFFFFF' || c.hex === '#F5EFEB' ? '#121212' : '#FFFFFF'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78125rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {t('product.size')}
                  </span>
                  <button
                    onClick={() => onOpenSizeGuide(product.category)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--color-gold-dark)',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    <Ruler size={13} />
                    <span>{t('product.sizeGuide')}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.sizes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.8125rem',
                        fontWeight: selectedSize === s ? 600 : 400,
                        backgroundColor: selectedSize === s ? '#121212' : '#FFFFFF',
                        color: selectedSize === s ? '#FFFFFF' : '#121212',
                        border: selectedSize === s ? '1px solid #121212' : '1px solid var(--color-border)',
                        cursor: 'pointer'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.875rem' }}
            >
              <ShoppingBag size={16} />
              <span>{t('product.addToBag')}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onSelectProduct(product);
              }}
              style={{
                textAlign: 'center',
                padding: '8px',
                color: '#888',
                fontSize: '0.78125rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              {t('shop.viewDetails')} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

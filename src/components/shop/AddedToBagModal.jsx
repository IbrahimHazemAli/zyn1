import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, ShoppingBag, ArrowRight, X } from 'lucide-react';

export const AddedToBagModal = ({
  item,
  isOpen,
  onContinueShopping,
  onViewBag
}) => {
  const { language, t, isRtl } = useLanguage();

  if (!isOpen || !item) return null;

  const title = typeof item.name === 'object' ? item.name[language] || item.name.en : item.name;
  const colorName = typeof item.color?.name === 'object' ? item.color.name[language] || item.color.name.en : item.color?.name;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onContinueShopping}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '480px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'slideUp 0.25s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#F0FFF4',
            borderBottom: '1px solid #C6F6D5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#22543D'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#276749" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              {isRtl ? 'تمت الإضافة إلى حقيبة التسوق بنجاح' : 'Successfully Added to Shopping Bag'}
            </span>
          </div>

          <button
            onClick={onContinueShopping}
            style={{ color: '#276749', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Item Summary */}
        <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img
            src={item.image}
            alt={title}
            style={{
              width: '84px',
              height: '112px',
              objectFit: 'cover',
              backgroundColor: '#EDE8E1'
            }}
          />

          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600 }}>
              {item.sku}
            </span>
            <h4
              style={{
                fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                fontSize: '1.25rem',
                margin: '4px 0 6px 0',
                color: 'var(--color-text-primary)',
                lineHeight: 1.3
              }}
            >
              {title}
            </h4>
            <div style={{ fontSize: '0.8125rem', color: '#666', display: 'flex', gap: '12px', marginBottom: '8px' }}>
              <span>Size: <strong>{item.size}</strong></span>
              {colorName && <span>Color: <strong>{colorName}</strong></span>}
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {item.price.toLocaleString()} {t('shop.currency')}
            </span>
          </div>
        </div>

        {/* Action Buttons: "What does the customer need to do next?" */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: 'var(--color-bg)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {/* Primary Next Action: View Bag & Checkout */}
          <button
            onClick={onViewBag}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '0.85rem' }}
          >
            <ShoppingBag size={17} />
            <span>{isRtl ? 'عرض الحقيبة وإتمام الشراء' : 'View Bag & Checkout'}</span>
            <ArrowRight size={16} className="icon-flip-rtl" />
          </button>

          {/* Secondary Action: Continue Shopping */}
          <button
            onClick={onContinueShopping}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#F5F2EB';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            {isRtl ? 'متابعة التسوق' : 'Continue Shopping'}
          </button>
        </div>
      </div>
    </div>
  );
};

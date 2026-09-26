import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer = ({ onProceedToCheckout, onNavigateShop }) => {
  const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, subtotal, isFreeDelivery, freeDeliveryProgress, amountLeftForFreeDelivery } = useCart();
  const { t, isRtl, language } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={closeCart}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [isRtl ? 'left' : 'right']: 0,
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.35)',
          animation: 'slideUp 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-bg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--color-gold-dark)" />
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                fontSize: '1.4rem',
                margin: 0,
                color: 'var(--color-text-primary)'
              }}
            >
              {t('cart.title')} ({items.length})
            </h3>
          </div>
          <button
            onClick={closeCart}
            style={{ color: '#8E8A83', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div
          style={{
            padding: '12px 28px',
            backgroundColor: '#F7F3ED',
            borderBottom: '1px solid #EFEAE2',
            fontSize: '0.78125rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#8F7450', fontWeight: 500 }}>
            <Truck size={15} />
            {isFreeDelivery ? (
              <span>✨ {t('cart.freeDeliveryNotice')}</span>
            ) : (
              <span>
                Add {amountLeftForFreeDelivery.toLocaleString()} {t('shop.currency')} more for complimentary Iraq delivery
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#E4DBD0', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${freeDeliveryProgress}%`,
                backgroundColor: '#C5A880',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  color: '#999'
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <p style={{ fontSize: '1rem', color: '#666', marginBottom: '24px' }}>
                {t('cart.empty')}
              </p>
              <button
                onClick={() => {
                  closeCart();
                  onNavigateShop();
                }}
                className="btn-primary"
                style={{ fontSize: '0.75rem' }}
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map(item => {
                const itemName = typeof item.name === 'object' ? item.name[language] || item.name.en : item.name;
                const colorName = typeof item.color.name === 'object' ? item.color.name[language] || item.color.name.en : item.color.name;

                return (
                  <div
                    key={item.cartItemId}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid var(--color-border-subtle)'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={itemName}
                      style={{
                        width: '80px',
                        height: '104px',
                        objectFit: 'cover',
                        backgroundColor: '#F0ECE6'
                      }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 500, margin: '0 0 4px 0', color: 'var(--color-text-primary)' }}>
                            {itemName}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            style={{ color: '#A19D95', cursor: 'pointer', padding: '2px' }}
                            title="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#888', display: 'flex', gap: '12px' }}>
                          <span>Size: {item.size}</span>
                          <span>Color: {colorName}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        {/* Quantity Stepper */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-bg)'
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            style={{ padding: '6px 10px', color: '#666', cursor: 'pointer' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ padding: '0 8px', fontSize: '0.8125rem', fontWeight: 600 }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            style={{ padding: '6px 10px', color: '#666', cursor: 'pointer' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {(item.price * item.quantity).toLocaleString()} {t('shop.currency')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer Checkout */}
        {items.length > 0 && (
          <div
            style={{
              padding: '24px 28px',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t('cart.subtotal')}
              </span>
              <span style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {subtotal.toLocaleString()} {t('shop.currency')}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 20px 0', lineHeight: 1.4 }}>
              {t('cart.deliveryNotice')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '16px' }}
              >
                <span>{t('cart.proceedToCheckout')}</span>
                <ArrowRight size={16} className="icon-flip-rtl" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

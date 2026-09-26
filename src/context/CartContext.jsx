import React, { createContext, useContext, useState, useEffect } from 'react';
import { FREE_DELIVERY_THRESHOLD } from '../data/governorates';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('sanaria_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sanaria_cart', JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, size, color, quantity = 1, openDrawer = false) => {
    const colorHex = color?.hex || '#111111';
    const cartItemId = `${product.id}-${size}-${colorHex}`;
    
    setItems(prevItems => {
      const existing = prevItems.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            productId: product.id,
            sku: product.sku,
            name: product.name,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            image: (product.images && product.images[0]) || product.image || '/placeholder-luxury.svg',
            size,
            color: color || { name: 'Default', hex: '#111111' },
            quantity
          }
        ];
      }
    });

    showToast('Item added to your shopping bag', 'success');
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from bag', 'info');
  };

  const clearCart = () => {
    setItems([]);
  };

  // Computed Values
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const amountLeftForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        totalItems,
        subtotal,
        isFreeDelivery,
        amountLeftForFreeDelivery,
        freeDeliveryProgress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

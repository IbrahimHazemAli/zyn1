import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('sanaria_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sanaria_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  const toggleFavorite = (productId, productName = null) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        if (showToast) showToast('Removed from your favorites', 'info');
        return prev.filter(id => id !== productId);
      } else {
        if (showToast) {
          const name = typeof productName === 'object' ? productName.en || 'Item' : (productName || 'Item');
          showToast('♥ Saved to your favorites', 'success');
        }
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const removeFavorite = (productId) => {
    setFavorites(prev => prev.filter(id => id !== productId));
    if (showToast) showToast('Removed from favorites', 'info');
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        clearFavorites,
        favoritesCount: favorites.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

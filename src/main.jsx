import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <LanguageProvider>
        <StoreProvider>
          <CartProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </CartProvider>
        </StoreProvider>
      </LanguageProvider>
    </ToastProvider>
  </React.StrictMode>
);

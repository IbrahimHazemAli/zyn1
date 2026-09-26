import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLogin = ({ onLoginSuccess, onBackToStore }) => {
  const { loginAdmin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(username.trim(), password.trim());
      setIsLoading(false);
      if (res.success) {
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess();
        }
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(197, 168, 128, 0.08) 0%, rgba(10, 10, 10, 0.98) 75%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#FDFCFA'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#141414',
          border: '1px solid rgba(197, 168, 128, 0.3)',
          padding: '44px 36px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          textAlign: 'center'
        }}
      >
        {/* Brand Header */}
        <div style={{ marginBottom: '28px' }}>
          <img
            src="/logo.png"
            alt="Sanaria Fashion"
            style={{ height: '64px', width: 'auto', margin: '0 auto 16px auto' }}
          />
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.45rem',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: '#FFFFFF',
              margin: '0 0 4px 0',
              textTransform: 'uppercase'
            }}
          >
            SANARIA FASHION
          </h2>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600 }}>
            ADMINISTRATION PORTAL
          </span>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: 'rgba(229, 62, 62, 0.15)',
              border: '1px solid rgba(229, 62, 62, 0.4)',
              color: '#FEB2B2',
              fontSize: '0.8125rem',
              marginBottom: '20px',
              textAlign: 'left'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.78125rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A19D95', display: 'block', marginBottom: '6px' }}>
              Staff Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                outline: 'none',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.78125rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A19D95', display: 'block', marginBottom: '6px' }}>
              Security PIN / Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                outline: 'none',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-gold"
            style={{ width: '100%', marginTop: '10px', padding: '14px' }}
          >
            {isLoading ? 'Verifying Session...' : 'Access Dashboard'}
          </button>
        </form>

        {/* Demo Credentials Tip for easy testing */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.75rem',
            color: '#777',
            textAlign: 'center'
          }}
        >
          <p style={{ margin: '0 0 6px 0' }}>
            Demo Staff Credentials:<br />
            Username: <strong style={{ color: '#C5A880' }}>admin</strong> | Password: <strong style={{ color: '#C5A880' }}>sanaria1992</strong>
          </p>
          <button
            onClick={onBackToStore}
            style={{
              color: '#A19D95',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.75rem',
              marginTop: '8px'
            }}
          >
            ← Return to Public Storefront
          </button>
        </div>
      </div>
    </div>
  );
};

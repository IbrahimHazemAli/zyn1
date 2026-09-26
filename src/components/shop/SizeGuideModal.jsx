import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SIZE_GUIDE_DATA } from '../../data/sizeGuideData';
import { X, Ruler } from 'lucide-react';

export const SizeGuideModal = ({ isOpen, onClose, initialTab = 'women' }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  const currentData = SIZE_GUIDE_DATA[activeTab] || SIZE_GUIDE_DATA.women;
  const tableTitle = typeof currentData.title === 'object' ? currentData.title[language] || currentData.title.en : currentData.title;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '680px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
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
            <Ruler size={20} color="var(--color-gold)" />
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', 'Amiri', serif",
                fontSize: '1.4rem',
                margin: 0,
                color: 'var(--color-text-primary)'
              }}
            >
              {t('product.sizeGuide')}
            </h3>
          </div>
          <button onClick={onClose} style={{ color: '#888', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border-subtle)',
            backgroundColor: '#FAF8F5'
          }}
        >
          <button
            onClick={() => setActiveTab('women')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: activeTab === 'women' ? '#121212' : '#888',
              borderBottom: activeTab === 'women' ? '2px solid var(--color-gold)' : 'none',
              backgroundColor: activeTab === 'women' ? '#FFFFFF' : 'transparent',
              cursor: 'pointer'
            }}
          >
            {t('nav.women')}
          </button>
          <button
            onClick={() => setActiveTab('womenSuits')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: activeTab === 'womenSuits' ? '#121212' : '#888',
              borderBottom: activeTab === 'womenSuits' ? '2px solid var(--color-gold)' : 'none',
              backgroundColor: activeTab === 'womenSuits' ? '#FFFFFF' : 'transparent',
              cursor: 'pointer'
            }}
          >
            Suits & Blazers / البدلات
          </button>
          <button
            onClick={() => setActiveTab('abayas')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: activeTab === 'abayas' ? '#121212' : '#888',
              borderBottom: activeTab === 'abayas' ? '2px solid var(--color-gold)' : 'none',
              backgroundColor: activeTab === 'abayas' ? '#FFFFFF' : 'transparent',
              cursor: 'pointer'
            }}
          >
            Abayas / العبايات
          </button>
        </div>

        {/* Content Table */}
        <div style={{ padding: '24px', overflowX: 'auto' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            {tableTitle}
          </p>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                {currentData.headers.map((h, i) => (
                  <th key={i} style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.rows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--color-border-subtle)',
                    backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAF8F5'
                  }}
                >
                  <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--color-gold-dark)' }}>{row.size}</td>
                  <td style={{ padding: '12px 10px' }}>{row.eu}</td>
                  <td style={{ padding: '12px 10px' }}>{row.bust}</td>
                  <td style={{ padding: '12px 10px' }}>{row.waist || row.hips}</td>
                  {row.shoulders && <td style={{ padding: '12px 10px' }}>{row.shoulders}</td>}
                  {row.hips && !row.shoulders && <td style={{ padding: '12px 10px' }}>{row.hips}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '20px', lineHeight: 1.5 }}>
            * Measurements are specified in standard centimeters. For personalized sizing assistance or bespoke tailoring inquiries, visit our flagship boutiques in Baghdad & Erbil or contact our boutique support.
          </p>
        </div>
      </div>
    </div>
  );
};

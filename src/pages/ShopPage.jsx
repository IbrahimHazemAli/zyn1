import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/shop/ProductCard';
import { EditorialProductGrid } from '../components/shop/EditorialProductGrid';
import { STANDARD_SIZES } from '../components/shop/SelectSizeModal';
import { SlidersHorizontal, X, ArrowDownUp, Check, Search } from 'lucide-react';

export const ShopPage = ({
  initialCategory = 'all',
  onSelectProduct,
  onQuickAdd,
  onQuickView,
  onNavigateLookbook
}) => {
  const { products, categories, collections } = useStore();
  const { t, language, isRtl } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(400000);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Available colors
  const colorOptions = [
    { hex: '#111111', label: 'Noir Black' },
    { hex: '#F5EFEB', label: 'Ivory Cream' },
    { hex: '#D8CEBE', label: 'Sand Beige' },
    { hex: '#C19A6B', label: 'Camel Tan' },
    { hex: '#162238', label: 'Midnight Navy' },
    { hex: '#541212', label: 'Burgundy' },
    { hex: '#1C3B2B', label: 'Emerald' }
  ];

  // Dynamic Category Pills
  const categoryTabs = useMemo(() => {
    const parentCats = (categories || [])
      .filter(c => !c.parentId && c.isVisible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(c => ({
        id: c.id,
        label: typeof c.name === 'object' ? c.name[language] || c.name.en || c.slug : c.name || c.slug
      }));

    return [
      { id: 'all', label: t('shop.allCategories') },
      ...parentCats,
      { id: 'new', label: isRtl ? 'وصل حديثاً' : 'New Arrivals' },
      { id: 'sale', label: isRtl ? 'عروض خاصة' : 'Sale' }
    ];
  }, [categories, language, t, isRtl]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Hide hidden products from customers
      if (p.isHidden) return false;

      // 2. Keyword search
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase().trim();
        const name = typeof p.name === 'object'
          ? (p.name[language] || p.name.en || '').toLowerCase()
          : (p.name || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        if (!name.includes(q) && !sku.includes(q)) return false;
      }

      // 3. Category & Collection Filtering
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'new') {
          if (!p.isNew) return false;
        } else if (selectedCategory === 'sale') {
          if (!p.isSale && !(p.salePrice && p.salePrice < p.price)) return false;
        } else if (selectedCategory.startsWith('col-')) {
          const col = (collections || []).find(c => c.id === selectedCategory);
          if (!col || !col.productIds?.includes(p.id)) return false;
        } else {
          // Check parent or subcategory match
          const matchesCategory = p.category === selectedCategory || p.subcategory === selectedCategory;
          if (!matchesCategory) return false;
        }
      }

      // 4. Price Filter
      const activePrice = p.salePrice || p.price;
      if (activePrice > maxPrice) return false;

      // 5. Size Filter
      if (selectedSize !== 'all') {
        const hasSize = (p.availableSizes || p.sizes || []).some(s =>
          s.toUpperCase().includes(selectedSize.toUpperCase())
        );
        if (!hasSize) return false;
      }

      // 6. Color Filter
      if (selectedColor !== 'all') {
        if (!p.colors || !p.colors.some(c => c.hex.toLowerCase() === selectedColor.toLowerCase())) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // featured default
    });
  }, [products, selectedCategory, maxPrice, selectedSize, selectedColor, sortBy, searchKeyword, language, collections]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(400000);
    setSortBy('featured');
    setSearchKeyword('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedSize !== 'all' || selectedColor !== 'all' || maxPrice < 400000 || Boolean(searchKeyword.trim());

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '36px 0 100px 0' }}>
      <div className="container-luxury">
        {/* Editorial Heading */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            SANARIA BOUTIQUE
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', serif",
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
              margin: '0 0 12px 0'
            }}
          >
            {isRtl ? 'الأزياء الراقية وتصاميم الهوت كوتور' : 'The Haute Couture Collection'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#777', letterSpacing: '0.04em', margin: 0 }}>
            {filteredProducts.length} {isRtl ? 'قطعة استثنائية جاهزة للطلب' : 'distinguished pieces ready for nationwide delivery'}
          </p>
        </div>

        {/* Dynamic Category Selector Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '32px'
          }}
        >
          {categoryTabs.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 24px',
                  fontSize: '0.8125rem',
                  fontWeight: isSelected ? 600 : 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  backgroundColor: isSelected ? '#121212' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                  border: isSelected ? '1px solid #121212' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Controls Bar: Search, Count, Sort, and Refine Drawer Trigger */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
            padding: '14px 20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)'
          }}
        >
          {/* Live Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
            <Search size={16} color="#888" />
            <input
              type="text"
              placeholder="Search garments, codes..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.8125rem',
                backgroundColor: 'transparent'
              }}
            />
            {searchKeyword && (
              <button onClick={() => setSearchKeyword('')} style={{ color: '#888', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Filters & Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', color: '#666' }}>
              <strong>{filteredProducts.length}</strong> pieces
            </span>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                style={{ fontSize: '0.75rem', color: '#8C2525', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Reset All
              </button>
            )}

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowDownUp size={13} color="#666" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '0.78125rem',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="featured">{t('shop.sortFeatured')}</option>
                <option value="newest">{t('shop.sortNewest')}</option>
                <option value="price_asc">{t('shop.sortPriceLow')}</option>
                <option value="price_desc">{t('shop.sortPriceHigh')}</option>
              </select>
            </div>

            {/* Filters Drawer Toggle */}
            <button
              onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                border: '1px solid var(--color-border)',
                backgroundColor: showFiltersDrawer ? '#121212' : '#FFFFFF',
                color: showFiltersDrawer ? '#FFFFFF' : '#121212',
                fontSize: '0.78125rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <SlidersHorizontal size={13} />
              <span>Filters ({[selectedSize !== 'all', selectedColor !== 'all', maxPrice < 400000].filter(Boolean).length})</span>
            </button>
          </div>
        </div>

        {/* Collapsible Refine Panel */}
        {showFiltersDrawer && (
          <div
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              marginBottom: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {/* Size Filter */}
            <div>
              <label style={{ fontSize: '0.78125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
                Filter by Size (XXS - XXL)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  onClick={() => setSelectedSize('all')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    border: '1px solid var(--color-border)',
                    backgroundColor: selectedSize === 'all' ? '#121212' : '#FFFFFF',
                    color: selectedSize === 'all' ? '#FFFFFF' : '#121212',
                    cursor: 'pointer'
                  }}
                >
                  All
                </button>
                {STANDARD_SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      border: '1px solid var(--color-border)',
                      backgroundColor: selectedSize === s ? '#121212' : '#FFFFFF',
                      color: selectedSize === s ? '#FFFFFF' : '#121212',
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <label style={{ fontSize: '0.78125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>
                Filter by Color
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={() => setSelectedColor('all')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    border: '1px solid var(--color-border)',
                    backgroundColor: selectedColor === 'all' ? '#121212' : '#FFFFFF',
                    color: selectedColor === 'all' ? '#FFFFFF' : '#121212',
                    cursor: 'pointer'
                  }}
                >
                  All
                </button>
                {colorOptions.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c.hex)}
                    title={c.label}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: selectedColor === c.hex ? '2px solid var(--color-gold)' : '1px solid #CCC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {selectedColor === c.hex && (
                      <Check size={14} color={c.hex === '#FFFFFF' || c.hex === '#F5EFEB' ? '#121212' : '#FFFFFF'} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <label style={{ fontSize: '0.78125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                Max Budget: {maxPrice.toLocaleString()} {t('shop.currency')}
              </label>
              <input
                type="range"
                min="50000"
                max="400000"
                step="10000"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#C5A880' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#888', marginTop: '4px' }}>
                <span>50k IQD</span>
                <span>400k IQD</span>
              </div>
            </div>
          </div>
        )}

        {/* Clothing Photography Editorial Grid */}
        {filteredProducts.length > 0 ? (
          <EditorialProductGrid
            products={filteredProducts}
            onSelectProduct={onSelectProduct}
            onQuickAdd={onQuickAdd}
            onQuickView={onQuickView}
            onExploreCampaign={onNavigateLookbook}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '70px 20px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', 'Amiri', serif", fontSize: '1.6rem', color: '#121212', marginBottom: '8px' }}>
              {t('shop.noProducts')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>
              Try selecting another category or resetting filters.
            </p>
            <button onClick={resetFilters} className="btn-primary" style={{ fontSize: '0.78125rem' }}>
              {t('shop.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

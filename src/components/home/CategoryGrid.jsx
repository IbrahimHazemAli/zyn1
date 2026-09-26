import React, { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

export const CategoryGrid = ({ onSelectCategory, onNavigateShop }) => {
  const { language, isRtl } = useLanguage();
  const { products, editorialPlacements } = useStore();

  const handleNavigate = (targetCategory) => {
    if (onNavigateShop) {
      onNavigateShop({ category: targetCategory });
    } else if (onSelectCategory) {
      onSelectCategory(targetCategory);
    }
  };

  // Helper to resolve the best authentic media for each panel from user's products or authentic boutique media
  const panelsData = useMemo(() => {
    const list = products || [];

    // 1. NEW ARRIVALS: Latest product or product marked isNew
    const newProduct = list.find(p => p.isNew && (p.images?.[0] || p.videoUrl)) ||
      list.find(p => p.images?.[0] || p.videoUrl) ||
      list[0];

    // 2. THE EVENING EDIT: Dresses / Couture / Occasion
    const eveningProduct = list.find(p => (p.category === 'dresses' || p.category === 'abaya') && (p.images?.[0] || p.videoUrl)) ||
      list.find(p => p.images?.[0] || p.videoUrl);

    // 3. EVERYDAY ESSENTIALS: Tops / Jackets / Pants / Tailored Sets
    const essentialsProduct = list.find(p => (p.category === 'tops' || p.category === 'jackets' || p.category === 'pants') && (p.images?.[0] || p.videoUrl)) ||
      (list.length > 1 ? list[1] : list[0]);

    // 4. SIGNATURE COLLECTION: Featured pieces defining Sanaria
    const signatureProduct = list.find(p => p.isFeatured && (p.images?.[0] || p.videoUrl)) ||
      (list.length > 2 ? list[2] : list[0]);

    const resolveMedia = (panelKey, product, fallbackVideoUrl) => {
      // 1. Explicit admin choice from Video Placements manager
      const customPlacement = editorialPlacements?.[panelKey];
      if (customPlacement?.videoUrl && customPlacement.videoUrl.trim() !== '') {
        return { type: 'video', src: getAssetUrl(customPlacement.videoUrl) };
      }
      if (customPlacement?.imageUrl && customPlacement.imageUrl.trim() !== '') {
        return { type: 'image', src: getAssetUrl(customPlacement.imageUrl) };
      }

      // 2. Product explicitly marked with this placement
      const assignedProduct = list.find(p => p.videoPlacement === panelKey);
      if (assignedProduct) {
        if (assignedProduct.images?.[0]) return { type: 'image', src: getAssetUrl(assignedProduct.images[0]) };
        if (assignedProduct.videoUrl) return { type: 'video', src: getAssetUrl(assignedProduct.videoUrl) };
      }

      // 3. Fallback to matched product or boutique default
      if (product?.images && product.images.length > 0 && product.images[0]) {
        return { type: 'image', src: getAssetUrl(product.images[0]) };
      }
      if (product?.videoUrl && product.videoUrl.trim() !== '') {
        return { type: 'video', src: getAssetUrl(product.videoUrl) };
      }
      return { type: 'video', src: getAssetUrl(fallbackVideoUrl) };
    };

    return [
      {
        id: 'new_arrivals',
        category: 'new',
        eyebrow: isRtl ? 'إصدارات الموسم الجديد' : 'NEW SEASON RELEASES',
        title: isRtl ? 'وصل حديثاً' : 'NEW ARRIVALS',
        subtitle: isRtl
          ? 'اكتشفي أحدث إبداعات وتصاميم سناريا فاشن الفاخرة.'
          : 'Discover the latest pieces from Sanaria Fashion.',
        btnText: isRtl ? 'استكشفي أحدث القطع' : 'EXPLORE NEW ARRIVALS',
        media: resolveMedia('new_arrivals', newProduct, '/videos/showcase-6938.mp4'),
        isWide: true, // Left wide in row 1
        associatedProduct: newProduct
      },
      {
        id: 'evening_edit',
        category: 'dresses',
        eyebrow: isRtl ? 'أمسيات راقية وكوتور' : 'HAUTE EVENING COUTURE',
        title: isRtl ? 'مختارات السهرة' : 'THE EVENING EDIT',
        subtitle: isRtl
          ? 'قصات أنيقة وإطلالات ساحرة لأجمل المناسبات التي لا تُنسى.'
          : 'Elegant silhouettes for unforgettable occasions.',
        btnText: isRtl ? 'استكشفي التشكيلة' : 'DISCOVER THE EDIT',
        media: resolveMedia('evening_edit', eveningProduct, '/videos/showcase-runway-6998.mp4'),
        isWide: false, // Right standard in row 1
        associatedProduct: eveningProduct
      },
      {
        id: 'everyday_essentials',
        category: 'tops',
        eyebrow: isRtl ? 'أناقة عصرية متجددة' : 'CONTEMPORARY REFINEMENT',
        title: isRtl ? 'الأساسيات الراقية' : 'EVERYDAY ESSENTIALS',
        subtitle: isRtl
          ? 'تصاميم رفيعة تجمع بين الفخامة المعاصرة والراحة اليومية.'
          : 'Refined pieces designed for effortless style.',
        btnText: isRtl ? 'تسوقي الأساسيات' : 'SHOP ESSENTIALS',
        media: resolveMedia('everyday_essentials', essentialsProduct, '/videos/showcase-jacket-6768.mp4'),
        isWide: false, // Left standard in row 2
        associatedProduct: essentialsProduct
      },
      {
        id: 'signature_collection',
        category: 'all',
        eyebrow: isRtl ? 'هوية سناريا منذ 1992' : 'EST. 1992 ICONIC PIECES',
        title: isRtl ? 'المجموعة الأيقونية' : 'SIGNATURE COLLECTION',
        subtitle: isRtl
          ? 'تصاميم مختارة بعناية فائقة تمثل جوهر وبصمة سناريا.'
          : 'Discover selected pieces that define Sanaria.',
        btnText: isRtl ? 'استكشفي المجموعة' : 'EXPLORE COLLECTION',
        media: resolveMedia('signature_collection', signatureProduct, '/videos/showcase-7051.mp4'),
        isWide: true, // Right wide in row 2
        associatedProduct: signatureProduct
      }
    ];
  }, [products, isRtl, editorialPlacements]);

  const row1 = panelsData.slice(0, 2);
  const row2 = panelsData.slice(2, 4);

  return (
    <section
      style={{
        backgroundColor: '#FAF8F5',
        color: '#121212',
        padding: '90px 0 110px 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container-luxury" style={{ maxWidth: '1440px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              color: '#A37C4E',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}
          >
            <span style={{ width: '28px', height: '1px', backgroundColor: 'rgba(163, 124, 78, 0.4)' }} />
            <span>{isRtl ? 'مختارات الموسم الحصرية · منذ 1992' : 'SANARIA FASHION · CURATED CAMPAIGN'}</span>
            <span style={{ width: '28px', height: '1px', backgroundColor: 'rgba(163, 124, 78, 0.4)' }} />
          </div>

          <h2
            style={{
              fontFamily: "'Cinzel', 'Cormorant Garamond', 'Amiri', serif",
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: '#121212',
              margin: '0 0 12px 0',
              lineHeight: 1.15
            }}
          >
            {isRtl ? 'مختارات سناريا الفاخرة' : 'THE SANARIA EDIT'}
          </h2>

          <p
            style={{
              fontFamily: isRtl ? "'Cairo', sans-serif" : "'Playfair Display', 'Cormorant Garamond', serif",
              fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
              color: '#666056',
              fontStyle: isRtl ? 'normal' : 'italic',
              fontWeight: 400,
              letterSpacing: '0.03em',
              margin: 0,
              lineHeight: 1.5
            }}
          >
            {isRtl ? 'تصاميم منتقاة بعناية لكافة الإطلالات والمناسبات الراقية.' : 'Curated pieces for every occasion.'}
          </p>
        </div>

        {/* Editorial Feature Panels: Row 1 (Wide Left + Standard Right) */}
        <div
          className="editorial-grid-row editorial-row-1"
          style={{
            display: 'grid',
            gridTemplateColumns: isRtl ? '1fr 1.38fr' : '1.38fr 1fr',
            gap: '24px',
            marginBottom: '24px'
          }}
        >
          {row1.map(panel => (
            <EditorialPanelItem
              key={panel.id}
              panel={panel}
              isRtl={isRtl}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {/* Editorial Feature Panels: Row 2 (Standard Left + Wide Right) */}
        <div
          className="editorial-grid-row editorial-row-2"
          style={{
            display: 'grid',
            gridTemplateColumns: isRtl ? '1.38fr 1fr' : '1fr 1.38fr',
            gap: '24px'
          }}
        >
          {row2.map(panel => (
            <EditorialPanelItem
              key={panel.id}
              panel={panel}
              isRtl={isRtl}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>

      {/* Scoped CSS for Magazine Editorial Hover & Responsiveness */}
      <style>{`
        .editorial-panel {
          position: relative;
          height: 560px;
          overflow: hidden;
          cursor: pointer;
          background-color: #EFEBE5;
          border: 1px solid rgba(197, 168, 128, 0.22);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .editorial-panel:hover {
          border-color: rgba(197, 168, 128, 0.55);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
        }

        .editorial-media-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .editorial-media-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.001);
          transition: transform 0.9s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .editorial-panel:hover .editorial-media-element {
          transform: scale(1.03);
        }

        .editorial-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(12, 10, 8, 0.85) 0%,
            rgba(12, 10, 8, 0.42) 36%,
            rgba(12, 10, 8, 0.08) 55%,
            transparent 72%
          );
          transition: background 0.5s ease;
          pointer-events: none;
        }

        .editorial-panel:hover .editorial-vignette {
          background: linear-gradient(
            to top,
            rgba(10, 8, 6, 0.92) 0%,
            rgba(12, 10, 8, 0.48) 38%,
            rgba(12, 10, 8, 0.12) 60%,
            transparent 75%
          );
        }

        .editorial-text-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px 36px;
          color: #FFFFFF;
          z-index: 2;
          transform: translateY(0);
          transition: transform 0.5s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .editorial-panel:hover .editorial-text-content {
          transform: translateY(-4px);
        }

        .editorial-arrow-icon {
          transition: transform 0.35s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .editorial-panel:hover .editorial-arrow-icon {
          transform: translateX(${isRtl ? '-6px' : '6px'});
        }

        .editorial-cta-line {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #FAF8F5;
          font-size: 0.78125rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
          padding-bottom: 5px;
          transition: border-color 0.3s ease, color 0.3s ease;
        }

        .editorial-panel:hover .editorial-cta-line {
          border-color: #C5A880;
          color: #F5E8D0;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .editorial-panel {
            height: 500px;
          }
          .editorial-text-content {
            padding: 32px 28px;
          }
        }

        @media (max-width: 860px) {
          .editorial-grid-row {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            margin-bottom: 20px !important;
          }
          .editorial-panel {
            height: 480px !important;
          }
          .editorial-text-content {
            padding: 28px 24px;
          }
        }

        @media (max-width: 520px) {
          .editorial-panel {
            height: 430px !important;
          }
          .editorial-text-content {
            padding: 24px 20px !important;
          }
          .editorial-heading {
            font-size: 1.55rem !important;
          }
          .editorial-subtitle {
            font-size: 0.8125rem !important;
            margin-bottom: 16px !important;
          }
        }
      `}</style>
    </section>
  );
};

// Sub-component for individual editorial panel
const EditorialPanelItem = ({ panel, isRtl, onNavigate }) => {
  return (
    <article
      className="editorial-panel"
      onClick={() => onNavigate(panel.category)}
      tabIndex={0}
      role="button"
      aria-label={`${panel.title} - ${panel.subtitle}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate(panel.category);
        }
      }}
    >
      {/* Background Media: Authentic Product Image or Seamless Runway Reel */}
      <div className="editorial-media-wrapper">
        {panel.media.type === 'video' ? (
          <video
            src={panel.media.src}
            autoPlay
            loop
            muted
            playsInline
            className="editorial-media-element"
          />
        ) : (
          <img
            src={panel.media.src}
            alt={panel.title}
            loading="lazy"
            className="editorial-media-element"
          />
        )}
      </div>

      {/* Gentle Luxury Vignette (Lower 38% only) */}
      <div className="editorial-vignette" />

      {/* Foreground Editorial Text */}
      <div className="editorial-text-content">
        <span
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#E8D2B0',
            fontWeight: 700,
            display: 'block',
            marginBottom: '8px'
          }}
        >
          {panel.eyebrow}
        </span>

        <h3
          className="editorial-heading"
          style={{
            fontFamily: "'Cinzel', 'Cormorant Garamond', 'Amiri', serif",
            fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            margin: '0 0 8px 0',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            lineHeight: 1.15
          }}
        >
          {panel.title}
        </h3>

        <p
          className="editorial-subtitle"
          style={{
            fontSize: '0.875rem',
            color: '#D8D3CC',
            margin: '0 0 22px 0',
            fontStyle: isRtl ? 'normal' : 'italic',
            fontWeight: 300,
            lineHeight: 1.5,
            maxWidth: '520px'
          }}
        >
          {panel.subtitle}
        </p>

        <div className="editorial-cta-line">
          <span>{panel.btnText}</span>
          <ArrowRight size={15} className={`editorial-arrow-icon ${isRtl ? 'icon-flip-rtl' : ''}`} />
        </div>
      </div>
    </article>
  );
};

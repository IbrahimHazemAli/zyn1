import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Instagram, ArrowUpRight } from 'lucide-react';

export const InstagramFeed = () => {
  const { t, language } = useLanguage();
  const { businessSettings, products } = useStore();

  const posts = React.useMemo(() => {
    const boutiqueFallbacks = [
      {
        type: 'video',
        video: '/videos/showcase-couture-6998.mp4',
        code: '6998',
        caption: 'Sanaria Royal Couture • كود 6998'
      },
      {
        type: 'video',
        video: '/videos/showcase-jacket-6768.mp4',
        code: '6768',
        caption: 'Sanaria Tailored Luxury Jacket • كود 6768'
      },
      {
        type: 'video',
        video: '/videos/showcase-ensemble-6931.mp4',
        code: '6931',
        caption: 'Sanaria Modern Chic Ensemble • كود 6931'
      },
      {
        type: 'video',
        video: '/videos/showcase-runway-6998.mp4',
        code: '6998',
        caption: 'Sanaria Runway Evening Look • كود 6998'
      }
    ];

    const productPosts = (products || []).slice(0, 4).map(p => {
      const hasVideo = Boolean(p.videoUrl && p.videoUrl.trim() !== '');
      const title = typeof p.name === 'object' ? (p.name[language] || p.name.ar || p.name.en) : p.name;
      return {
        type: hasVideo ? 'video' : 'image',
        video: p.videoUrl,
        img: (p.images && p.images[0]) || p.image,
        code: p.modelCode || p.sku || '',
        caption: `${p.modelCode ? 'كود ' + p.modelCode + ' • ' : ''}${title}`
      };
    });

    if (productPosts.length >= 4) return productPosts;
    const combined = [...productPosts];
    for (let i = combined.length; i < 4; i++) {
      combined.push(boutiqueFallbacks[i % boutiqueFallbacks.length]);
    }
    return combined;
  }, [products, language]);

  return (
    <section style={{ padding: '90px 0', backgroundColor: 'var(--color-bg)' }}>
      <div className="container-luxury">
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            EDITORIAL JOURNAL
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', serif",
              fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
              margin: '0 0 8px 0'
            }}
          >
            {t('home.instagramTitle')}
          </h2>
          <a
            href={businessSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: 'var(--color-text-primary)',
              fontWeight: 600,
              letterSpacing: '0.08em'
            }}
          >
            <Instagram size={15} color="var(--color-gold-dark)" />
            <span>{businessSettings.instagram}</span>
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* 4 Column Instagram Lookbook */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}
        >
          {posts.map((post, i) => (
            <a
              key={i}
              href={businessSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                backgroundColor: '#EDE8E1',
                display: 'block'
              }}
              className="insta-post"
            >
              {post.type === 'video' ? (
                <video
                  src={post.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  className="insta-img"
                />
              ) : (
                <img
                  src={post.img}
                  alt="Sanaria Instagram"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                  className="insta-img"
                />
              )}

              {/* Reel / Code Pill */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(6px)',
                  color: '#C5A880',
                  border: '1px solid rgba(197, 168, 128, 0.4)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  zIndex: 2
                }}
              >
                {post.code ? `كود ${post.code}` : 'REEL'}
              </div>

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(18, 18, 18, 0.65)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  padding: '20px',
                  textAlign: 'center',
                  zIndex: 3
                }}
                className="insta-overlay"
              >
                <Instagram size={28} color="#C5A880" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  @sanaria.fashion
                </span>
                <span style={{ fontSize: '0.75rem', color: '#E2D5C3', fontWeight: 600 }}>
                  {post.caption}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .insta-post:hover .insta-overlay {
          opacity: 1 !important;
        }
        .insta-post:hover .insta-img {
          transform: scale(1.08) !important;
        }
      `}</style>
    </section>
  );
};

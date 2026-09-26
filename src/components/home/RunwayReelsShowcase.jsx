import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Eye,
  Film
} from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

const EDITORIAL_SHOWCASE_REELS = [
  {
    id: 'reel-7051',
    code: '7051',
    videoUrl: '/videos/showcase-7051.mp4',
    badge: {
      ar: 'مجموعة سناريا كولكشن 🔥',
      en: 'SANARIA NEW COLLECTION',
      ku: 'کۆلێکژنی نوێی سناریا',
      tr: 'YENİ SANARIA KOLEKSİYONU'
    },
    title: {
      ar: 'فستان سناريا الحصري — كود 7051',
      en: 'Sanaria Exclusive Gown — Code 7051',
      ku: 'فستانی تایبەتی سناریا — کۆد 7051',
      tr: 'Sanaria Özel Tasarım Elbise — Kod 7051'
    },
    subtitle: {
      ar: 'إطلالة كوتور ساحرة بأقمشة منسوجة ببراعة وفخامة إيطالية لا تضاهى.',
      en: 'Enchanting couture silhouette woven with bespoke artisanal craftsmanship.',
      ku: 'شێوازێکی ناوازە بە قوماشی بەرز و کوالێتی تەواو نایاب.',
      tr: 'Benzersiz terzilik ve İtalyan lüks kumaş dokusu ile göz kamaştıran silüet.'
    },
    tag: 'RUNWAY LOOK'
  },
  {
    id: 'reel-6938',
    code: '6938',
    videoUrl: '/videos/showcase-6938.mp4',
    badge: {
      ar: 'إصدار الموسم الفاخر 🇮🇶',
      en: 'NEW SEASON COUTURE',
      ku: 'دەرکەوتنی شاهانەی وەرز',
      tr: 'YENİ SEZON KUTÜRÜ'
    },
    title: {
      ar: 'إطلالة سناريا كولكشن الراقية — كود 6938',
      en: 'Sanaria Couture Edit — Code 6938',
      ku: 'مۆدێلی شیکی سناریا — کۆد 6938',
      tr: 'Sanaria Seçkin Zarafet — Kod 6938'
    },
    subtitle: {
      ar: 'تناغم راقٍ بين الأصالة البغدادية والخطوط العصرية المعاصرة.',
      en: 'Exquisite harmony between heritage poise and contemporary tailoring.',
      ku: 'تێکەڵەیەکی جوان لە نێوان ڕەسەنایەتی و مۆدێرنیتی.',
      tr: 'Zarif silüetler ve çağdaş estetiğin kusursuz uyumu.'
    },
    tag: 'EDITORIAL'
  },
  {
    id: 'reel-6998-couture',
    code: '6998',
    videoUrl: '/videos/showcase-couture-6998.mp4',
    badge: {
      ar: 'الأناقة والجمال الملكي ✨',
      en: 'ROYAL COUTURE GOWN',
      ku: 'جوانی و شیکی شاهانە',
      tr: 'KRALİYET KUTÜRÜ'
    },
    title: {
      ar: 'فستان السهرة الكوتور الملكي — كود 6998',
      en: 'Haute Evening Couture Gown — Code 6998',
      ku: 'فستانی ئێوارەی شاهانە — کۆد 6998',
      tr: 'Kraliyet Gece Elbisesi — Kod 6998'
    },
    subtitle: {
      ar: 'قصة انسيابية تخطف الأنظار مصممة لأرقى الحفلات والمناسبات الخاصة.',
      en: 'Fluid, breathtaking gown tailored for grand galas and high-profile soirees.',
      ku: 'بۆ بۆنە تایبەتەکان و ئاهەنگە شاهانەکان.',
      tr: 'Unutulmaz geceler için akıcı ve büyüleyici tasarım.'
    },
    tag: 'HAUTE COUTURE'
  },
  {
    id: 'reel-6768',
    code: '6768',
    videoUrl: '/videos/showcase-jacket-6768.mp4',
    badge: {
      ar: 'جاكيت مميزة بكواليتي عالي 🔥',
      en: 'TAILORED LUXURY BLAZER',
      ku: 'چاکەتی تایبەت بە کوالێتی بەرز',
      tr: 'ÖZEL DİKİM BLAZER'
    },
    title: {
      ar: 'جاكيت بليزر سناريا المفصل — كود 6768',
      en: 'Sanaria Tailored Luxury Blazer — Code 6768',
      ku: 'چاکەتی لوکسی سناریا — کۆد 6768',
      tr: 'Sanaria Özel Dikim Blazer — Kod 6768'
    },
    subtitle: {
      ar: 'قصة ستركتشر دقيقة من صوف الكشمير الصافي تمنحك حضوراً واثقاً وفخماً.',
      en: 'Structured architectural tailoring with fine wool for commanding presence.',
      ku: 'ستایلی سەردەمیانە بە دروومانێکی تەواو ورد و شیک.',
      tr: 'Güçlü ve sofistike bir duruş için kusursuz hatlar.'
    },
    tag: 'ATELIER'
  },
  {
    id: 'reel-6931',
    code: '6931',
    videoUrl: '/videos/showcase-ensemble-6931.mp4',
    badge: {
      ar: 'طقم كاجوال شيك عصري 🇮🇶',
      en: 'CONTEMPORARY ENSEMBLE',
      ku: 'تەقمی سەردەمیانە و شیک',
      tr: 'ÇAĞDAŞ KOMBİN'
    },
    title: {
      ar: 'طقم سناريا العصري — كود 6931',
      en: 'Sanaria Modern Chic Ensemble — Code 6931',
      ku: 'تەقمی مۆدێرنی سناریا — کۆد 6931',
      tr: 'Sanaria Modern Şık Takım — Kod 6931'
    },
    subtitle: {
      ar: 'توليفة عملية ساحرة تجمع بين راحة الارتداء اليومي وفخامة التفاصيل.',
      en: 'Effortless everyday glamour with bespoke fabric finishes.',
      ku: 'ئاسوودەیی ڕۆژانە لەگەڵ جوانترین مۆدێل.',
      tr: 'Günlük şıklığı lüks detaylarla buluşturan tasarım.'
    },
    tag: 'SIGNATURE'
  },
  {
    id: 'reel-6998-runway',
    code: '6998-R',
    videoUrl: '/videos/showcase-runway-6998.mp4',
    badge: {
      ar: 'عروض منصة سناريا الحية 🎬',
      en: 'LIVE RUNWAY ARCHIVE',
      ku: 'نمایشی ڕاستەوخۆی مۆدێل',
      tr: 'CANLI DEFİLE ARŞİVİ'
    },
    title: {
      ar: 'عروض المنصة الحية — كود 6998',
      en: 'Sanaria Runway Motion — Code 6998',
      ku: 'جوڵەی ڕاستەوخۆ لەسەر سەکۆ — کۆد 6998',
      tr: 'Sanaria Podyum Hareketi — Kod 6998'
    },
    subtitle: {
      ar: 'حركة الأقمشة الحية وانسيابية التصميم كما تظهر على المنصة العالمية.',
      en: 'Fluid garment movement showcasing the drape and kinetic allure.',
      ku: 'جوڵەی سەرنجڕاکێشی قوماشەکان لە کاتی نمایشی ڕاستەوخۆ.',
      tr: 'Kumaşın hareketini ve dökümünü canlı defile dinamizmiyle hissedin.'
    },
    tag: 'RUNWAY MOTION'
  }
];

export const RunwayReelsShowcase = ({ onNavigateDiscover, onNavigateShop, onNavigateLookbook }) => {
  const { language, isRtl } = useLanguage();
  const [playingVideoId, setPlayingVideoId] = useState('reel-7051');
  const [mutedVideoId, setMutedVideoId] = useState(null); // All muted by default for luxury browsing
  const videoRefs = useRef({});

  const handleTogglePlay = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingVideoId === id && !video.paused) {
      video.pause();
      setPlayingVideoId(null);
    } else {
      // Pause others
      Object.keys(videoRefs.current).forEach(k => {
        if (k !== id && videoRefs.current[k]) {
          videoRefs.current[k].pause();
        }
      });
      video.play().catch(() => {});
      setPlayingVideoId(id);
    }
  };

  const handleToggleSound = (id, e) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    if (mutedVideoId === id) {
      video.muted = true;
      setMutedVideoId(null);
    } else {
      // Mute others
      Object.keys(videoRefs.current).forEach(k => {
        if (videoRefs.current[k]) videoRefs.current[k].muted = true;
      });
      video.muted = false;
      setMutedVideoId(id);
    }
  };

  const handleExploreAction = () => {
    if (onNavigateLookbook) {
      onNavigateLookbook();
    } else if (onNavigateDiscover) {
      onNavigateDiscover();
    } else if (onNavigateShop) {
      onNavigateShop({ category: 'all' });
    }
  };

  return (
    <section
      style={{
        backgroundColor: '#0A0A0A',
        color: '#FAF8F5',
        padding: '90px 0 110px 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(197, 168, 128, 0.22)',
        borderBottom: '1px solid rgba(197, 168, 128, 0.22)'
      }}
    >
      {/* Background ambient radial luxury glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          maxWidth: '1000px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div className="container-luxury" style={{ position: 'relative', zIndex: 2, maxWidth: '1440px' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: '#C5A880',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                marginBottom: '12px',
                fontFamily: "'Cinzel', 'Amiri', serif"
              }}
            >
              <Film size={14} />
              <span>
                {language === 'ar'
                  ? 'أزياء سناريا في حركة حية • كودات الموديلات'
                  : language === 'ku'
                  ? 'مۆدێلە ڕاستەوخۆکانی سناریا بە ڤیدیۆ'
                  : 'HAUTE COUTURE IN LIVE MOTION'}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Cinzel', 'Amiri', serif",
                fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                lineHeight: 1.25,
                margin: '0 0 12px 0',
                color: '#FFFFFF'
              }}
            >
              {language === 'ar'
                ? 'إطلالات الموسم في حركة حية — سناريا كولكشن'
                : language === 'ku'
                ? 'نمایشی ڕاستەوخۆی مۆدێلەکانی سناریا'
                : 'Sanaria Runway & Editorial Motion'}
            </h2>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#A8A29E',
                maxWidth: '680px',
                lineHeight: 1.7,
                margin: 0
              }}
            >
              {language === 'ar'
                ? 'استمتعي بمشاهدة جمال وانسيابية أقمشة تصاميم سناريا الحصرية كما تظهر في عروض المنصة والفيديوهات التحريرية لكودات الموسم.'
                : language === 'ku'
                ? 'بینەری جوڵەی ناوازەی قوماشەکان و دیزاینە تایبەتەکانی سناریا فاشن بە ڤیدیۆی ڕاستەوخۆ.'
                : language === 'tr'
                ? 'Sanaria’nın özel koleksiyonlarının kumaş dökümünü ve zarafetini canlı podyum videolarında keşfedin.'
                : 'Experience the kinetic allure, bespoke fabric drape, and artisanal movement of Sanaria’s official campaign pieces.'}
            </p>
          </div>

          <button
            onClick={handleExploreAction}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 26px',
              borderRadius: '30px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(197, 168, 128, 0.45)',
              color: '#FAF8F5',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(197, 168, 128, 0.2)';
              e.currentTarget.style.borderColor = '#C5A880';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(197, 168, 128, 0.45)';
            }}
          >
            <span>
              {language === 'ar'
                ? 'استكشفي الكاتالوج الكامل'
                : language === 'ku'
                ? 'بینینی تەواوی کەتەلۆک'
                : 'Explore Full Lookbook'}
            </span>
            <ChevronRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
          </button>
        </div>

        {/* Video Cards Grid (Responsive: 3 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '24px'
          }}
        >
          {EDITORIAL_SHOWCASE_REELS.map((item) => {
            const isPlaying = playingVideoId === item.id;
            const isSoundOn = mutedVideoId === item.id;
            const itemBadge = item.badge[language] || item.badge.ar;
            const itemTitle = item.title[language] || item.title.ar;
            const itemSub = item.subtitle[language] || item.subtitle.ar;

            return (
              <div
                key={item.id}
                onClick={() => handleTogglePlay(item.id)}
                style={{
                  position: 'relative',
                  aspectRatio: '9 / 16',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#141414',
                  border: isPlaying ? '1.5px solid #C5A880' : '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: isPlaying ? '0 16px 40px rgba(197, 168, 128, 0.25)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
                  cursor: 'pointer',
                  transition: 'transform 0.35s ease, border-color 0.3s ease, box-shadow 0.35s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Authentic Background Video */}
                <video
                  ref={(el) => (videoRefs.current[item.id] = el)}
                  src={getAssetUrl(item.videoUrl)}
                  loop
                  muted={!isSoundOn}
                  playsInline
                  autoPlay
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Subtle Editorial Vignette */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.45) 45%, rgba(10,10,10,0.1) 70%, rgba(10,10,10,0.55) 100%)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Top Badge & Audio Toggle Button */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    right: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 10
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(10, 10, 10, 0.72)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(197, 168, 128, 0.4)',
                      color: '#C5A880',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em'
                    }}
                  >
                    {itemBadge}
                  </span>

                  <button
                    onClick={(e) => handleToggleSound(item.id, e)}
                    title={isSoundOn ? 'كتم الصوت / Mute' : 'تشغيل الصوت / Unmute'}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: isSoundOn ? '#C5A880' : 'rgba(10, 10, 10, 0.72)',
                      color: isSoundOn ? '#0D0D0D' : '#FAF8F5',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                </div>

                {/* Center Play/Pause indicator */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 8,
                    pointerEvents: 'none',
                    opacity: isPlaying ? 0 : 0.9,
                    transition: 'opacity 0.25s ease'
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.72)',
                      border: '1px solid #C5A880',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C5A880',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <Play size={24} style={{ marginLeft: isRtl ? '-2px' : '2px' }} />
                  </div>
                </div>

                {/* Bottom Information Card (Pure Lookbook Aesthetic - NOT on sale) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '22px 18px',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  {/* Model Code Pill & Archive Tag */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: '#C5A880',
                        color: '#0A0A0A',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.06em'
                      }}
                    >
                      كود الموديل {item.code}
                    </span>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#DDD3C4',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.35
                      }}
                    >
                      {itemTitle}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.78rem',
                        color: '#BDB8B0',
                        lineHeight: 1.5
                      }}
                    >
                      {itemSub}
                    </p>
                  </div>

                  {/* Interactive Button: View Lookbook Details */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExploreAction();
                    }}
                    style={{
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)',
                      color: '#FAF8F5',
                      border: '1px solid rgba(197, 168, 128, 0.4)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#C5A880';
                      e.currentTarget.style.color = '#0A0A0A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#FAF8F5';
                    }}
                  >
                    <Eye size={15} />
                    <span>
                      {language === 'ar'
                        ? 'عرض الإطلالة في الكاتالوج'
                        : language === 'ku'
                        ? 'بینینی مۆدێل لە کەتەلۆکدا'
                        : 'View Lookbook Details'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RunwayReelsShowcase;

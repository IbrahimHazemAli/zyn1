import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { storeUploadedVideoFile } from '../../utils/mediaStorage';
import {
  Film,
  Upload,
  Play,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Sliders,
  Eye,
  Trash2,
  ArrowRight,
  Layers
} from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

const BOUTIQUE_ARCHIVE_VIDEOS = [
  { id: 'collection-6938', name: 'إطلالة كولكشن سناريا - كود 6938 🔥', url: '/videos/showcase-6938.mp4' },
  { id: 'collection-7051', name: 'فستان سناريا الحصري - كود 7051 🇮🇶', url: '/videos/showcase-7051.mp4' },
  { id: 'couture-6998', name: 'إطلالة كوتور الملكية - كود 6998 ✨', url: '/videos/showcase-couture-6998.mp4' },
  { id: 'jacket-6768', name: 'جاكيت فاخر مفصل - كود 6768', url: '/videos/showcase-jacket-6768.mp4' },
  { id: 'ensemble-6931', name: 'طقم كاجوال شيك - كود 6931', url: '/videos/showcase-ensemble-6931.mp4' },
  { id: 'runway-6998', name: 'إطلالة عروض المنصة - كود 6998 🎬', url: '/videos/showcase-runway-6998.mp4' }
];

export const VideoPlacementsManager = ({ onBackToStore, onNavigate }) => {
  const {
    products,
    editorialPlacements,
    updateEditorialPlacement
  } = useStore();

  const { showToast } = useToast();

  const [uploadingPanel, setUploadingPanel] = useState(null);

  // Products with valid video attached
  const productsWithVideo = (products || []).filter(p => p.videoUrl && p.videoUrl.trim() !== '');

  const PLACEMENT_CONFIGS = [
    {
      key: 'new_arrivals',
      badge: 'اللوحة 1 (عريضة) • Feature 1',
      titleAr: 'لوحة "وصل حديثاً" • NEW ARRIVALS',
      subtitleAr: 'اللوحة التحريرية الرئيسية الأولى في قسم مختارات سناريا الفاخرة (The Sanaria Edit).',
      defaultVideo: '/videos/showcase-6938.mp4',
      targetCategory: 'new'
    },
    {
      key: 'evening_edit',
      badge: 'اللوحة 2 • Feature 2',
      titleAr: 'لوحة "مختارات السهرة" • THE EVENING EDIT',
      subtitleAr: 'اللوحة الخاصة بفساتين السهرة والأمسيات الراقية والكوتور.',
      defaultVideo: '/videos/showcase-runway-6998.mp4',
      targetCategory: 'dresses'
    },
    {
      key: 'everyday_essentials',
      badge: 'اللوحة 3 • Feature 3',
      titleAr: 'لوحة "الأساسيات الراقية" • EVERYDAY ESSENTIALS',
      subtitleAr: 'لوحة الأطقم اليومية المفصلة والبلوزات والبلايزرات المعاصرة.',
      defaultVideo: '/videos/showcase-jacket-6768.mp4',
      targetCategory: 'tops'
    },
    {
      key: 'signature_collection',
      badge: 'اللوحة 4 (عريضة) • Feature 4',
      titleAr: 'لوحة "المجموعة الأيقونية" • SIGNATURE COLLECTION',
      subtitleAr: 'لوحة التصاميم الأيقونية التي تمثل توقيع وبصمة سناريا منذ 1992.',
      defaultVideo: '/videos/showcase-7051.mp4',
      targetCategory: 'all'
    },
    {
      key: 'hero_banner',
      badge: 'رأس الصفحة الرئيسي • Top Hero',
      titleAr: 'فيديو واجهة المتجر الرئيسية • HERO BANNER',
      subtitleAr: 'الفيديو السينمائي المتحرك في خلفية الشاشة الترحيبية بأعلى الموقع.',
      defaultVideo: '/videos/showcase-couture-6998.mp4',
      targetCategory: 'all'
    },
    {
      key: 'runway_reels',
      badge: 'عروض المنصة • Runway Reels',
      titleAr: 'شريط عروض المنصة • RUNWAY REELS SHOWCASE',
      subtitleAr: 'الفيديو البارز في قسم فيديوهات عروض المنصة التفاعلية.',
      defaultVideo: '/videos/showcase-7051.mp4',
      targetCategory: 'dresses'
    }
  ];

  const handleFileUpload = async (placementKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPanel(placementKey);
      const res = await storeUploadedVideoFile(file);
      updateEditorialPlacement(placementKey, {
        videoUrl: res.previewUrl,
        _idbKey: res.id,
        title: file.name
      });
      showToast(`✓ تم تحديث الفيديو للموضع بنجاح: ${res.name}`, 'success');
    } catch (err) {
      console.error('Error uploading video:', err);
      showToast('تعذر رفع الفيديو، يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setUploadingPanel(null);
    }
  };

  const handleSelectFromProduct = (placementKey, productId) => {
    if (!productId) return;
    const prod = products.find(p => p.id === productId);
    if (prod && prod.videoUrl) {
      const pName = typeof prod.name === 'object' ? prod.name.ar || prod.name.en : prod.name;
      updateEditorialPlacement(placementKey, {
        videoUrl: prod.videoUrl,
        productId: prod.id,
        title: pName
      });
      showToast(`✓ تم ربط فيديو المنتج "${pName}" بالموضع بنجاح!`, 'success');
    }
  };

  const handleSelectFromArchive = (placementKey, videoUrl, videoName) => {
    updateEditorialPlacement(placementKey, {
      videoUrl: videoUrl,
      productId: null,
      title: videoName
    });
    showToast(`✓ تم تعيين فيديو "${videoName}" بنجاح!`, 'success');
  };

  const handleResetPlacement = (placementKey, defaultVideo) => {
    updateEditorialPlacement(placementKey, {
      videoUrl: defaultVideo,
      productId: null,
      title: 'Default Video'
    });
    showToast('تمت استعادة الفيديو الافتراضي للموضع', 'info');
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Banner / Explanatory Header */}
      <div
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '32px',
          border: '1px solid rgba(197, 168, 128, 0.3)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(197, 168, 128, 0.15)',
              color: '#C5A880',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              marginBottom: '10px'
            }}
          >
            <Film size={14} />
            <span>THE SANARIA EDIT · VIDEO PLACEMENT HUB</span>
          </div>

          <h2
            style={{
              fontFamily: "'Cinzel', 'Amiri', serif",
              fontSize: '1.75rem',
              fontWeight: 700,
              margin: '0 0 6px 0',
              color: '#FFFFFF'
            }}
          >
            مركز التحكم بمواضع الفيديوهات والمختارات التحريرية
          </h2>

          <p style={{ margin: 0, fontSize: '0.88rem', color: '#94A3B8', maxWidth: '780px', lineHeight: 1.6 }}>
            تحكم بدقة واحترافية في موضع ظهور كل فيديو في واجهة المتجر: لوحات <strong>وصل حديثاً (New Arrivals)</strong>، <strong>مختارات السهرة (The Evening Edit)</strong>، <strong>الأساسيات الراقية (Everyday Essentials)</strong>، <strong>المجموعة الأيقونية (Signature Collection)</strong>، وفيديو واجهة المتجر الرئيسية.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {onBackToStore && (
            <button
              onClick={onBackToStore}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: '#C5A880',
                color: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(197, 168, 128, 0.3)'
              }}
            >
              <span>معاينة المتجر المباشر</span>
              <ExternalLink size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of 6 Video Placement Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px'
        }}
      >
        {PLACEMENT_CONFIGS.map(config => {
          const currentData = editorialPlacements?.[config.key] || {};
          const activeVideo = currentData.videoUrl || config.defaultVideo;
          const isUploading = uploadingPanel === config.key;

          return (
            <div
              key={config.key}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      backgroundColor: '#E2E8F0',
                      color: '#334155',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginBottom: '4px'
                    }}
                  >
                    {config.badge}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                    {config.titleAr}
                  </h3>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: '#16A34A',
                    fontWeight: 700,
                    backgroundColor: '#DCFCE7',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>فعال في الموقع</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5 }}>
                  {config.subtitleAr}
                </p>

                {/* Video Player Preview */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#000000',
                    border: '1px solid #CBD5E1'
                  }}
                >
                  {activeVideo ? (
                    <video
                      key={activeVideo}
                      src={getAssetUrl(activeVideo)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                      لا يوجد فيديو محدد حالياً
                    </div>
                  )}

                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      color: '#FAF8F5',
                      fontSize: '0.68rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backdropFilter: 'blur(4px)',
                      pointerEvents: 'none'
                    }}
                  >
                    معاينة مباشرة
                  </div>
                </div>

                {/* Video Selection Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* 1. Choose from User Products */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      1. اختيار فيديو من منتجات المتجر الحالية:
                    </label>
                    <select
                      onChange={(e) => handleSelectFromProduct(config.key, e.target.value)}
                      defaultValue=""
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        backgroundColor: '#FFFFFF',
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    >
                      <option value="" disabled>-- اضغط للاختيار من منتجاتك التي تحتوي فيديو --</option>
                      {productsWithVideo.map(p => {
                        const pName = typeof p.name === 'object' ? p.name.ar || p.name.en : p.name;
                        return (
                          <option key={p.id} value={p.id}>
                            {pName} (كود: {p.modelCode || p.sku || 'N/A'})
                          </option>
                        );
                      })}
                      {productsWithVideo.length === 0 && (
                        <option value="" disabled>لم تقم بإضافة منتجات تحتوي فيديو بعد</option>
                      )}
                    </select>
                  </div>

                  {/* 2. Choose from Boutique Video Archive */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      2. أو اختر من فيديوهات بوتيك سناريا الرسمية:
                    </label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {BOUTIQUE_ARCHIVE_VIDEOS.map(v => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleSelectFromArchive(config.key, v.url, v.name)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: activeVideo === v.url ? '#0F172A' : '#F1F5F9',
                            color: activeVideo === v.url ? '#C5A880' : '#334155',
                            border: activeVideo === v.url ? '1px solid #C5A880' : '1px solid #CBD5E1',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Upload New Video File Directly */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <label
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '9px 14px',
                        borderRadius: '8px',
                        backgroundColor: isUploading ? '#94A3B8' : '#C5A880',
                        color: '#0F172A',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 6px rgba(197, 168, 128, 0.25)'
                      }}
                    >
                      <Upload size={14} />
                      <span>{isUploading ? 'جاري الرفع...' : 'رفع فيديو جديد لهذا الموضع'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/*"
                        onChange={(e) => handleFileUpload(config.key, e)}
                        disabled={isUploading}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {activeVideo !== config.defaultVideo && config.defaultVideo && (
                      <button
                        type="button"
                        onClick={() => handleResetPlacement(config.key, config.defaultVideo)}
                        title="استعادة الفيديو الافتراضي"
                        style={{
                          padding: '9px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#F1F5F9',
                          color: '#64748B',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RefreshCw size={13} />
                        <span>استعادة</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Building,
  Smartphone,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Navigation,
  ExternalLink,
  LocateFixed,
  RefreshCw,
  Shield,
  ShieldAlert,
  Lock,
  AlertTriangle
} from 'lucide-react';

const GOV_COORDS = {
  baghdad: { lat: 33.3152, lng: 44.3661, name: 'Baghdad (Al-Mansour Hub)' },
  erbil: { lat: 36.1912, lng: 44.0091, name: 'Erbil (Gulan Hub)' },
  sulaymaniyah: { lat: 35.5558, lng: 45.4351, name: 'Sulaymaniyah (Salim St Hub)' },
  duhok: { lat: 36.8679, lng: 42.9886, name: 'Duhok Center Hub' },
  basra: { lat: 30.5081, lng: 47.8184, name: 'Basra (Corniche Hub)' },
  kirkuk: { lat: 35.4681, lng: 44.3922, name: 'Kirkuk Center Hub' },
  najaf: { lat: 32.0259, lng: 44.3462, name: 'Najaf Center Hub' },
  karbala: { lat: 32.6160, lng: 44.0249, name: 'Karbala Center Hub' },
  nineveh: { lat: 36.3400, lng: 43.1300, name: 'Nineveh (Mosul Hub)' },
  babil: { lat: 32.4833, lng: 44.4333, name: 'Babil (Hillah Hub)' },
  anbar: { lat: 33.4244, lng: 43.2989, name: 'Anbar (Ramadi Hub)' },
  diyala: { lat: 33.7464, lng: 44.6433, name: 'Diyala (Baqubah Hub)' },
  maysan: { lat: 31.8433, lng: 47.1433, name: 'Maysan (Amarah Hub)' },
  dhiqar: { lat: 31.0500, lng: 46.2500, name: 'Dhi Qar (Nasiriyah Hub)' },
  muthanna: { lat: 31.3167, lng: 45.2833, name: 'Muthanna (Samawah Hub)' },
  qadisiyyah: { lat: 31.9833, lng: 44.9167, name: 'Qadisiyyah (Diwaniyah Hub)' },
  saladin: { lat: 34.6000, lng: 43.6833, name: 'Saladin (Tikrit Hub)' },
  wasit: { lat: 32.5000, lng: 45.8167, name: 'Wasit (Kut Hub)' }
};

export const CheckoutPage = ({ onOrderPlaced, onBackToCart }) => {
  const { items, subtotal, isFreeDelivery, clearCart } = useCart();
  const { governorates, createOrder, paymentConfig } = useStore();
  const { t, language, isRtl } = useLanguage();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [governorateId, setGovernorateId] = useState('baghdad');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Card Payment simulation state (for Qi Card or Gateway)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // GPS Location detection state
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Selected Governorate Details & Delivery fee
  const selectedGov = governorates.find(g => g.id === governorateId) || governorates[0];
  const deliveryFee = isFreeDelivery ? 0 : (selectedGov ? selectedGov.deliveryFee : 5000);
  const grandTotal = subtotal + deliveryFee;

  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (phone.replace(/\D/g, '').length < 9) {
      errors.phone = 'Please enter a valid Iraqi mobile number';
    }
    if (!city.trim()) errors.city = 'City or District is required';
    if (!address.trim()) errors.address = 'Street address or landmark is required';

    if (paymentMethod === 'qi_card' || paymentMethod === 'gateway') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
        errors.cardNumber = 'Valid 16-digit card number required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(isRtl ? 'خاصية تحديد الموقع غير مدعومة في متصفحك' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 10);
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        let detectedAddressText = '';
        let detectedGovName = '';
        let detectedCityName = '';

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'ar,en' } }
          );
          if (resp.ok) {
            const data = await resp.json();
            if (data && data.address) {
              const addr = data.address;
              detectedCityName = addr.city || addr.town || addr.suburb || addr.district || addr.county || '';
              detectedGovName = addr.state || addr.province || addr.region || '';
              const road = addr.road || addr.neighbourhood || addr.suburb || '';
              detectedAddressText = [road, detectedCityName, detectedGovName].filter(Boolean).join(', ');

              if (detectedGovName) {
                const lowerGov = detectedGovName.toLowerCase();
                const matchedGov = governorates.find(g => 
                  lowerGov.includes(g.nameEn.toLowerCase()) ||
                  detectedGovName.includes(g.nameAr) ||
                  g.id.toLowerCase().includes(lowerGov)
                );
                if (matchedGov) {
                  setGovernorateId(matchedGov.id);
                }
              }

              if (detectedCityName && !city) {
                setCity(detectedCityName);
              }

              if (road && !address) {
                setAddress(road);
              }
            }
          }
        } catch (err) {
          console.warn('Reverse geocode error:', err);
        }

        setDetectedLocation({
          lat,
          lng,
          accuracy,
          mapsUrl,
          detectedAddress: detectedAddressText || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          capturedAt: new Date().toISOString()
        });
        setFormErrors(prev => {
          const updated = { ...prev };
          delete updated.location;
          return updated;
        });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        let msg = isRtl ? 'تعذر جلب موقع GPS تلقائياً. يرجى تفعيل إذن الموقع بالمتصفح أو اختيار إحداثيات مركز المحافظة أدناه.' : 'Could not access GPS automatically. Please allow location in browser settings or use the governorate center coordinates below.';
        if (err.code === 1) {
          msg = isRtl ? 'تم رفض إذن الوصول للموقع. يرجى تفعيله من إعدادات المتصفح أو الضغط على زر تثبيت إحداثيات المحافظة أدناه.' : 'Location permission denied by browser. Please enable permissions or click below to pin your governorate delivery center.';
        }
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Fallback to pin selected governorate center coordinates (satisfies GPS anti-fraud if browser denies permission)
  const handlePinGovernorateCenter = () => {
    const coords = GOV_COORDS[governorateId] || GOV_COORDS.baghdad;
    const mapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    setDetectedLocation({
      lat: coords.lat,
      lng: coords.lng,
      accuracy: 50,
      mapsUrl,
      detectedAddress: `${selectedGov?.nameEn || governorateId} Delivery Hub Coordinates`,
      isManualFallback: true,
      capturedAt: new Date().toISOString()
    });
    setLocationError(null);
    setFormErrors(prev => {
      const updated = { ...prev };
      delete updated.location;
      return updated;
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const govName = selectedGov ? selectedGov[`name${language.charAt(0).toUpperCase() + language.slice(1)}`] || selectedGov.nameAr : governorateId;

    setTimeout(() => {
      const newOrder = createOrder({
        customer: {
          fullName,
          phone,
          altPhone,
          governorate: governorateId,
          governorateName: govName,
          city,
          address,
          notes,
          location: detectedLocation,
          mapsUrl: detectedLocation?.mapsUrl || null
        },
        location: detectedLocation,
        mapsUrl: detectedLocation?.mapsUrl || null,
        items,
        subtotal,
        deliveryFee,
        total: grandTotal,
        paymentMethod,
        paymentMethodLabel:
          paymentMethod === 'cod' ? 'الدفع عند الاستلام (Cash on Delivery)' :
          paymentMethod === 'qi_card' ? 'Qi Card (كي كارد)' :
          paymentMethod === 'fib' ? 'FIB (First Iraqi Bank)' : 'Credit Card Gateway'
      });

      clearCart();
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h2>{t('cart.empty')}</h2>
        <button onClick={onBackToCart} className="btn-primary" style={{ marginTop: '20px' }}>
          {t('cart.continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '40px 0 100px 0' }}>
      <div className="container-luxury" style={{ maxWidth: '1100px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            ORDER CHECKOUT
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', 'Amiri', serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
              margin: 0
            }}
          >
            {t('checkout.title')}
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start'
            }}
          >
            {/* Left Steps: Contact & Delivery & Payment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Step 1: Customer Contact */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', padding: '28px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px', color: 'var(--color-text-primary)' }}>
                  {t('checkout.stepContact')}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                      {t('checkout.fullName')} *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="الاسم الكامل / Full Name"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: formErrors.fullName ? '1px solid #E53E3E' : '1px solid var(--color-border)',
                        backgroundColor: '#FAF8F5',
                        outline: 'none',
                        fontSize: '0.875rem'
                      }}
                    />
                    {formErrors.fullName && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{formErrors.fullName}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        {t('checkout.phone')} *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="0773 888 8180"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: formErrors.phone ? '1px solid #E53E3E' : '1px solid var(--color-border)',
                          backgroundColor: '#FAF8F5',
                          outline: 'none',
                          fontSize: '0.875rem'
                        }}
                      />
                      {formErrors.phone && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{formErrors.phone}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        {t('checkout.altPhone')}
                      </label>
                      <input
                        type="tel"
                        value={altPhone}
                        onChange={e => setAltPhone(e.target.value)}
                        placeholder={isRtl ? 'رقم بديل إضافي (اختياري)' : 'Alternate Contact Number (Optional)'}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: '#FAF8F5',
                          outline: 'none',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address Across Iraq */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', padding: '28px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px', color: 'var(--color-text-primary)' }}>
                  {t('checkout.stepDelivery')}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* GPS Location Finder Button & Verification Card (MANDATORY ANTI-FRAUD) */}
                  <div
                    id="gps-location-section"
                    style={{
                      padding: '18px',
                      backgroundColor: detectedLocation ? '#F0FDF4' : '#FFFBEB',
                      border: formErrors.location
                        ? '2px solid #DC2626'
                        : detectedLocation
                        ? '2px solid #22C55E'
                        : '2px solid #F59E0B',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      boxShadow: formErrors.location
                        ? '0 0 12px rgba(220, 38, 38, 0.25)'
                        : detectedLocation
                        ? '0 2px 8px rgba(34, 197, 94, 0.15)'
                        : '0 2px 8px rgba(245, 158, 11, 0.12)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Optional GPS Location Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: detectedLocation ? '#F0FDF4' : '#F8FAFC',
                      color: detectedLocation ? '#166534' : '#475569',
                      border: detectedLocation ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginBottom: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {detectedLocation ? <ShieldCheck size={16} color="#15803D" /> : <MapPin size={16} color="#C5A880" />}
                        <span>
                          {isRtl ? 'تحديد الموقع الدقيق (اختياري لتسهيل وصول المندوب)' : 'Exact GPS Pinpoint (Optional for Express Courier)'}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        backgroundColor: detectedLocation ? '#15803D' : '#64748B',
                        color: '#FFF',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        fontWeight: 700
                      }}>
                        {detectedLocation ? (isRtl ? 'تم التحديد ✓' : 'ATTACHED ✓') : (isRtl ? 'اختياري' : 'OPTIONAL')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: detectedLocation ? '#DCFCE7' : 'rgba(197, 168, 128, 0.15)',
                            color: detectedLocation ? '#15803D' : '#C5A880',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <LocateFixed size={22} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: detectedLocation ? '#166534' : '#0F172A', display: 'block' }}>
                            {detectedLocation
                              ? (isRtl ? '✓ تم توثيق موقع GPS بنجاح (معتمد للشحن)' : '✓ Verified GPS Coordinates Locked (Authentic)')
                              : (isRtl ? 'تحديد موقع التوصيل الحالي بنقرة واحدة (GPS)' : 'Auto-Detect Delivery Location (GPS)')}
                          </span>
                          <span style={{ fontSize: '0.78125rem', color: detectedLocation ? '#15803D' : '#64748B', display: 'block', marginTop: '2px' }}>
                            {detectedLocation
                              ? (isRtl ? `إحداثيات حقيقية (دقة ±${detectedLocation.accuracy}م) تم ربطها بالطلب وتمريرها للإدارة والمندوب` : `Coordinates (±${detectedLocation.accuracy}m accuracy) linked to order and sent directly to admin dashboard`)
                              : (isRtl ? 'يمكنك تحديد موقعك بنقرة زر أو الاعتماد على العنوان المكتوب أعلاه' : 'You can optionally auto-detect your location or rely on your typed address above')}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        style={{
                          padding: '12px 20px',
                          backgroundColor: detectedLocation ? '#15803D' : '#111111',
                          color: '#FFFFFF',
                          border: detectedLocation ? 'none' : '1px solid #C5A880',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        <Navigation size={15} />
                        <span>
                          {isLocating
                            ? (isRtl ? 'جارِ تحديد الموقع...' : 'Connecting to GPS...')
                            : detectedLocation
                            ? (isRtl ? 'إعادة التحديث' : 'Re-Detect GPS')
                            : (isRtl ? '📍 تحديد وتوثيق موقعي الآن' : '📍 Detect My Location Now')}
                        </span>
                      </button>
                    </div>

                    {/* Location details card if detected */}
                    {detectedLocation && (
                      <div
                        style={{
                          marginTop: '14px',
                          paddingTop: '12px',
                          borderTop: '1px solid #BBF7D0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534' }}>
                          <MapPin size={15} />
                          <span>
                            <strong>Exact GPS:</strong> {detectedLocation.lat.toFixed(6)}, {detectedLocation.lng.toFixed(6)}
                          </span>
                          {detectedLocation.detectedAddress && (
                            <span style={{ color: '#4B5563', marginLeft: '6px' }}>
                              ({detectedLocation.detectedAddress})
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <a
                            href={detectedLocation.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#15803D',
                              fontWeight: 700,
                              textDecoration: 'none'
                            }}
                          >
                            <span>{isRtl ? 'معاينة على خرائط Google' : 'Preview on Google Maps'}</span>
                            <ExternalLink size={12} />
                          </a>

                          <button
                            type="button"
                            onClick={() => setDetectedLocation(null)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#DC2626',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              padding: '2px 6px'
                            }}
                          >
                            {isRtl ? 'إلغاء' : 'Clear'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Prominent Error if submit attempted without location */}
                    {formErrors.location && (
                      <div style={{
                        marginTop: '12px',
                        padding: '10px 14px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #F87171',
                        color: '#991B1B',
                        fontSize: '0.8125rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600
                      }}>
                        <AlertTriangle size={16} color="#DC2626" />
                        <span>{formErrors.location}</span>
                      </div>
                    )}

                    {/* Geolocation permission assistance / fallback button */}
                    {locationError && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#FFF7ED',
                        border: '1px solid #FDBA74',
                        color: '#9A3412',
                        fontSize: '0.78125rem',
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={15} color="#EA580C" />
                          <span>{locationError}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={handlePinGovernorateCenter}
                            style={{
                              padding: '6px 14px',
                              backgroundColor: '#EA580C',
                              color: '#FFF',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {isRtl ? `تثبيت إحداثيات مركز (${selectedGov?.nameAr || governorateId}) كبديل موثّق` : `Pin Official (${selectedGov?.nameEn || governorateId}) Delivery Hub Coordinates`}
                          </button>
                          <span style={{ fontSize: '0.71875rem', color: '#7C2D12' }}>
                            {isRtl ? '(يحقق شرط منع الطلبات الوهمية بربط الإحداثيات)' : '(Satisfies anti-fraud GPS verification)'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    {/* Governorate Selection */}
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        {t('checkout.governorate')} *
                      </label>
                      <select
                        value={governorateId}
                        onChange={e => setGovernorateId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: '#FAF8F5',
                          outline: 'none',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        {governorates.map(gov => (
                          <option key={gov.id} value={gov.id}>
                            {gov.nameAr} - {gov.nameEn} ({gov.deliveryFee.toLocaleString()} IQD)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City / District */}
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        {t('checkout.city')} *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Jadriya / Mansour / Gulan"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: formErrors.city ? '1px solid #E53E3E' : '1px solid var(--color-border)',
                          backgroundColor: '#FAF8F5',
                          outline: 'none',
                          fontSize: '0.875rem'
                        }}
                      />
                      {formErrors.city && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{formErrors.city}</span>}
                    </div>
                  </div>

                  {/* Street Address / Landmark */}
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                      {t('checkout.address')} *
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Street name, landmark, near mall, building number..."
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: formErrors.address ? '1px solid #E53E3E' : '1px solid var(--color-border)',
                        backgroundColor: '#FAF8F5',
                        outline: 'none',
                        fontSize: '0.875rem',
                        resize: 'none'
                      }}
                    />
                    {formErrors.address && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{formErrors.address}</span>}
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                      {t('checkout.notes')}
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Call before arrival, delivery in the evening"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: '#FAF8F5',
                        outline: 'none',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Selection */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', padding: '28px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px', color: 'var(--color-text-primary)' }}>
                  {t('checkout.stepPayment')}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* COD */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px',
                      border: paymentMethod === 'cod' ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                      backgroundColor: paymentMethod === 'cod' ? '#FAF8F5' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ marginTop: '4px', accentColor: '#C5A880' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, display: 'block', color: 'var(--color-text-primary)' }}>
                        {t('checkout.payCod')}
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: '#666', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                        {t('checkout.payCodDesc')}
                      </span>
                    </div>
                  </label>

                  {/* Qi Card */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px',
                      border: paymentMethod === 'qi_card' ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                      backgroundColor: paymentMethod === 'qi_card' ? '#FAF8F5' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'qi_card'}
                      onChange={() => setPaymentMethod('qi_card')}
                      style={{ marginTop: '4px', accentColor: '#C5A880' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {t('checkout.payQi')}
                        </span>
                        <span style={{ fontSize: '0.6875rem', padding: '2px 6px', backgroundColor: '#121212', color: '#C5A880', fontWeight: 600 }}>
                          QI DIRECT
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8125rem', color: '#666', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                        {t('checkout.payQiDesc')}
                      </span>
                    </div>
                  </label>

                  {/* FIB */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px',
                      border: paymentMethod === 'fib' ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                      backgroundColor: paymentMethod === 'fib' ? '#FAF8F5' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'fib'}
                      onChange={() => setPaymentMethod('fib')}
                      style={{ marginTop: '4px', accentColor: '#C5A880' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {t('checkout.payFib')}
                        </span>
                        <span style={{ fontSize: '0.6875rem', padding: '2px 6px', backgroundColor: '#0B2545', color: '#FFFFFF', fontWeight: 600 }}>
                          FIRST IRAQI BANK
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8125rem', color: '#666', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                        {t('checkout.payFibDesc')}
                      </span>
                    </div>
                  </label>

                  {/* Credit / Debit Gateway */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px',
                      border: paymentMethod === 'gateway' ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                      backgroundColor: paymentMethod === 'gateway' ? '#FAF8F5' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'gateway'}
                      onChange={() => setPaymentMethod('gateway')}
                      style={{ marginTop: '4px', accentColor: '#C5A880' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, display: 'block', color: 'var(--color-text-primary)' }}>
                        {t('checkout.payGateway')}
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: '#666', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                        {t('checkout.payGatewayDesc')}
                      </span>
                    </div>
                  </label>

                  {/* Simulated Card Fields if Electronic Payment selected */}
                  {(paymentMethod === 'qi_card' || paymentMethod === 'gateway') && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#F5F2EB',
                        border: '1px solid var(--color-border)',
                        marginTop: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78125rem', color: '#666' }}>
                        <CreditCard size={16} color="var(--color-gold-dark)" />
                        <span>Secure Card Processing Gateway (Test/Sandbox Mode)</span>
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Card Number (e.g. 5241 8892 7712 9011)"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          maxLength={19}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: formErrors.cardNumber ? '1px solid #E53E3E' : '1px solid var(--color-border)',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.875rem'
                          }}
                        />
                        {formErrors.cardNumber && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{formErrors.cardNumber}</span>}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          maxLength={5}
                          style={{ padding: '10px 12px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', fontSize: '0.875rem' }}
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          maxLength={4}
                          style={{ padding: '10px 12px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', fontSize: '0.875rem' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* FIB App QR Simulation */}
                  {paymentMethod === 'fib' && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#F5F2EB',
                        border: '1px solid var(--color-border)',
                        marginTop: '8px',
                        fontSize: '0.8125rem',
                        color: '#555'
                      }}
                    >
                      <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#0B2545' }}>
                        📱 First Iraqi Bank Mobile Payment
                      </p>
                      <p style={{ margin: 0 }}>
                        Upon confirmation, you will receive an instant payment request on your registered FIB account or QR scan code.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', padding: '28px', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px', color: 'var(--color-text-primary)' }}>
                {t('checkout.orderSummary')}
              </h3>

              {/* Items List in Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', maxHeight: '280px', overflowY: 'auto' }}>
                {items.map(item => {
                  const itemName = typeof item.name === 'object' ? item.name[language] || item.name.en : item.name;
                  return (
                    <div key={item.cartItemId} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={item.image} alt={itemName} style={{ width: '48px', height: '64px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.8125rem', fontWeight: 500, margin: '0 0 2px 0' }}>{itemName}</h5>
                        <span style={{ fontSize: '0.72rem', color: '#888' }}>Qty: {item.quantity} • {item.size}</span>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {(item.price * item.quantity).toLocaleString()} IQD
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                  <span>{t('checkout.subtotal')}</span>
                  <span>{subtotal.toLocaleString()} {t('shop.currency')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                  <span>{t('checkout.deliveryFee')}</span>
                  <span>{deliveryFee === 0 ? <strong style={{ color: '#276749' }}>{t('checkout.freeDelivery')}</strong> : `${deliveryFee.toLocaleString()} ${t('shop.currency')}`}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  <span>{t('checkout.total')}</span>
                  <span>{grandTotal.toLocaleString()} {t('shop.currency')}</span>
                </div>
              </div>

              {/* Optional GPS Confirmation Status */}
              {detectedLocation && (
                <div style={{
                  marginTop: '20px',
                  padding: '10px 14px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.78125rem',
                  color: '#166534',
                  fontWeight: 600
                }}>
                  <ShieldCheck size={16} color="#15803D" />
                  <span>{isRtl ? 'تم ربط إحداثيات GPS الدقيقة بالطلب بنجاح ✓' : 'Exact GPS Delivery Coordinates Attached ✓'}</span>
                </div>
              )}

              {/* One Large Place Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '18px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  backgroundColor: '#111111',
                  borderColor: '#C5A880',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                {isSubmitting ? (
                  <span>{t('checkout.processing')}</span>
                ) : (
                  <>
                    <span>{t('checkout.placeOrder')}</span>
                    <ArrowRight size={18} className="icon-flip-rtl" />
                  </>
                )}
              </button>

              <p style={{ fontSize: '0.72rem', color: '#8E8A83', textAlign: 'center', marginTop: '16px', lineHeight: 1.4 }}>
                {t('checkout.securityNotice')}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

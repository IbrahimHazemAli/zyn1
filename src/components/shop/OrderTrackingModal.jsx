import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'new', labelAr: 'تم استلام الطلب', labelEn: 'Order Received', descAr: 'وصل طلبك إلى نظام بوتيك سناريا بنجاح' },
  { key: 'confirmed', labelAr: 'تم تأكيد الطلب', labelEn: 'Confirmed', descAr: 'تمت مراجعة الطلب والموافقة على تفاصيله' },
  { key: 'preparing', labelAr: 'قيد التجهيز والتغليف', labelEn: 'Preparing', descAr: 'يجري تجهيز القطع وتغليفها الفاخر' },
  { key: 'ready', labelAr: 'في الطريق للتوصيل', labelEn: 'Out for Delivery', descAr: 'الطلب مع مندوب التوصيل في محافظتك' },
  { key: 'delivered', labelAr: 'تم التوصيل بنجاح', labelEn: 'Delivered', descAr: 'نتمنى لك تجربة تسوق راقية مع سناريا' }
];

export const OrderTrackingModal = ({ isOpen, onClose, initialOrderId = '', initialPhone = '' }) => {
  const { language, isRtl } = useLanguage();
  const { orders, verifyOrderForSupport, businessSettings } = useStore();

  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const term = initialOrderId || initialPhone || '';
      if (term) {
        setSearchInput(term);
        performSearch(term);
      } else {
        setSearchInput('');
        setSearchedOrder(null);
        setHasSearched(false);
        setErrorMsg('');
      }
    }
  }, [isOpen, initialOrderId, initialPhone]);

  if (!isOpen) return null;

  const performSearch = (query) => {
    const term = (query || searchInput).trim();
    if (!term) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال رقم الطلب أو رقم الهاتف' : 'Please enter order ID or phone number');
      setSearchedOrder(null);
      return;
    }

    setHasSearched(true);
    setErrorMsg('');

    // Try verify helper first
    const verifyRes = verifyOrderForSupport ? verifyOrderForSupport(term) : null;
    if (verifyRes && verifyRes.success && verifyRes.order) {
      setSearchedOrder(verifyRes.order);
      return;
    }

    // Direct search in orders array
    const cleanTerm = term.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const found = (orders || []).find(o => {
      const oId = (o.id || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const oPhone = (o.customer?.phone || o.phone || '').replace(/[^0-9]/g, '');
      const oAltPhone = (o.customer?.altPhone || '').replace(/[^0-9]/g, '');
      return oId.includes(cleanTerm) || (cleanTerm.length >= 6 && (oPhone.includes(cleanTerm) || oAltPhone.includes(cleanTerm)));
    });

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setErrorMsg(
        language === 'ar'
          ? 'لم يتم العثور على طلب بهذا الرقم. يرجى التحقق من رقم الطلب أو رقم الهاتف والمحاولة مجدداً.'
          : 'No order found with this reference. Please check your order ID or phone number and try again.'
      );
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const getStepStatus = (stepKey, currentStatus) => {
    if (currentStatus === 'cancelled') return 'cancelled';
    const orderIndex = STATUS_STEPS.findIndex(s => s.key === currentStatus);
    const stepIndex = STATUS_STEPS.findIndex(s => s.key === stepKey);
    if (orderIndex === -1) return stepIndex === 0 ? 'current' : 'pending';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'pending';
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US').format(Number(val) || 0) + (language === 'ar' ? ' د.ع' : ' IQD');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === 'ar' ? 'ar-IQ' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          borderRadius: '16px',
          border: '1px solid rgba(197, 168, 128, 0.3)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          direction: isRtl ? 'rtl' : 'ltr'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #0F172A, #1E293B)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(197, 168, 128, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A880'
              }}
            >
              <Package size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                {language === 'ar' ? 'تتبع مسار طلبك المباشر' : 'Live Order Tracking'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94A3B8' }}>
                {language === 'ar' ? 'سناريا فاشيون • خدمة تتبع الشحنات في كافة محافظات العراق' : 'Sanaria Fashion • Delivery across all Iraq'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s, background-color 0.2s'
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Search Form */}
          <form onSubmit={handleFormSubmit} style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#C5A880', marginBottom: '8px' }}>
              {language === 'ar' ? 'ابحث برقم الطلب أو رقم هاتف المستلم:' : 'Search by Order ID or Recipient Phone:'}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    [isRtl ? 'right' : 'left']: '14px',
                    color: '#64748B'
                  }}
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: SF-2026-0001 أو 0770XXXXXXX' : 'e.g. SF-2026-0001 or 0770XXXXXXX'}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    [isRtl ? 'paddingRight' : 'paddingLeft']: '42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#C5A880',
                  color: '#0F172A',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 22px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{language === 'ar' ? 'تتبع' : 'Track'}</span>
                <ChevronRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
              </button>
            </div>
          </form>

          {/* Error Notice */}
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                fontSize: '0.84rem',
                marginBottom: '20px'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Details View */}
          {searchedOrder && (
            <div>
              {/* Order Meta Banner */}
              <div
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid rgba(197, 168, 128, 0.25)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {language === 'ar' ? 'رقم الطلب' : 'ORDER REFERENCE'}
                    </span>
                    <h4 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#C5A880' }}>
                      {searchedOrder.id}
                    </h4>
                  </div>
                  <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      {language === 'ar' ? 'تاريخ الإنشاء' : 'Date Placed'}
                    </span>
                    <div style={{ fontSize: '0.85rem', color: '#E2E8F0', marginTop: '2px' }}>
                      {formatDate(searchedOrder.createdAt)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.82rem'
                  }}
                >
                  <div>
                    <span style={{ color: '#94A3B8' }}>{language === 'ar' ? 'المستلم:' : 'Customer:'}</span>{' '}
                    <strong style={{ color: '#FFFFFF' }}>{searchedOrder.customer?.name || searchedOrder.name || 'عميل سناريا'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8' }}>{language === 'ar' ? 'المحافظة:' : 'City:'}</span>{' '}
                    <strong style={{ color: '#FFFFFF' }}>{searchedOrder.customer?.city || searchedOrder.city || 'العراق'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8' }}>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</span>{' '}
                    <strong style={{ color: '#C5A880' }}>{formatPrice(searchedOrder.total)}</strong>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div style={{ marginBottom: '28px' }}>
                <h5 style={{ margin: '0 0 16px 0', fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {language === 'ar' ? 'مراحل شحن وتوصيل الطلب:' : 'Shipment Progress Timeline:'}
                </h5>

                {searchedOrder.status === 'cancelled' ? (
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#F87171',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <AlertCircle size={20} />
                    <span>{language === 'ar' ? 'تم إلغاء هذا الطلب. للتفاصيل يرجى مراجعة خدمة العملاء.' : 'This order has been cancelled.'}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                    {STATUS_STEPS.map((step, idx) => {
                      const state = getStepStatus(step.key, searchedOrder.status || 'new');
                      const isCompleted = state === 'completed';
                      const isCurrent = state === 'current';

                      return (
                        <div
                          key={step.key}
                          style={{
                            display: 'flex',
                            gap: '14px',
                            alignItems: 'flex-start',
                            position: 'relative'
                          }}
                        >
                          {/* Dot / Icon */}
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: isCompleted ? '#16A34A' : isCurrent ? '#C5A880' : '#1E293B',
                              color: isCompleted || isCurrent ? '#0F172A' : '#64748B',
                              border: isCurrent ? '3px solid rgba(197, 168, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              flexShrink: 0,
                              boxShadow: isCurrent ? '0 0 16px rgba(197, 168, 128, 0.5)' : 'none'
                            }}
                          >
                            {isCompleted ? <CheckCircle2 size={18} color="#FFFFFF" /> : idx + 1}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, paddingTop: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontSize: '0.88rem',
                                  fontWeight: isCurrent ? 800 : 600,
                                  color: isCurrent ? '#C5A880' : isCompleted ? '#F8FAFC' : '#64748B'
                                }}
                              >
                                {language === 'ar' ? step.labelAr : step.labelEn}
                              </span>
                              {isCurrent && (
                                <span
                                  style={{
                                    fontSize: '0.6875rem',
                                    backgroundColor: 'rgba(197, 168, 128, 0.2)',
                                    color: '#C5A880',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontWeight: 700
                                  }}
                                >
                                  {language === 'ar' ? 'الحالة الحالية' : 'CURRENT STATUS'}
                                </span>
                              )}
                            </div>
                            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: isCurrent ? '#CBD5E1' : '#64748B' }}>
                              {step.descAr}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Items List */}
              {Array.isArray(searchedOrder.items) && searchedOrder.items.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {language === 'ar' ? 'محتويات الطلب:' : 'Order Items:'}
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {searchedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          backgroundColor: '#1E293B',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <img
                          src={item.image || (item.images && item.images[0]) || '/placeholder-luxury.svg'}
                          alt={item.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {typeof item.name === 'object' ? item.name[language] || item.name.ar : item.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                            {item.size ? `المقاس: ${item.size}` : ''} {item.quantity ? `• الكمية: ${item.quantity}` : ''}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#C5A880' }}>
                          {formatPrice(item.price * (item.quantity || 1))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Support Helpline */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(197, 168, 128, 0.1)',
                  border: '1px solid rgba(197, 168, 128, 0.3)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#C5A880" />
                  <span style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>
                    {language === 'ar' ? 'مركز خدمة وتنسيق الطلبات متاح لمتابعة شحنتك' : 'Our customer support concierge is tracking your shipment.'}
                  </span>
                </div>
                <a
                  href={`tel:${businessSettings?.phone || '+9647738888180'}`}
                  style={{
                    backgroundColor: '#C5A880',
                    color: '#0D0D0D',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Phone size={14} />
                  <span>{language === 'ar' ? 'اتصال بالدعم المباشر' : 'Direct Helpline'}</span>
                </a>
              </div>
            </div>
          )}

          {/* Empty initial search prompt */}
          {!searchedOrder && !errorMsg && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
              <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#94A3B8' }}>
                {language === 'ar'
                  ? 'أدخل رقم طلبك (مثال: SF-2026-XXXX) أو رقم هاتفك لمتابعة حالة الشحن في الوقت الفعلي.'
                  : 'Enter your order ID or phone number to track real-time delivery status.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
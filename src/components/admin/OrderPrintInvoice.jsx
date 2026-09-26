import React from 'react';
import { Printer, X, MapPin, Phone, Calendar, Clock, CheckSquare } from 'lucide-react';

export const OrderPrintInvoice = ({ order, orders = [], onClose }) => {
  const printList = order ? [order] : orders;

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (amount) => {
    return Number(amount || 0).toLocaleString() + ' د.ع';
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString || Date.now());
      return d.toLocaleDateString('ar-IQ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString || '';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Bar (Screen Only - Hidden in Print) */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #222222'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Printer size={18} color="#C5A880" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.04em' }}>
              {order ? `طباعة الطلب #${order.id}` : `طباعة جميع الطلبات (${printList.length} طلب)`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handlePrint}
              style={{
                backgroundColor: '#C5A880',
                color: '#0A0A0A',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Printer size={16} />
              <span>إرسال للطابعة • Print</span>
            </button>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Sheets Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px',
            backgroundColor: '#F8F9FA'
          }}
        >
          {printList.map((ord, idx) => {
            const customer = ord.customer || {};
            const customerName = customer.name || ord.customerName || 'عميل سناريا';
            const customerPhone = customer.phone || ord.customerPhone || 'غير متوفر';
            const customerGov = customer.governorate || ord.customerGovernorate || 'بغداد';
            const customerAddress = customer.address || ord.customerAddress || 'الفرع الرئيسي';
            const mapsUrl = ord.mapsUrl || customer.mapsUrl;

            return (
              <div
                key={ord.id || idx}
                className="print-sheet"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '32px',
                  marginBottom: '32px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  color: '#1A202C',
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                }}
              >
                {/* Invoice Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '2px solid #111111',
                    paddingBottom: '20px',
                    marginBottom: '24px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src="/logo.png"
                        alt="Seneria Fashion"
                        style={{ height: '54px', width: 'auto' }}
                      />
                      <div>
                        <h1
                          style={{
                            margin: 0,
                            fontFamily: "'Cinzel', 'Amiri', serif",
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            color: '#111111'
                          }}
                        >
                          SENERIA FASHION
                        </h1>
                        <div style={{ fontSize: '0.78rem', color: '#718096', fontWeight: 600 }}>
                          سناريا فاشن • إشعار تجهيز وتسليم الطلب • SINCE 1992
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'left', direction: 'ltr' }}>
                    <div
                      style={{
                        backgroundColor: '#111111',
                        color: '#C5A880',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        letterSpacing: '0.05em',
                        display: 'inline-block'
                      }}
                    >
                      #{ord.id}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#4A5568', marginTop: '6px', fontWeight: 600 }}>
                      {formatDate(ord.date)}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color:
                          ord.status === 'delivered'
                            ? '#2E7D32'
                            : ord.status === 'cancelled'
                            ? '#C62828'
                            : '#D97706',
                        textTransform: 'uppercase',
                        marginTop: '4px'
                      }}
                    >
                      Status: {ord.status || 'New'}
                    </div>
                  </div>
                </div>

                {/* Customer & Delivery Information Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '18px',
                    marginBottom: '24px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                      بيانات العميل • Customer Info
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                      {customerName}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#334155', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="#C5A880" />
                      <strong style={{ direction: 'ltr' }}>{customerPhone}</strong>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                      عنوان التوصيل • Delivery Location
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                      المحافظة: {customerGov}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#475569', marginTop: '2px' }}>
                      {customerAddress}
                    </div>
                    {mapsUrl && (
                      <div style={{ fontSize: '0.75rem', color: '#2563EB', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        <span>موقع GPS معتمد ومرفق</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                      طريقة الدفع • Payment
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                      الدفع عند الاستلام (COD)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600, marginTop: '2px' }}>
                      يُسمح للزبون بالمعاينة والقياس
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '24px'
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#0F172A', color: '#FFFFFF', textAlign: 'right' }}>
                      <th style={{ padding: '12px 14px', fontSize: '0.8rem', width: '50px' }}>#</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.8rem' }}>المنتج • Product</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.8rem', textAlign: 'center', width: '100px' }}>القياس • Size</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.8rem', textAlign: 'center', width: '80px' }}>الكمية • Qty</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.8rem', textAlign: 'left', width: '130px' }}>السعر • Price</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.8rem', textAlign: 'left', width: '140px' }}>الإجمالي • Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(ord.items || []).map((item, iIdx) => {
                      const itemTitle = typeof item.name === 'object' ? item.name.ar || item.name.en : item.name;
                      const itemSize = item.size || item.selectedSize || 'Free Size';
                      const itemQty = item.quantity || 1;
                      const itemPrice = item.price || 0;
                      const itemTotal = itemPrice * itemQty;

                      return (
                        <tr
                          key={iIdx}
                          style={{
                            borderBottom: '1px solid #E2E8F0',
                            backgroundColor: iIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
                          }}
                        >
                          <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#64748B' }}>
                            {iIdx + 1}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                              {itemTitle}
                            </div>
                            {item.sku && (
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                كود: {item.sku}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <span
                              style={{
                                backgroundColor: '#111111',
                                color: '#FAF8F5',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                              }}
                            >
                              {itemSize}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                            {itemQty}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'left', direction: 'ltr', fontSize: '0.88rem' }}>
                            {formatPrice(itemPrice)}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'left', direction: 'ltr', fontWeight: 700, fontSize: '0.92rem' }}>
                            {formatPrice(itemTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Totals & Notes Section */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    alignItems: 'start',
                    marginBottom: '28px'
                  }}
                >
                  {/* Staff Quality & Prep Checklist */}
                  <div
                    style={{
                      border: '1px dashed #CBD5E1',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: '#FAFAFA'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                      قائمة تحقق التجهيز • Staff Dispatch Checklist
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                        <span>مطابقة القياس والموديل مع الفاتورة</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                        <span>فحص سلامة القماش والأزرار والسحاب</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                        <span>التغليف في كيس وبوكس سناريا الفاخر</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                        <span>تسليم مندوب شركة التوصيل المعتمد</span>
                      </label>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.88rem' }}>
                      <span style={{ color: '#64748B' }}>مجموع القطع (Subtotal):</span>
                      <strong style={{ direction: 'ltr' }}>{formatPrice(ord.subtotal || ord.total || 0)}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.88rem' }}>
                      <span style={{ color: '#64748B' }}>أجور التوصيل (Delivery):</span>
                      <span style={{ direction: 'ltr', fontWeight: 600 }}>
                        {ord.deliveryFee ? formatPrice(ord.deliveryFee) : 'توصيل مجاني • Free'}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0 0 0',
                        marginTop: '8px',
                        borderTop: '2px solid #0F172A',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: '#0F172A'
                      }}
                    >
                      <span>المبلغ المطلوب استلامه:</span>
                      <span style={{ direction: 'ltr', color: '#B45309' }}>
                        {formatPrice(ord.total || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Signatures */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #E2E8F0',
                    paddingTop: '16px',
                    fontSize: '0.78rem',
                    color: '#64748B'
                  }}
                >
                  <div>
                    توقيع مسؤول التجهيز: __________________
                  </div>
                  <div>
                    توقيع المندوب المستلم: __________________
                  </div>
                  <div>
                    خدمة الزبائن: +964 773 888 8180
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

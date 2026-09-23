import React from 'react';
import { Printer, X } from 'lucide-react';
import { sound } from '../utils/sound';

export default function ReceiptPreview({ checkin, onClose }) {
  if (!checkin) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Generate a pseudo-random reference code
  const refCode = `CHK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  const handlePrint = () => {
    sound.playSuccess();
    // In production, this will send ESC/POS commands to XPrinter via IPC
    // For now, simulate success feedback
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '24px'
    }}>
      <div className="animate-modal" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '340px'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Printer size={18} color="#fbbf24" />
            Receipt Preview — 80mm Thermal
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* THE 80MM RECEIPT PAPER                                   */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="receipt-paper">
          {/* Club Header */}
          <div className="receipt-header">
            <p style={{ fontSize: '22px', marginBottom: '2px' }}>⛳</p>
            <h3>ROYAL PALM</h3>
            <h3 style={{ fontSize: '13px', letterSpacing: '3px', marginBottom: '4px' }}>GOLF CLUB</h3>
            <p>123 Fairway Avenue, District 7</p>
            <p>Ho Chi Minh City, Vietnam</p>
            <p>Tel: (028) 3888-9999</p>
          </div>

          <hr className="receipt-divider" />

          {/* Receipt Title */}
          <div style={{ textAlign: 'center', marginBottom: '6px' }}>
            <p style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase'
            }}>
              CHECK-IN RECEIPT
            </p>
            <p style={{ fontSize: '10px', color: '#888' }}>
              Member Verification Slip
            </p>
          </div>

          <hr className="receipt-divider" />

          {/* Member Information */}
          <div style={{ marginBottom: '4px' }}>
            <div className="receipt-row">
              <span className="label">Member:</span>
              <span className="value">{checkin.name}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Card ID:</span>
              <span className="value">{checkin.cardId}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Tier:</span>
              <span className="value">{checkin.tier}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Phone:</span>
              <span className="value">{checkin.phone || '—'}</span>
            </div>
          </div>

          <hr className="receipt-divider" />

          {/* Check-in Details */}
          <div style={{ marginBottom: '4px' }}>
            <div className="receipt-row">
              <span className="label">Date:</span>
              <span className="value">{dateStr}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Time:</span>
              <span className="value">{timeStr}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Locker:</span>
              <span className="value" style={{ fontWeight: 900 }}>{checkin.locker}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Counter:</span>
              <span className="value">#{checkin.counter}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Receptionist:</span>
              <span className="value">Ms. Trang N.</span>
            </div>
          </div>

          <hr className="receipt-divider" />

          {/* Membership Validity */}
          <div style={{ marginBottom: '4px' }}>
            <div className="receipt-row">
              <span className="label">Valid Until:</span>
              <span className="value" style={{
                color: checkin.status === 'expiring' ? '#b45309' : '#166534'
              }}>
                {checkin.expiry}
              </span>
            </div>
            <div className="receipt-row">
              <span className="label">Status:</span>
              <span className="value" style={{
                color: checkin.status === 'expiring' ? '#b45309' : '#166534',
                fontWeight: 900
              }}>
                {checkin.status === 'expiring' ? '⚠ EXPIRING SOON' : '✓ ACTIVE'}
              </span>
            </div>
          </div>

          <hr className="receipt-divider" />

          {/* Reference Barcode */}
          <div className="receipt-barcode">
            ||||| {refCode} |||||
          </div>
          <p style={{ textAlign: 'center', fontSize: '9px', color: '#999', marginBottom: '6px' }}>
            Ref: {refCode}
          </p>

          <hr className="receipt-divider" />

          {/* Footer */}
          <div className="receipt-footer">
            <p className="wish">★ Have a wonderful round! ★</p>
            <p>Thank you for choosing Royal Palm Golf Club</p>
            <p>www.royalpalmgolf.vn</p>
            <p style={{ marginTop: '6px', fontSize: '9px' }}>
              This receipt was auto-printed by Golf Member Check-in System
            </p>
          </div>
        </div>

        {/* Action Buttons below receipt */}
        <div style={{ display: 'flex', gap: '12px', width: '302px' }}>
          <button
            onClick={handlePrint}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.8), rgba(2, 44, 34, 0.9))',
              color: '#6ee7b7',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Printer size={16} /> Send to Printer
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <X size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

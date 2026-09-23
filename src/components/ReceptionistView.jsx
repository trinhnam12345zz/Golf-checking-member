import React, { useState, useEffect, useCallback } from 'react';
import {
  Fingerprint,
  Printer,
  Wifi,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Users,
  FileText,
  Eye,
  ChevronRight,
  RefreshCw,
  Shield,
  Activity,
  HelpCircle,
  X,
  Bell
} from 'lucide-react';
import { sound } from '../utils/sound';
import ReceiptPreview from './ReceiptPreview.jsx';

// ─── Sample Check-in Data (5 scenarios) ─────────────────────────
const SAMPLE_CHECKINS = [
  {
    id: 1,
    time: '08:32 AM',
    name: 'Nguyen Van Minh',
    cardId: 'GLF-8899',
    tier: 'VIP Diamond',
    tierClass: 'badge-tier-vip-diamond',
    status: 'success',
    statusLabel: 'Verified',
    locker: '#108 (VIP A)',
    expiry: '31/12/2026',
    phone: '0903.***.888',
    counter: 1,
    isNew: true,
    photo: 'VM'
  },
  {
    id: 2,
    time: '08:45 AM',
    name: 'Le Thi Huong Giang',
    cardId: 'GLF-5521',
    tier: 'VIP Gold',
    tierClass: 'badge-tier-vip-gold',
    status: 'success',
    statusLabel: 'Verified',
    locker: '#042 (Gold B)',
    expiry: '15/06/2027',
    phone: '0912.***.456',
    counter: 1,
    isNew: false,
    photo: 'HG'
  },
  {
    id: 3,
    time: '09:03 AM',
    name: 'Pham Duc Anh',
    cardId: 'GLF-3347',
    tier: 'Platinum',
    tierClass: 'badge-tier-platinum',
    status: 'expiring',
    statusLabel: 'Expiring in 5 days',
    locker: '#215',
    expiry: '28/09/2026',
    phone: '0987.***.123',
    counter: 1,
    isNew: false,
    photo: 'DA'
  },
  {
    id: 4,
    time: '09:15 AM',
    name: 'Tran Quoc Toan',
    cardId: 'GLF-7720',
    tier: 'VIP Gold',
    tierClass: 'badge-tier-vip-gold',
    status: 'blocked',
    statusLabel: 'EXPIRED — Blocked',
    locker: '—',
    expiry: '10/09/2026',
    phone: '0908.***.555',
    counter: 1,
    isNew: false,
    photo: 'QT'
  },
  {
    id: 5,
    time: '09:28 AM',
    name: 'Unknown',
    cardId: '—',
    tier: '—',
    tierClass: '',
    status: 'unknown',
    statusLabel: 'Unregistered Fingerprint',
    locker: '—',
    expiry: '—',
    phone: '—',
    counter: 1,
    isNew: false,
    photo: '??'
  }
];

// ─── Hardware Status Toggle Data ────────────────────────────────
const INITIAL_HARDWARE = {
  zkteco: { connected: true, label: 'ZKTeco K60', detail: '192.168.1.200:4370', icon: 'fingerprint' },
  printer: { connected: true, label: 'XPrinter XP-T80Q', detail: 'USB (COM3)', icon: 'printer' },
  server: { connected: true, label: 'API Server', detail: 'LAN 192.168.1.100:3000', icon: 'wifi' }
};

export default function ReceptionistView() {
  const [hardware, setHardware] = useState(INITIAL_HARDWARE);
  const [checkins, setCheckins] = useState(SAMPLE_CHECKINS);
  const [alertModal, setAlertModal] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [shakeClass, setShakeClass] = useState('');

  // Stats computed from checkins
  const stats = {
    total: checkins.length,
    vip: checkins.filter(c => c.tier.startsWith('VIP')).length,
    blocked: checkins.filter(c => c.status === 'blocked').length,
    printed: checkins.filter(c => c.status === 'success').length
  };

  // Toggle hardware connection status (simulated)
  const toggleHardware = useCallback((key) => {
    sound.playClick();
    setHardware(prev => ({
      ...prev,
      [key]: { ...prev[key], connected: !prev[key].connected }
    }));
  }, []);

  // Show expired alert modal
  const showAlert = useCallback((checkin) => {
    sound.playWarning();
    setShakeClass('shake');
    setAlertModal(checkin);
    setTimeout(() => setShakeClass(''), 500);
  }, []);

  // Show receipt modal
  const showReceipt = useCallback((checkin) => {
    sound.playClick();
    setReceiptModal(checkin);
  }, []);

  // Get icon for hardware
  const getHwIcon = (type) => {
    switch (type) {
      case 'fingerprint': return <Fingerprint size={16} />;
      case 'printer': return <Printer size={16} />;
      case 'wifi': return <Wifi size={16} />;
      default: return <HelpCircle size={16} />;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={14} />;
      case 'blocked': return <XCircle size={14} />;
      case 'expiring': return <AlertTriangle size={14} />;
      case 'unknown': return <HelpCircle size={14} />;
      default: return null;
    }
  };

  // Filtered checkins based on search
  const filteredCheckins = searchQuery
    ? checkins.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.cardId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : checkins;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', flex: 1 }}>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LEFT PANEL: Hardware Status + Check-in Table               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Hardware Connection Status Bar */}
        <div className="hw-status-bar">
          {Object.entries(hardware).map(([key, hw]) => (
            <div
              key={key}
              className={`hw-status-item ${hw.connected ? 'connected' : 'disconnected'}`}
              style={{ flex: 1 }}
            >
              <span style={{ color: hw.connected ? '#34d399' : '#ef4444' }}>
                {getHwIcon(hw.icon)}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-main)' }}>{hw.label}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{hw.detail}</p>
              </div>
              <span className={`status-dot ${hw.connected ? 'online' : 'offline'}`} />
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: hw.connected ? '#34d399' : '#ef4444'
              }}>
                {hw.connected ? 'Online' : 'Offline'}
              </span>
              <button
                onClick={() => toggleHardware(key)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '3px 6px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
                title="Toggle connection (simulated)"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Check-in Activity Panel */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Panel Header with Search */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={18} color="#34d399" />
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                fontWeight: 700
              }}>
                Live Check-in Activity
              </h3>
              <span style={{
                fontSize: '11px',
                color: '#34d399',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span className="status-dot online" /> Real-time Sync
              </span>
            </div>

            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0,0,0,0.3)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              width: '240px'
            }}>
              <Search size={14} color="var(--text-dim)" />
              <input
                type="text"
                placeholder="Search by name or card ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-body)',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Check-in Table */}
          <div className="checkin-scroll-container">
            <table className="checkin-table">
              <thead>
                <tr>
                  <th style={{ width: '36px' }}>#</th>
                  <th>Time</th>
                  <th>Member</th>
                  <th>Card ID</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCheckins.map((checkin, idx) => (
                  <tr
                    key={checkin.id}
                    className={`
                      ${checkin.isNew ? 'flash-highlight' : ''}
                      ${checkin.status === 'blocked' ? 'row-blocked' : ''}
                      ${checkin.status === 'expiring' ? 'row-warning' : ''}
                      ${checkin.status === 'unknown' ? 'row-unknown' : ''}
                    `}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--text-dim)', fontSize: '12px' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                        <Clock size={13} color="var(--text-dim)" />
                        {checkin.time}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: checkin.status === 'unknown'
                            ? 'rgba(100, 116, 139, 0.2)'
                            : checkin.status === 'blocked'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(245, 158, 11, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '11px',
                          color: checkin.status === 'unknown'
                            ? '#94a3b8'
                            : checkin.status === 'blocked'
                              ? '#fca5a5'
                              : '#fbbf24',
                          flexShrink: 0
                        }}>
                          {checkin.photo}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '13px' }}>{checkin.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Counter #{checkin.counter}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        color: checkin.cardId === '—' ? 'var(--text-dim)' : 'var(--gold-400)',
                        fontSize: '13px'
                      }}>
                        {checkin.cardId}
                      </span>
                    </td>
                    <td>
                      {checkin.tierClass ? (
                        <span
                          className={checkin.tierClass}
                          style={{
                            padding: '3px 10px',
                            borderRadius: '14px',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.3px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {checkin.tier}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${checkin.status}`}>
                        {getStatusIcon(checkin.status)}
                        {checkin.statusLabel}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {(checkin.status === 'success' || checkin.status === 'expiring') && (
                          <button
                            className="btn-table-action"
                            onClick={() => showReceipt(checkin)}
                          >
                            <Printer size={12} /> Print Bill
                          </button>
                        )}
                        {checkin.status === 'blocked' && (
                          <button
                            className="btn-table-action danger"
                            onClick={() => showAlert(checkin)}
                          >
                            <AlertCircle size={12} /> View Alert
                          </button>
                        )}
                        {checkin.status === 'unknown' && (
                          <button className="btn-table-action">
                            <Eye size={12} /> Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCheckins.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-dim)',
                fontSize: '14px'
              }}>
                <Search size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>No matching check-in records found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* RIGHT SIDEBAR: Shift Summary + Quick Actions               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Shift Info Card */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #059669, #022c22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={18} color="#34d399" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px' }}>Ms. Trang Nguyen</p>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Receptionist • Counter #1</p>
            </div>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px'
          }}>
            <Clock size={14} color="#fbbf24" />
            <span style={{ color: 'var(--text-muted)' }}>Shift started:</span>
            <strong style={{ color: 'var(--gold-400)' }}>06:00 AM — Today</strong>
          </div>
        </div>

        {/* Today's Quick Summary */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <h4 style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Activity size={14} /> Today's Summary
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '14px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: 'var(--primary-400)'
              }}>
                {stats.total}
              </span>
              <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>Total Check-ins</p>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '14px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: 'var(--gold-400)'
              }}>
                {stats.vip}
              </span>
              <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>VIP Members</p>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '14px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: '#ef4444'
              }}>
                {stats.blocked}
              </span>
              <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>Blocked</p>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '14px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: '#38bdf8'
              }}>
                {stats.printed}
              </span>
              <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>Bills Printed</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-panel" style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '4px'
          }}>
            Quick Actions
          </h4>

          <button
            onClick={() => showReceipt(SAMPLE_CHECKINS[0])}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              background: 'rgba(16, 185, 129, 0.08)',
              color: 'var(--primary-400)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <Printer size={16} />
            <span style={{ flex: 1 }}>Print Test Bill</span>
            <ChevronRight size={14} style={{ opacity: 0.5 }} />
          </button>

          <button style={{
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}>
            <Users size={16} />
            <span style={{ flex: 1 }}>Manage Member Directory</span>
            <ChevronRight size={14} style={{ opacity: 0.3 }} />
          </button>

          <button style={{
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}>
            <FileText size={16} />
            <span style={{ flex: 1 }}>Import from Excel / CSV</span>
            <ChevronRight size={14} style={{ opacity: 0.3 }} />
          </button>

          <button style={{
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}>
            <Clock size={16} />
            <span style={{ flex: 1 }}>View Shift History</span>
            <ChevronRight size={14} style={{ opacity: 0.3 }} />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* EXPIRED CARD ALERT MODAL (Red Danger Popup)                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {alertModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '24px'
        }}>
          <div
            className={`glass-panel animate-modal alert-modal-danger ${shakeClass}`}
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '36px',
              textAlign: 'center'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setAlertModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.06)',
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

            {/* Danger Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)'
            }}>
              <AlertCircle size={40} color="#ef4444" />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 800,
              color: '#fca5a5',
              marginBottom: '6px'
            }}>
              MEMBERSHIP EXPIRED
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              This member's card has expired. Check-in has been <strong style={{ color: '#ef4444' }}>BLOCKED</strong>.
            </p>

            {/* Member Info */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Member:</span>
                <strong style={{ fontSize: '13px' }}>{alertModal.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Card ID:</span>
                <strong style={{ fontSize: '13px', color: '#fbbf24' }}>{alertModal.cardId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Tier:</span>
                <strong style={{ fontSize: '13px' }}>{alertModal.tier}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Expired On:</span>
                <strong style={{ fontSize: '13px', color: '#ef4444' }}>{alertModal.expiry}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setAlertModal(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <CheckCircle2 size={16} /> Acknowledge
              </button>
              <button
                onClick={() => setAlertModal(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#fde68a',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Bell size={16} /> Contact Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* RECEIPT PREVIEW MODAL                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {receiptModal && (
        <ReceiptPreview
          checkin={receiptModal}
          onClose={() => setReceiptModal(null)}
        />
      )}
    </div>
  );
}

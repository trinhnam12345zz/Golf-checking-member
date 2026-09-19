import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Sun, 
  Wind, 
  Flag,
  Award,
  Calendar,
  Key,
  Printer,
  ChevronRight
} from 'lucide-react';
import { sound } from '../utils/sound';

export default function KioskView() {
  const [scanning, setScanning] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'success' | 'expired' | 'unregistered'
  const [countdown, setCountdown] = useState(6);

  // Auto-close modal countdown
  useEffect(() => {
    let timer;
    if (activeModal) {
      setCountdown(6);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setActiveModal(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeModal]);

  const triggerScan = (scenario) => {
    sound.playClick();
    setScanning(true);
    setActiveModal(null);

    setTimeout(() => {
      setScanning(false);
      if (scenario === 'success') {
        sound.playSuccess();
        setActiveModal('success');
      } else if (scenario === 'expired') {
        sound.playWarning();
        setActiveModal('expired');
      } else if (scenario === 'unregistered') {
        sound.playWarning();
        setActiveModal('unregistered');
      }
    }, 1200);
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Top Welcome & Club Atmosphere Widget */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '24px',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>✨</span>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-display)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--gold-400)',
              fontWeight: 700
            }}>
              Chào Mừng Đến Với Royal Palm Golf Club
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: 800,
            lineHeight: 1.2
          }}>
            Khu Vực Check-in <span className="gold-gradient-text">Tự Động Hội Viên</span>
          </h2>
        </div>

        {/* Live Weather / Course Condition Widget */}
        <div className="glass-panel" style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          background: 'rgba(6, 78, 59, 0.25)',
          borderColor: 'rgba(52, 211, 153, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sun size={20} color="#fbbf24" />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700 }}>26°C</p>
              <p style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Nắng nhẹ</p>
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind size={20} color="#38bdf8" />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700 }}>8 km/h</p>
              <p style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Gió mát</p>
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flag size={20} color="#34d399" />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-400)' }}>18 Lỗ</p>
              <p style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Sân mở cửa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center Biometric Scanning Interactive Radar */}
      <div className="glass-panel-gold" style={{
        flex: 1,
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '28px 20px'
      }}>
        {/* Subtle Luxury Background Pattern */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        {/* Scanning Pad with Animated Radar Rings - Clickable */}
        <div 
          id="fingerprint-sensor-pad"
          onClick={() => triggerScan('success')}
          title="Chạm vào đây để quét thử"
          style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            cursor: 'pointer'
          }}
        >
          {/* Concentric Pulse Rings */}
          <div className="radar-ring" style={{ width: '100%', height: '100%' }} />
          <div className="radar-ring" style={{ width: '100%', height: '100%' }} />
          <div className="radar-ring" style={{ width: '100%', height: '100%' }} />

          {/* Main Fingerprint Pad */}
          <div style={{
            width: '115px',
            height: '115px',
            borderRadius: '50%',
            background: scanning 
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(2, 44, 34, 0.9) 70%)'
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(2, 44, 34, 0.9) 70%)',
            border: scanning ? '2px solid var(--gold-400)' : '2px solid var(--primary-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: scanning 
              ? '0 0 50px rgba(245, 158, 11, 0.5)'
              : '0 0 45px rgba(16, 185, 129, 0.45)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            {/* Laser scanning bar */}
            {scanning && (
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
                boxShadow: '0 0 12px #fbbf24',
                animation: 'laser-sweep 1.2s infinite ease-in-out'
              }} />
            )}

            <Fingerprint 
              size={64} 
              color={scanning ? "#fbbf24" : "#34d399"} 
              style={{
                filter: scanning ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))' : 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.7))',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Dynamic Instructional Text */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          fontWeight: 700,
          marginBottom: '8px',
          letterSpacing: '0.5px'
        }}>
          {scanning ? (
            <span className="gold-gradient-text">Đang đối chiếu dữ liệu sinh trắc học...</span>
          ) : (
            <span>Xin vui lòng đặt ngón tay lên máy quét</span>
          )}
        </h3>

        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          maxWidth: '480px',
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          {scanning 
            ? "Vui lòng giữ nguyên ngón tay trên đầu đọc ZKTeco K60 trong giây lát." 
            : "Chạm nhẹ ngón tay đã đăng ký vào máy chấm công tại bàn. Hệ thống sẽ tự động xác thực và in phiếu ra sân."}
        </p>

        <div style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(0,0,0,0.35)',
          padding: '6px 16px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          fontSize: '11px',
          color: 'var(--text-dim)'
        }}>
          <span>Cảm biến: <strong>ZKTeco K60 Optical</strong></span>
          <span>•</span>
          <span>Tốc độ nhận diện: <strong>&lt; 0.5s</strong></span>
        </div>
      </div>

      {/* Bottom Interactive Simulation Bar (Cho người dùng bấm thử ngay) */}
      <div style={{
        marginTop: '16px',
        padding: '12px 20px',
        borderRadius: '14px',
        background: 'rgba(6, 16, 12, 0.9)',
        border: '1px dashed rgba(245, 158, 11, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={16} color="#fbbf24" />
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gold-400)' }}>
              Bảng Thử Nghiệm Tương Tác (Vibe Simulator)
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              Bấm thử các tình huống giả lập từ máy K60:
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            id="btn-scan-vip"
            onClick={() => triggerScan('success')}
            disabled={scanning}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.8), rgba(2, 44, 34, 0.9))',
              color: '#6ee7b7',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s'
            }}
          >
            <CheckCircle2 size={14} color="#34d399" />
            1. Quét VIP Hợp Lệ
          </button>

          <button
            id="btn-scan-expired"
            onClick={() => triggerScan('expired')}
            disabled={scanning}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.8), rgba(69, 10, 10, 0.9))',
              color: '#fca5a5',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s'
            }}
          >
            <XCircle size={14} color="#ef4444" />
            2. Thẻ Đã Hết Hạn
          </button>

          <button
            id="btn-scan-unregistered"
            onClick={() => triggerScan('unregistered')}
            disabled={scanning}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'linear-gradient(135deg, rgba(120, 53, 15, 0.8), rgba(69, 26, 3, 0.9))',
              color: '#fde68a',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s'
            }}
          >
            <AlertTriangle size={14} color="#fbbf24" />
            3. Chưa Có Vân Tay
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL KẾT QUẢ CHECK-IN (POPUP TOÀN MÀN HÌNH HOẶC OVERLAY CAO CẤP)        */}
      {/* ========================================================================= */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          {/* SUCCESS MODAL */}
          {activeModal === 'success' && (
            <div className="glass-panel-gold animate-modal" style={{
              width: '100%',
              maxWidth: '560px',
              padding: '40px',
              textAlign: 'center',
              position: 'relative'
            }}>
              {/* Countdown badge */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '24px',
                fontSize: '12px',
                color: 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Clock size={14} /> Tự đóng sau {countdown}s
              </div>

              {/* Avatar with Gold Crest Ring */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                padding: '4px',
                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#042f2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#fbbf24'
                }}>
                  VM
                </div>
              </div>

              {/* Tier Badge */}
              <div style={{ display: 'inline-block', marginBottom: '12px' }}>
                <span className="badge-tier-vip-diamond" style={{
                  padding: '5px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Award size={14} /> VIP Diamond Member
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '4px'
              }}>
                ÔNG NGUYỄN VĂN MINH
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Mã Thẻ: <strong style={{ color: '#fbbf24' }}>GLF-8899</strong> • SĐT: <strong>0903.***.888</strong>
              </p>

              {/* Status Box */}
              <div style={{
                background: 'rgba(6, 78, 59, 0.4)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                textAlign: 'left',
                marginBottom: '24px'
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Thời hạn thẻ:</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#34d399' }}>Đến 31/12/2026</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tủ đồ chỉ định (Locker):</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>Locker #108 (VIP A)</p>
                </div>
              </div>

              {/* Thermal Printer Success Notice */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                borderRadius: '8px',
                color: 'var(--primary-300)',
                fontSize: '13px',
                fontWeight: 600
              }}>
                <Printer size={18} color="#34d399" />
                <span>Đã in phiếu check-in tự động tại Quầy Lễ Tân #1</span>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                style={{
                  marginTop: '24px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
                }}
              >
                Hoàn Tất (Đóng)
              </button>
            </div>
          )}

          {/* EXPIRED MODAL */}
          {activeModal === 'expired' && (
            <div className="glass-panel animate-modal" style={{
              width: '100%',
              maxWidth: '520px',
              padding: '36px',
              textAlign: 'center',
              borderColor: 'rgba(239, 68, 68, 0.5)',
              background: 'linear-gradient(135deg, rgba(30, 10, 10, 0.95), rgba(15, 5, 5, 0.98))',
              boxShadow: '0 0 50px rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '2px solid #ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
              }}>
                <XCircle size={44} color="#ef4444" />
              </div>

              <span style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '4px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px'
              }}>
                CHẶN CHECK-IN • THẺ HẾT HẠN
              </span>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 700,
                color: '#ffffff',
                marginTop: '16px',
                marginBottom: '8px'
              }}>
                ÔNG TRẦN QUỐC TOẢN
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                Mã thẻ: <strong>GLF-4412</strong> • Hạng thẻ: Gold Member
              </p>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'left',
                fontSize: '13px',
                color: '#fca5a5',
                lineHeight: 1.6,
                marginBottom: '24px'
              }}>
                ⚠️ Thẻ hội viên này đã hết hạn hiệu lực từ ngày <strong>10/09/2026</strong>. Hệ thống từ chối in phiếu check-in và đã phát tín hiệu cảnh báo đến bàn Lễ tân.
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Xin vui lòng liên hệ nhân viên tại <strong>Quầy Lễ Tân</strong> để thực hiện thủ tục gia hạn thẻ trước khi ra sân.
              </p>

              <button
                onClick={() => setActiveModal(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Đã Hiểu (Đóng)
              </button>
            </div>
          )}

          {/* UNREGISTERED MODAL */}
          {activeModal === 'unregistered' && (
            <div className="glass-panel animate-modal" style={{
              width: '100%',
              maxWidth: '520px',
              padding: '36px',
              textAlign: 'center',
              borderColor: 'rgba(245, 158, 11, 0.5)',
              background: 'linear-gradient(135deg, rgba(30, 20, 10, 0.95), rgba(15, 10, 5, 0.98))'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '2px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Fingerprint size={44} color="#f59e0b" />
              </div>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '12px'
              }}>
                Chưa Nhận Diện Được Vân Tay
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Dấu vân tay này chưa được đăng ký trong hệ thống hoặc bạn là hội viên mới từ hệ thống cũ chuyển sang.
              </p>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '10px',
                padding: '16px',
                textAlign: 'left',
                fontSize: '13px',
                color: '#fef3c7',
                marginBottom: '24px'
              }}>
                <strong>Quy trình đăng ký vân tay mới (chỉ 30 giây):</strong>
                <ol style={{ paddingLeft: '20px', marginTop: '8px', lineHeight: 1.6 }}>
                  <li>Bước tới Quầy Lễ Tân và xuất trình Mã thẻ hoặc CCCD.</li>
                  <li>Nhân viên sẽ bấm lệnh kích hoạt trên máy ZKTeco K60.</li>
                  <li>Đặt ngón tay 3 lần để hoàn tất lấy mẫu sinh trắc học.</li>
                </ol>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Đã Hiểu (Đóng)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

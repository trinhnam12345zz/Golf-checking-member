import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Printer, 
  Wifi, 
  UserCheck, 
  Users, 
  Monitor, 
  Clock, 
  Fingerprint,
  FileText,
  Settings,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('kiosk');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sysInfo, setSysInfo] = useState({
    platform: 'win32',
    arch: 'x64',
    electron: '33.2.1'
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (window.electronAPI) {
      setSysInfo({
        platform: window.electronAPI.platform || 'win32',
        arch: window.electronAPI.arch || 'x64',
        electron: window.electronAPI.versions?.electron || '33.x'
      });
    }
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Luxury Navigation Bar */}
      <header style={{
        padding: '16px 32px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(6, 16, 12, 0.85)',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669, #022c22)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.2)'
          }}>
            <span style={{ fontSize: '22px' }}>⛳</span>
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }} className="gold-gradient-text">
              Royal Palm Golf Club
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Hệ thống Xác thực Hội viên & In Phiếu Tự Động
            </p>
          </div>
        </div>

        {/* Real-time Clock & Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Mode Switch Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(2, 44, 34, 0.6)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setActiveTab('kiosk')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '13px',
                transition: 'all 0.2s',
                background: activeTab === 'kiosk' ? 'linear-gradient(135deg, #059669, #047857)' : 'transparent',
                color: activeTab === 'kiosk' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: activeTab === 'kiosk' ? '0 2px 8px rgba(5, 150, 105, 0.4)' : 'none'
              }}
            >
              <Monitor size={16} />
              Chế độ Kiosk (Golfer)
            </button>
            <button
              onClick={() => setActiveTab('receptionist')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '13px',
                transition: 'all 0.2s',
                background: activeTab === 'receptionist' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
                color: activeTab === 'receptionist' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: activeTab === 'receptionist' ? '0 2px 8px rgba(217, 119, 6, 0.4)' : 'none'
              }}
            >
              <UserCheck size={16} />
              Quầy Lễ Tân
            </button>
          </div>

          {/* Clock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-main)',
            background: 'rgba(255,255,255,0.05)',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <Clock size={16} color="#fbbf24" />
            <span>{currentTime.toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Phase 1.1 Success Banner */}
        <div className="glass-panel" style={{
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(13, 30, 23, 0.8) 100%)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--primary-400)',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}>
                GIAI ĐOẠN 1.1 HOÀN TẤT
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Hệ điều hành tương thích: <strong>Windows 10 (32-bit / 64-bit) & Windows 11</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              Bộ Khung Dự Án Electron + React 18 + Vite Đã Sẵn Sàng
            </h2>
          </div>

          {/* Hardware status mini-bar */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.3)',
              fontSize: '12px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <Fingerprint size={16} color="#34d399" />
              <span>ZKTeco K60: <strong>TCP 4370</strong></span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.3)',
              fontSize: '12px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <Printer size={16} color="#fbbf24" />
              <span>XPrinter XP-T80Q: <strong>USB (K80)</strong></span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.3)',
              fontSize: '12px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <Wifi size={16} color="#38bdf8" />
              <span>Server LAN: <strong>Connected</strong></span>
            </div>
          </div>
        </div>

        {/* Dynamic Viewport according to Active Tab */}
        {activeTab === 'kiosk' ? (
          /* KIOSK VIEW PREVIEW */
          <div className="glass-panel" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(2, 44, 34, 0.1) 70%)',
              border: '2px solid rgba(52, 211, 153, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)',
              animation: 'pulse 2s infinite'
            }}>
              <Fingerprint size={64} color="#34d399" />
            </div>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              Xin Vui Lòng Đặt Ngón Tay Lên Máy Quét
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '500px', lineHeight: 1.6 }}>
              Đặt ngón tay vào máy chấm công <strong>ZKTeco K60</strong> tại quầy. Hệ thống sẽ tự động nhận diện và in phiếu xác nhận ngay lập tức.
            </p>

            <div style={{
              marginTop: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(255,255,255,0.03)',
              padding: '12px 24px',
              borderRadius: '30px',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: '13px',
              color: 'var(--text-muted)'
            }}>
              <span>Chưa đăng ký vân tay?</span>
              <span style={{ color: 'var(--gold-400)', fontWeight: 600 }}>Vui lòng liên hệ Lễ tân để lấy mẫu</span>
            </div>
          </div>
        ) : (
          /* RECEPTIONIST VIEW PREVIEW */
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1 }}>
            {/* Left: Check-in Activity stream */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>
                  Nhật Ký Check-in Trực Tiếp (Ca Hôm Nay)
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--primary-400)', fontWeight: 600 }}>
                  🟢 Tự động đồng bộ
                </span>
              </div>

              {/* Sample list item */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: 'var(--gold-400)'
                  }}>
                    VIP
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Nguyễn Văn Minh</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mã thẻ: <strong>GLF-8899</strong> • Hạng: VIP Diamond</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--success)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    Check-in Hợp Lệ
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Hôm nay 08:32 AM • Quầy #1</p>
                </div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AlertCircle size={24} color="#ef4444" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Trần Quốc Toản</h4>
                    <p style={{ fontSize: '12px', color: 'var(--danger)' }}>⚠️ Thẻ đã hết hạn từ 10/09/2026 - ĐÃ CHẶN CHECK-IN</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: 'var(--danger)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    Từ chối in bill
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Hôm nay 09:15 AM • Quầy #1</p>
                </div>
              </div>
            </div>

            {/* Right: Quick Stats & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Thống Kê Nhanh Hôm Nay
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-400)' }}>42</span>
                    <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Lượt đã check-in</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gold-400)' }}>18</span>
                    <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Hội viên VIP</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Thao Tác Nhanh
                </h4>
                <button style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--primary-400)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Users size={16} /> Quản lý danh sách hội viên
                </button>
                <button style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FileText size={16} /> Nhập danh sách từ Excel
                </button>
                <button style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Printer size={16} /> Kiểm tra máy in XPrinter (Test)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer style={{
        padding: '12px 32px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: 'var(--text-dim)'
      }}>
        <span>Checking Golf Member v1.0.0 • Chạy trên Electron {sysInfo.electron} ({sysInfo.arch})</span>
        <span>Sẵn sàng cho cả Windows 10 (32-bit/64-bit) & Windows 11</span>
      </footer>
    </div>
  );
}

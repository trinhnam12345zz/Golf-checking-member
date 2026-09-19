# DANH SÁCH CÔNG VIỆC DỰ ÁN (TASK CHECKLIST)
**Hệ thống Kiểm tra & Quản lý Hội viên Sân Golf (Checking Golf Member)**

> Tài liệu này quản lý tiến độ thực tế của dự án. Mỗi đầu việc sẽ được cập nhật trạng thái `[ ]` (chưa làm) thành `[x]` (hoàn thành) theo đúng phương pháp Vibe Coding: làm đến đâu, kiểm thử và bàn giao đến đó.

---

## ⛳ GIAI ĐOẠN 1: KHỞI TẠO BỘ KHUNG & GIAO DIỆN MẪU (Visual Prototype)
*Mục tiêu: Dựng khung app Electron + React + Vite và hoàn thiện toàn bộ giao diện đẳng cấp sân golf trước khi viết logic.*

- [x] **1.1. Khởi tạo cấu trúc dự án (Scaffolding)**
  - [x] Khởi tạo dự án với Electron + React 18 + Vite.
  - [x] Cấu hình hỗ trợ Windows 10 (cả 32-bit `ia32` và 64-bit `x64`) cùng Windows 11.
  - [x] Cấu hình script đóng gói `electron-builder` xuất file `.exe`.
- [ ] **1.2. Xây dựng Design System chuẩn Golf Club sang trọng**
  - [ ] Bộ màu nhận diện: Xanh lục bảo (Emerald Green), Vàng ánh kim (Champagne Gold), Xám than (Charcoal Dark).
  - [ ] Hiệu ứng kính mờ (Glassmorphism), bóng đổ mềm mại, phông chữ chuẩn quốc tế.
  - [ ] Bộ icon & âm thanh thông báo trực quan (thành công, cảnh báo, lỗi).
- [ ] **1.3. Thiết kế Màn hình Kiosk (Dành cho Golfer)**
  - [ ] Giao diện chào mừng toàn màn hình sang trọng.
  - [ ] Vùng hướng dẫn quét ngón tay kèm hoạt ảnh động (Lottie / CSS Pulse).
  - [ ] Màn hình pop-up kết quả: Ảnh hội viên, Họ tên, Mã thẻ, Hạng thẻ, Lời chào mừng.
- [ ] **1.4. Thiết kế Màn hình Lễ tân (Dành cho Nhân viên)**
  - [ ] Thanh trạng thái kết nối phần cứng (Máy K60: Online/Offline, Máy in: Online/Offline, Server: Connected).
  - [ ] Bảng điều khiển Check-in thời gian thực kèm âm báo.
  - [ ] Pop-up cảnh báo đỏ đặc biệt khi **Thẻ hết hạn** hoặc **Thẻ bị khóa**.
- [ ] **1.5. Thiết kế Mẫu Hóa đơn In Bill (Thermal Receipt Preview)**
  - [ ] Thiết kế mẫu phiếu khổ 80mm chuẩn máy in XPrinter XP-T80Q.
  - [ ] Thể hiện đầy đủ: Tên sân golf, Logo, Họ tên Golfer, Mã thẻ, Hạng thẻ, Ngày giờ check-in, Mã tra cứu, Lời chúc mừng.

---

## 🛠️ GIAI ĐOẠN 2: MÔI TRƯỜNG DEV & GIẢ LẬP PHẦN CỨNG (Mock Simulator)
*Mục tiêu: Cho phép bấm thử nghiệm trọn vẹn mọi luồng check-in và in ấn ngay trên PC mà chưa cần cắm máy thật.*

- [ ] **2.1. Thiết lập Database môi trường Dev**
  - [ ] Tạo database nội bộ SQLite có cấu trúc schema 100% giống PostgreSQL phòng server.
  - [ ] Tạo bảng `users` (tài khoản đăng nhập), `members` (hội viên), `checkin_logs` (lịch sử).
  - [ ] Nạp sẵn bộ dữ liệu mẫu (Seed Data) ~20 hội viên với nhiều tình huống:
    - Hội viên thẻ VIP còn hạn (check-in thành công).
    - Hội viên thẻ sắp hết hạn (còn dưới 7 ngày - hiện cảnh báo vàng).
    - Hội viên thẻ đã hết hạn (chặn check-in, chuông báo đỏ).
    - Hội viên chưa đăng ký vân tay (yêu cầu lấy vân tay).
- [ ] **2.2. Xây dựng Thanh công cụ Giả lập (Dev Hardware Bar)**
  - [ ] Nút giả lập: *"Golfer VIP quét vân tay"* ➔ Kiểm tra phản hồi app.
  - [ ] Nút giả lập: *"Golfer thẻ hết hạn quét vân tay"* ➔ Kiểm tra cơ chế chặn.
  - [ ] Nút giả lập: *"Vân tay không tồn tại"* ➔ Kiểm tra báo lỗi.
  - [ ] Bộ giả lập máy in (Virtual Printer): Hiển thị phiếu in trực tiếp trên màn hình xem trước.

---

## 🔌 GIAI ĐOẠN 3: TÍCH HỢP THIẾT BỊ THẬT (ZKTeco K60 & XPrinter XP-T80Q)
*Mục tiêu: Đấu nối socket mạng LAN với máy K60 và cổng USB với máy in XPrinter.*

- [ ] **3.1. Tích hợp máy chấm công ZKTeco K60**
  - [ ] Tích hợp thư viện `node-zklib` trong tiến trình Electron Main (Node.js).
  - [ ] Kết nối Socket TCP port 4370 tới địa chỉ IP của K60 trong mạng LAN.
  - [ ] Lắng nghe sự kiện check-in theo thời gian thực (Real-time Event Hook).
  - [ ] Viết chức năng gửi lệnh lấy vân tay mới (Enrollment) từ App sang máy K60.
  - [ ] Cơ chế tự động kết nối lại (Auto Reconnect) khi mất kết nối mạng.
- [ ] **3.2. Tích hợp máy in nhiệt XPrinter XP-T80Q**
  - [ ] Tích hợp thư viện `node-thermal-printer` giao thức ESC/POS qua cổng USB.
  - [ ] Định dạng khổ giấy 80mm, căn chỉnh lề, hỗ trợ tiếng Việt có dấu.
  - [ ] Kích hoạt lệnh tự động cắt giấy (Auto-Cut) sau khi in xong.

---

## 👥 GIAI ĐOẠN 4: QUẢN LÝ HỘI VIÊN & NHẬP LIỆU EXCEL
*Mục tiêu: Quản lý thông tin hội viên hoàn chỉnh và nạp dữ liệu từ hệ thống cũ.*

- [ ] **4.1. Màn hình Quản lý Hội viên (Member CRUD)**
  - [ ] Danh sách hội viên dạng bảng hiện đại, phân trang, lọc theo hạng thẻ/trạng thái.
  - [ ] Thêm mới hội viên thủ công kèm chụp ảnh/chọn ảnh đại diện.
  - [ ] Chỉnh sửa thông tin, gia hạn thời hạn thẻ, khóa thẻ hội viên.
  - [ ] Tìm kiếm tức thì theo: Họ tên, Số điện thoại, Mã thẻ.
- [ ] **4.2. Bộ công cụ Di trú Dữ liệu Excel (Excel Migration)**
  - [ ] Tải lên file Excel/CSV từ hệ thống cũ.
  - [ ] Xem trước dữ liệu (Preview) và kiểm tra lỗi (validate trùng mã, sai ngày tháng).
  - [ ] Nạp hàng loạt vào cơ sở dữ liệu với trạng thái `fingerprint_registered = false`.
  - [ ] Xuất danh sách hội viên ra file Excel.

---

## 🔐 GIAI ĐOẠN 5: BẢO MẬT & PHÂN QUYỀN NHÂN VIÊN (RBAC)
*Mục tiêu: Phân tách rõ quyền hạn giữa Lễ tân và Quản lý sân golf.*

- [ ] **5.1. Màn hình Đăng nhập & Xác thực**
  - [ ] Đăng nhập bằng tài khoản và mật khẩu được mã hóa (bcrypt).
  - [ ] Nhớ phiên đăng nhập cho ca làm việc.
- [ ] **5.2. Phân quyền vai trò (Role-Based Access Control)**
  - [ ] Vai trò **Lễ tân (`receptionist`)**: Chỉ được check-in và xem lịch sử ca trực.
  - [ ] Vai trò **Quản lý (`admin`)**: Toàn quyền cấu hình, quản lý hội viên, quản lý nhân viên, xem báo cáo.
- [ ] **5.3. Quản lý Tài khoản Nhân viên (Dành riêng cho Admin)**
  - [ ] Thêm, sửa, khóa/mở khóa tài khoản nhân viên lễ tân.
  - [ ] Đặt lại mật khẩu nhân viên.

---

## 📊 GIAI ĐOẠN 6: NHẬT KÝ CHECK-IN & BÁO CÁO THỐNG KÊ
*Mục tiêu: Báo cáo giám sát lượng khách, phục vụ đối soát và quản trị.*

- [ ] **6.1. Bảng nhật ký Check-in thời gian thực**
  - [ ] Hiển thị dòng sự kiện check-in vừa diễn ra (Hội viên, Quầy số mấy, Giờ quét, Kết quả).
  - [ ] Đánh dấu màu nổi bật các lượt bị từ chối (thẻ hết hạn / không nhận diện được).
- [ ] **6.2. Bộ lọc & Báo cáo**
  - [ ] Lọc theo ngày, theo ca làm việc, theo quầy lễ tân.
  - [ ] Biểu đồ thống kê số lượng hội viên đến sân theo các khung giờ trong ngày.
  - [ ] Xuất báo cáo lịch sử check-in ra file Excel (.xlsx).

---

## 🚀 GIAI ĐOẠN 7: TRIỂN KHAI PHÒNG SERVER & VẬN HÀNH (Go-Live)
*Mục tiêu: Cài đặt lên Windows Server phòng máy và các máy tính quầy lễ tân.*

- [ ] **7.1. Cài đặt hệ thống tại phòng Server**
  - [ ] Cài đặt PostgreSQL trên Windows Server.
  - [ ] Chạy script tạo cấu trúc bảng (`schema.sql`) và tài khoản Admin mặc định.
  - [ ] Cài đặt Express.js API Server chạy dưới dạng dịch vụ ngầm Windows Service (tự bật lại khi khởi động lại server).
  - [ ] Cấu hình tường lửa (Firewall) mở cổng LAN cho các máy trạm kết nối.
- [ ] **7.2. Đóng gói & Triển khai máy trạm lễ tân**
  - [ ] Đóng gói bộ cài `GolfCheckin-Setup-x86.exe` (cho Win 10 32-bit) và `GolfCheckin-Setup-x64.exe` (cho Win 10/11 64-bit).
  - [ ] Cài đặt lên 2-3 máy tính quầy lễ tân, điền IP máy chủ trong phần Cài đặt.
  - [ ] Cắm máy in XPrinter XP-T80Q và kiểm tra in thử.
  - [ ] Cắm máy ZKTeco K60 vào mạng LAN và kiểm tra quét thử.
- [ ] **7.3. Hướng dẫn sử dụng & Bàn giao**
  - [ ] Biên soạn tài liệu hướng dẫn sử dụng nhanh dành cho Lễ tân.
  - [ ] Hướng dẫn IT cách sao lưu (backup) cơ sở dữ liệu định kỳ trên server.

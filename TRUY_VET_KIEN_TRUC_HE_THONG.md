# BẢN TRUY VẾT TOÀN BỘ KIẾN TRÚC HỆ THỐNG (Full End-to-End System Trace)
**Hệ thống Kiểm tra & Quản lý Hội viên Sân Golf (Checking Golf Member)**

> Tài liệu này lưu trữ toàn bộ bản đồ truy vết kiến trúc, luồng dữ liệu và quy trình nghiệp vụ được trích xuất từ Knowledge Graph của dự án. Dùng làm cẩm nang đối chiếu trong suốt quá trình phát triển (Dev) và triển khai vận hành (Go-Live).

---

## 1. Sơ Đồ Truy Vết Tổng Thể Hệ Thống

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SƠ ĐỒ TRUY VẾT TỔNG THỂ HỆ THỐNG                                 │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

   [ PHÒNG SERVER ]                       [ MẠNG NỘI BỘ ]                     [ QUẦY LỄ TÂN ]
┌─────────────────────────┐            ┌───────────────────┐            ┌──────────────────────────┐
│  Máy chủ Windows Server │            │                   │            │  Máy trạm PC (Win 10/11) │
│  ┌───────────────────┐  │            │                   │            │  ┌────────────────────┐  │
│  │PostgreSQL Database│◄─┼────────────┼─── Mạng LAN ──────┼────────────┼─►│App Desktop Electron│  │
│  └─────────▲─────────┘  │ (Dữ liệu)  │   (TCP/IP)        │ (Gọi API)  │  └─────────┬──────────┘  │
│  ┌─────────┴─────────┐  │            │                   │            │            │             │
│  │Node.js Express API│◄─┼────────────┘                   │            │            ▼             │
│  └───────────────────┘  │                                │            │  ┌────────────────────┐  │
└─────────────────────────┘                                │            │  │ React 18 + Vite UI │  │
                                                           │            │  │(Kiosk / Lễ tân)    │  │
                                                           │            │  └────────────────────┘  │
                                                           │            │            │             │
                                  ┌────────────────────────┘            │            ▼             │
                                  ▼                                     │  [XPrinter XP-T80Q]      │
                         [ZKTeco K60 Terminal] ─────────────────────────┼─► (Cổng USB - Cắt bill)  │
                         (Socket TCP port 4370)   (Bắn sự kiện Realtime)└──────────────────────────┘
```

---

## 2. Bản Đồ 7 Cụm Cộng Đồng Nghiệp Vụ (Communities)

Dựa trên thuật toán phát hiện cộng đồng của Graphify, toàn bộ hệ thống được chia thành 7 cụm gắn kết:

1. **Cụm 0 - Check-in Flow & Thermal Printing:** Quản lý quy trình check-in vân tay, in bill nhiệt ESC/POS qua máy in XPrinter XP-T80Q, ghi nhận nhật ký vào database.
2. **Cụm 1 - Backend Server & Environments:** Máy chủ Windows Server, PostgreSQL trung tâm, API Express.js, cấu hình 2 môi trường Dev và Go-Live.
3. **Cụm 2 - Member Management & Validation:** Quản lý thông tin hội viên (CRUD), kiểm tra hạn thẻ, chống cho mượn thẻ, công cụ nhập/xuất Excel.
4. **Cụm 3 - Hardware Integration & LAN:** Tầng kết nối phần cứng mạng LAN, giao thức socket TCP port 4370 của ZKTeco K60, thư viện `node-zklib`.
5. **Cụm 4 - Knowledge Graph & Documentation:** Hệ thống tài liệu kiến trúc, báo cáo Graphify và bản đồ trực quan tương tác `graph.html`.
6. **Cụm 5 - UI Modes & Presentation:** Giao diện người dùng React 18 + Vite gồm 2 chế độ: Chế độ Kiosk (hướng về Golfer) và Chế độ Lễ tân (cho nhân viên).
7. **Cụm 6 - Staff Management & Security:** Quản trị tài khoản nhân viên lễ tân, bảo mật và phân quyền vai trò (Admin / Receptionist).

---

## 3. Chi Tiết 5 Đại Trục Luồng Vận Hành Thực Tế

---

### TRỤC 1: Luồng Hạ Tầng & Kết Nối Mạng (Infrastructure & Networking Trace)
*Mục tiêu: Đảm bảo dữ liệu tập trung, các trạm quầy lễ tân không bao giờ bị mất dữ liệu khi hỏng máy.*

* **Khởi điểm:** `Windows Server (Server Room)`
* **Thành phần lưu trữ:** `PostgreSQL Central Database` (Lưu 3 bảng: `users`, `members`, `checkin_logs`).
* **Thành phần trung gian:** `Express.js Backend API Server` chạy service ngầm trên máy chủ, mở cổng nội bộ (ví dụ: `http://192.168.1.100:3000`).
* **Đường truyền:** `Internal LAN Network (TCP/IP)` kết nối các máy tính quầy lễ tân thông qua switch mạng của sân golf.
* **Đích đến:** `Electron Desktop Client (Win 10/11)` trên các máy trạm lễ tân.
* **Đặc tính kỹ thuật cốt lõi:** Nếu máy tính ở quầy 1 gặp sự cố (hỏng ổ cứng, dính nước...), chỉ cần thay máy tính khác, cắm cáp LAN và mở app lên là tiếp tục làm việc bình thường vì 100% dữ liệu nằm an toàn trong phòng server.

---

### TRỤC 2: Luồng Xác Thực Sinh Trắc Học & In Hóa Đơn (Check-in & Printing Trace)
*Mục tiêu: Chống cho mượn thẻ hội viên, tự động hóa 100% quy trình check-in trong vòng 1 giây.*

```
[Golfer ấn ngón tay vào ZKTeco K60]
                │
                ▼ (TCP Socket 4370)
[node-zklib Socket Client]
                │
                ▼ (Bắn Event: Mã hội viên)
[Fingerprint Check-in Engine]
        │                │
        │ (Nhánh 1)      │ (Nhánh 2)
        ▼                ▼
[Card Status Validator] [Thermal Receipt Service]
        │                        │
        ▼ (Hợp lệ)               ▼
[PostgreSQL Database]   [node-thermal-printer]
(Ghi Check-in Log)               │
                                 ▼ (Cáp USB)
                        [XPrinter XP-T80Q] ➔ CẮT GIẤY TỰ ĐỘNG!
```

* **Bước 1:** Golfer đến quầy, đặt ngón tay lên máy **ZKTeco K60**. Máy K60 quét mắt quang học, phát âm thanh: *"Xin cảm ơn"*.
* **Bước 2:** K60 gửi gói tin sự kiện chấm công qua cổng mạng `TCP 4370`. Thư viện **`node-zklib`** trên PC lễ tân bắt được sự kiện ngay lập tức.
* **Bước 3 - Cầu nối điều phối:** **`Fingerprint Check-in Engine`** nhận mã hội viên, kích hoạt bộ kiểm tra **`Card Status Validator`**:
  * **Trường hợp A (Thẻ hết hạn / Bị khóa):** Màn hình lễ tân bật chuông cảnh báo 🚨, hiện thông báo đỏ *"Thẻ hội viên đã hết hạn ngày DD/MM/YYYY. Vui lòng gia hạn!"* ➔ **Khóa luồng, không in bill**.
  * **Trường hợp B (Thẻ hợp lệ):** Cho phép luồng đi tiếp.
* **Bước 4 - Ghi nhận:** Tự động ghi 1 bản ghi vào bảng `checkin_logs` trên PostgreSQL (Thời gian, ID hội viên, trạm lễ tân).
* **Bước 5 - In bill:** Lệnh được chuyển sang **`Thermal Receipt Service`** ➔ biên dịch thành tập lệnh ESC/POS ➔ truyền qua cổng USB đến máy in **`XPrinter XP-T80Q`** ➔ Giấy in ra và dao cắt tự động xoẹt 1 cái chưa đầy 1 giây!

---

### TRỤC 3: Luồng Quản Lý Hội Viên & Nhập Liệu Excel (Member Lifecycle Trace)
*Mục tiêu: Di chuyển dữ liệu cũ lên hệ thống mới và đăng ký vân tay lần đầu.*

* **Bước 1 (Import dữ liệu cũ):** File Excel danh sách hội viên cũ được tải lên qua **`Excel/CSV Migration Engine`**. Hệ thống lọc trùng mã thẻ, chuẩn hóa họ tên, số điện thoại, hạn thẻ rồi nạp vào bảng `members` trên PostgreSQL.
* **Bước 2 (Trạng thái ban đầu):** Hội viên có hồ sơ nhưng mang trạng thái `fingerprint_registered = false` (chưa có vân tay).
* **Bước 3 (Lấy vân tay lần đầu):** Khi golfer đến chơi:
  * Lễ tân tìm tên hoặc số điện thoại trên giao diện React.
  * Màn hình nhắc nhở: *"Chưa có dữ liệu vân tay"*.
  * Lễ tân bấm **[Lấy vân tay]** ➔ App gửi lệnh qua `node-zklib` sang máy K60.
  * Golfer đặt ngón tay 3 lần trên K60 ➔ Đăng ký hoàn tất.
  * Database cập nhật `fingerprint_registered = true`. Từ lần sau trở đi, golfer tự quét ngón tay check-in không cần qua thao tác thủ công của lễ tân nữa.

---

### TRỤC 4: Luồng Bảo Mật & Phân Quyền Nhân Viên (RBAC Security Trace)
*Mục tiêu: Đảm bảo nhân viên lễ tân không thể can thiệp sửa đổi hạn thẻ hay xem báo cáo tài chính của sân.*

* **Thực thể quản trị:** `System User Model` (Bảng `users` trên PostgreSQL).
* **Thành phần phân quyền:** `Staff & RBAC Management Module`:
  * **Tài khoản Lễ tân (`role = 'receptionist'`):**
    * Chỉ được vào màn hình **Check-in** và xem lịch sử check-in trong ca làm việc của mình.
    * ❌ Không có quyền xóa hội viên, không sửa ngày hết hạn thẻ, không tạo tài khoản nhân viên khác.
  * **Tài khoản Quản lý (`role = 'admin'`):**
    * Toàn quyền CRUD hội viên, gia hạn thẻ, xuất file Excel, tạo/xóa tài khoản lễ tân, đổi mật khẩu, xem báo cáo tổng quan.
* **Chế độ hiển thị giao diện:**
  * **`Kiosk Self-Service Mode`:** Giao diện toàn màn hình sang trọng hướng về phía golfer, hiển thị lời chào mừng, trạng thái quét tay.
  * **`Receptionist Counter Mode`:** Giao diện nghiệp vụ đầy đủ chi tiết danh sách hội viên, tìm kiếm nhanh và nút thao tác xử lý cho nhân viên.

---

### TRỤC 5: Luồng Báo Cáo & Thống Kê Giám Sát (Audit & History Trace)
*Mục tiêu: Giúp ban giám đốc sân golf nắm bắt lưu lượng khách và phát hiện các trường hợp bất thường.*

* **Thành phần:** `Check-in History & Analytics`.
* **Nguồn dữ liệu:** Đọc liên tục từ `Check-in Log Model`.
* **Khả năng cung cấp:**
  - Thống kê số lượt khách check-in theo từng khung giờ trong ngày (đỉnh điểm giờ nào).
  - Lọc danh sách theo ngày/tuần/tháng hoặc theo từng hạng thẻ (VIP Diamond, Gold, Standard).
  - Xuất báo cáo ra file Excel chỉ với 1 click chuột.
  - Cảnh báo các trường hợp nghi vấn (ví dụ cùng 1 mã thẻ quét liên tiếp ở 2 cổng trong vài phút).

---

## 4. Bảng Tổng Kết Đánh Giá Độ Hoàn Thiện Của Đồ Thị

| Hạng mục kiểm tra | Trạng thái trên Graph | Kết luận kỹ thuật |
| :--- | :---: | :--- |
| **Tính liên tục của luồng phần cứng** | 🟢 Đầy đủ 100% | K60 (LAN TCP/IP) ➔ node-zklib ➔ Engine ➔ XPrinter XP-T80Q (USB) không bị ngắt quãng. |
| **Tính bảo toàn dữ liệu** | 🟢 Đầy đủ 100% | Toàn bộ dữ liệu hội viên và lịch sử đều có đường dẫn trực tiếp về PostgreSQL máy chủ phòng server. |
| **Xử lý ngoại lệ (Thẻ hết hạn/mượn thẻ)** | 🟢 Đầy đủ 100% | Card Status Validator chặn trực tiếp trước khi lệnh in được kích hoạt. |
| **Tách biệt môi trường Dev & Go-live** | 🟢 Đầy đủ 100% | Môi trường Dev dùng SQLite + giả lập thiết bị; Go-live chuyển sang Postgres + thiết bị thật. |
| **Hệ điều hành máy trạm** | 🟢 Đầy đủ 100% | Hỗ trợ Windows 10 (cả bản 32-bit và 64-bit) lẫn Windows 11. |

---

## 5. Nhật Ký Quyết Định Kiến Trúc (Architecture Decisions Memory)

### 5.1. Khả năng tương thích và linh hoạt thiết bị (Hardware Flexibility)
* **Máy in hóa đơn (Receipt Printer):** Hệ thống dùng chuẩn **ESC/POS** (qua thư viện `node-thermal-printer`). Tương thích ~95% các loại máy in nhiệt khổ 80mm trên thị trường (Epson, Bixolon, XPrinter...). Đổi máy in rất dễ dàng (Plug & Play).
* **Máy quét vân tay (Biometric):**
  * **Cùng hãng ZKTeco (chuẩn TCP/IP 4370):** Tương thích 100% nhờ giao thức mạng chung.
  * **Khác hãng (hoặc chuyển sang đầu đọc vân tay cắm USB):** Đòi hỏi thay đổi lớn về kiến trúc. Phải xây dựng "Hardware Abstraction Layer" (Adapter Pattern), nhúng C++ SDK của hãng mới, và tự tải hệ thống so khớp vân tay (1:N Matching) trực tiếp trên máy PC lễ tân.
* **Quyết định (Ngày 23/09/2026):** Chốt giữ nguyên phương án dùng **Máy chấm công ZKTeco K60 (LAN TCP/IP)** vì độ ổn định cực cao, thiết bị tự xử lý phần nặng (matching vân tay), phần mềm PC được giảm tải (chỉ nghe kết quả), và tránh được rủi ro xung đột thư viện SDK khi cài trên các bản Windows 32/64-bit khác nhau.

### 5.2. Cơ chế kết nối: Real-time Event Hook (TCP Socket vs Polling)
* **Không dùng Polling (Hỏi vòng):** Phần mềm không gửi lệnh hỏi thiết bị liên tục định kỳ (cách này gây trễ dữ liệu và hao tốn tài nguyên máy tính).
* **Dùng Real-time Socket Listening ("Nhận cuộc gọi"):** Phần mềm mở một kết nối TCP Socket tới thiết bị và "ngủ" ở chế độ chờ (CPU 0%). Khi khách quét vân tay, K60 tự đẩy (Push) một gói tin sự kiện qua mạng LAN. Hệ điều hành Windows lập tức đánh thức phần mềm để xử lý. Tổng thời gian xử lý (quét vân tay ➔ tra cứu DB ➔ hiển thị màn hình ➔ nhả lệnh in) chỉ mất **< 50 mili-giây**.

### 5.3. Logic kiểm tra thẻ hết hạn (Phân tách trách nhiệm)
* Máy vân tay ZKTeco **không** lưu ngày hết hạn hay tên người. Nó chỉ lưu: **Mẫu vân tay** và **ID (VD: 1234)**.
* Khi quét, ZKTeco chỉ gửi `ID 1234` về phần mềm. Toàn bộ logic tra cứu tên (Mr. Minh), hạng thẻ (Diamond), ngày hết hạn, cấp tủ Locker... đều diễn ra tại **Database của phần mềm (PostgreSQL/SQLite)**.
* Nhờ thiết kế này, luật Business Logic (Ví dụ: Thẻ còn 5 ngày hiện cảnh báo vàng) hoàn toàn linh hoạt, muốn sửa luật chỉ cần sửa code phần mềm, không bao giờ phải chạm vào cấu hình máy phần cứng.

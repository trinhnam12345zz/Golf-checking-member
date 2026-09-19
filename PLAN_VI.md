# Kế Hoạch Triển Khai: Hệ Thống Check-in Hội Viên Golf Bằng Vân Tay

## 1. Tổng Quan Dự Án

**Mục tiêu:** Xây dựng ứng dụng chạy trên máy tính bàn Windows, dùng để xác thực hội viên sân golf bằng **quét vân tay** nhằm ngăn chặn việc cho mượn thẻ hội viên. Sau khi xác thực thành công, hệ thống tự động **in phiếu xác nhận (bill)** qua máy in nhiệt.

**Bài toán cần giải quyết:** Hiện tại, hệ thống check-in bằng thẻ cho phép hội viên đưa thẻ cho người khác dùng. Vân tay là dữ liệu sinh trắc học gắn liền với từng người, đảm bảo chỉ đúng chủ thẻ mới check-in được.

---

## 2. Công Nghệ Sử Dụng & Lý Do Lựa Chọn

### 2.1. Tại sao dùng Electron + React?

Bài toán của chúng ta **bắt buộc** phải giao tiếp với 2 thiết bị phần cứng USB:
1. **Máy quét vân tay** — nhận dữ liệu sinh trắc từ cảm biến USB.
2. **Máy in nhiệt** — gửi lệnh in bill qua cổng USB.

Trình duyệt web thông thường (Chrome, Edge...) **KHÔNG THỂ** truy cập các thiết bị USB này. Vì vậy, chúng ta cần một công nghệ có thể:
- ✅ Tạo giao diện đẹp, hiện đại (giống trang web).
- ✅ Đồng thời truy cập trực tiếp thiết bị USB (máy quét vân tay, máy in).
- ✅ Chạy trên Windows PC mà không cần cài đặt phức tạp.

👉 **Electron** là framework duy nhất đáp ứng đủ cả 3 yêu cầu này:
- Bên ngoài: Giao diện được xây bằng HTML/CSS/React — đẹp và linh hoạt như một trang web sang trọng.
- Bên trong: Chạy Node.js — có toàn quyền truy cập phần cứng USB, đọc/ghi database, giao tiếp mạng LAN.

### 2.2. Bảng tóm tắt công nghệ

| Tầng | Công nghệ | Vai trò |
| :--- | :--- | :--- |
| **Giao diện** | React 18 + Vite | Các màn hình ứng dụng (check-in, quản lý hội viên, báo cáo), hỗ trợ 2 chế độ (Kiosk / Lễ tân) |
| **Vỏ ứng dụng** | Electron 30+ | Đóng gói thành file `.exe` cài trên Windows, truy cập USB |
| **Máy chủ API** | Express.js (Node.js) | Xử lý logic nghiệp vụ: đăng ký hội viên, xác thực vân tay, ghi nhật ký check-in, xuất báo cáo. Chạy trên máy chủ trong phòng server |
| **Cơ sở dữ liệu** | PostgreSQL | Lưu trữ toàn bộ dữ liệu hội viên, mẫu vân tay, lịch sử check-in. Đặt trên máy chủ phòng server |
| **Quét vân tay** | SDK của DigitalPersona / SecuGen | Thu nhận, đăng ký và đối chiếu vân tay |
| **In bill** | Thư viện `node-thermal-printer` hoặc `escpos` | Định dạng và gửi lệnh in đến máy in nhiệt Epson TM-T82 hoặc tương đương |

### 2.3. Tư vấn thiết bị: Máy quét vân tay

Bạn chưa có máy quét vân tay. Dưới đây là 3 lựa chọn phổ biến:

| Thiết bị | Giá (VNĐ) | Hỗ trợ SDK | Ưu điểm |
| :--- | :--- | :--- | :--- |
| **✅ DigitalPersona U.are.U 4500** (Khuyên dùng) | ~2 - 3 triệu | Windows SDK + Node.js wrapper | Chuẩn công nghiệp, độ chính xác cao, dùng phổ biến trong ngân hàng và doanh nghiệp Việt Nam |
| SecuGen Hamster Pro 20 | ~1.5 - 2.5 triệu | Windows SDK + Node bindings | Chính xác tốt, nhỏ gọn, giá phải chăng |
| ZKTeco ZK4500 | ~1.2 - 1.8 triệu | Windows SDK | Rẻ nhất, đủ dùng cho nhu cầu cơ bản |

> 💡 **Khuyến nghị:** Nên chọn **DigitalPersona U.are.U 4500** vì SDK trưởng thành nhất, cộng đồng hỗ trợ đông nhất, và được dùng rộng rãi trong hệ thống sinh trắc học doanh nghiệp tại Việt Nam. Chỉ cần cắm USB vào PC là ứng dụng nhận diện tự động.

---

## 3. Kiến Trúc Hệ Thống

Công ty đã có **phòng server chạy Windows Server**. Toàn bộ cơ sở dữ liệu và máy chủ API sẽ được đặt tập trung tại đây. Các máy tính quầy lễ tân kết nối vào qua mạng LAN nội bộ.

```
┌──────────── PHÒNG SERVER ────────────────┐
│                                          │
│   Máy chủ Windows Server                 │
│   ┌────────────────────────────────┐     │
│   │  PostgreSQL Database           │     │  ← Toàn bộ dữ liệu hội viên
│   │  (hội viên, vân tay, nhật ký)  │     │     + mẫu vân tay + lịch sử
│   ├────────────────────────────────┤     │     check-in lưu TẬP TRUNG
│   │  Node.js API Server           │     │     tại đây
│   │  (xử lý logic nghiệp vụ)     │     │
│   └──────────────┬─────────────────┘     │
│                  │                       │
└──────────────────┼───────────────────────┘
                   │ Mạng LAN nội bộ
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼────┐ ┌───▼────┐ ┌───▼────┐
   │  PC #1  │ │ PC #2  │ │ PC #3  │
   │ Quầy 1  │ │ Quầy 2 │ │Quản lý │
   │         │ │        │ │        │
   │ App     │ │ App    │ │ App    │
   │Electron │ │Electron│ │Electron│
   │         │ │        │ │        │
   │[Vân tay]│ │[Vân tay│ │        │
   │[Máy in] │ │[Máy in]│ │        │
   └─────────┘ └────────┘ └────────┘
```

### Cách hoạt động:
- **Máy chủ (Phòng server):** Chạy PostgreSQL + Node.js API 24/7. Lưu trữ toàn bộ dữ liệu. Bộ phận IT quản lý sao lưu định kỳ.
- **Các PC quầy lễ tân:** Chỉ chạy ứng dụng Electron (giao diện). Kết nối vào máy chủ qua mạng LAN để đọc/ghi dữ liệu. Mỗi PC gắn máy quét vân tay USB và máy in nhiệt riêng.
- **PC Quản lý:** Cùng ứng dụng Electron nhưng đăng nhập bằng tài khoản Admin. Không cần phần cứng — dùng để quản lý hội viên, xem báo cáo, xuất dữ liệu.

> 💡 **Lợi ích:** Nếu PC quầy lễ tân bị hỏng, chỉ cần thay máy mới và cài app — toàn bộ dữ liệu an toàn trên server. Bộ phận IT cũng có thể lên lịch sao lưu tự động cho PostgreSQL.

---

## 4. Phân Chia Tính Năng Theo Giai Đoạn

### Giai đoạn 1: Luồng Check-in Cốt Lõi (Sản phẩm tối thiểu khả dụng - MVP)
> Mức ưu tiên: 🔴 Bắt buộc phải có

- [ ] Tích hợp máy quét vân tay (thu nhận, đăng ký, đối chiếu)
- [ ] Check-in hội viên bằng xác thực vân tay
- [ ] Đăng ký hội viên mới kèm lấy mẫu vân tay
- [ ] Màn hình kết quả check-in (thành công / thất bại / thẻ hết hạn)
- [ ] Chặn check-in nếu thẻ hết hạn → hiển thị cảnh báo cho lễ tân & hội viên
- [ ] In phiếu xác nhận (bill) qua máy in nhiệt
- [ ] Quản lý hội viên cơ bản (Thêm, Sửa, Xóa)
- [ ] Tìm kiếm hội viên (theo tên, mã thẻ, số điện thoại)
- [ ] Màn hình đăng nhập phân quyền (Admin / Lễ tân)
- [ ] Quản lý tài khoản nhân viên — Chỉ Admin (Thêm, Sửa, Xóa tài khoản lễ tân, đặt lại mật khẩu, khóa/mở khóa tài khoản)

### Giai đoạn 2: Quản Lý Dữ Liệu & Nhập Liệu
> Mức ưu tiên: 🟡 Quan trọng

- [ ] Import hội viên hàng loạt từ file Excel/CSV
- [ ] Gia hạn thẻ hội viên (gia hạn ngày hết hạn, cộng thêm lượt chơi)
- [ ] Nhật ký lịch sử check-in theo từng hội viên
- [ ] Chuyển đổi giao diện 2 chế độ (Kiosk cho hội viên tự phục vụ / Lễ tân thao tác)

### Giai đoạn 3: Báo Cáo & Xuất Dữ Liệu
> Mức ưu tiên: 🟢 Nên có

- [ ] Bảng điều khiển tổng quan (Dashboard): số lượt check-in theo ngày/tháng, số hội viên hoạt động / hết hạn
- [ ] Danh sách cảnh báo hội viên sắp hết hạn thẻ
- [ ] Xuất lịch sử check-in ra file Excel/PDF
- [ ] Xuất danh sách hội viên ra file Excel/PDF

---

## 5. Cấu Trúc Cơ Sở Dữ Liệu

### Bảng `users` (Tài khoản đăng nhập hệ thống — Admin & Lễ tân)

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| id | SỐ NGUYÊN | Khóa chính, tự tăng |
| username | CHỮ | Tên đăng nhập (duy nhất) |
| password_hash | CHỮ | Mật khẩu đã mã hóa (bcrypt) |
| full_name | CHỮ | Tên hiển thị |
| role | CHỮ | `admin` hoặc `receptionist` (lễ tân) |
| created_at | NGÀY GIỜ | Ngày tạo tài khoản |

### Bảng `members` (Hội viên sân Golf)

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| id | SỐ NGUYÊN | Khóa chính, tự tăng |
| member_code | CHỮ | Mã hội viên (VD: GM-0001), duy nhất |
| full_name | CHỮ | Họ và tên |
| gender | CHỮ | Nam / Nữ |
| phone | CHỮ | Số điện thoại |
| email | CHỮ | Email (không bắt buộc) |
| date_of_birth | NGÀY | Ngày sinh |
| id_card | CHỮ | Số CCCD / Hộ chiếu |
| membership_tier | CHỮ | Hạng thẻ: VIP / Gold / Platinum / Diamond / Standard |
| status | CHỮ | `active` (hoạt động), `expired` (hết hạn), `suspended` (tạm ngưng) |
| start_date | NGÀY | Ngày bắt đầu thẻ hội viên |
| expiry_date | NGÀY | Ngày hết hạn thẻ |
| remaining_rounds | SỐ NGUYÊN | Số lượt chơi còn lại (nếu có giới hạn) |
| photo_path | CHỮ | Đường dẫn ảnh chân dung hội viên |
| fingerprint_template | DỮ LIỆU NHỊ PHÂN | Mẫu vân tay đã mã hóa |
| fingerprint_registered | ĐÚNG/SAI | Đã đăng ký vân tay chưa |
| notes | CHỮ | Ghi chú thêm |
| created_at | NGÀY GIỜ | Ngày tạo hồ sơ |
| updated_at | NGÀY GIỜ | Ngày cập nhật gần nhất |

### Bảng `checkin_logs` (Nhật ký lịch sử Check-in)

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| id | SỐ NGUYÊN | Khóa chính, tự tăng |
| member_id | SỐ NGUYÊN | Liên kết tới bảng members |
| checkin_time | NGÀY GIỜ | Thời điểm check-in chính xác |
| station_name | CHỮ | Check-in tại quầy nào (Quầy 1, Quầy 2...) |
| verified_by | CHỮ | Phương thức xác thực: Vân tay / Xác nhận thủ công |
| operator_id | SỐ NGUYÊN | Lễ tân nào đang trực (liên kết bảng users) |
| bill_printed | ĐÚNG/SAI | Đã in bill thành công chưa |
| notes | CHỮ | Ghi chú đặc biệt |

---

## 6. Mô Tả Các Màn Hình Giao Diện

### 6.1. Màn hình Đăng nhập
- Ô nhập Tên đăng nhập + Mật khẩu.
- Sau khi đăng nhập hiển thị vai trò (nhãn Admin / nhãn Lễ tân).

### 6.2. Màn hình Check-in (Màn hình chính)
- **Vùng quét vân tay lớn** với hiệu ứng hoạt hình (biểu tượng dấu vân tay nhấp nháy).
- Dòng hướng dẫn: "Vui lòng đặt ngón tay lên máy quét" / "Place your finger on the scanner".
- Sau khi quét xong:
  - **Thành công:** Hiển thị ảnh, tên, hạng thẻ, trạng thái hội viên → Nền xanh lá → Tự động in bill → Màn hình tự đặt lại sau 5 giây.
  - **Thẻ hết hạn:** Cảnh báo đỏ → "Thẻ hội viên đã hết hạn. Vui lòng liên hệ quầy lễ tân để gia hạn" → **CHẶN** check-in.
  - **Không nhận diện được:** "Vân tay chưa được đăng ký" → Hiện lựa chọn đăng ký hội viên mới.
- **Nút chuyển chế độ:** Bấm để chuyển giữa Kiosk (chữ to, hội viên tự nhìn) và Lễ tân (giao diện gọn, nhân viên thao tác).

### 6.3. Màn hình Quản lý Hội viên (Chỉ Admin)
- Bảng danh sách hội viên có ô tìm kiếm nhanh.
- Nút Thêm mới / Sửa / Xóa hội viên.
- Nút "Đăng ký vân tay" (mở quy trình quét vân tay cho hội viên đó).
- Form gia hạn thẻ.
- Nút Import từ Excel/CSV.

### 6.4. Màn hình Lịch sử Check-in
- Bảng lọc được theo khoảng ngày, theo hội viên, theo quầy.
- Nút xuất ra Excel / PDF.

### 6.5. Màn hình Quản lý Nhân viên (Chỉ Admin)
- Bảng danh sách tài khoản nhân viên (tên đăng nhập, họ tên, vai trò, trạng thái).
- Nút Thêm mới tài khoản lễ tân (nhập tên đăng nhập, mật khẩu mặc định, họ tên, vai trò).
- Nút Sửa thông tin / Đổi vai trò.
- Nút Đặt lại mật khẩu (Admin đặt mật khẩu mới cho nhân viên quên mật khẩu).
- Nút Khóa / Mở khóa tài khoản (nhân viên nghỉ việc thì khóa, không cần xóa để giữ lịch sử).
- Xem nhật ký hoạt động của từng nhân viên (ai check-in cho hội viên nào, lúc nào).

### 6.6. Bảng điều khiển tổng quan - Dashboard (Chỉ Admin)
- Số lượt check-in hôm nay.
- Số hội viên đang hoạt động / đã hết hạn.
- Danh sách hội viên sắp hết hạn trong vòng 30 ngày.
- Biểu đồ xu hướng check-in theo tháng.

---

## 7. Mẫu Bill In Nhiệt (Tạm thời — Bạn sẽ cung cấp mẫu chính thức sau)

```
================================
    [TÊN SÂN GOLF]
    Phiếu Xác Nhận Check-in
================================
Hội viên:   [Họ và Tên]
Mã thẻ:     [GM-XXXX]
Hạng:       [Diamond VIP]
Trạng thái: [ĐANG HOẠT ĐỘNG ✓]
--------------------------------
Check-in:   [19/09/2026 12:30]
Quầy:       [Quầy 1]
Xác thực:   [Vân tay ✓]
================================
  Cảm ơn quý khách! Chúc quý
  khách có trải nghiệm tuyệt vời!
================================
```

---

## 8. Rủi Ro & Cách Xử Lý

| Rủi ro | Mức ảnh hưởng | Cách xử lý |
| :--- | :--- | :--- |
| SDK máy quét vân tay không tương thích với Node.js | Có thể chặn toàn bộ dự án | Nghiên cứu và thử nghiệm SDK **TRƯỚC KHI** mua thiết bị. Làm prototype quét vân tay trước tiên |
| Ngón tay bị ướt / bẩn, máy quét không nhận | Hội viên bực bội | Cho phép Admin xác nhận thủ công (nhập mã thẻ + lễ tân bấm xác nhận) như phương án dự phòng |
| Mất điện đột ngột, cơ sở dữ liệu bị hỏng | Mất dữ liệu | PostgreSQL có cơ chế WAL (Write-Ahead Logging) chống hỏng dữ liệu + IT lên lịch sao lưu tự động hàng ngày |
| Mạng LAN giữa PC và server bị đứt | Không check-in được | Thiết kế chế độ Offline tạm thời: lưu cache trên PC, đồng bộ lại khi mạng phục hồi |

---

## 9. Kế Hoạch Kiểm Thử

### Kiểm thử Giai đoạn 1:
1. **Kiểm tra máy quét vân tay:** Kết nối → Quét vân tay → Đối chiếu → In kết quả lên màn hình.
2. **Kiểm tra luồng check-in:** Đăng ký hội viên thử → Lấy mẫu vân tay → Check-in → Xác nhận bill in đúng.
3. **Kiểm tra thẻ hết hạn:** Đặt ngày hết hạn của hội viên thử thành ngày hôm qua → Thử check-in → Xác nhận hệ thống chặn + hiện cảnh báo.
4. **Kiểm tra phân quyền:** Đăng nhập Admin → Xác nhận thấy đầy đủ chức năng. Đăng nhập Lễ tân → Xác nhận các mục quản lý bị ẩn.

### Kiểm thử Giai đoạn 2 - 3:
1. **Kiểm tra Import:** Chuẩn bị file Excel 50 hội viên → Import → Xác nhận toàn bộ dữ liệu tạo đúng.
2. **Kiểm tra lịch sử:** Thực hiện 10 lượt check-in → Xuất ra Excel → Đối chiếu dữ liệu chính xác.
3. **Kiểm tra đa quầy:** Cài app trên 2 PC → Check-in trên PC #1 → Xác nhận lịch sử hiển thị trên PC #2.

---

## 10. Môi Trường Triển Khai: Dev vs Go Live

### 10.1. Môi trường DEV (Phát triển & Kiểm thử)

> 🎯 **Mục tiêu:** Lập trình viên (chúng ta) code và test trên chính máy tính của mình, **KHÔNG CẦN** phòng server, **KHÔNG CẦN** máy quét vân tay thật, **KHÔNG CẦN** máy in thật.

```
┌─────── MÁY TÍNH CỦA LẬP TRÌNH VIÊN ───────┐
│                                              │
│   ┌────────────────────────────────────┐     │
│   │  SQLite (thay cho PostgreSQL)      │     │  ← Database nhẹ, không cần
│   │  File database ngay trên máy       │     │     cài đặt server
│   ├────────────────────────────────────┤     │
│   │  Node.js API Server (Express)      │     │  ← Chạy trên localhost:3001
│   ├────────────────────────────────────┤     │
│   │  Electron App (chế độ dev)         │     │  ← Chạy trên localhost:5173
│   │  Tự động reload khi sửa code      │     │     (hot reload)
│   └────────────────────────────────────┘     │
│                                              │
│   [Vân tay GIẢ LẬP]  [Máy in GIẢ LẬP]      │  ← Phần cứng được mô phỏng
│                                              │     bằng phần mềm
└──────────────────────────────────────────────┘
```

#### Cách triển khai Dev cụ thể:

| Hạng mục | Cách làm ở Dev | Giải thích |
| :--- | :--- | :--- |
| **Database** | Dùng **SQLite** (file database trên máy) | Không cần cài PostgreSQL server. Chỉ cần 1 file `.db` là có database đầy đủ. Cấu trúc bảng giống hệt Production |
| **API Server** | Chạy `npm run dev:server` → localhost:3001 | Server chạy ngay trên máy lập trình viên |
| **Giao diện** | Chạy `npm run dev` → localhost:5173 | Electron mở lên với hot reload — sửa code, lưu file là giao diện tự cập nhật |
| **Máy quét vân tay** | **Chế độ giả lập (Mock Mode)** | Thay vì quét vân tay thật, hệ thống hiện nút "Giả lập quét thành công" / "Giả lập quét thất bại" để test các luồng |
| **Máy in bill** | **In ra file PDF / Console log** | Thay vì in giấy thật, bill được xuất ra file PDF hoặc hiển thị nội dung bill trên màn hình để kiểm tra |
| **Dữ liệu** | **Dữ liệu mẫu (Seed Data)** | Tự động tạo 20-50 hội viên giả (tên, mã thẻ, hạng...) để có dữ liệu test ngay khi khởi động |
| **Tài khoản** | Admin mặc định: `admin / admin123` | Tài khoản test có sẵn, không cần đăng ký |

#### Lệnh khởi động Dev:

```bash
# Bước 1: Cài đặt thư viện (chỉ chạy lần đầu)
npm install

# Bước 2: Tạo database + dữ liệu mẫu (chỉ chạy lần đầu)
npm run db:seed

# Bước 3: Chạy ứng dụng ở chế độ Dev
npm run dev
```

> 💡 **Tóm lại:** Ở Dev, chúng ta code và test 100% trên máy cá nhân mà không cần bất kỳ thiết bị phần cứng hay server nào. Mọi thứ được giả lập.

---

### 10.2. Môi trường GO LIVE (Triển khai thực tế tại sân Golf)

> 🎯 **Mục tiêu:** Cài đặt hệ thống hoàn chỉnh với phần cứng thật, database thật, trên hạ tầng thật của công ty.

```
┌──────── PHÒNG SERVER (CÔNG TY) ─────────┐
│                                          │
│   Windows Server                         │
│   ┌────────────────────────────────┐     │
│   │  PostgreSQL (Production DB)    │     │  ← Database chính thức
│   │  + Sao lưu tự động hàng ngày  │     │     với sao lưu định kỳ
│   ├────────────────────────────────┤     │
│   │  Node.js API Server           │     │  ← Chạy 24/7 như Windows
│   │  (chạy như Windows Service)    │     │     Service, tự khởi động
│   └──────────────┬─────────────────┘     │     lại khi server reboot
│                  │                       │
└──────────────────┼───────────────────────┘
                   │ Mạng LAN
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼────┐ ┌───▼────┐ ┌───▼────┐
   │  PC #1  │ │ PC #2  │ │ PC #3  │
   │         │ │        │ │        │
   │ Cài file│ │ Cài file│ │Cài file│
   │ .exe    │ │ .exe    │ │ .exe   │
   │         │ │         │ │        │
   │[Vân tay │ │[Vân tay │ │        │
   │  THẬT]  │ │  THẬT]  │ │        │
   │[Máy in  │ │[Máy in  │ │        │
   │  THẬT]  │ │  THẬT]  │ │        │
   └─────────┘ └─────────┘ └────────┘
```

#### Quy trình Go Live từng bước:

##### Bước 1: Chuẩn bị Server (IT thực hiện, 1 lần duy nhất)
| Việc cần làm | Chi tiết |
| :--- | :--- |
| Cài PostgreSQL lên server | Tải từ postgresql.org, cài bản Windows, tạo database `golf_checkin` |
| Cài Node.js lên server | Tải từ nodejs.org, cài bản LTS |
| Deploy API Server | Copy thư mục server lên server, chạy `npm install --production`, cấu hình kết nối database |
| Cài PM2 hoặc Windows Service | Đảm bảo API tự khởi động lại khi server reboot |
| Cấu hình Firewall | Mở port API (VD: 3001) cho các PC trong mạng LAN truy cập |
| Thiết lập sao lưu tự động | Lên lịch `pg_dump` sao lưu database hàng ngày vào ổ cứng dự phòng |

##### Bước 2: Đóng gói ứng dụng Electron thành file .exe
```bash
# Chạy trên máy lập trình viên
npm run build           # Build giao diện React
npm run package         # Đóng gói thành file .exe (dùng electron-builder)
```
→ Kết quả: Được 1 file `GolfCheckin-Setup.exe` (~80-120MB), copy vào USB để cài lên các PC.

##### Bước 3: Cài đặt trên các PC quầy lễ tân
| Việc cần làm | Chi tiết |
| :--- | :--- |
| Cài `GolfCheckin-Setup.exe` | Chạy file setup, cài như phần mềm Windows bình thường |
| Cắm máy quét vân tay USB | Cắm vào cổng USB → Windows tự nhận driver → App tự phát hiện |
| Kết nối máy in nhiệt | Cắm USB hoặc cổng COM → Cài driver máy in → Chọn máy in trong cài đặt app |
| Cấu hình kết nối server | Mở app → Cài đặt → Nhập địa chỉ IP server (VD: `192.168.1.100:3001`) |
| Đăng nhập | Dùng tài khoản Admin hoặc Lễ tân do Admin đã tạo |

##### Bước 4: Import dữ liệu hội viên
| Việc cần làm | Chi tiết |
| :--- | :--- |
| Xuất danh sách hội viên từ hệ thống cũ | Lấy file Excel/CSV từ phần mềm quản lý hiện tại |
| Import vào hệ thống mới | Admin → Quản lý hội viên → Import Excel/CSV |
| Lấy mẫu vân tay từng hội viên | Khi hội viên đến check-in lần đầu, yêu cầu đăng ký vân tay |

##### Bước 5: Đào tạo nhân viên
| Đối tượng | Nội dung đào tạo |
| :--- | :--- |
| **Lễ tân** | Cách đăng nhập, hướng dẫn hội viên quét vân tay, xử lý khi quét lỗi, đăng ký vân tay cho hội viên mới |
| **Admin / Quản lý** | Quản lý hội viên, quản lý nhân viên, xem báo cáo, gia hạn thẻ, import dữ liệu, xuất Excel/PDF |
| **IT** | Khởi động/tắt server, sao lưu database, xử lý sự cố mạng, cập nhật phần mềm |

---

### 10.3. Bảng So Sánh Tổng Hợp: Dev vs Go Live

| Hạng mục | 🧑‍💻 Dev (Phát triển) | 🚀 Go Live (Vận hành thật) |
| :--- | :--- | :--- |
| **Database** | SQLite (file trên máy) | PostgreSQL (trên server công ty) |
| **API Server** | localhost trên máy dev | Chạy 24/7 trên Windows Server |
| **Ứng dụng** | `npm run dev` (hot reload) | File `.exe` cài đặt trên mỗi PC |
| **Máy quét vân tay** | Giả lập bằng nút bấm | Thiết bị USB thật (DigitalPersona) |
| **Máy in bill** | In ra PDF / log console | Máy in nhiệt thật (Epson TM-T82) |
| **Dữ liệu** | 20-50 hội viên mẫu (giả) | Dữ liệu hội viên thật từ hệ thống cũ |
| **Tài khoản** | admin / admin123 | Tài khoản Admin thật + tài khoản lễ tân cho từng nhân viên |
| **Mạng** | Không cần (localhost) | Mạng LAN nội bộ công ty |
| **Sao lưu** | Không cần | Tự động sao lưu hàng ngày |
| **Ai sử dụng** | Chỉ lập trình viên | Lễ tân, Admin, Hội viên |

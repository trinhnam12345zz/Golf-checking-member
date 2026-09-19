# 📘 Hướng Dẫn Sử Dụng Graphify & Agent Skill (Dễ Hiểu Từ A - Z)

Tài liệu này giải thích chi tiết, dễ hiểu về **Graphify** và cách bạn có thể tận dụng **Agent Skill** để quản lý, kiểm soát và phát triển dự án **Checking Golf Member**.

---

## 1. Graphify là gì? (Hình dung thực tế)

Hãy tưởng tượng dự án phần mềm của bạn giống như một **thành phố**:
- Các tệp mã nguồn (`.js`, `.py`, `.html`,...), tài liệu (`.md`, `.pdf`), database là các **tòa nhà**.
- Các lời gọi hàm (`function calls`), import, kế thừa là các **con đường nối giữa các tòa nhà**.

Bình thường, AI khi vào một dự án mới giống như một **người mù đường**:
- Mỗi lần bạn hỏi một câu, AI phải đọc từng file từ đầu đến cuối (rất chậm và tốn token).
- Khi sửa một file, AI rất dễ "quên" rằng con đường này đang dẫn tới 5 tòa nhà khác, dẫn đến sửa chỗ này làm gãy chỗ kia.

👉 **Graphify chính là "Bản đồ vệ tinh Google Maps" cho dự án:**
Nó quét toàn bộ mã nguồn và tài liệu của bạn, sau đó vẽ ra một **Mạng lưới tri thức (Knowledge Graph)** hoàn chỉnh. Từ đó, AI luôn biết rõ mọi ngóc ngách trong dự án trước khi đụng vào code.

---

## 2. Các sản phẩm Graphify tạo ra (Nằm trong thư mục `graphify-out/`)

Mỗi khi bạn chạy Graphify, nó sẽ tự động tạo ra một thư mục `graphify-out/` chứa:

| Tệp / Thư mục | Ý nghĩa & Cách bạn dùng |
| :--- | :--- |
| **`graph.html`** | **Bản đồ tương tác trực quan:** Bạn chỉ cần nhấp đúp mở bằng trình duyệt (Chrome, Edge). Bạn có thể bấm vào từng nút, kéo thả, phóng to thu nhỏ và thấy các file liên kết với nhau bằng màu sắc trực quan. |
| **`GRAPH_REPORT.md`** | **Báo cáo kiến trúc tóm tắt:** Chỉ ra những "God Nodes" (các file/hàm quan trọng nhất đang gánh toàn bộ dự án), cảnh báo những mối quan hệ bất thường, và gợi ý các câu hỏi kiến trúc nên xem xét. |
| **`graph.json`** | **Dữ liệu cho AI tra cứu:** Lưu trữ dạng GraphRAG. AI sẽ đọc tệp này để trả lời các câu hỏi phức tạp mà không cần đọc lại toàn bộ code. |
| **`obsidian/`** | Nếu bạn dùng ứng dụng ghi chú **Obsidian**, bạn có thể mở thư mục này như một Obsidian Vault để xem các liên kết hai chiều dạng Mindmap. |

---

## 3. Các lệnh sử dụng phổ biến (Chỉ cần gõ trong Chat)

Nhờ đã cài đặt **Agent Skill**, bạn không cần gõ các lệnh terminal phức tạp, mà chỉ cần gõ các lệnh ngắn gọn ngay trong khung chat này:

### 🔹 1. Quét và tạo đồ thị toàn bộ dự án
```text
/graphify
```
* **Khi nào dùng:** Khi mới bắt đầu dự án, hoặc sau khi vừa viết xong một lượng lớn code/tài liệu mới.
* **Tác dụng:** Quét toàn bộ thư mục dự án, phân tích cây cú pháp AST, gom cụm chức năng và xuất ra file `graph.html`.

### 🔹 2. Cập nhật chỉ những file vừa thay đổi (Rất nhanh)
```text
/graphify --update
```
* **Khi nào dùng:** Khi bạn vừa sửa 1 - 2 file và không muốn quét lại từ đầu.
* **Tác dụng:** Graphify kiểm tra mã băm SHA256, chỉ trích xuất những file mới thay đổi và ghép vào đồ thị hiện có.

### 🔹 3. Quét sâu hơn các liên kết ngầm
```text
/graphify --mode deep
```
* **Khi nào dùng:** Khi bạn muốn AI suy luận thêm các mối quan hệ tiềm ẩn (ví dụ: dùng chung cấu trúc dữ liệu, phụ thuộc gián tiếp qua config).

### 🔹 4. Hỏi đáp & Tra cứu quan hệ bằng câu lệnh
* **Hỏi về liên kết giữa các khái niệm:**
  ```text
  /graphify query "Module xác thực hội viên kết nối với cơ sở dữ liệu như thế nào?"
  ```
* **Tìm đường đi giữa 2 thành phần (Truy vết phụ thuộc):**
  ```text
  /graphify path "MemberService" "Database"
  ```
  *(Graphify sẽ chỉ ra chuỗi gọi hàm từ MemberService -> Handler -> DAO -> Database)*.
* **Giải thích chuyên sâu một thành phần:**
  ```text
  /graphify explain "CheckinService"
  ```
  *(Graphify sẽ liệt kê nút này là gì, ai gọi nó, nó gọi ai, và tại sao nó quan trọng)*.

---

---

## 4. Giai đoạn Lên Kế Hoạch (Planning First - Khi chưa cần viết code)

Nếu bạn chưa muốn code ngay mà muốn **lên kế hoạch, làm rõ nghiệp vụ và cấu trúc trước**, quy trình sẽ diễn ra như sau:

### 4.1. Cách bạn và AI cùng lên Plan:
1. **Bạn chia sẻ ý tưởng hoặc gõ lệnh `/grill-me`:**
   - **Tự do:** Bạn chỉ cần nói ý tưởng thô (ví dụ: *"Tôi muốn làm app check-in cho lễ tân sân golf, có quét mã QR và phân hạng thẻ"*).
   - **Phỏng vấn bóc tách (`/grill-me`):** AI sẽ đóng vai trò Solution Architect phỏng vấn bạn từng câu hỏi ngắn để làm rõ:
     - Ai là người dùng chính (Lễ tân, Golfer, hay Quản lý sân)?
     - Luồng nghiệp vụ diễn ra như thế nào từ lúc golfer đến cổng?
     - Dữ liệu cần quản lý gồm những gì?
2. **AI lập tài liệu Kế hoạch chi tiết (`PLAN.md`):**
   - Tài liệu hóa toàn bộ: Mục tiêu, Kiến trúc dự kiến, Phân rã tính năng theo giai đoạn (Phase 1, 2, 3), và Dự kiến rủi ro.
3. **Graphify vẽ bản đồ Khái niệm Nghiệp vụ (Concept Graph):**
   - **Điểm đặc biệt:** Graphify không chỉ đọc code mà còn đọc **tài liệu Markdown (`.md`), sơ đồ và ảnh**.
   - Ngay cả khi **chưa có 1 dòng code nào**, khi chúng ta viết xong tài liệu kế hoạch và chạy `/graphify`, Graphify sẽ trích xuất toàn bộ các thực thể nghiệp vụ:
     `[Hội viên]` ──(sở hữu)──► `[Hạng thẻ VIP]` ──(quy định)──► `[Số lượt chơi / Hạn mức]`
     `[Golfer]` ──(check-in)──► `[Locker / Tủ đồ]` ──(gán)──► `[Caddie phục vụ]`
   - Bạn mở `graphify-out/graph.html` để ngắm **bản đồ nghiệp vụ logic**, xem có thiếu sót mắt xích nào trước khi bắt tay vào code!
4. **Chốt duyệt:** Bạn xem xét, yêu cầu sửa đổi cho đến khi ưng ý 100% thì mới chuyển sang giai đoạn code.

---

## 5. Quy Trình Chi Tiết Sau Khi Lên Plan Xong (Từ Kế Hoạch Đến Sản Phẩm Hoàn Thiện)

Sau khi tài liệu Kế hoạch (`PLAN.md`) được bạn phê duyệt, đây là **toàn bộ các bước diễn ra trên thực tế**, giải thích rõ AI làm gì, bạn làm gì và Graphify hỗ trợ ở đâu:

---

### 🔹 Bước 1: Phân rã Plan thành danh sách Task nhỏ (Task Breakdown)
Thay vì code một khối lớn khổng lồ dễ gây lỗi, AI sẽ chuyển đổi `PLAN.md` thành một danh sách công việc cụ thể (Todo Checklist) theo thứ tự ưu tiên:
- `[ ] Task 1.1: Thiết kế cấu trúc dữ liệu Hội viên (Schema, các trường thông tin, phân hạng thẻ)`.
- `[ ] Task 1.2: Viết tầng xử lý nghiệp vụ Check-in & Kiểm tra tính hợp lệ của thẻ`.
- `[ ] Task 1.3: Thiết kế giao diện Kiosk tra cứu & tìm kiếm hội viên`.
- `[ ] Task 1.4: Tích hợp mô phỏng / camera quét mã QR và gán tủ locker`.

👉 **Hành động của bạn:** Bạn xem danh sách này, có thể yêu cầu đổi thứ tự hoặc chọn làm task nào trước theo ý bạn.

---

### 🔹 Bước 2: Thực thi từng module nhỏ (Incremental Execution)
Nguyên tắc cốt lõi: **"Làm đến đâu, chắc đến đó - Tuyệt đối không làm ào ạt"**.
- AI chỉ tập trung viết đúng code cho **1 Task** đang làm.
- Giữ code gọn gàng, có chú thích rõ ràng, tuân thủ kiến trúc đã thống nhất trong Plan.
- Mỗi khi viết xong file nào, AI sẽ dẫn link cụ thể (`[tên_file](file:///...)`) và giải thích ngắn gọn để bạn nắm được.

👉 **Hành động của bạn:** Bạn theo dõi tiến độ từng bước, kiểm tra các tệp vừa tạo.

---

### 🔹 Bước 3: Tự động Kiểm thử & Báo cáo trực quan (Verification)
Sau khi viết xong mã nguồn cho task đó, AI sẽ:
1. **Kiểm tra cú pháp & tính toàn vẹn:** Chạy lệnh build hoặc kiểm tra lỗi.
2. **Kiểm thử giao diện thực tế (Browser Testing):** 
   - AI tự động khởi động server cục bộ và mở trình duyệt ảo.
   - Thao tác thử các nút bấm (nhấp tìm kiếm, bấm nút Check-in, mở popup...).
   - Chụp ảnh màn hình (screenshot) và đính kèm trực tiếp vào báo cáo để bạn nhìn thấy tận mắt giao diện trông như thế nào mà không cần tự thao tác.
3. **Bạn kiểm tra thực tế:** Bạn có thể tự mở ứng dụng trên máy tính của mình để trải nghiệm thử.

👉 **Hành động của bạn:** Bấm thử, trải nghiệm giao diện và phản hồi: *"Chỗ này nút bấm nhỏ quá"*, *"Cần thêm ô nhập Handicap"*... AI sẽ tinh chỉnh lại ngay.

---

### 🔹 Bước 4: Cập nhật Kiến trúc bằng Graphify (`/graphify --update`)
Đây là lúc Graphify phát huy sức mạnh tối đa:
- Sau khi một task hoàn thành, ta gõ lệnh:
  ```text
  /graphify --update
  ```
- **Graphify làm gì?**
  - Quét các file vừa mới tạo/sửa.
  - Cập nhật đồ thị `graph.html`. Bạn sẽ thấy module mới xuất hiện và nối dây vào các thành phần cũ trên bản đồ.
  - Cập nhật `GRAPH_REPORT.md`: Cảnh báo ngay nếu file mới viết có dấu hiệu thiết kế sai (ví dụ: bị gọi chéo vòng tròn, hoặc gánh quá nhiều trách nhiệm).

👉 **Hành động của bạn:** Bạn mở `graphify-out/graph.html` để ngắm "thành phố phần mềm" của mình đang lớn dần lên một cách ngăn nắp và khoa học.

---

### 🔹 Bước 5: Lưu trữ & Đồng bộ lên GitHub (Commit & Push)
Khi một task đã hoàn thành chuẩn chỉnh và được bạn nghiệm thu:
- AI sẽ tự động đóng gói commit với thông điệp rõ ràng theo chuẩn:
  ```bash
  git add .
  git commit -m "feat: hoàn thành module tra cứu và xác thực thẻ hội viên"
  git push origin main
  ```
- Toàn bộ lịch sử làm việc được đồng bộ lên kho GitHub của bạn ([github.com/trinhnam12345zz/Golf-checking-member](https://github.com/trinhnam12345zz/Golf-checking-member)), đảm bảo bạn không bao giờ bị mất code hay công sức.

---

### 🔹 Bước 6: Khi bạn muốn thay đổi ý tưởng giữa chừng (Change Request)?
Trong quá trình phát triển, nếu bạn chợt nhận ra: *"Tôi muốn đổi cách tính điểm Handicap"*, hoặc *"Tôi muốn thêm chức năng đặt caddie theo yêu cầu"*:
1. **Không sửa code bừa bãi:** Ta quay lại tệp `PLAN.md` cập nhật yêu cầu mới.
2. **Tra cứu phạm vi ảnh hưởng bằng Graphify:**
   ```text
   /graphify query "Nếu sửa logic Handicap thì những module nào bị ảnh hưởng?"
   ```
   Graphify sẽ chỉ đích danh: *"Chỉ có file `member-service` và `checkin-card` bị ảnh hưởng, các module khác không bị tác động"*.
3. **Sửa an toàn:** AI sửa đúng những vị trí cần thiết, không làm ảnh hưởng đến phần còn lại của hệ thống.
4. Lặp lại chu trình: Code -> Test -> Graphify -> Git Push.

---

## 5. Các câu hỏi thường gặp (FAQ)

**Q: Mã nguồn của tôi có bị tải lên máy chủ bên thứ ba khi dùng Graphify không?**
> **A:** Hoàn toàn **KHÔNG**. Graphify sử dụng thư viện Tree-sitter chạy nội bộ bằng Python trên chính máy tính của bạn để đọc cú pháp, đảm bảo an toàn và bảo mật 100%.

**Q: Tôi có cần cài thêm Python hay gì nữa không?**
> **A:** Không cần. Chúng ta đã cài đặt thành công **Python 3.12** và thư viện **`graphifyy`** trên máy tính của bạn rồi.

**Q: Khi đóng IDE mở lại, kỹ năng này có bị mất không?**
> **A:** Không. Thư mục [`.agents/skills/graphify/`](.agents/skills/graphify/) và tệp [AGENTS.md](AGENTS.md) đã được lưu trữ vĩnh viễn trong dự án và đã được đồng bộ lên GitHub của bạn.

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

## 4. Quy trình phối hợp chuẩn trong dự án này

Để đạt hiệu quả cao nhất ("chuẩn Vibe Coding"):

1. **Bước 1 (Lên ý tưởng & yêu cầu):** Bạn đưa ra yêu cầu (ví dụ: *"Tôi muốn làm màn hình quét thẻ RFID và bảng quản lý Caddie"*).
2. **Bước 2 (Xây dựng code):** Tôi và bạn cùng viết code các file tính năng.
3. **Bước 3 (Khóa kiến trúc bằng Graphify):** Gõ lệnh `/graphify`.
4. **Bước 4 (Kiểm tra):**
   - Mở `graphify-out/graph.html` để ngắm sơ đồ kiến trúc trực quan.
   - Đọc `GRAPH_REPORT.md` xem có module nào bị thiết kế quá tải (God node) hay không.
5. **Bước 5 (Mở rộng tính năng tiếp theo):** Tiếp tục lặp lại quy trình mà không sợ code mới làm hỏng code cũ.

---

## 5. Các câu hỏi thường gặp (FAQ)

**Q: Mã nguồn của tôi có bị tải lên máy chủ bên thứ ba khi dùng Graphify không?**
> **A:** Hoàn toàn **KHÔNG**. Graphify sử dụng thư viện Tree-sitter chạy nội bộ bằng Python trên chính máy tính của bạn để đọc cú pháp, đảm bảo an toàn và bảo mật 100%.

**Q: Tôi có cần cài thêm Python hay gì nữa không?**
> **A:** Không cần. Chúng ta đã cài đặt thành công **Python 3.12** và thư viện **`graphifyy`** trên máy tính của bạn rồi.

**Q: Khi đóng IDE mở lại, kỹ năng này có bị mất không?**
> **A:** Không. Thư mục [`.agents/skills/graphify/`](.agents/skills/graphify/) và tệp [AGENTS.md](AGENTS.md) đã được lưu trữ vĩnh viễn trong dự án và đã được đồng bộ lên GitHub của bạn.

# HER PRIVATE WORLD — HUỚNG DẪN VẬN HÀNH & SỬ DỤNG TRÊN WINDOWS

Website cá nhân cao cấp dành riêng cho cô ấy — kết hợp phong cách **Editorial Luxury**, **Digital Scrapbook** và **Cinematic Atmosphere**.

---

## 1. YÊU CẦU HỆ THỐNG
* Hệ điều hành: Windows 10 / 11.
* Phần mềm: **Node.js** (Khuyến nghị phiên bản LTS v18 trở lên).
  * Nếu máy bạn chưa có Node.js, tải tại: [nodejs.org](https://nodejs.org).

---

## 2. CÁCH KHỞI CHẠY TRÊN WINDOWS (DÀNH CHO NGƯỜI MỚI)

### Bước 1: Mở thư mục dự án trong Terminal / PowerShell
1. Mở thư mục `d:\visua_code\web_cv` trên máy tính của bạn.
2. Nhấn giữ phím `Shift` + nhấp chuột phải vào khoảng trống trong thư mục, chọn **"Open in Terminal"** hoặc **"Open PowerShell window here"**.

### Bước 2: Cài đặt thư viện (Chỉ cần làm lần đầu tiên)
Chạy lệnh sau:
```powershell
npm.cmd install
```
*(Lưu ý trên Windows: sử dụng `npm.cmd` để tránh lỗi PowerShell ExecutionPolicy).*

### Bước 3: Khởi động website
Chạy lệnh:
```powershell
npm.cmd run dev
```
Trình duyệt sẽ tự động mở hoặc bạn có thể mở thủ công tại địa chỉ:
👉 **`http://localhost:5173`**

Sau khi đóng và mở lại VS Code, không cần build lại. VS Code đã có task tự chạy Vite khi mở thư mục dự án. Nếu VS Code hỏi xác nhận chạy task, chọn **Allow**. Bạn cũng có thể chạy thủ công bằng `Ctrl + Shift + P` -> **Tasks: Run Task** -> **Mở website Her Private World**.

---

## 3. CÁCH THAY ĐỔI TÊN, HÌNH ẢNH & THÔNG TIN DỄ DÀNG

Bạn **KHÔNG CẦN** phải sửa code trong source file! Website được thiết kế với **Trung tâm Quản trị Cá nhân hóa** tích hợp trực tiếp trên giao diện:

1. Nhấn vào biểu tượng **Bánh răng (Cài đặt)** ở góc thanh điều hướng.
2. Bạn có thể thay đổi:
   * **Tên của cô ấy** (Ví dụ: Như Ý, Ánh Dương, Linh Chi...).
   * **Biệt danh của bạn** (Ví dụ: Người luôn cạnh em, Anh...).
   * **Ngày kỷ niệm bắt đầu** (Đồng hồ đếm ngày sẽ tự động tính chính xác từng ngày, tháng, năm).
   * **Ảnh chân dung trang chủ**: Dán link ảnh online (Unsplash/Imgur) hoặc chọn trực tiếp ảnh từ máy tính/điện thoại.
   * **Câu thông điệp trang chủ**: Tùy chỉnh câu nói sâu sắc gửi riêng cho cô ấy.
   * **Mã PIN bảo mật riêng tư** (Tùy chọn đặt 4 chữ số).
3. Nhấn **Lưu thông tin**. Mọi dữ liệu sẽ được lưu tự động trên trình duyệt!

---

## 4. CÁCH THÊM BỚT NỘI DUNG TỪNG KHU VỰC

* **Hộp Thư Bí Mật (Secret Letters):**
  * Nhấn nút **"Viết thư mới"** để gửi thêm phong thư.
  * Có thể chọn chủ đề (Tình yêu, An ủi, Sinh nhật...), chọn màu sáp niêm phong, và thiết lập **Khóa đến một ngày cụ thể** (chỉ mở được khi đến đúng ngày).
* **Tạp Chí Kỷ Niệm (Memory Journal):**
  * Nhấn **"Viết kỷ niệm"** để tải ảnh từ máy, ghi chú địa điểm, thời gian và câu chuyện.
  * Có thể đánh dấu sao Yêu thích và chuyển đổi giữa dạng Thẻ Tạp Chí hoặc Dòng Thời Gian (Timeline).
* **Triển Lãm Ảnh (Photo Gallery):**
  * Nhấn **"Thêm ảnh mới"** để tải ảnh từ máy tính/điện thoại lên album.
  * Nhấn vào bất kỳ ảnh nào để xem toàn màn hình (Lightbox), hỗ trợ phím mũi tên hoặc vuốt ngón tay trên điện thoại.
* **Góc Âm Nhạc (Music Corner):**
  * Tích hợp sẵn bộ tổng hợp âm thanh **Ambient Lo-Fi Piano & Chuông gió** êm dịu, không sợ vi phạm bản quyền hay đứt link.
  * Bạn có thể nhấn nút **"Nạp file MP3"** để chọn bài hát yêu thích từ máy tính của mình.
* **Danh Sách Ước Nguyện (Bucket List):**
  * Nhấn **"Thêm điều ước mới"** và tích chọn hoàn thành để xem thanh tiến độ tăng dần kèm hiệu ứng hoa giấy chúc mừng.
* **Đổi Theme Mỹ Cảm:**
  * Nhấn biểu tượng **Bảng Màu (Palette)** trên menu để chuyển đổi qua lại giữa 5 chủ đề: *Morning Dew, Dreamy Rose, Calm Linen, Midnight Velvet, Bloom Garden*.

---

## 5. SAO LƯU DỮ LIỆU & CHUYỂN SANG MÁY KHÁC (BACKUP & RESTORE)

Vì toàn bộ dữ liệu được lưu an toàn trên trình duyệt của máy hiện tại:
* Để sao lưu hoặc chuyển website sang máy tính/điện thoại của cô ấy:
  1. Vào **Cài đặt** -> chọn tab **"Sao Lưu & Khôi Phục"**.
  2. Nhấn **"Tải bản sao lưu JSON về máy"**.
  3. Khi mở website trên thiết bị của cô ấy, vào lại mục này và chọn **"Chọn file JSON để khôi phục"**. Toàn bộ thư từ, kỷ niệm và ảnh sẽ xuất hiện trọn vẹn!

---

## 6. CÁCH BUILD & ĐƯA LÊN INTERNET MIỄN PHÍ

### Đóng gói website:
```powershell
npm.cmd run build
```
Thư mục hoàn chỉnh sẵn sàng phát hành sẽ nằm tại thư mục `dist/`.

### Đưa lên mạng miễn phí (Vercel hoặc Netlify):
1. **Cách 1 (Kéo thả Netlify Drop):**
   * Truy cập [app.netlify.com/drop](https://app.netlify.com/drop).
   * Kéo thả cả thư mục `dist` vừa build vào trang web Netlify.
   * Bạn sẽ nhận được ngay một đường link miễn phí dạng `https://ten-ban-chon.netlify.app` để gửi cho cô ấy!
2. **Cách 2 (Vercel qua GitHub):**
   * Đẩy mã nguồn lên GitHub cá nhân.
   * Đăng nhập [vercel.com](https://vercel.com) và bấm **Import Project** từ GitHub, bấm **Deploy**. Vercel sẽ tự động build và cấp domain miễn phí.

---

Chúc bạn và cô ấy có những giây phút thật ấm áp, xúc động khi bước vào thế giới kỹ thuật số riêng tư này! ✨

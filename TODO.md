# TODO — Rạp chiếu kỷ niệm

## Mini theater và media
- [ ] Thêm mini theater cạnh playlist hiện tại, không thay thế music player cũ.
- [ ] Cho phép thêm nhiều ảnh, video MP4 và MP3 từ form.
- [ ] Lưu media cục bộ bằng IndexedDB và khôi phục sau khi tải lại trang.
- [ ] Hiển thị trạng thái thêm, lỗi định dạng và lỗi dung lượng rõ ràng.

## Playback
- [ ] Một controller dùng chung cho mini/modal/fullscreen.
- [ ] Ảnh tự chuyển theo thời lượng; video chuyển theo sự kiện `ended`.
- [ ] Play/pause, trước/sau, thanh tiến trình, âm lượng, danh sách cảnh.
- [ ] Mở rộng, fullscreen, Escape, đóng và khôi phục đúng cảnh/thời điểm.
- [ ] Không còn timer, audio, video hoặc animation chạy ngầm sau khi đóng.

## Visual và hiệu năng
- [ ] `object-fit: contain`, không méo/cắt mặt; nền gradient lấp khoảng trống.
- [ ] Fade + slow zoom nhẹ, tắt/giảm theo `prefers-reduced-motion`.
- [ ] Responsive dọc/ngang điện thoại và desktop.
- [ ] Không thêm particle/animation nền nặng.

## Kiểm tra
- [ ] Build và syntax check.
- [ ] Test thật thêm MP3, ảnh, MP4 bằng Chromium.
- [ ] Test controls, fullscreen, reload và cleanup.
- [ ] Đo CPU với theater đóng và sau khi đóng theater.

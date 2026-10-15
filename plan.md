# Kế hoạch: Rạp chiếu kỷ niệm tình yêu

## Mục tiêu
Bổ sung một trình chiếu kỷ niệm hoạt động thật trên website hiện tại, không thay thế music player cũ và không làm lại giao diện.

## Phạm vi triển khai
- Mini theater card cạnh/khu vực playlist hiện có.
- Modal theater có bố cục responsive: dọc điện thoại, ngang điện thoại và desktop.
- Thêm ảnh, video MP4 và MP3; media lưu bằng IndexedDB trên thiết bị hiện tại.
- Ảnh dùng `object-fit: contain`, nền tối/gradient để không cắt người hoặc làm méo ảnh.
- Video dùng thời lượng thực tế; ảnh có thời lượng mặc định cấu hình được trong code.
- Điều khiển phát/dừng, trước/sau, thanh tiến trình, âm lượng, danh sách cảnh, fullscreen và đóng.
- Chuyển cảnh fade + slow zoom nhẹ; tôn trọng `prefers-reduced-motion`.
- Dùng một bộ điều khiển playback thống nhất cho mini và fullscreen; đóng theater dừng timer, video, audio và animation.

## Thiết kế
- Phong cách cinematic pastel-pink: khung đen mềm, viền hồng nhạt, glow nhẹ, caption nằm ở vùng an toàn phía dưới.
- Mini-player giữ chiều cao thấp để không phá hero hiện tại.
- Theater lớn ưu tiên media ở trung tâm, controls tự ẩn ở desktop khi không thao tác và luôn đủ lớn trên mobile.
- Không dùng hiệu ứng 3D hoặc nhiều DOM particle; chỉ dùng CSS transform/opacity.

## Cấu trúc dự án hiện tại
- `index.html`: giao diện vanilla hiện tại, music player và logic chính; bổ sung markup/CSS/JS theater tại đây để giữ kiến trúc hiện có.
- `public/cloud-account.js`: đăng nhập/cloud hiện có; không thay đổi trong phase này.
- `public/music/`: nhạc mặc định của website.
- IndexedDB: kho riêng cho media theater cục bộ, không tải video lớn vào RAM cùng lúc.

## Validation
- Build Vite thành công.
- Syntax check các inline script.
- Chromium test: thêm MP3, ảnh, MP4; mở mini/fullscreen; play/pause; next/prev; progress; đóng và kiểm tra không còn timer/audio chạy ngầm.
- Đo CPU ở trạng thái trang mở và theater đóng; không thêm animation nền liên tục.

# Cloud riêng theo tài khoản và chat bạn bè

Website đồng bộ hồ sơ, ảnh và nhạc tải lên theo tài khoản. Chat 1–1 chỉ mở sau khi hai tài khoản gửi và chấp nhận lời mời kết bạn. RLS giới hạn hồ sơ chat, yêu cầu kết bạn, tin nhắn và voice theo đúng người liên quan; khách vẫn dùng trang chính nhưng không dùng chat cloud.

## 1. Tạo project Supabase

1. Tạo project trong [Supabase Dashboard](https://supabase.com/dashboard).
2. Trong **SQL Editor**, chạy `supabase/schema.sql` để tạo kho ảnh và nhạc riêng.
3. Tiếp tục chạy `supabase/chat_schema.sql` để tạo mã mời, quan hệ bạn bè, tin nhắn, bucket voice riêng và chính sách RLS cho chat.
4. Chạy tiếp `supabase/chat_experience_migration.sql` để bật chủ đề nền dùng chung và tính năng ẩn tin nhắn chỉ ở phía tài khoản hiện tại.
5. Chạy `supabase/chat_background_migration.sql` để bật ảnh nền cuộc trò chuyện trong bucket private, chỉ bạn bè đã kết nối mới tải được.
6. Trong **Project Settings → API** (hoặc API Keys), lấy **Project URL** và **publishable key**. Có thể dùng legacy `anon` key nếu project hiển thị kiểu key cũ.
7. Tuyệt đối không đưa `service_role`/secret key vào website hoặc biến môi trường client-side của Vercel.

Với project hiện có đã bật chat và chạy `chat_experience_migration.sql`, chỉ cần áp dụng `chat_background_migration.sql` để bật ảnh nền. Migration này thêm một cột nullable và bucket riêng; không xóa hay sửa tin nhắn, theme, ảnh hoặc nhạc hiện có.

## 2. Cấu hình Vercel

Mở project Vercel → **Settings → Environment Variables**, thêm:

- `VITE_SUPABASE_URL` = Project URL.
- `VITE_SUPABASE_ANON_KEY` = publishable/anon public key.

Chọn các môi trường cần dùng (Production; có thể thêm Preview/Development), rồi redeploy để các biến được nhúng vào bản build. Không commit `.env.local` hoặc giá trị khóa lên GitHub; `.env.example` chỉ là mẫu.

Để phát triển local, copy `.env.example` thành `.env.local`, điền hai giá trị public phía trên rồi chạy `npm run dev`.

## 3. Cho phép đăng ký không cần xác nhận email

Trong **Authentication → Providers → Email**, tắt **Confirm email** để người dùng đăng ký và đăng nhập ngay bằng email/mật khẩu, không cần OTP hay bấm liên kết xác nhận. Email vẫn là tên đăng nhập; mật khẩu cần tối thiểu 8 ký tự. Vì không yêu cầu xác nhận email, người dùng cần tự giữ mật khẩu; khôi phục tài khoản khi quên sẽ bị hạn chế.

Trong **Authentication → URL Configuration**, đặt Site URL là `https://demngaybennhau.vercel.app` và thêm Redirect URL cho domain production cùng `http://localhost:5173/**` khi phát triển local.

## 4. Dùng chat riêng

1. Mỗi người đăng nhập bằng tài khoản Supabase riêng, mở nút **Tin nhắn**, đặt tên hiển thị và chia sẻ mã kết bạn/link mời.
2. Người nhận nhập mã và gửi lời mời. Người có lời mời cần bấm **Chấp nhận**; chỉ sau đó mới xuất hiện trong danh sách bạn bè và mới được nhắn.
3. Trong cuộc trò chuyện 1–1 có thể gửi văn bản tối đa 2.000 ký tự, sticker, bắn tim và ghi/gửi voice dài tối đa 90 giây. Voice được giữ trong bucket private `chat-voice`, tối đa 10 MB mỗi bản ghi; người ngoài cặp bạn bè không được tải.
4. Có thể ẩn một tin nhắn khỏi phía mình; bản ghi gốc vẫn còn và người bạn chat vẫn nhìn thấy tin đó. Nền màu (hồng, tím, đào, bạc hà hoặc xanh trời) hoặc ảnh JPG/PNG/WebP do một trong hai người chọn được chia sẻ cho cả hai. Ảnh gốc tối đa 20 MB, được thu nhỏ/nén thành JPEG tối đa 5 MB, tự cắt kiểu phủ vừa khung, không méo/không lặp và có lớp phủ dịu để chữ dễ đọc.
5. Mã mời không cho phép nhắn trực tiếp. Danh sách chat và hồ sơ hiển thị chỉ gồm bạn bè hoặc người đang có lời mời chờ xử lý. Chat không có nhóm, chia sẻ vị trí hay tìm người ở gần.

## 5. Kiểm tra

1. Tạo hoặc đăng nhập hai tài khoản trên hai trình duyệt/thiết bị. Confirm email phải tắt nếu muốn đăng ký và đăng nhập ngay.
2. Tài khoản A chia sẻ mã; tài khoản B gửi lời mời. Xác nhận A nhìn thấy yêu cầu, chấp nhận, rồi cả hai thấy nhau trong danh sách.
3. Gửi thử văn bản, sticker, tim và voice ở hai phía; tải lại trang và xác nhận hội thoại vẫn được tải lại. Thử guest để xác nhận nút chat yêu cầu đăng nhập.
4. Đổi màu nền hoặc chọn một ảnh trong cuộc trò chuyện ở tài khoản A; xác nhận tài khoản B thấy cùng nền. Gỡ ảnh nền và xác nhận cả hai trở về nền màu. Ẩn thử một tin nhắn ở A; xác nhận A không còn thấy, còn B vẫn thấy.
5. Xác nhận tài khoản thứ ba không thấy hồ sơ chat, danh sách bạn bè, tin nhắn hoặc file voice của cặp đã kết bạn.
6. Kiểm tra ảnh và nhạc riêng vẫn tách biệt: `user-media` là bucket private, file tối đa 50 MB và RLS giới hạn theo `auth.uid()`.

## Phạm vi đồng bộ

Chat, mã kết bạn, hồ sơ hiển thị trong chat, tin nhắn và voice được lưu trên Supabase. Ảnh và nhạc tải lên dùng kho riêng hiện có. Một số trạng thái khác của trang (ví dụ khu vườn/thú cưng) vẫn ghi vào `localStorage`, nên chưa đồng bộ giữa thiết bị.

# Thiết lập kho cloud riêng theo tài khoản

Tích hợp này đồng bộ **thông tin hồ sơ, các ảnh hồ sơ/trang chủ và nhạc tải lên** giữa điện thoại và máy tính. Mỗi người cần tài khoản email riêng; dữ liệu được bảo vệ bằng Supabase Row Level Security (RLS) và bucket riêng theo user ID. Giao diện trang chính không bị thay bố cục.

## 1. Tạo project Supabase

1. Tạo một project trong [Supabase Dashboard](https://supabase.com/dashboard).
2. Trong **SQL Editor**, mở và chạy toàn bộ `supabase/schema.sql`.
3. Trong **Project Settings → API** (hoặc API Keys), lấy **Project URL** và **publishable key**. Có thể dùng legacy `anon` key nếu project hiển thị kiểu key cũ.
4. Tuyệt đối **không** đưa `service_role`/secret key vào website hoặc Vercel client-side environment.

## 2. Cấu hình Vercel

Mở project Vercel → **Settings → Environment Variables**, thêm:

- `VITE_SUPABASE_URL` = Project URL.
- `VITE_SUPABASE_ANON_KEY` = publishable/anon public key.

Chọn các môi trường cần dùng (Production; có thể thêm Preview/Development), rồi tạo **Redeploy** để các biến được nhúng vào bản build. Không commit `.env.local` hay giá trị khóa vào GitHub. `.env.example` chỉ là mẫu.

Để phát triển local, copy `.env.example` thành `.env.local`, điền hai giá trị public phía trên và chạy lại `npm run dev`.

## 3. Cho phép đăng ký không cần xác nhận email

Trong **Authentication → Providers → Email**, tắt **Confirm email** để người dùng đăng ký và đăng nhập ngay bằng email/mật khẩu, không cần OTP hay bấm liên kết xác nhận. Vẫn cần email làm tên đăng nhập và mật khẩu để phân biệt tài khoản. Vì không yêu cầu xác nhận email, người dùng cần tự giữ mật khẩu; khôi phục tài khoản khi quên sẽ bị hạn chế.

Trong **Authentication → URL Configuration**, đặt Site URL là `https://demngaybennhau.vercel.app` và thêm Redirect URL cho domain production cùng `http://localhost:5173/**` khi phát triển local.

## 4. Kiểm tra

1. Mở website, chọn **Tạo tài khoản** và đăng ký email/mật khẩu riêng; khi Confirm email đã tắt, có thể đăng nhập ngay.
2. Đăng nhập bằng email/mật khẩu đó trên thiết bị khác.
3. Tải ảnh và bài nhạc lên; làm mới trang và đăng nhập cùng tài khoản trên thiết bị khác để xác nhận đồng bộ.
4. Tạo tài khoản thứ hai và xác nhận không thấy ảnh/nhạc của tài khoản đầu.

Bucket `user-media` là private. File tối đa 50 MB; website chỉ dùng signed URL có thời hạn để hiển thị/phát media. RLS giới hạn truy cập theo `auth.uid()`.

## Phạm vi hiện tại

Cloud sync áp dụng cho hồ sơ/ảnh trong phần tùy chỉnh và playlist nhạc người dùng tải lên. Các trạng thái khác của website vốn đang ghi vào localStorage (ví dụ một số trạng thái khu vườn/thú cưng) chưa chuyển sang cloud trong bước này. Chúng vẫn tách theo trình duyệt/thiết bị cho đến khi bổ sung đồng bộ riêng.

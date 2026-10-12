# TÀI LIỆU KỸ THUẬT — HER PRIVATE WORLD

Tài liệu dành cho người phát triển. Hướng dẫn sử dụng cho người dùng cuối nằm ở [`README.md`](../README.md).

---

## 1. TỔNG QUAN

| Mục | Nội dung |
| --- | --- |
| Tên dự án | `her-private-world` (npm package), thư mục `web_cv` |
| Loại | SPA (Single Page App) — website cá nhân, 1 trang cuộn dài |
| Stack | React 18 + TypeScript + Vite 5 + Tailwind CSS 3 |
| Ngôn ngữ giao diện | Tiếng Việt (`<html lang="vi">`) |
| Backend | Không có. Toàn bộ dữ liệu nằm ở **trình duyệt** (localStorage + IndexedDB) |
| Cổng dev | `http://localhost:5173` |
| Output build | `dist/` |

---

## 2. CÔNG NGHỆ & THƯ VIỆN

### Runtime dependencies (`dependencies`)

| Package | Phiên bản | Vai trò |
| --- | --- | --- |
| `react` / `react-dom` | ^18.3.1 | Nền tảng UI |
| `lucide-react` | ^1.16.0 | Bộ icon SVG (nhúng inline) |
| `canvas-confetti` | ^1.9.4 | Hiệu ứng pháo giấy hoa giấy khi mở quà / hoàn thành ước nguyện |

### Dev dependencies (`devDependencies`)

| Package | Phiên bản | Vai trò |
| --- | --- | --- |
| `vite` | ^5.4.2 | Dev server + bundler |
| `@vitejs/plugin-react` | ^4.3.1 | HMR React (Fast Refresh) |
| `typescript` | ^5.5.4 | Kiểm tra kiểu (`tsc` chạy trước `vite build`) |
| `tailwindcss` + `postcss` + `autoprefixer` | 3.4 / 8.4 / 10.4 | Utility CSS, hệ biến màu theo theme |

### Script `package.json`

```bash
npm run dev       # vite — http://localhost:5173, tự mở trình duyệt
npm run build     # tsc && vite build -> dist/
npm run preview   # serve thử bản build tại http://localhost:4173
```

> Trên PowerShell dùng `npm.cmd run dev` để tránh lỗi ExecutionPolicy.

---

## 3. CẤU TRÚC THƯ MỤC

```
web_cv/
├── index.html                  # Vite entry, khai báo Google Fonts + favicon inline
├── vite.config.ts              # port 5173, outDir dist, tắt sourcemap
├── tailwind.config.js          # Map CSS variable -> class Tailwind (màu aura-*, font, animation)
├── tsconfig.json               # strict, jsx: react-jsx, moduleResolution bundler
├── postcss.config.js
├── index.html                  # Giao diện HTML chính được Vite phục vụ
├── public/favicon.svg
├── dist/                       # Output build (git-ignored)
│
├── server/
│   └── server.js               # Express: API đo tốc độ + serve dist/ (chưa nằm trong package.json)
│
└── src/
    ├── main.tsx                # ReactDOM.createRoot
    ├── App.tsx                 # ★ Root component — nguồn sự thật duy nhất của state
    ├── types.ts                # ★ Toàn bộ model dữ liệu (interface)
    ├── index.css               # ★ Định nghĩa 5 theme dưới dạng CSS variable + keyframes
    ├── data/
    │   └── defaultData.ts      # Nội dung mẫu: profile, letters, memories, wishes, photos,
    │                           #   playlist, dailyNotes + bộ câu hỏi game
    ├── services/
    │   ├── storage.ts          # ★ localStorage (state) + IndexedDB (blob ảnh) + export/import JSON
    │   └── audioSynthesizer.ts # ★ Web Audio API — tổng hợp nhạc nền, không dùng file MP3
    └── components/
        ├── Navbar.tsx            # Điều hướng + nút mở Settings / Theme
        ├── Hero.tsx              # Trang chủ, đồng hồ, lời chào theo giờ
        ├── SecretLetters.tsx     # Hộp thư bí mật (lọc chủ đề, khoá đến ngày)
        ├── MemoryJournal.tsx     # Tạp chí kỷ niệm (grid / timeline, đánh dấu yêu thích)
        ├── MoodRoom.tsx          # Chọn tâm trạng + hướng dẫn + bài tập thở
        ├── OurTimeline.tsx       # Đếm ngày/tháng/năm từ anniversaryDate
        ├── PhotoGallery.tsx      # Album ảnh + Lightbox (mũi tên / vuốt)
        ├── DailyMessage.tsx      # Trích dẫn trong ngày (chọn theo ngày trong năm)
        ├── WishList.tsx          # Ước nguyện + thanh tiến độ + confetti
        ├── InteractiveGames.tsx  # Serendipity Cards + Soul Quest quiz
        ├── MusicPlayer.tsx       # Đĩa thanh + playlist (synth hoặc file tải lên)
        ├── SurpriseExperience.tsx# Hộp quà ký ức bí mật
        ├── ThemeSelector.tsx     # Modal chọn 5 theme
        ├── SettingsModal.tsx     # 3 tab: Hồ sơ / Sao lưu / Quyền riêng tư
        └── PinLockScreen.tsx     # Màn hình nhập PIN
```

---

## 4. KIẾN TRÚC & LUỒNG DỮ LIỆU

### 4.1. Mô hình: Single Source of Truth + Props Drilling

Không dùng React Context, Redux hay Zustand. Toàn bộ state nằm trong `App.tsx`.

```
localStorage ──loadSavedState()──▶ App.useState<AppStateData>  ◀── initialData (defaultData.ts)
                                          │
                                    useEffect([state]) ──▶ saveState() ──▶ localStorage
                                          │
                    ┌─────────────────────┴──────────────────────┐
                    ▼                                            ▼
        Component (props xuôi xuống)              onUpdateXxx (callback ngược lên)
                    │                                            │
                    └──── setState(prev => ({...prev, ...})) ◀──┘
```

**Quy ước bắt buộc khi viết/thêm component:**

1. Component **chỉ nhận `props`**, không tự `loadState`/`saveState`.
2. Component có nhu cầu sửa dữ liệu **phải** nhận callback `onUpdateXxx` và gọi với mảng mới.
3. Mọi thay đổi đi qua `setState(prev => ...)` để không mất dữ liệu của nhánh khác.

### 4.2. Chu kỳ ghi dữ liệu

`src/App.tsx:47`

```ts
useEffect(() => {
  saveState(state);
}, [state]);
```

Không có nút "Save". Mỗi lần state đổi là ghi thẳng xuống `localStorage` (ghi đè toàn bộ object). Mở trang lần sau sẽ đọc lại qua `loadSavedState()` (`src/App.tsx:25`).

**Hệ quả cần lưu ý:**
- localStorage thường giới hạn ~5 MB. Ảnh nén base64 rò vào state sẽ làm vỡ quota.
- Vì vậy ảnh lớn phải đi qua IndexedDB (xem 5.2), không nhét vào `AppStateData`.

### 4.3. Áp dụng theme

`src/App.tsx:52`

```ts
useEffect(() => {
  document.documentElement.setAttribute('data-theme', state.activeTheme);
}, [state.activeTheme]);
```

Đổi theme = đổi attribute trên `<html>`. CSS trong `index.css` bắt attribute này và ghi đè bộ `--color-*`. Component không cần biết theme đang là gì.

### 4.4. Scroll spy

`src/App.tsx:57-77` — listener `scroll` (passive) đọc `offsetTop`/`offsetHeight` của các section theo thứ tự khai báo trong mảng `sections`, rồi set `activeSection` để Navbar tô sáng.

> Nếu thêm section mới, **phải** thêm `id` vào mảng `sections` trong `src/App.tsx:59`, nếu không Navbar sẽ không bao giờ highlight nó.

---

## 5. MÔ HÌNH DỮ LIỆU

Nguồn: `src/types.ts`.

### 5.1. `AppStateData` — object state duy nhất

```ts
interface AppStateData {
  profile: UserProfile;          // tên, biệt danh, ảnh, ngày kỷ niệm, siteTitle, heroQuote, pinLock
  activeTheme: ThemeMode;         // 'morning' | 'dreamy' | 'calm' | 'midnight' | 'bloom'
  currentMood: MoodType | null;   // 7 trạng thái tâm trạng
  letters: SecretLetter[];        // hộp thư
  memories: MemoryItem[];         // tạp chí kỷ niệm
  wishes: WishItem[];             // ước nguyện
  photos: PhotoItem[];            // album (chỉ metadata, không chứa blob)
  dailyNotes: DailyNote[];        // trích dẫn
  surpriseUnlocked: boolean;
  playlist: SongTrack[];          // nhạc nền
}
```

**Key lưu trữ:** `her_private_world_state_v1` (`src/services/storage.ts:3`)
**Tên DB IndexedDB:** `HerPrivateWorldDB` — object store `photos_blob`, keyPath `id` (`src/services/storage.ts:4-6`)

### 5.2. Hai tầng lưu trữ

| Tầng | Dùng cho | API |
| --- | --- | --- |
| localStorage | Toàn bộ `AppStateData` (JSON) | `loadSavedState()`, `saveState()` |
| IndexedDB | Ảnh dạng data-URL lớn | `savePhotoBlob()`, `getPhotoBlob()`, `deletePhotoBlob()` |

`photos: PhotoItem[]` trong state chỉ giữ `url` / `caption` / `date` / `location`. Blob ảnh thật nằm riêng trong IndexedDB và được tải lại theo `id` khi cần.

### 5.3. Merge state khi khởi động

`src/App.tsx:25-35` — state đã lưu được merge **nông** với `initialData`, riêng `profile` được merge sâu một cấp:

```ts
{ ...initialData, ...saved, profile: { ...initialData.profile, ...(saved.profile || {}) } }
```

Hệ quả: **thêm một field mới vào `AppStateData` là an toàn** (user cũ tự nhận giá trị mặc định). Nhưng nếu *xoá* một field, state đã lưu của người dùng cũ vẫn giữ field đó — cần migration nếu cấu trúc thay đổi lớn.

---

## 6. HỆ THỐNG THEME

### 6.1. Ba tầng liên kết

```
index.css        :root / [data-theme="X"] { --color-primary: #... }
      ↓
tailwind.config.js  colors: { aura: { primary: 'var(--color-primary)', ... } }
      ↓
Component        className="bg-aura-bg text-aura-text border-aura-border"
```

### 6.2. Danh sách theme

| Key | Nhãn trong UI | Ghi chú |
| --- | --- | --- |
| `morning` | Morning Dew | Theme mặc định, nằm ở `:root` |
| `dreamy` | Dreamy Rose | Hồng mận ngọt |
| `calm` | Calm Linen | Tím nhạt pastel |
| `midnight` | Midnight Velvet | Nền tối, neon |
| `bloom` | Bloom Garden | Cam đào |

Dữ liệu hiển thị (tên, tagline, 4 màu mẫu, icon) nằm trong `src/components/ThemeSelector.tsx`; **bảng màu thật** nằm trong `src/index.css`. Khi thêm theme mới phải sửa **cả hai nơi**.

### 6.3. Bảng token màu

`bg`, `card`, `surface`, `border`, `text`, `muted`, `primary`, `primaryHover`, `accent`, `highlight`, `glow`, `nav-bg`

Ngoài ra `index.css` có các class tiện ích viết tay: `.glass-panel`, `.text-gradient`, `.animate-wave-*`, `.animate-breath`, `.vinyl-disk`, `.tonearm-*`.

---

## 7. BẢN ĐỒ SECTION ↔ COMPONENT

`id` của mỗi `<section>` là hợp đồng với Navbar và scroll spy.

| `id` | Component | Navbar hiển thị |
| --- | --- | --- |
| `hero` | `Hero.tsx` | Trang chủ |
| `letters` | `SecretLetters.tsx` | Hộp thư |
| `memories` | `MemoryJournal.tsx` | Kỷ niệm |
| `mood` | `MoodRoom.tsx` | Tâm trạng |
| `timeline` | `OurTimeline.tsx` | Đếm ngày |
| `gallery` | `PhotoGallery.tsx` | Album ảnh |
| `wishes` | `WishList.tsx` | Ước nguyện |
| `games` | `InteractiveGames.tsx` | Trò chơi |
| `music` | `MusicPlayer.tsx` | *(không có trong Navbar)* |
| `surprise` | `SurpriseExperience.tsx` | Bất ngờ |

Ngoài `main` còn có: `DailyMessage.tsx` (không có `id`, không hiện trên Navbar), footer, `ThemeSelector` và `SettingsModal` (modal toàn cục).

Thứ tự render trong `App.tsx` khác thứ tự đánh số comment — hãy theo đúng thứ tự JSX thực tế.

---

## 8. NHẠC NỀN TỔNG HỢP (WEB AUDIO API)

`src/services/audioSynthesizer.ts` export singleton `ambientPlayer` (`class AmbientEngine`).

```ts
ambientPlayer.playAmbientSequence('piano' | 'ambient' | 'rain' | 'chime');
ambientPlayer.stop();
ambientPlayer.setVolume(0.0 - 1.0);
ambientPlayer.getIsPlaying(): boolean;
```

Cơ chế: `AudioContext` + `GainNode` chung. Mỗi nhịp (`setInterval` 2500 ms, hoặc 4000 ms với `ambient`) chọn ngẫu nhiên một nốt trong thang pentatonic `[261.63 … 783.99]` Hz, khai báo `OscillatorNode` với envelope `rampUp 0.1s` → `exponentialRampToValueAtTime(0.001)`, rồi tự `stop()`.

- Không có file âm thanh nào được đóng gói → không vi phạm bản quyền, không đứt link.
- `MusicPlayer` còn hỗ trợ nạp file MP3 từ máy (`SongTrack.audioUrl`) — dữ liệu này **không** đi qua lưu trữ bền vững.

---

## 9. SAO LƯU & KHÔI PHỤC

`src/services/storage.ts:89-120`, gọi từ tab **Sao Lưu & Khôi Phục** trong `SettingsModal.tsx`.

| Hàm | Việc |
| --- | --- |
| `exportBackup(state)` | `JSON.stringify(state, null, 2)` → `Blob` → tải file `her-private-world-backup-YYYY-MM-DD.json` |
| `importBackupFile(file)` | `FileReader.readAsText` → `JSON.parse`, kiểm tra bắt buộc có `profile` và `letters`, trả về `AppStateData` |

**Giới hạn:** file sao lưu **không** chứa blob ảnh trong IndexedDB. Muốn chuyển ảnh sang máy khác phải xuất JSON kèm ảnh ở dạng URL ngoài (link) — data-URL nằm trong IndexedDB sẽ không đi theo.

---

## 10. BẢO MẬT — CẢNH BÁO QUAN TRỌNG

- **PIN (`profile.pinLock`) chỉ là rào cản phía UI.** PIN được so sánh ở `PinLockScreen.tsx` trong bộ nhớ của trình duyệt và lưu **bản rõ** trong localStorage.
- Ai mở DevTools → Application → LocalStorage là đọc được toàn bộ nội dung thư, kỷ niệm, ảnh.
- Toàn bộ nội dung là **static client-side**, không có xác thực, không mã hoá, không backend.
- `server/server.js` mở CORS `Access-Control-Allow-Origin: *` cho mọi origin và trả JSON công khai IP/ISP của người truy cập.

Phù hợp với mục đích "tặng riêng tư", **không** dùng để lưu dữ liệu thật sự bí mật (khóa API, ảnh riêng tư nhạy cảm, thông tin tài chính…).

---

## 11. SERVER PHỤ (`server/server.js`)

Express, cổng `5174` (hoặc `PORT`). Chưa được khai báo trong `package.json` và `express` **chưa có trong `node_modules`** — xem mục 13.

| Route | Method | Mô tả |
| --- | --- | --- |
| `/api/ping` | GET | Trả `pong` ngay — đo RTT/jitter |
| `/api/download?bytes=N` | GET | Stream `N` byte ngẫu nhiên (min 1 KB, max 100 MB, chunk 64 KB) — đo tốc độ tải |
| `/api/upload` | POST | Đếm byte nhận được → `{ received }` — đo tốc độ upload |
| `/api/info` | GET | Proxy `https://ipapi.co/json/`, cache 60 s, trả `{ ip, isp, location }` |
| `/healthz` | GET | Health check `{ ok: true }` |
| `/*` | GET | Serve static từ `../dist` + fallback SPA (nếu `dist` tồn tại) |

CORS cho phép mọi origin (cần thiết khi dev Vite ở `:5173` gọi `:5174`).

---

## 12. BUILD & TRIỂN KHAI

```bash
npm run build     # -> dist/
npm run preview   # kiểm tra bản build
```

`dist/` gồm `index.html`, `favicon.svg`, `assets/index-*.css` (~45 KB), `assets/index-*.js` (~312 KB, gzip nhỏ hơn nhiều).

Vì toàn bộ route là anchor scroll, **không cần cấu hình rewrite**. Deploy static thuần (Netlify Drop, GitHub Pages, Vercel/Cloudflare Pages) là đủ.

---

## 13. VẤN ĐỀ ĐÃ BIẾT & NỢ KỸ THUẬT

| # | Vấn đề | Mức độ | Ghi chú |
| --- | --- | --- | --- |
| 1 | `express` không có trong `package.json` / `node_modules` | Cao (nếu dùng server) | `node server/server.js` sẽ lỗi `Cannot find module 'express'`. Cần `npm i express` và thêm script, ví dụ `"serve": "node server/server.js"` |
| 2 | Giao diện hiện tại nằm trực tiếp trong `index.html` và dùng Tailwind CDN | Thấp | Chỉnh sửa `index.html` làm nguồn duy nhất; không tạo lại file preview |
| 3 | Không có test, lint, formatter | Trung bình | Không có `eslint`, `prettier`, `vitest` trong devDependencies |
| 4 | `localStorage` giới hạn ~5 MB | Trung bình | `saveState` đã bắt lỗi quota nhưng chỉ `console.warn` — người dùng mất dữ liệu mà không biết |
| 5 | PIN bảo mật bằng client-side | Cố ý thiết kế | Xem mục 10 |
| 6 | `SurpriseExperience` có state `passcode`/`errorMsg` nhưng luồng mở quà không kiểm tra mã | Thấp | Mã ở `src/components/SurpriseExperience.tsx:19-23` — hiện mở trực tiếp |
| 7 | Chưa phải git repo | Trung bình | Nên `git init` trước khi deploy qua GitHub/Vercel |
| 8 | Không có `aria-label` nhất quán, focus trap trong modal | Thấp | Nếu cần accessibility thì đây là điểm cần cải thiện |

---

## 14. THÊM SECTION MỚI (checklist)

1. Tạo `src/components/TuongPhanMoi.tsx` — nhận props, không tự đọc/ghi storage.
2. Nếu có dữ liệu riêng: thêm interface vào `src/types.ts` và field vào `AppStateData` + giá trị mặc định trong `src/data/defaultData.ts`.
3. Mount trong `<main>` của `src/App.tsx`, truyền `onUpdateXxx` gọi `setState(prev => ({ ...prev, ... }))`.
4. Đặt `<section id="ten-section">` — **khớp chính tả** với id sẽ thêm vào `navItems` (`Navbar.tsx:33`) và mảng `sections` (`App.tsx:59`).
5. Dùng token màu `aura-*` và class animation có sẵn để theme tự hoạt động.
6. Chạy `npm run build` để chắc `tsc` không báo lỗi.
import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Lock, 
  ShieldAlert, 
  Check, 
  User, 
  Calendar, 
  Image as ImageIcon 
} from 'lucide-react';
import { AppStateData, UserProfile } from '../types';
import { exportBackup, importBackupFile } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: AppStateData;
  onSaveProfile: (profile: UserProfile) => void;
  onRestoreState: (state: AppStateData) => void;
  onResetToDefault: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onSaveProfile,
  onRestoreState,
  onResetToDefault,
}) => {
  if (!isOpen) return null;

  const [herName, setHerName] = useState(currentState.profile.herName);
  const [myNickname, setMyNickname] = useState(currentState.profile.myNickname);
  const [musicCoverUrl, setMusicCoverUrl] = useState(currentState.profile.musicCoverUrl || '/couple-background.jfif');
  const [anniversaryDate, setAnniversaryDate] = useState(currentState.profile.anniversaryDate);
  const [heroQuote, setHeroQuote] = useState(currentState.profile.heroQuote);
  const [pinLock, setPinLock] = useState(currentState.profile.pinLock || '');

  const [activeTab, setActiveTab] = useState<'profile' | 'backup' | 'privacy'>('profile');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      ...currentState.profile,
      herName: herName.trim() || 'huongmuoi',
      myNickname: myNickname.trim() || 'Người luôn cạnh em',
      musicCoverUrl: musicCoverUrl.trim() || '/couple-background.jfif',
      anniversaryDate,
      heroQuote,
      pinLock: pinLock.trim() || undefined,
    };
    onSaveProfile(updatedProfile);
    setStatusMsg('Đã lưu cấu hình cá nhân thành công!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleExport = () => {
    exportBackup(currentState);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedData = await importBackupFile(file);
        if (window.confirm('Khôi phục dữ liệu từ bản sao lưu này? Dữ liệu hiện tại sẽ được thay thế.')) {
          onRestoreState(importedData);
          setStatusMsg('Đã khôi phục dữ liệu từ bản sao lưu!');
          setTimeout(() => onClose(), 1500);
        }
      } catch (err: unknown) {
        alert('File sao lưu không hợp lệ: ' + (err instanceof Error ? err.message : String(err)));
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ đặt lại toàn bộ thư từ, kỷ niệm và cài đặt về dữ liệu ban đầu. Bạn có chắc chắn không?')) {
      onResetToDefault();
      onClose();
    }
  };

  const handleMusicCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMusicCoverUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="max-w-2xl w-full bg-aura-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-aura-border max-h-[90vh] overflow-y-auto animate-fade-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-aura-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-aura-surface text-aura-primary">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-aura-text">
                Trung Tâm Cá Nhân Hóa & Dữ Liệu
              </h3>
              <p className="text-[11px] text-aura-muted">
                Tự do thay đổi tên, ảnh, ngày kỷ niệm và sao lưu dữ liệu riêng tư
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-aura-surface text-aura-muted hover:text-aura-text"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-aura-border text-xs font-medium">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-aura-primary text-white shadow-soft-glow'
                : 'text-aura-muted hover:text-aura-text'
            }`}
          >
            Thông Tin Cá Nhân
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-aura-primary text-white shadow-soft-glow'
                : 'text-aura-muted hover:text-aura-text'
            }`}
          >
            Sao Lưu & Khôi Phục
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-aura-primary text-white shadow-soft-glow'
                : 'text-aura-muted hover:text-aura-text'
            }`}
          >
            Bảo Mật & Lưu Ý
          </button>
        </div>

        {statusMsg && (
          <div className="my-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check size={14} />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* TAB 1: Profile form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4 py-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-aura-muted mb-1 font-medium">Tên của cô ấy *</label>
                <input
                  type="text"
                  value={herName}
                  onChange={(e) => setHerName(e.target.value)}
                  placeholder="Ví dụ: huongmuoi"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                />
              </div>

              <div>
                <label className="block text-aura-muted mb-1 font-medium">Tên / Biệt danh của bạn *</label>
                <input
                  type="text"
                  value={myNickname}
                  onChange={(e) => setMyNickname(e.target.value)}
                  placeholder="Ví dụ: Người luôn cạnh em"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-aura-muted mb-1 font-medium">Ngày kỷ niệm bắt đầu *</label>
              <input
                type="date"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
              />
            </div>

            <div>
              <label className="block text-aura-muted mb-1 font-medium">Ảnh bìa cạnh tên bài hát</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={musicCoverUrl}
                  onChange={(e) => setMusicCoverUrl(e.target.value)}
                  placeholder="Dán link ảnh bìa hoặc chọn ảnh từ thiết bị bên dưới..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                />
                <label className="cursor-pointer px-3.5 py-2 rounded-xl border border-dashed border-aura-border hover:bg-aura-surface text-aura-muted flex items-center justify-center gap-2">
                  <ImageIcon size={15} />
                  <span>Chọn ảnh bìa từ máy tính / điện thoại</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMusicCoverFileChange}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-aura-muted mb-1 font-medium">Thông điệp cốt lõi trang chủ</label>
              <textarea
                rows={3}
                value={heroQuote}
                onChange={(e) => setHeroQuote(e.target.value)}
                placeholder="Câu nói mang tính chiều sâu gửi đến cô ấy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-aura-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-aura-border text-aura-muted hover:bg-aura-surface"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-aura-primary text-white font-medium hover:bg-aura-primaryHover flex items-center gap-1.5 shadow-sm"
              >
                <Save size={14} />
                <span>Lưu thông tin</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Backup & Restore */}
        {activeTab === 'backup' && (
          <div className="py-4 space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-aura-surface border border-aura-border space-y-2">
              <h4 className="font-serif font-bold text-sm text-aura-text flex items-center gap-2">
                <Download size={16} className="text-aura-primary" />
                <span>Xuất file sao lưu (Export JSON)</span>
              </h4>
              <p className="text-aura-muted leading-relaxed">
                Tải toàn bộ thư từ, kỷ niệm, danh sách ước mơ và cấu hình về máy tính dưới dạng file JSON an toàn.
              </p>
              <button
                type="button"
                onClick={handleExport}
                className="px-4 py-2 rounded-xl bg-aura-card border border-aura-border hover:bg-aura-surface text-aura-text font-medium flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download size={14} />
                <span>Tải bản sao lưu JSON về máy</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-aura-surface border border-aura-border space-y-2">
              <h4 className="font-serif font-bold text-sm text-aura-text flex items-center gap-2">
                <Upload size={16} className="text-aura-primary" />
                <span>Khôi phục từ file sao lưu (Import JSON)</span>
              </h4>
              <p className="text-aura-muted leading-relaxed">
                Nạp file sao lưu đã tải trước đây để chuyển dữ liệu sang máy tính hoặc điện thoại khác.
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-aura-card border border-aura-border hover:bg-aura-surface text-aura-text font-medium shadow-sm">
                <Upload size={14} />
                <span>Chọn file JSON để khôi phục</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-2">
              <h4 className="font-serif font-bold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <RotateCcw size={16} />
                <span>Khôi phục dữ liệu ban đầu</span>
              </h4>
              <p className="text-rose-600/80 dark:text-rose-400/80 leading-relaxed">
                Xóa các thay đổi trên thiết bị và đưa mọi nội dung trở về dữ liệu mẫu tinh tế ban đầu.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-2 cursor-pointer"
              >
                <span>Đặt lại về dữ liệu ban đầu</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Privacy & Security note */}
        {activeTab === 'privacy' && (
          <div className="py-4 space-y-5 text-xs">
            <div>
              <label className="block text-aura-muted mb-1 font-medium">
                Mã PIN bảo vệ không gian riêng tư (4 chữ số, tùy chọn)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  maxLength={6}
                  value={pinLock}
                  onChange={(e) => setPinLock(e.target.value)}
                  placeholder="Để trống nếu không muốn khóa PIN"
                  className="w-48 px-3.5 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary font-mono text-center tracking-widest text-base"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-aura-primary text-white hover:bg-aura-primaryHover"
                >
                  Cập nhật PIN
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert size={16} />
                <span>Lưu ý kỹ thuật quan trọng về lưu trữ & bảo mật</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                <li>
                  <strong>Lưu trữ trên trình duyệt:</strong> Dữ liệu ảnh được lưu bằng IndexedDB, dữ liệu văn bản và cài đặt lưu trên LocalStorage của máy hiện tại. Khi đổi thiết bị (hoặc trình duyệt), bạn cần dùng tính năng <em>Xuất sao lưu JSON</em> để chuyển dữ liệu.
                </li>
                <li>
                  <strong>Bảo mật phía Client:</strong> Mã PIN này hoạt động trên trình duyệt nhằm bảo vệ sự riêng tư trước những người mượn điện thoại/máy tính thông thường. Khóa phía trình duyệt không phải là cơ chế mã hóa máy chủ (server-side authentication) nếu bạn đưa website lên internet công cộng.
                </li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

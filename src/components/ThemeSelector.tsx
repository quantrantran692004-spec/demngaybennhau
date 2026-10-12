import React from 'react';
import { Palette, X, Check, Sun, Moon, Sparkles, Feather, Flower2, LucideIcon } from 'lucide-react';
import { ThemeMode } from '../types';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

interface ThemeMeta {
  id: ThemeMode;
  name: string;
  tagline: string;
  icon: LucideIcon;
  colors: string[];
}

const THEMES: ThemeMeta[] = [
  {
    id: 'morning',
    name: 'Morning Dew (Sớm Mai Tinh Khôi)',
    tagline: 'Như ánh nắng sớm mai chiếu qua rèm lụa, nhẹ nhõm và an yên.',
    icon: Sun,
    colors: ['#FBF9F5', '#8E735B', '#B8977E', '#EAE0D5'],
  },
  {
    id: 'dreamy',
    name: 'Dreamy Rose (Hoàng Hôn Khẽ Chạm)',
    tagline: 'Hồng đất tro lụa lãng mạn, nữ tính và sâu lắng.',
    icon: Sparkles,
    colors: ['#FBF4F4', '#9E5B6A', '#C78290', '#F5DDE2'],
  },
  {
    id: 'calm',
    name: 'Calm Linen (Tĩnh Lặng Trầm Mặc)',
    tagline: 'Mộc mạc như thớ vải lanh, trà ấm và khoảng trời phẳng lặng.',
    icon: Feather,
    colors: ['#F5F5F0', '#5A6B63', '#7E9287', '#DEE4DF'],
  },
  {
    id: 'midnight',
    name: 'Midnight Velvet (Đêm Nhung Huyền Bí)',
    tagline: 'Nền tối than đá sâu thẳm, điểm xuyết ánh kim sang trọng.',
    icon: Moon,
    colors: ['#121318', '#D4AF37', '#1B1D24', '#2F3341'],
  },
  {
    id: 'bloom',
    name: 'Bloom Garden (Khu Vườn Bừng Nở)',
    tagline: 'Tươi tắn, ngập tràn sức sống như một sớm dạo bước thảo cầm viên.',
    icon: Flower2,
    colors: ['#F4F7F4', '#4F7959', '#78A884', '#DCEDDF'],
  },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="max-w-lg w-full bg-aura-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-aura-border animate-fade-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-aura-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-aura-surface text-aura-primary">
              <Palette size={18} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-aura-text">
                Bảng Mỹ Cảm & Chủ Đề
              </h3>
              <p className="text-[11px] text-aura-muted">
                Chọn tông màu phù hợp nhất với cảm xúc của em hôm nay
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

        {/* Theme List */}
        <div className="space-y-3 py-6 max-h-[60vh] overflow-y-auto pr-1">
          {THEMES.map((th) => {
            const Icon = th.icon;
            const isSelected = currentTheme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => {
                  onSelectTheme(th.id);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-aura-surface border-aura-primary shadow-soft-glow scale-[1.01]'
                    : 'bg-aura-card hover:bg-aura-surface/50 border-aura-border hover:border-aura-primary/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-aura-primary text-white' : 'bg-aura-surface text-aura-muted group-hover:text-aura-primary'
                  }`}>
                    <Icon size={18} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-aura-text">
                        {th.name}
                      </h4>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-aura-primary bg-aura-primary/10 px-2 py-0.5 rounded-full">
                          Đang kích hoạt
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-aura-muted font-light leading-relaxed">
                      {th.tagline}
                    </p>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {th.colors.map((c, i) => (
                        <span
                          key={i}
                          style={{ backgroundColor: c }}
                          className="w-4 h-4 rounded-full border border-black/10 inline-block"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <Check size={18} className="text-aura-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-aura-border text-center">
          <p className="text-[11px] text-aura-muted font-mono">
            Chủ đề sẽ được lưu tự động trên trình duyệt của em
          </p>
        </div>

      </div>
    </div>
  );
};

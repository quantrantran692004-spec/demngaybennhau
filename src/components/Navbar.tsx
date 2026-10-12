import React from 'react';
import { 
  Sparkles, 
  Mail, 
  BookHeart, 
  Smile, 
  Gamepad2, 
  Music, 
  Gift, 
  Image as ImageIcon, 
  CalendarHeart, 
  MessageSquareHeart, 
  ListChecks, 
  Settings, 
  Palette 
} from 'lucide-react';
import { ThemeMode } from '../types';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSettings: () => void;
  onOpenThemeModal: () => void;
  currentTheme: ThemeMode;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenSettings,
  onOpenThemeModal,
}) => {
  const navItems = [
    { id: 'hero', label: 'Trang chủ', icon: Sparkles },
    { id: 'letters', label: 'Hộp thư', icon: Mail },
    { id: 'memories', label: 'Kỷ niệm', icon: BookHeart },
    { id: 'mood', label: 'Tâm trạng', icon: Smile },
    { id: 'timeline', label: 'Đếm ngày', icon: CalendarHeart },
    { id: 'gallery', label: 'Album ảnh', icon: ImageIcon },
    { id: 'wishes', label: 'Ước nguyện', icon: ListChecks },
    { id: 'games', label: 'Trò chơi', icon: Gamepad2 },
    { id: 'surprise', label: 'Bất ngờ', icon: Gift },
  ];

  return (
    <>
      {/* Desktop Floating Navigation Dock */}
      <header className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-40 items-center justify-between px-6 py-3 rounded-full glass-panel shadow-floating border border-aura-border transition-all duration-300 max-w-4xl w-[92%]">
        <button 
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2 group text-left cursor-pointer"
        >
          <span className="w-8 h-8 rounded-full bg-aura-primary/15 flex items-center justify-center text-aura-primary font-serif font-bold text-sm group-hover:scale-105 transition-transform">
            ✦
          </span>
          <span className="font-serif italic font-semibold text-aura-text tracking-wide text-sm hidden lg:inline">
            Her World
          </span>
        </button>

        {/* Primary nav buttons */}
        <nav className="flex items-center gap-1">
          {navItems.slice(0, 7).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-aura-primary text-white shadow-soft-glow' 
                    : 'text-aura-muted hover:text-aura-text hover:bg-aura-surface/60'
                }`}
              >
                <Icon size={14} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick controls */}
        <div className="flex items-center gap-2 border-l border-aura-border pl-3">
          <button
            onClick={onOpenThemeModal}
            title="Đổi chủ đề mỹ cảm"
            className="p-2 rounded-full hover:bg-aura-surface text-aura-muted hover:text-aura-primary transition-all duration-200"
          >
            <Palette size={16} />
          </button>
          <button
            onClick={onOpenSettings}
            title="Cài đặt riêng tư & Quản lý"
            className="p-2 rounded-full hover:bg-aura-surface text-aura-muted hover:text-aura-primary transition-all duration-200"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 px-3 py-2.5 rounded-2xl glass-panel shadow-floating border border-aura-border flex items-center justify-around">
        <button
          onClick={() => onNavigate('hero')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            activeSection === 'hero' ? 'text-aura-primary font-semibold' : 'text-aura-muted'
          }`}
        >
          <Sparkles size={18} />
          <span>Chính</span>
        </button>
        <button
          onClick={() => onNavigate('letters')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            activeSection === 'letters' ? 'text-aura-primary font-semibold' : 'text-aura-muted'
          }`}
        >
          <Mail size={18} />
          <span>Thư</span>
        </button>
        <button
          onClick={() => onNavigate('memories')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            activeSection === 'memories' ? 'text-aura-primary font-semibold' : 'text-aura-muted'
          }`}
        >
          <BookHeart size={18} />
          <span>Nhật ký</span>
        </button>
        <button
          onClick={() => onNavigate('timeline')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            activeSection === 'timeline' ? 'text-aura-primary font-semibold' : 'text-aura-muted'
          }`}
        >
          <CalendarHeart size={18} />
          <span>Đếm ngày</span>
        </button>
        <button
          onClick={() => onNavigate('mood')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            activeSection === 'mood' ? 'text-aura-primary font-semibold' : 'text-aura-muted'
          }`}
        >
          <Smile size={18} />
          <span>Tâm trạng</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-0.5 text-[10px] text-aura-muted hover:text-aura-primary"
        >
          <Settings size={18} />
          <span>Cài đặt</span>
        </button>
      </nav>
    </>
  );
};

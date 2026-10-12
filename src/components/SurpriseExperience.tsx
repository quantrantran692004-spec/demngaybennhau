import React, { useState } from 'react';
import { Gift, Sparkles, Key, Lock, Unlock, Heart, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SurpriseProps {
  herName: string;
  isUnlocked: boolean;
  onToggleUnlocked: (unlocked: boolean) => void;
}

export const SurpriseExperience: React.FC<SurpriseProps> = ({
  herName,
  isUnlocked,
  onToggleUnlocked,
}) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnlockBox = () => {
    // Trực tiếp mở quà hoặc nhập mật mã nếu muốn
    onToggleUnlocked(true);
    triggerDelicateConfetti();
  };

  const triggerDelicateConfetti = () => {
    // Subtle star & flower petals confetti
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#E5C365', '#9E5B6A', '#FFFDFC'],
      shapes: ['circle', 'square'],
      ticks: 200,
      gravity: 0.8,
    });
  };

  return (
    <section id="surprise" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-aura-card via-aura-surface to-aura-card rounded-3xl p-8 sm:p-14 border border-aura-border shadow-luxury relative overflow-hidden text-center">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-aura-glow rounded-full blur-3xl pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-aura-primary">
            <Gift size={14} />
            <span>The Secret Sanctuary Vault</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-aura-text">
            Hộp Quà Ký Ức Bí Mật
          </h2>

          <p className="text-sm text-aura-muted leading-relaxed font-light">
            Một chiếc hộp kỹ thuật số chứa đựng thông điệp và món quà đặc biệt nhất. Chỉ khi em sẵn sàng, chiếc hộp mới hé mở.
          </p>

          {!isUnlocked ? (
            <div className="pt-6 flex flex-col items-center">
              {/* Sealed Gift Box Illustration */}
              <div 
                onClick={handleUnlockBox}
                className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-aura-primary to-aura-accent p-1 shadow-floating cursor-pointer hover:scale-105 transition-all duration-300 flex items-center justify-center group"
              >
                <div className="w-full h-full rounded-[22px] bg-aura-card flex flex-col items-center justify-center text-aura-primary border border-white/20">
                  <Gift size={40} className="group-hover:animate-bounce transition-transform" />
                  <span className="text-[10px] font-mono uppercase tracking-widest mt-1 text-aura-muted">
                    Nhấn để mở
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleUnlockBox}
                  className="px-6 py-3 rounded-full bg-aura-primary hover:bg-aura-primaryHover text-white text-xs sm:text-sm font-medium tracking-wide shadow-soft-glow flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Unlock size={16} />
                  <span>Mở khóa món quà bí mật</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unlocked Surprise Box */
            <div className="pt-4 space-y-6 animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center mx-auto shadow-soft-glow animate-pulse-subtle">
                <Heart size={32} className="fill-rose-500" />
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-aura-card border border-aura-border shadow-soft-glow text-left space-y-4">
                <div className="flex items-center justify-between border-b border-aura-border pb-3">
                  <span className="text-xs font-mono text-aura-primary uppercase tracking-wider">
                    Thông Điệp Độc Quyền Dành Cho {herName}
                  </span>
                  <span className="text-xs text-aura-muted font-mono">Vĩnh cửu</span>
                </div>

                <p className="font-serif italic text-base sm:text-lg text-aura-text leading-relaxed">
                  "Cảm ơn em vì đã đến và làm cho thế giới này trở nên dịu dàng hơn. Dù mai này cuộc sống có thăng trầm ra sao, em sẽ luôn là người mà anh trân quý và yêu thương nhất. Chúc cho nụ cười trên môi em không bao giờ tắt."
                </p>

                <div className="pt-2 text-xs text-aura-muted leading-relaxed font-light">
                  ✦ <strong>Món quà hiện thực đi kèm:</strong> Một buổi tối hẹn hò trọn vẹn tại nơi em thích nhất, với tất cả sự nâng niu và chuẩn bị kỹ lưỡng từ anh. Hãy nói với anh bất cứ khi nào em muốn nhé!
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={triggerDelicateConfetti}
                  className="px-4 py-2 rounded-full border border-aura-border hover:bg-aura-surface text-aura-text text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Rải cánh hoa chúc mừng</span>
                </button>

                <button
                  onClick={() => onToggleUnlocked(false)}
                  className="px-4 py-2 rounded-full border border-aura-border hover:bg-aura-surface text-aura-muted text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Đóng hộp lại</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowDown, Clock, Heart, Compass } from 'lucide-react';
import { UserProfile } from '../types';

interface HeroProps {
  profile: UserProfile;
  onExplore: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onExplore }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      );

      const hour = now.getHours();
      if (hour >= 5 && hour < 11) {
        setGreeting('Chào buổi sớm mai tinh khôi');
      } else if (hour >= 11 && hour < 14) {
        setGreeting('Một buổi trưa thật dịu lành nhé');
      } else if (hour >= 14 && hour < 18) {
        setGreeting('Chào buổi chiều hoàng hôn khẽ chạm');
      } else if (hour >= 18 && hour < 22) {
        setGreeting('Gửi em, một buổi tối bình yên');
      } else {
        setGreeting('Đêm đã khuya rồi, chúc em ngủ ngon');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="min-h-screen pt-28 pb-16 md:py-32 flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[600px] h-96 md:h-[600px] bg-aura-glow rounded-full blur-3xl pointer-events-none -z-10 opacity-70 animate-pulse-subtle" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-aura-highlight rounded-full blur-2xl pointer-events-none -z-10 opacity-40" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-aura-border bg-aura-card/60 backdrop-blur-sm self-start text-xs font-medium text-aura-muted shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <Clock size={13} className="text-aura-primary" />
            <span>{currentDate}</span>
            <span className="text-aura-border">|</span>
            <span className="font-mono text-aura-text">{currentTime}</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-aura-primary font-semibold">
              Bespoke Digital Sanctuary
            </p>
            <p className="font-serif italic text-base md:text-lg text-aura-muted">
              {greeting},
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-aura-text tracking-tight leading-[1.15]">
            Không Gian Của <br />
            <span className="text-gradient relative">
              {profile.herName} & {profile.myNickname}
            </span>
            <span className="text-rose-500 inline-block text-3xl ml-2 animate-pulse">♥</span>
          </h1>

          <p className="text-sm md:text-base text-aura-muted max-w-xl leading-relaxed font-light">
            {profile.heroQuote}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onExplore('letters')}
              className="px-6 py-3 rounded-full bg-aura-primary hover:bg-aura-primaryHover text-white text-xs md:text-sm font-medium tracking-wide shadow-soft-glow hover:shadow-luxury transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
            >
              <span>Khám phá thế giới riêng</span>
              <Compass size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </button>

            <button
              onClick={() => onExplore('timeline')}
              className="px-5 py-3 rounded-full border border-aura-border hover:border-aura-primary/50 bg-aura-card/40 hover:bg-aura-card text-aura-text text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Heart size={15} className="text-rose-400 fill-rose-400/20" />
              <span>Dấu mốc kỷ niệm</span>
            </button>
          </div>

          <div className="pt-2 text-xs text-aura-muted/80 flex items-center gap-2">
            <span>Dành tặng từ:</span>
            <span className="font-serif italic font-medium text-aura-text">{profile.myNickname}</span>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative group w-full max-w-sm sm:max-w-md">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-aura-highlight to-aura-glow opacity-60 blur-xl group-hover:opacity-80 transition duration-700 -z-10" />

            <div className="relative rounded-3xl overflow-hidden p-2.5 bg-aura-card border border-aura-border shadow-luxury">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-aura-surface">
                <img
                  src="/home-photo.jfif"
                  alt={profile.herName}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="eager"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[11px] uppercase tracking-widest text-white/80 font-mono">
                    Aura & Reverie
                  </p>
                  <p className="font-serif italic text-lg font-medium text-white/95 mt-0.5">
                    "Em là thanh âm êm dịu nhất giữa thế giới ồn ào."
                  </p>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-aura-primary text-white shadow-soft-glow flex items-center justify-center border-2 border-white/60">
                <Sparkles size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onExplore('letters')}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-aura-muted hover:text-aura-primary transition-colors cursor-pointer"
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">Cuộn xuống</span>
        <ArrowDown size={14} className="animate-bounce" />
      </button>
    </section>
  );
};

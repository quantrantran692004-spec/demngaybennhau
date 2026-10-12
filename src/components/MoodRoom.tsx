import React, { useState } from 'react';
import { 
  Smile, 
  Sun, 
  CloudSun, 
  CloudRain, 
  Coffee, 
  Sparkles, 
  HeartHandshake, 
  Feather, 
  RotateCcw, 
  Music, 
  CheckCircle2,
  LucideIcon 
} from 'lucide-react';
import { MoodType, ThemeMode } from '../types';
import { ambientPlayer } from '../services/audioSynthesizer';

interface MoodRoomProps {
  currentMood: MoodType | null;
  onSelectMood: (mood: MoodType | null) => void;
  onChangeTheme: (theme: ThemeMode) => void;
}

interface MoodConfig {
  id: MoodType;
  label: string;
  sub: string;
  icon: LucideIcon;
  themeMatch: ThemeMode;
  synthTone: 'piano' | 'ambient' | 'rain' | 'chime';
  message: string;
  suggestion: string;
  breathingText?: string;
}

const MOODS: MoodConfig[] = [
  {
    id: 'joyful',
    label: 'Vui vẻ & Rạng rỡ',
    sub: 'Tâm trạng ngập tràn năng lượng tích cực',
    icon: Sun,
    themeMatch: 'bloom',
    synthTone: 'piano',
    message: 'Nụ cười của em hôm nay là món quà tuyệt vời nhất. Hãy lưu giữ trọn vẹn niềm vui này và lan tỏa nó nhé!',
    suggestion: 'Bật một bài hát yêu thích, nhâm nhi món ngon hoặc nhắn tin chia sẻ một điều vui với người thân yêu.',
  },
  {
    id: 'peaceful',
    label: 'Bình yên & Tĩnh lặng',
    sub: 'Khoảng lặng êm đềm giữa dòng đời',
    icon: CloudSun,
    themeMatch: 'calm',
    synthTone: 'ambient',
    message: 'Những giây phút bình lặng trong tâm hồn là lúc ta cảm nhận vẻ đẹp của cuộc sống một cách sâu sắc nhất.',
    suggestion: 'Pha một ấm trà hoa cúc nóng, đọc vài trang sách nhẹ nhàng hoặc đơn giản là nhìn mây trôi ngoài cửa sổ.',
    breathingText: 'Hít vào bình an... Thở ra nhẹ nhõm...'
  },
  {
    id: 'melancholy',
    label: 'Hơi chùng lòng một chút',
    sub: 'Có những ngày lòng trĩu hạt mưa rào',
    icon: CloudRain,
    themeMatch: 'dreamy',
    synthTone: 'rain',
    message: 'Nỗi buồn cũng là một phần dịu dàng của cảm xúc. Em không cần phải cố gượng cười hay gồng mình mạnh mẽ.',
    suggestion: 'Đắp chăn ấm, cho phép mình nghỉ ngơi, nghe tiếng mưa rơi và uống một ngụm nước ấm.',
    breathingText: 'Buông bỏ âu lo... Mọi chuyện rồi sẽ ổn...'
  },
  {
    id: 'exhausted',
    label: 'Mệt mỏi sau ngày dài',
    sub: 'Cơ thể và tâm trí cần được nghỉ ngơi',
    icon: Coffee,
    themeMatch: 'midnight',
    synthTone: 'ambient',
    message: 'Hôm nay em đã rất cố gắng rồi. Cả thế giới ngoài kia cứ để ngày mai tính, bây giờ em hãy thả lỏng hoàn toàn nhé.',
    suggestion: 'Tắt hết thông báo công việc, ngâm chân nước ấm hoặc nằm thả lỏng các cơ bắp trong 15 phút.',
    breathingText: 'Thả lỏng đôi vai... Giữ tâm trí thật êm...'
  },
  {
    id: 'motivated',
    label: 'Tràn đầy cảm hứng',
    sub: 'Sẵn sàng chinh phục mục tiêu mới',
    icon: Sparkles,
    themeMatch: 'morning',
    synthTone: 'piano',
    message: 'Ánh mắt kiên định và nhiệt huyết của em thật cuốn hút. Anh tin vào mọi điều em đang hướng tới.',
    suggestion: 'Ghi ngay những ý tưởng tuyệt vời ra sổ tay và bắt đầu từng bước nhỏ nhất một cách tự tin.',
  },
  {
    id: 'craving_care',
    label: 'Muốn được vỗ về & yêu thương',
    sub: 'Cần một cái ôm ấm áp không lời',
    icon: HeartHandshake,
    themeMatch: 'dreamy',
    synthTone: 'chime',
    message: 'Luôn có một người thương em vô điều kiện, sẵn sàng lắng nghe mọi nỗi niềm của em bất kể ngày hay đêm.',
    suggestion: 'Hãy gửi ngay một tin nhắn cho người ấy, hoặc tự ôm lấy bờ vai mình và nhớ rằng em luôn được yêu thương.',
  },
  {
    id: 'solitude',
    label: 'Muốn một góc riêng cho mình',
    sub: 'Khoảng không tĩnh mịch tự chữa lành',
    icon: Feather,
    themeMatch: 'midnight',
    synthTone: 'ambient',
    message: 'Sự cô độc có chọn lọc chính là mảnh đất màu mỡ để ta kết nối lại với tiếng nói sâu thẳm bên trong mình.',
    suggestion: 'Đeo tai nghe, bật âm thanh ambient lofi dịu êm và tận hưởng thế giới không ai làm phiền này.',
    breathingText: 'Tĩnh lặng tuyệt đối... Trở về với chính mình...'
  }
];

export const MoodRoom: React.FC<MoodRoomProps> = ({
  currentMood,
  onSelectMood,
  onChangeTheme,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  const activeMoodConfig = MOODS.find(m => m.id === currentMood);

  const handleChooseMood = (mood: MoodConfig) => {
    onSelectMood(mood.id);
    onChangeTheme(mood.themeMatch);
    if (mood.synthTone) {
      ambientPlayer.playAmbientSequence(mood.synthTone);
      setIsPlayingMusic(true);
    }
  };

  const handleReset = () => {
    onSelectMood(null);
    onChangeTheme('morning');
    ambientPlayer.stop();
    setIsPlayingMusic(false);
    setIsBreathingActive(false);
  };

  const toggleSound = () => {
    if (isPlayingMusic) {
      ambientPlayer.stop();
      setIsPlayingMusic(false);
    } else if (activeMoodConfig) {
      ambientPlayer.playAmbientSequence(activeMoodConfig.synthTone);
      setIsPlayingMusic(true);
    }
  };

  return (
    <section id="mood" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-aura-primary mb-2">
            <Smile size={14} />
            <span>The Mood Sanctuary</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-aura-text">
            Góc Cảm Xúc Của Em Hôm Nay
          </h2>
          <p className="text-sm text-aura-muted mt-2 max-w-lg">
            Em đang cảm thấy thế nào lúc này? Hãy chọn một sắc thái tâm trạng, không gian xung quanh sẽ tự chuyển mình để lắng nghe và vỗ về em.
          </p>
        </div>

        {currentMood && (
          <button
            onClick={handleReset}
            className="self-start md:self-auto px-4 py-2 rounded-full border border-aura-border hover:bg-aura-surface text-aura-muted hover:text-aura-text text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Trở về mặc định</span>
          </button>
        )}
      </div>

      {/* Mood Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 mb-10">
        {MOODS.map((m) => {
          const Icon = m.icon;
          const isSelected = currentMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleChooseMood(m)}
              className={`p-4 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-aura-card border-aura-primary shadow-soft-glow scale-[1.02]'
                  : 'bg-aura-card/60 hover:bg-aura-card border-aura-border hover:border-aura-primary/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${
                  isSelected ? 'bg-aura-primary text-white' : 'bg-aura-surface text-aura-primary group-hover:scale-110'
                } transition-all`}>
                  <Icon size={18} />
                </div>
                {isSelected && (
                  <CheckCircle2 size={16} className="text-aura-primary" />
                )}
              </div>

              <div>
                <h4 className="font-serif font-semibold text-sm text-aura-text group-hover:text-aura-primary transition-colors">
                  {m.label}
                </h4>
                <p className="text-[11px] text-aura-muted line-clamp-1 mt-0.5">
                  {m.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Mood Experience Card */}
      {activeMoodConfig && (
        <div className="bg-aura-card rounded-3xl p-6 sm:p-10 border border-aura-border shadow-luxury animate-fade-up relative overflow-hidden">
          {/* Subtle Ambient Light Orb */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-aura-glow rounded-full blur-3xl pointer-events-none -z-0 opacity-40" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Comfort Message & Suggestion */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aura-surface text-aura-primary text-xs font-mono">
                <span>Trạng thái:</span>
                <strong className="font-serif">{activeMoodConfig.label}</strong>
              </div>

              <blockquote className="font-serif text-lg sm:text-xl text-aura-text italic leading-relaxed border-l-2 border-aura-primary pl-4">
                "{activeMoodConfig.message}"
              </blockquote>

              <div className="p-4 rounded-2xl bg-aura-surface/80 border border-aura-border text-xs text-aura-muted space-y-1.5">
                <span className="font-semibold text-aura-text block uppercase tracking-wider text-[10px]">
                  Gợi ý xoa dịu dành riêng cho em:
                </span>
                <p className="leading-relaxed text-aura-text/90">
                  {activeMoodConfig.suggestion}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <button
                  onClick={toggleSound}
                  className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    isPlayingMusic
                      ? 'bg-aura-primary text-white shadow-soft-glow'
                      : 'bg-aura-surface text-aura-text border border-aura-border hover:bg-aura-card'
                  }`}
                >
                  <Music size={14} className={isPlayingMusic ? 'animate-spin' : ''} />
                  <span>{isPlayingMusic ? 'Đang phát âm thanh thư giãn' : 'Bật âm thanh vỗ về'}</span>
                </button>

                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className="px-4 py-2 rounded-full bg-aura-surface hover:bg-aura-card text-aura-text border border-aura-border text-xs font-medium transition-all cursor-pointer"
                >
                  {isBreathingActive ? 'Đóng nhịp thở' : 'Bài tập thở chậm êm ái'}
                </button>
              </div>
            </div>

            {/* Right Column: Breathing Circle Zen Sphere */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6">
              {isBreathingActive ? (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-aura-glow animate-breath" />
                    <div className="relative z-10 w-28 h-28 rounded-full bg-aura-surface border border-aura-border shadow-inner flex flex-col items-center justify-center text-center p-2">
                      <span className="text-xs font-serif font-medium text-aura-text">Thở sâu</span>
                      <span className="text-[10px] text-aura-muted font-mono mt-0.5">4s - 7s - 8s</span>
                    </div>
                  </div>
                  <p className="text-xs text-aura-muted font-serif italic max-w-xs">
                    {activeMoodConfig.breathingText || 'Hít vào nhẹ nhàng, thở ra êm đềm... Buông lơi mọi suy nghĩ'}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 rounded-2xl bg-aura-surface/40 border border-dashed border-aura-border text-center">
                  <Feather size={32} className="text-aura-primary mb-3 animate-float" />
                  <p className="font-serif italic text-sm text-aura-text font-medium">
                    "Ở đây, mọi cảm xúc của em đều được đón nhận trọn vẹn."
                  </p>
                  <p className="text-[11px] text-aura-muted mt-1">
                    Hãy nhấn nút "Bài tập thở chậm" nếu em muốn thả lỏng tâm trí.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState } from 'react';
import { Gamepad2, Shuffle, Sparkles, CheckCircle2, RotateCcw, Trophy, Gift, Compass, Dices } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sampleGameCards, sampleQuizQuestions } from '../data/defaultData';

export const InteractiveGames: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cards' | 'quiz' | 'dice'>('cards');
  const [dice, setDice] = useState<[number, number]>([3, 5]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    let ticks = 0;
    const timer = window.setInterval(() => {
      setDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
      ticks += 1;
      if (ticks >= 10) {
        window.clearInterval(timer);
        setRollCount(count => count + 1);
        setIsRolling(false);
      }
    }, 90);
  };

  // Mini-game 1: Serendipity Cards State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [drawCount, setDrawCount] = useState<number>(1);

  const handleDrawCard = () => {
    setIsCardFlipped(false);
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * sampleGameCards.length);
      if (nextIndex === currentCardIndex) {
        nextIndex = (currentCardIndex + 1) % sampleGameCards.length;
      }
      setCurrentCardIndex(nextIndex);
      setIsCardFlipped(true);
      setDrawCount(prev => prev + 1);

      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#9E5B6A', '#B8977E']
      });
    }, 250);
  };

  // Mini-game 2: Soul Quest State
  const [quizStep, setQuizStep] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, pointKey: string) => {
    setUserAnswers({ ...userAnswers, [questionId]: pointKey });
    if (quizStep < sampleQuizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestartQuiz = () => {
    setQuizStep(0);
    setUserAnswers({});
    setQuizFinished(false);
  };

  const currentCard = sampleGameCards[currentCardIndex];

  return (
    <section id="games" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-aura-primary mb-2">
            <Gamepad2 size={14} />
            <span>Interactive Mini Games</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-aura-text">
            Góc Tương Tác Vui Vẻ
          </h2>
          <p className="text-sm text-aura-muted mt-2 max-w-lg">
            Hai trò chơi nhỏ thực sự hoạt động, được tạo ra để mang đến nụ cười và những bất ngờ nho nhỏ mỗi khi em ghé thăm.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-aura-surface border border-aura-border self-start">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-aura-primary text-white shadow-soft-glow'
                : 'text-aura-muted hover:text-aura-text'
            }`}
          >
            Hộp Thẻ Duyên Lành
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-aura-primary text-white shadow-soft-glow'
                : 'text-aura-muted hover:text-aura-text'
            }`}
          >
            Hành Trình Thấu Cảm
          </button>
          <button
            onClick={() => setActiveTab('dice')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${activeTab === 'dice' ? 'bg-aura-primary text-white shadow-soft-glow' : 'text-aura-muted hover:text-aura-text'}`}
          >
            Xúc Xắc
          </button>
        </div>
      </div>

      {/* GAME 1: SERENDIPITY CARDS */}
      {activeTab === 'cards' && (
        <div className="bg-aura-card rounded-3xl p-6 sm:p-12 border border-aura-border shadow-luxury flex flex-col items-center text-center animate-fade-in relative overflow-hidden">
          <div className="max-w-md w-full">
            <span className="text-xs font-mono uppercase tracking-widest text-aura-primary block mb-2">
              Lần rút thứ #{drawCount}
            </span>
            <h3 className="text-2xl font-serif font-bold text-aura-text mb-2">
              Bốc Thẻ Duyên Lành Ngẫu Nhiên
            </h3>
            <p className="text-xs text-aura-muted mb-8">
              Mỗi tấm thẻ chứa đựng một lời khen, một đặc quyền hẹn hò, hoặc một thử thách ấm áp dành riêng cho em.
            </p>

            {/* Interactive Card Presentation */}
            <div className="relative w-full aspect-[4/3] rounded-3xl p-8 bg-gradient-to-br from-aura-surface via-aura-card to-aura-highlight border-2 border-aura-border shadow-luxury flex flex-col items-center justify-center text-center transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aura-primary px-2.5 py-1 rounded-full bg-aura-card border border-aura-border">
                  {currentCard.type === 'compliment' && '✦ Lời Khen'}
                  {currentCard.type === 'invitation' && '★ Đặc Quyền'}
                  {currentCard.type === 'challenge' && '♥ Thử Thách'}
                  {currentCard.type === 'deep_question' && '💬 Tâm Sự'}
                </span>
              </div>

              <Sparkles size={28} className="text-aura-primary mb-3 animate-float" />
              
              <h4 className="font-serif font-bold text-xl text-aura-text mb-3">
                {currentCard.title}
              </h4>

              <p className="text-sm text-aura-muted leading-relaxed font-light px-2">
                "{currentCard.description}"
              </p>
            </div>

            {/* Draw Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleDrawCard}
                className="px-6 py-3 rounded-full bg-aura-primary hover:bg-aura-primaryHover text-white text-xs sm:text-sm font-medium tracking-wide shadow-soft-glow flex items-center gap-2 transition-all cursor-pointer group"
              >
                <Shuffle size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>Rút tấm thẻ ngẫu nhiên mới</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dice' && (
        <div className="bg-aura-card rounded-3xl p-6 sm:p-12 border border-aura-border shadow-luxury flex flex-col items-center text-center animate-fade-in relative overflow-hidden">
          <div className="max-w-md w-full">
            <span className="text-xs font-mono uppercase tracking-widest text-aura-primary block mb-2">
              {rollCount === 0 ? 'Sẵn sàng gieo' : `Lần gieo thứ #${rollCount}`}
            </span>
            <h3 className="text-2xl font-serif font-bold text-aura-text mb-2">Gieo Xúc Xắc</h3>
            <p className="text-xs text-aura-muted mb-8">Gieo hai viên xúc xắc và xem hôm nay mình nhận được bao nhiêu điểm nhé.</p>
            <div className="flex justify-center gap-5 sm:gap-7 py-5" aria-live="polite" aria-label={`Kết quả ${dice[0]} và ${dice[1]}`}>
              {dice.map((value, index) => {
                const positions: Record<number, number[]> = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
                return <div key={index} className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-aura-surface border-2 border-aura-border shadow-luxury grid grid-cols-3 grid-rows-3 place-items-center p-4 ${isRolling ? 'animate-bounce' : ''}`}>
                  {Array.from({ length: 9 }, (_, pip) => <span key={pip} className={`w-3 h-3 rounded-full ${positions[value].includes(pip) ? 'bg-aura-primary' : 'bg-transparent'}`} />)}
                </div>;
              })}
            </div>
            <p className="mt-3 text-sm text-aura-muted">Tổng điểm <strong className="text-aura-primary text-lg">{dice[0] + dice[1]}</strong></p>
            <button onClick={rollDice} disabled={isRolling} className="mt-7 px-6 py-3 rounded-full bg-aura-primary hover:bg-aura-primaryHover disabled:opacity-60 text-white text-xs sm:text-sm font-medium tracking-wide shadow-soft-glow flex items-center gap-2 mx-auto transition-all cursor-pointer disabled:cursor-wait">
              <Dices size={17} className={isRolling ? 'animate-spin' : ''} />
              <span>{isRolling ? 'Đang gieo...' : 'Gieo xúc xắc'}</span>
            </button>
          </div>
        </div>
      )}
      {/* GAME 2: SOUL QUEST QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-aura-card rounded-3xl p-6 sm:p-12 border border-aura-border shadow-luxury animate-fade-in">
          {!quizFinished ? (
            <div className="max-w-xl mx-auto space-y-8">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs font-mono text-aura-muted">
                <span>Câu hỏi {quizStep + 1} / {sampleQuizQuestions.length}</span>
                <span className="text-aura-primary font-bold">
                  {Math.round(((quizStep + 1) / sampleQuizQuestions.length) * 100)}%
                </span>
              </div>

              {/* Question Content */}
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-aura-text mb-3">
                  {sampleQuizQuestions[quizStep].question}
                </h3>
                <p className="text-xs text-aura-muted">
                  Hãy chọn phương án chân thật nhất với cảm xúc của em ngay lúc này.
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {sampleQuizQuestions[quizStep].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(sampleQuizQuestions[quizStep].id, opt.points)}
                    className="w-full text-left p-4 rounded-2xl bg-aura-surface hover:bg-aura-highlight/50 border border-aura-border hover:border-aura-primary transition-all duration-200 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-aura-card border border-aura-border flex items-center justify-center font-serif font-bold text-xs text-aura-primary group-hover:scale-105">
                        {opt.label}
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-aura-text">
                          {opt.text}
                        </p>
                        <p className="text-[11px] text-aura-muted mt-0.5 font-light">
                          {opt.hint}
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 size={16} className="text-aura-border group-hover:text-aura-primary transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Quiz Completed Result */
            <div className="max-w-lg mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mx-auto shadow-soft-glow">
                <Trophy size={32} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-aura-primary">
                  Kết Quả Thấu Cảm
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-aura-text">
                  Em Là Một Tâm Hồn Tinh Tế & Đầy Sâu Sắc
                </h3>
              </div>

              <p className="text-sm text-aura-muted leading-relaxed font-light">
                Dù là một buổi tối tĩnh mịch hay những khoảnh khắc dạo phố rộn ràng, em luôn biết cách trân trọng những giá trị chân thật nhất. Cảm ơn em vì đã là chính mình — một phiên bản duy nhất và đáng trân quý.
              </p>

              <div className="p-4 rounded-2xl bg-aura-surface border border-aura-border text-xs text-aura-primary flex items-center justify-center gap-2">
                <Gift size={16} />
                <span>Mật mã phần thưởng: <strong>YEU_EM_MOI_NGAY_2024</strong> (Nhận một cái ôm dài 2 phút!)</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 rounded-full border border-aura-border hover:bg-aura-surface text-aura-text text-xs font-medium flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Làm lại trắc nghiệm</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

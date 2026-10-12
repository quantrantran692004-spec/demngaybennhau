import React, { useState } from 'react';
import { MessageSquareHeart, Sparkles, RefreshCw, Plus, X, Heart, Quote } from 'lucide-react';
import { DailyNote } from '../types';

interface DailyMessageProps {
  notes: DailyNote[];
  onUpdateNotes: (notes: DailyNote[]) => void;
}

export const DailyMessage: React.FC<DailyMessageProps> = ({ notes, onUpdateNotes }) => {
  // Deterministic daily note based on day of year, or user can shuffle
  const getTodayIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % (notes.length || 1);
  };

  const [currentIndex, setCurrentIndex] = useState<number>(getTodayIndex());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState('');
  const [newTag, setNewTag] = useState('Yêu thương');

  const currentNote = notes[currentIndex] || notes[0];

  const handleShuffle = () => {
    let nextIdx = Math.floor(Math.random() * notes.length);
    if (nextIdx === currentIndex && notes.length > 1) {
      nextIdx = (currentIndex + 1) % notes.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.trim()) return;

    const noteItem: DailyNote = {
      id: 'note-' + Date.now(),
      quote: newQuote,
      author: 'Gửi em',
      tag: newTag || 'Dịu dàng',
    };

    onUpdateNotes([noteItem, ...notes]);
    setNewQuote('');
    setIsModalOpen(false);
    setCurrentIndex(0);
  };

  return (
    <section id="daily" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-aura-card rounded-3xl p-8 sm:p-12 border border-aura-border shadow-luxury relative overflow-hidden">
        
        {/* Decorative Quote Icon Background */}
        <div className="absolute top-4 left-6 text-aura-highlight/50 pointer-events-none -z-0">
          <Quote size={80} className="fill-current opacity-40 rotate-180" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-aura-primary">
            <MessageSquareHeart size={14} />
            <span>Hũ Lời Nhắn Mỗi Ngày</span>
          </div>

          <div className="max-w-xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-aura-surface border border-aura-border text-xs text-aura-primary font-mono">
              ✦ Chủ đề: {currentNote.tag}
            </span>

            <blockquote className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-aura-text leading-relaxed font-medium">
              "{currentNote.quote}"
            </blockquote>

            <div className="flex items-center justify-center gap-2 text-xs text-aura-muted font-serif">
              <span>— {currentNote.author}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={handleShuffle}
              className="px-5 py-2.5 rounded-full bg-aura-primary hover:bg-aura-primaryHover text-white text-xs font-medium tracking-wide shadow-soft-glow flex items-center gap-2 transition-all cursor-pointer group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>Rút một lời nhắn khác</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-full border border-aura-border hover:bg-aura-surface text-aura-muted hover:text-aura-text text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Góp thêm lời nhắn</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-aura-muted/70">
            Tổng cộng {notes.length} câu nhắn gửi yêu thương trong hũ
          </span>
        </div>
      </div>

      {/* Add Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-md w-full bg-aura-card rounded-2xl p-6 shadow-2xl border border-aura-border animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-aura-text">
                Bỏ thêm lời nhắn vào hũ
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-aura-muted hover:text-aura-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-aura-muted mb-1 font-medium">Lời nhắn gửi *</label>
                <textarea
                  rows={4}
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="Viết một lời nhắn dịu dàng, khích lệ hoặc hài hước..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-aura-muted mb-1 font-medium">Chủ đề lời nhắn</label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Vỗ về, Yêu thương, Động lực, Nhớ nhung..."
                  className="w-full px-3.5 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-aura-border text-aura-muted hover:bg-aura-surface"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-aura-primary text-white font-medium hover:bg-aura-primaryHover"
                >
                  Bỏ vào hũ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

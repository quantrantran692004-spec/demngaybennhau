import React, { useState } from 'react';
import { Mail, Lock, Unlock, Plus, Trash2, Edit3, X, Check, Calendar, Heart, ShieldAlert } from 'lucide-react';
import { SecretLetter } from '../types';

interface SecretLettersProps {
  letters: SecretLetter[];
  onUpdateLetters: (letters: SecretLetter[]) => void;
}

export const SecretLetters: React.FC<SecretLettersProps> = ({ letters, onUpdateLetters }) => {
  const [selectedLetter, setSelectedLetter] = useState<SecretLetter | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Add/Edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<SecretLetter | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<SecretLetter['category']>('love');
  const [formContent, setFormContent] = useState('');
  const [formUnlockDate, setFormUnlockDate] = useState('');
  const [formWaxColor, setFormWaxColor] = useState('#9E5B6A');

  const today = new Date().toISOString().slice(0, 10);

  const isLocked = (letter: SecretLetter): boolean => {
    if (!letter.unlockDate) return false;
    return letter.unlockDate > today;
  };

  const handleOpenLetter = (letter: SecretLetter) => {
    if (isLocked(letter)) return;
    
    // Mark as read
    if (!letter.isRead) {
      const updated = letters.map(l => l.id === letter.id ? { ...l, isRead: true } : l);
      onUpdateLetters(updated);
    }
    setSelectedLetter(letter);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa lá thư này không?')) {
      const updated = letters.filter(l => l.id !== id);
      onUpdateLetters(updated);
      if (selectedLetter?.id === id) {
        setSelectedLetter(null);
      }
    }
  };

  const handleStartEdit = (letter: SecretLetter, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLetter(letter);
    setFormTitle(letter.title);
    setFormCategory(letter.category);
    setFormContent(letter.content);
    setFormUnlockDate(letter.unlockDate || '');
    setFormWaxColor(letter.waxColor || '#9E5B6A');
    setIsModalOpen(true);
  };

  const handleStartAdd = () => {
    setEditingLetter(null);
    setFormTitle('');
    setFormCategory('love');
    setFormContent('');
    setFormUnlockDate('');
    setFormWaxColor('#9E5B6A');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingLetter) {
      const updated = letters.map(l => l.id === editingLetter.id ? {
        ...l,
        title: formTitle,
        category: formCategory,
        content: formContent,
        snippet: formContent.slice(0, 70) + '...',
        unlockDate: formUnlockDate || undefined,
        waxColor: formWaxColor,
      } : l);
      onUpdateLetters(updated);
    } else {
      const newLetter: SecretLetter = {
        id: 'letter-' + Date.now(),
        title: formTitle,
        category: formCategory,
        author: 'Anh',
        dateSent: today,
        unlockDate: formUnlockDate || undefined,
        snippet: formContent.slice(0, 70) + '...',
        content: formContent,
        isRead: false,
        waxColor: formWaxColor,
      };
      onUpdateLetters([newLetter, ...letters]);
    }
    setIsModalOpen(false);
  };

  const filteredLetters = filterCategory === 'all'
    ? letters
    : letters.filter(l => l.category === filterCategory);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'love': return 'Tình yêu';
      case 'comfort': return 'Vỗ về & An ủi';
      case 'birthday': return 'Sinh nhật';
      case 'future': return 'Tương lai';
      case 'gratitude': return 'Biết ơn';
      default: return 'Tâm tình';
    }
  };

  return (
    <section id="letters" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-aura-primary mb-2">
            <Mail size={14} />
            <span>Secret Letter Box</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-aura-text">
            Hộp Thư Riêng Cho Em
          </h2>
          <p className="text-sm text-aura-muted mt-2 max-w-lg">
            Những phong thư được gấp lại bằng tất cả chân thành. Có những lá thư mở ngay, và có những lá thư được khóa kín đợi ngày đặc biệt.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartAdd}
            className="px-4 py-2.5 rounded-full bg-aura-primary hover:bg-aura-primaryHover text-white text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Viết thư mới</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-medium scrollbar-none">
        {['all', 'love', 'comfort', 'birthday'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-aura-primary text-white shadow-soft-glow'
                : 'bg-aura-surface text-aura-muted hover:text-aura-text'
            }`}
          >
            {cat === 'all' ? 'Tất cả phong thư' : getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLetters.map((letter) => {
          const locked = isLocked(letter);
          return (
            <div
              key={letter.id}
              onClick={() => handleOpenLetter(letter)}
              className={`relative rounded-2xl p-6 transition-all duration-300 group cursor-pointer border ${
                locked
                  ? 'bg-aura-surface/50 border-aura-border/60 opacity-80'
                  : 'bg-aura-card border-aura-border hover:shadow-luxury hover:-translate-y-1'
              }`}
            >
              {/* Envelope Texture / Border Deco */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-aura-muted px-2.5 py-1 rounded-full bg-aura-surface">
                  {getCategoryLabel(letter.category)}
                </span>

                {/* Wax Seal Badge */}
                <div
                  style={{ backgroundColor: letter.waxColor || '#9E5B6A' }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm text-xs font-serif font-bold transition-transform group-hover:scale-110"
                  title="Con dấu sáp niêm phong"
                >
                  {locked ? <Lock size={13} /> : (letter.isRead ? <Unlock size={13} /> : '✦')}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-serif font-semibold text-aura-text mb-2 line-clamp-1 group-hover:text-aura-primary transition-colors">
                {letter.title}
              </h3>

              {/* Snippet or Locked Message */}
              {locked ? (
                <div className="py-4 px-3 rounded-xl bg-aura-highlight/40 border border-aura-border text-xs text-aura-muted flex items-center gap-2.5 my-3">
                  <Lock size={15} className="text-amber-600 shrink-0" />
                  <span>
                    Được khóa kín đến ngày: <strong className="text-aura-text">{letter.unlockDate}</strong>
                  </span>
                </div>
              ) : (
                <p className="text-xs text-aura-muted leading-relaxed line-clamp-3 mb-4 font-light">
                  {letter.snippet}
                </p>
              )}

              {/* Footer Meta */}
              <div className="flex items-center justify-between pt-3 border-t border-aura-border/60 text-[11px] text-aura-muted">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{letter.dateSent}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleStartEdit(letter, e)}
                    className="p-1 hover:text-aura-primary transition-colors"
                    title="Chỉnh sửa thư"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(letter.id, e)}
                    className="p-1 hover:text-rose-500 transition-colors"
                    title="Xóa thư"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Unread Indicator Dot */}
              {!letter.isRead && !locked && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLetters.length === 0 && (
        <div className="text-center py-16 bg-aura-card/50 rounded-2xl border border-dashed border-aura-border">
          <Mail size={32} className="mx-auto text-aura-muted/60 mb-3" />
          <p className="text-sm font-medium text-aura-text">Chưa có lá thư nào trong chủ đề này</p>
          <p className="text-xs text-aura-muted mt-1">Hãy nhấn nút "Viết thư mới" để lưu lại những lời nhắn gửi riêng tư.</p>
        </div>
      )}

      {/* Reading Modal: Digital Letter Paper Effect */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-[#FDFBF7] text-[#2C2623] rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E8DFD8] relative animate-fade-up">
            
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-gray-500 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            {/* Letter Header */}
            <div className="border-b border-[#E8DFD8] pb-6 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8E735B] mb-2">
                <span>{getCategoryLabel(selectedLetter.category)}</span>
                <span>•</span>
                <span>{selectedLetter.dateSent}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2623]">
                {selectedLetter.title}
              </h2>
            </div>

            {/* Letter Body in Rich Typography */}
            <div className="font-serif text-sm sm:text-base leading-relaxed text-[#3D352E] whitespace-pre-line space-y-4">
              {selectedLetter.content}
            </div>

            {/* Letter Signature */}
            <div className="mt-10 pt-6 border-t border-[#E8DFD8] flex items-center justify-between">
              <div className="text-xs text-gray-500 font-mono">
                Niêm phong bí mật • Chỉ dành riêng cho em
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Người viết</p>
                <p className="font-script text-2xl font-bold text-[#8E735B] mt-1">{selectedLetter.author}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Letter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-aura-card rounded-2xl p-6 shadow-2xl border border-aura-border animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-aura-text">
                {editingLetter ? 'Chỉnh sửa phong thư' : 'Soạn phong thư mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-aura-muted hover:text-aura-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-aura-muted mb-1 font-medium">Tiêu đề lá thư *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Gửi em vào một ngày mưa..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-aura-muted mb-1 font-medium">Chủ đề thư</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as SecretLetter['category'])}
                    className="w-full px-3 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  >
                    <option value="love">Tình yêu</option>
                    <option value="comfort">Vỗ về & An ủi</option>
                    <option value="birthday">Sinh nhật</option>
                    <option value="future">Tương lai</option>
                    <option value="gratitude">Biết ơn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-aura-muted mb-1 font-medium">Khóa đến ngày (tùy chọn)</label>
                  <input
                    type="date"
                    value={formUnlockDate}
                    onChange={(e) => setFormUnlockDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-aura-muted mb-1 font-medium">Màu con dấu sáp</label>
                <div className="flex items-center gap-3">
                  {['#9E5B6A', '#5A6B63', '#D4AF37', '#8E735B', '#2C302E'].map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormWaxColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full transition-transform ${formWaxColor === c ? 'scale-125 ring-2 ring-aura-primary ring-offset-2' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-aura-muted mb-1 font-medium">Nội dung thư *</label>
                <textarea
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Viết những lời chân thành nhất gửi đến cô ấy..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary leading-relaxed"
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
                  {editingLetter ? 'Lưu thay đổi' : 'Gửi thư vào hòm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

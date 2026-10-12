import React, { useState } from 'react';
import { 
  ListChecks, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Compass, 
  Utensils, 
  HeartHandshake, 
  Plane, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WishItem } from '../types';

interface WishListProps {
  wishes: WishItem[];
  onUpdateWishes: (wishes: WishItem[]) => void;
}

export const WishList: React.FC<WishListProps> = ({ wishes, onUpdateWishes }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWish, setEditingWish] = useState<WishItem | null>(null);

  const [formText, setFormText] = useState('');
  const [formCategory, setFormCategory] = useState<WishItem['category']>('travel');
  const [formNotes, setFormNotes] = useState('');

  const completedCount = wishes.filter(w => w.completed).length;
  const progressPercent = wishes.length > 0 ? Math.round((completedCount / wishes.length) * 100) : 0;

  const handleToggleComplete = (id: string) => {
    const updated = wishes.map(w => {
      if (w.id === id) {
        const nextStatus = !w.completed;
        if (nextStatus) {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#D4AF37', '#9E5B6A', '#5A6B63']
          });
        }
        return {
          ...w,
          completed: nextStatus,
          completedDate: nextStatus ? new Date().toISOString().slice(0, 10) : undefined
        };
      }
      return w;
    });
    onUpdateWishes(updated);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Xóa ước nguyện này khỏi danh sách?')) {
      onUpdateWishes(wishes.filter(w => w.id !== id));
    }
  };

  const handleStartEdit = (w: WishItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingWish(w);
    setFormText(w.text);
    setFormCategory(w.category);
    setFormNotes(w.notes || '');
    setIsModalOpen(true);
  };

  const handleStartAdd = () => {
    setEditingWish(null);
    setFormText('');
    setFormCategory('travel');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    if (editingWish) {
      const updated = wishes.map(w => w.id === editingWish.id ? {
        ...w,
        text: formText,
        category: formCategory,
        notes: formNotes || undefined,
      } : w);
      onUpdateWishes(updated);
    } else {
      const newWish: WishItem = {
        id: 'wish-' + Date.now(),
        text: formText,
        category: formCategory,
        completed: false,
        notes: formNotes || undefined,
      };
      onUpdateWishes([...wishes, newWish]);
    }
    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'travel': return <Plane size={14} className="text-sky-500" />;
      case 'food': return <Utensils size={14} className="text-amber-500" />;
      case 'heart': return <HeartHandshake size={14} className="text-rose-500" />;
      default: return <Sparkles size={14} className="text-emerald-500" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'travel': return 'Du lịch & Khám phá';
      case 'food': return 'Ẩm thực & Món ngon';
      case 'heart': return 'Tâm tình & Gắn kết';
      case 'experience': return 'Trải nghiệm mới';
      default: return 'Đời thường dịu dàng';
    }
  };

  const filteredWishes = filterCategory === 'all'
    ? wishes
    : wishes.filter(w => w.category === filterCategory);

  return (
    <section id="wishes" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-aura-primary mb-2">
            <ListChecks size={14} />
            <span>The Shared Bucket List</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-aura-text">
            Những Điều Ước Cùng Nhau
          </h2>
          <p className="text-sm text-aura-muted mt-2 max-w-lg">
            Mỗi điều ước là một lời hẹn ước cho tương lai. Từng bước một, chúng mình sẽ cùng nhau hoàn thành tất cả.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2.5 rounded-full bg-aura-primary hover:bg-aura-primaryHover text-white text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Thêm điều ước mới</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-aura-card rounded-3xl p-6 sm:p-8 border border-aura-border shadow-luxury mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-aura-muted block mb-1">
              Tiến độ hoàn thành
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-aura-text">
                {completedCount} / {wishes.length}
              </span>
              <span className="text-xs text-aura-primary font-mono">
                ({progressPercent}% đã thực hiện)
              </span>
            </div>
          </div>

          <div className="text-xs text-aura-muted font-serif italic max-w-xs text-right hidden sm:block">
            "Cuộc đời là một chuyến hành trình dài, và điều đẹp nhất là có em đồng hành trong từng cột mốc."
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-aura-surface overflow-hidden border border-aura-border p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-aura-primary to-aura-accent transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs font-medium scrollbar-none">
        {['all', 'travel', 'food', 'experience', 'heart'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-aura-primary text-white shadow-soft-glow'
                : 'bg-aura-surface text-aura-muted hover:text-aura-text'
            }`}
          >
            {cat === 'all' ? 'Tất cả điều ước' : getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Wishes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWishes.map((wish) => (
          <div
            key={wish.id}
            onClick={() => handleToggleComplete(wish.id)}
            className={`p-5 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-4 cursor-pointer group ${
              wish.completed
                ? 'bg-aura-surface/40 border-aura-border/60 opacity-80'
                : 'bg-aura-card border-aura-border hover:shadow-luxury hover:border-aura-primary/50'
            }`}
          >
            <div className="flex items-start gap-3 flex-1">
              <button
                type="button"
                className="mt-0.5 text-aura-muted hover:text-aura-primary transition-colors shrink-0"
              >
                {wish.completed ? (
                  <CheckCircle2 size={20} className="text-emerald-500 fill-emerald-500/20" />
                ) : (
                  <Circle size={20} className="text-aura-border group-hover:text-aura-primary" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-aura-surface">
                    {getCategoryIcon(wish.category)}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-aura-muted">
                    {getCategoryLabel(wish.category)}
                  </span>
                </div>

                <p className={`text-sm font-medium ${
                  wish.completed ? 'line-through text-aura-muted' : 'text-aura-text'
                }`}>
                  {wish.text}
                </p>

                {wish.notes && (
                  <p className="text-xs text-aura-muted/80 font-light italic">
                    "{wish.notes}"
                  </p>
                )}

                {wish.completed && wish.completedDate && (
                  <span className="inline-block text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                    Đã hoàn thành ngày {wish.completedDate}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handleStartEdit(wish, e)}
                className="p-1.5 hover:text-aura-primary text-aura-muted transition-colors"
                title="Chỉnh sửa"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={(e) => handleDelete(wish.id, e)}
                className="p-1.5 hover:text-rose-500 text-aura-muted transition-colors"
                title="Xóa"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-md w-full bg-aura-card rounded-2xl p-6 shadow-2xl border border-aura-border animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-aura-text">
                {editingWish ? 'Chỉnh sửa điều ước' : 'Thêm điều ước mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-aura-muted hover:text-aura-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-aura-muted mb-1 font-medium">Điều em muốn cùng nhau làm *</label>
                <input
                  type="text"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Ví dụ: Đi ngắm bình minh trên biển..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                />
              </div>

              <div>
                <label className="block text-aura-muted mb-1 font-medium">Chủ đề</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as WishItem['category'])}
                  className="w-full px-3 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                >
                  <option value="travel">Du lịch & Khám phá</option>
                  <option value="food">Ẩm thực & Món ngon</option>
                  <option value="experience">Trải nghiệm mới</option>
                  <option value="heart">Tâm tình & Gắn kết</option>
                  <option value="daily">Đời thường dịu dàng</option>
                </select>
              </div>

              <div>
                <label className="block text-aura-muted mb-1 font-medium">Ghi chú thêm (tùy chọn)</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Cảm xúc hoặc địa điểm dự định..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
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
                  {editingWish ? 'Lưu thay đổi' : 'Ghi vào danh sách'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

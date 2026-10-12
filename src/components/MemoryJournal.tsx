import React, { useState } from 'react';
import { BookHeart, Plus, Star, MapPin, Calendar, Trash2, Edit3, X, Image as ImageIcon, Heart } from 'lucide-react';
import { MemoryItem } from '../types';
import { savePhotoBlob } from '../services/storage';

interface MemoryJournalProps {
  memories: MemoryItem[];
  onUpdateMemories: (memories: MemoryItem[]) => void;
}

export const MemoryJournal: React.FC<MemoryJournalProps> = ({ memories, onUpdateMemories }) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [filterFavorite, setFilterFavorite] = useState(false);

  // Modal create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MemoryItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<MemoryItem['category']>('special');
  const [formMoodTag, setFormMoodTag] = useState('Ấm áp');

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = memories.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m);
    onUpdateMemories(updated);
    if (selectedMemory?.id === id) {
      setSelectedMemory({ ...selectedMemory, isFavorite: !selectedMemory.isFavorite });
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa trang nhật ký này?')) {
      const updated = memories.filter(m => m.id !== id);
      onUpdateMemories(updated);
      if (selectedMemory?.id === id) {
        setSelectedMemory(null);
      }
    }
  };

  const handleStartEdit = (m: MemoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(m);
    setFormTitle(m.title);
    setFormDate(m.date);
    setFormLocation(m.location || '');
    setFormImageUrl(m.imageUrl || '');
    setFormContent(m.content);
    setFormCategory(m.category);
    setFormMoodTag(m.moodTag || 'Ấm áp');
    setIsModalOpen(true);
  };

  const handleStartAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormLocation('');
    setFormImageUrl('');
    setFormContent('');
    setFormCategory('special');
    setFormMoodTag('Ấm áp');
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setFormImageUrl(base64);
        // Also save to indexedDB if needed
        const tempId = 'photo-mem-' + Date.now();
        await savePhotoBlob(tempId, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingItem) {
      const updated = memories.map(m => m.id === editingItem.id ? {
        ...m,
        title: formTitle,
        date: formDate,
        location: formLocation || undefined,
        imageUrl: formImageUrl || undefined,
        content: formContent,
        category: formCategory,
        moodTag: formMoodTag,
      } : m);
      onUpdateMemories(updated);
    } else {
      const newItem: MemoryItem = {
        id: 'mem-' + Date.now(),
        title: formTitle,
        date: formDate,
        location: formLocation || undefined,
        imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
        content: formContent,
        category: formCategory,
        isFavorite: false,
        moodTag: formMoodTag,
      };
      onUpdateMemories([newItem, ...memories]);
    }
    setIsModalOpen(false);
  };

  const displayedMemories = filterFavorite
    ? memories.filter(m => m.isFavorite)
    : memories;

  return (
    <section id="memories" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-aura-primary mb-2">
            <BookHeart size={14} />
            <span>Digital Memory Journal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-aura-text">
            Tạp Chí Những Kỷ Niệm
          </h2>
          <p className="text-sm text-aura-muted mt-2 max-w-lg">
            Mỗi khoảnh khắc ta cùng nhau trải qua đều xứng đáng được nâng niu và ghi chép lại tựa như một trang sách quý.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setFilterFavorite(!filterFavorite)}
            className={`px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              filterFavorite 
                ? 'bg-rose-500 text-white shadow-sm' 
                : 'bg-aura-surface text-aura-muted hover:text-aura-text'
            }`}
          >
            <Star size={14} className={filterFavorite ? 'fill-white' : ''} />
            <span>Yêu thích ({memories.filter(m => m.isFavorite).length})</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'timeline' : 'grid')}
            className="px-3.5 py-2 rounded-full bg-aura-surface hover:bg-aura-card text-aura-text text-xs font-medium border border-aura-border transition-all cursor-pointer"
          >
            {viewMode === 'grid' ? 'Dạng Dòng Thời Gian' : 'Dạng Thẻ Tạp Chí'}
          </button>

          <button
            onClick={handleStartAdd}
            className="px-4 py-2 rounded-full bg-aura-primary hover:bg-aura-primaryHover text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Viết kỷ niệm</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setSelectedMemory(mem)}
              className="group bg-aura-card rounded-3xl overflow-hidden border border-aura-border hover:shadow-luxury transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Photo Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-aura-surface">
                {mem.imageUrl ? (
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-aura-muted bg-aura-surface">
                    <ImageIcon size={32} />
                  </div>
                )}
                
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-mono">
                    {mem.date}
                  </span>
                </div>

                <button
                  onClick={(e) => handleToggleFavorite(mem.id, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm hover:scale-110 transition-transform"
                >
                  <Heart
                    size={16}
                    className={mem.isFavorite ? 'text-rose-500 fill-rose-500' : 'text-gray-600'}
                  />
                </button>
              </div>

              {/* Text Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {mem.location && (
                    <div className="flex items-center gap-1 text-[11px] text-aura-primary mb-2 font-mono">
                      <MapPin size={12} />
                      <span>{mem.location}</span>
                    </div>
                  )}
                  <h3 className="text-lg font-serif font-bold text-aura-text group-hover:text-aura-primary transition-colors line-clamp-2">
                    {mem.title}
                  </h3>
                  <p className="text-xs text-aura-muted leading-relaxed line-clamp-3 mt-2.5 font-light">
                    {mem.content}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="pt-4 mt-4 border-t border-aura-border/60 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-aura-surface text-aura-muted">
                    {mem.moodTag || 'Kỷ niệm đẹp'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleStartEdit(mem, e)}
                      className="p-1 hover:text-aura-primary transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(mem.id, e)}
                      className="p-1 hover:text-rose-500 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Timeline View */
        <div className="relative border-l-2 border-aura-border ml-4 md:ml-32 space-y-10 py-4">
          {displayedMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setSelectedMemory(mem)}
              className="relative pl-6 md:pl-10 cursor-pointer group"
            >
              {/* Timeline Marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-aura-primary border-4 border-aura-bg transition-transform group-hover:scale-125" />

              {/* Date stamp desktop side */}
              <div className="hidden md:block absolute -left-36 top-1 text-right w-28 text-xs font-mono text-aura-muted">
                {mem.date}
              </div>

              <div className="bg-aura-card p-6 rounded-2xl border border-aura-border hover:shadow-luxury transition-all max-w-2xl">
                <div className="md:hidden text-xs font-mono text-aura-muted mb-1">
                  {mem.date}
                </div>
                <h3 className="text-lg font-serif font-bold text-aura-text group-hover:text-aura-primary transition-colors">
                  {mem.title}
                </h3>
                {mem.location && (
                  <p className="text-xs text-aura-primary mt-0.5 flex items-center gap-1">
                    <MapPin size={12} /> {mem.location}
                  </p>
                )}
                <p className="text-xs text-aura-muted mt-2 line-clamp-2">
                  {mem.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-aura-card rounded-3xl overflow-hidden shadow-2xl border border-aura-border relative animate-fade-up">
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>

            {selectedMemory.imageUrl && (
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={selectedMemory.imageUrl}
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 text-xs font-mono text-aura-muted mb-2">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {selectedMemory.date}
                </span>
                {selectedMemory.location && (
                  <span className="flex items-center gap-1 text-aura-primary">
                    <MapPin size={13} /> {selectedMemory.location}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-aura-text mb-4">
                {selectedMemory.title}
              </h2>

              <div className="text-sm leading-relaxed text-aura-muted whitespace-pre-line font-light">
                {selectedMemory.content}
              </div>

              <div className="mt-8 pt-4 border-t border-aura-border flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-aura-surface text-aura-muted">
                  Cảm xúc: {selectedMemory.moodTag || 'Bình yên'}
                </span>

                <button
                  onClick={(e) => handleToggleFavorite(selectedMemory.id, e)}
                  className="flex items-center gap-1.5 text-xs text-aura-muted hover:text-rose-500"
                >
                  <Heart
                    size={16}
                    className={selectedMemory.isFavorite ? 'text-rose-500 fill-rose-500' : ''}
                  />
                  <span>{selectedMemory.isFavorite ? 'Đã lưu yêu thích' : 'Lưu vào yêu thích'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Memory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-aura-card rounded-2xl p-6 shadow-2xl border border-aura-border animate-fade-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-aura-text">
                {editingItem ? 'Chỉnh sửa kỷ niệm' : 'Lưu lại khoảnh khắc mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-aura-muted hover:text-aura-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-aura-muted mb-1 font-medium">Tiêu đề khoảnh khắc *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Hoàng hôn bên đồi thông..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-aura-muted mb-1 font-medium">Ngày tháng *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  />
                </div>
                <div>
                  <label className="block text-aura-muted mb-1 font-medium">Địa điểm</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Đà Lạt, Quán cafe quen..."
                    className="w-full px-3 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-aura-muted mb-1 font-medium">Hình ảnh kỷ niệm</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="Dán link ảnh (Unsplash / Imgur) hoặc tải từ máy bên dưới..."
                    className="w-full px-3 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-aura-border hover:bg-aura-surface text-aura-muted flex items-center gap-1.5 text-[11px]">
                      <ImageIcon size={14} />
                      <span>Chọn ảnh từ thiết bị</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                      />
                    </label>
                    {formImageUrl && (
                      <span className="text-[11px] text-emerald-600 font-mono">Đã nạp ảnh thành công</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-aura-muted mb-1 font-medium">Phân loại</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MemoryItem['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  >
                    <option value="special">Đặc biệt</option>
                    <option value="trip">Chuyến đi</option>
                    <option value="cozy">Ấm áp thường nhật</option>
                    <option value="milestone">Cột mốc quan trọng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-aura-muted mb-1 font-medium">Cảm xúc</label>
                  <input
                    type="text"
                    value={formMoodTag}
                    onChange={(e) => setFormMoodTag(e.target.value)}
                    placeholder="Bình yên, Rạng rỡ..."
                    className="w-full px-3 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-aura-muted mb-1 font-medium">Nội dung ghi chép *</label>
                <textarea
                  rows={5}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Ghi lại cảm xúc, câu chuyện của ngày hôm đó..."
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
                  {editingItem ? 'Lưu chỉnh sửa' : 'Lưu vào sổ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

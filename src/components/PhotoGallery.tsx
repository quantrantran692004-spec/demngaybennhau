import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { PhotoItem } from '../types';
import { savePhotoBlob, deletePhotoBlob } from '../services/storage';

interface PhotoGalleryProps {
  photos: PhotoItem[];
  onUpdatePhotos: (photos: PhotoItem[]) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onUpdatePhotos }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newLocation, setNewLocation] = useState('');

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNextPhoto(); // Swipe left -> next
    } else if (diff < -50) {
      handlePrevPhoto(); // Swipe right -> prev
    }
    touchStartX.current = null;
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setNewPhotoUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newId = 'photo-' + Date.now();
    await savePhotoBlob(newId, newPhotoUrl);

    const newPhoto: PhotoItem = {
      id: newId,
      url: newPhotoUrl,
      caption: newCaption || 'Khoảnh khắc đáng nhớ',
      date: newDate,
      location: newLocation || undefined,
    };

    onUpdatePhotos([newPhoto, ...photos]);
    setNewPhotoUrl('');
    setNewCaption('');
    setNewLocation('');
    setIsAddModalOpen(false);
  };

  const handleDeletePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa ảnh này khỏi bộ sưu tập?')) {
      await deletePhotoBlob(id);
      const updated = photos.filter(p => p.id !== id);
      onUpdatePhotos(updated);
      if (selectedPhotoIndex !== null && photos[selectedPhotoIndex]?.id === id) {
        setSelectedPhotoIndex(null);
      }
    }
  };

  const activePhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-aura-primary mb-2">
            <ImageIcon size={14} />
            <span>Artisan Photo Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-aura-text">
            Triển Lãm Ký Ức Đẹp Nhất
          </h2>
          <p className="text-sm text-aura-muted mt-2 max-w-lg">
            Nơi lưu giữ từng nụ cười và ánh mắt qua từng năm tháng. Bố cục tự do như một trang báo nghệ thuật.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-full bg-aura-primary hover:bg-aura-primaryHover text-white text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Thêm ảnh mới</span>
        </button>
      </div>

      {/* Masonry / Editorial Asymmetrical Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
        {photos.map((photo, index) => {
          // Asymmetrical span pattern for editorial look
          const spanClass = index % 4 === 0 
            ? 'lg:col-span-7' 
            : index % 4 === 1 
            ? 'lg:col-span-5' 
            : index % 4 === 2 
            ? 'lg:col-span-5' 
            : 'lg:col-span-7';

          return (
            <div
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className={`${spanClass} group relative rounded-3xl overflow-hidden bg-aura-card border border-aura-border shadow-soft-glow hover:shadow-luxury transition-all duration-500 cursor-pointer flex flex-col`}
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-aura-surface">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="p-1.5 rounded-full bg-black/40 hover:bg-rose-600 text-white transition-colors"
                      title="Xóa ảnh"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">
                      {photo.date} {photo.location ? `• ${photo.location}` : ''}
                    </span>
                    <p className="font-serif italic text-sm mt-0.5 line-clamp-1">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Caption on Card */}
              <div className="p-4 flex items-center justify-between text-xs">
                <span className="font-serif italic text-aura-text line-clamp-1">
                  {photo.caption}
                </span>
                <span className="font-mono text-[10px] text-aura-muted shrink-0 ml-2">
                  {photo.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal with Fullscreen & Swipe Support */}
      {activePhoto && selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={22} />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-40 hidden sm:flex items-center justify-center"
            title="Ảnh trước (Phím ←)"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-40 hidden sm:flex items-center justify-center"
            title="Ảnh sau (Phím →)"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image & Caption Display */}
          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="relative max-h-[75vh] w-auto overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="mt-4 text-center text-white space-y-1">
              <p className="font-serif italic text-lg sm:text-xl">
                {activePhoto.caption}
              </p>
              <div className="flex items-center justify-center gap-3 text-xs text-white/70 font-mono">
                <span>{activePhoto.date}</span>
                {activePhoto.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {activePhoto.location}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{selectedPhotoIndex + 1} / {photos.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-md w-full bg-aura-card rounded-2xl p-6 shadow-2xl border border-aura-border animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-aura-text">
                Thêm ảnh vào bộ sưu tập
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-aura-muted hover:text-aura-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewPhoto} className="space-y-4 text-xs">
              <div>
                <label className="block text-aura-muted mb-1 font-medium">Hình ảnh *</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Dán link ảnh hoặc chọn từ máy bên dưới..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl border border-dashed border-aura-border hover:bg-aura-surface text-aura-muted flex items-center justify-center gap-2">
                    <ImageIcon size={15} />
                    <span>Tải ảnh từ máy tính / điện thoại</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadPhoto}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-aura-muted mb-1 font-medium">Lời chú thích cho bức ảnh *</label>
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Ví dụ: Buổi chiều ngập nắng bên em..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-aura-muted mb-1 font-medium">Ngày chụp</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  />
                </div>
                <div>
                  <label className="block text-aura-muted mb-1 font-medium">Địa điểm</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Hà Nội, Quán nhỏ..."
                    className="w-full px-3 py-2 rounded-xl bg-aura-surface border border-aura-border text-aura-text focus:outline-none focus:border-aura-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-aura-border text-aura-muted hover:bg-aura-surface"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-aura-primary text-white font-medium hover:bg-aura-primaryHover"
                >
                  Thêm vào Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

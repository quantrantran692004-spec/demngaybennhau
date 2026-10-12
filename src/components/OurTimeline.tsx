import React, { useState } from 'react';
import { ArrowRight, CalendarHeart, Camera, Clock } from 'lucide-react';

interface TimelineProps {
  anniversaryDate: string;
  onOpenSettings: () => void;
}

export const OurTimeline: React.FC<TimelineProps> = ({ anniversaryDate, onOpenSettings }) => {
  const [coupleBg, setCoupleBg] = useState('/couple-background.jfif');

  const calculateDuration = (dateStr: string) => {
    if (!dateStr) return null;
    const start = new Date(dateStr);
    const now = new Date();
    if (Number.isNaN(start.getTime())) return null;

    const diffTime = now.getTime() - start.getTime();
    if (diffTime < 0) return { days: 0, months: 0, years: 0, totalDays: 0, isFuture: true };

    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days, totalDays, isFuture: false };
  };

  const duration = calculateDuration(anniversaryDate);

  const handleUploadBg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setCoupleBg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const milestones = [
    ['Ngày khởi đầu', 'Khoảnh khắc hai con tim hòa chung một nhịp đập.'],
    ['100 ngày yêu', 'Những nụ cười thân quen bắt đầu gắn bó bền chặt.'],
    ['1 năm gắn kết', 'Bốn mùa yêu thương đi qua trọn vẹn và ấm áp.'],
    ['Mãi mãi về sau', 'Từng phút giây vẫn vẹn nguyên sự nâng niu trân trọng.'],
  ];

  return (
    <section id="timeline" className="space-y-6 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 border-b border-aura-border pb-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-rose-500">
            <span className="animate-pulse">♥</span>
            Hành trình tình yêu • Our love timeline
          </div>
          <h2 className="mt-1 font-serif text-3xl font-bold text-aura-text sm:text-4xl">
            Từng Phút Giây Bên Nhau
          </h2>
          <p className="mt-1 max-w-lg text-xs text-aura-muted sm:text-sm">
            Đếm chính xác từng ngày, tháng, năm hai trái tim cùng chung nhịp đập.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 self-start rounded-full border border-aura-border bg-aura-surface px-4 py-2 text-xs font-medium text-aura-primary shadow-sm transition hover:bg-aura-card">
          <Camera size={14} />
          Đổi ảnh nền
          <input type="file" accept="image/*" className="hidden" onChange={handleUploadBg} />
        </label>
      </div>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#D8A85B]/70 bg-white shadow-[0_24px_70px_-28px_rgba(120,72,45,0.75)]">
        <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden px-5 py-10 text-center sm:min-h-[470px] sm:px-10">
          <img
            src={coupleBg}
            alt="Ảnh nền kỷ niệm"
            className="absolute inset-0 h-full w-full object-cover object-[65%_60%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/55" />
          <div className="relative z-10 space-y-5 text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]">
            {duration && !duration.isFuture ? (
              <>
                <div className="inline-flex items-baseline gap-3 rounded-3xl bg-black/25 px-7 py-2 ring-1 ring-white/30 backdrop-blur-sm">
                  <strong className="font-display text-6xl font-extrabold tracking-tight sm:text-8xl">
                    {duration.totalDays.toLocaleString('vi-VN')}
                  </strong>
                  <span className="font-serif text-2xl italic text-white/90">ngày</span>
                </div>
                <div className="flex justify-center gap-2 text-xs sm:gap-3 sm:text-sm">
                  <span className="rounded-full bg-black/25 px-4 py-1.5 ring-1 ring-white/30">{duration.years} năm</span>
                  <span className="rounded-full bg-black/25 px-4 py-1.5 ring-1 ring-white/30">{duration.months} tháng</span>
                  <span className="rounded-full bg-black/25 px-4 py-1.5 ring-1 ring-white/30">{duration.days} ngày</span>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Clock size={40} className="mx-auto" />
                <h3 className="font-serif text-lg font-bold">Chưa thiết lập ngày bắt đầu</h3>
                <button onClick={onOpenSettings} className="rounded-full bg-rose-600 px-5 py-2 text-xs">
                  Thiết lập ngay <ArrowRight size={14} className="ml-1 inline" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white px-5 py-7 text-center text-neutral-800 sm:px-10 sm:py-9">
          <p className="font-serif text-sm italic text-neutral-500 sm:text-base">
            “Mỗi ngày trôi qua đều là một ngày hạnh phúc vì có em bên cạnh.”
          </p>
          <div className="mx-auto mt-6 flex max-w-2xl items-center justify-between gap-3 sm:gap-8">
            <div className="flex min-w-0 flex-1 items-center gap-2 text-left sm:gap-3">
              <img src="/profile-huongmuoi.jfif" alt="huongmuoi" className="h-16 w-16 rounded-full border-4 border-pink-200 object-cover shadow-md sm:h-20 sm:w-20" />
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold sm:text-xl">huongmuoi</p>
                <p className="text-[10px] uppercase tracking-wider text-pink-500">Người thương</p>
              </div>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500 text-2xl text-white shadow-lg">♥</span>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right sm:gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold sm:text-xl">đại ca</p>
                <p className="text-[10px] uppercase tracking-wider text-pink-500">Người đồng hành</p>
              </div>
              <img src="/profile-daica.jfif" alt="đại ca" className="h-16 w-16 rounded-full border-4 border-pink-200 object-cover shadow-md sm:h-20 sm:w-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4">
        {milestones.map(([label, desc]) => (
          <div key={label} className="rounded-2xl border border-aura-border bg-aura-card p-4">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-aura-primary">
              <CalendarHeart size={13} /> Cột mốc
            </div>
            <strong className="font-serif text-sm text-aura-text">{label}</strong>
            <p className="mt-1 text-[11px] leading-relaxed text-aura-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

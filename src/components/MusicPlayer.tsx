import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Upload, 
  Radio, 
  Disc3 
} from 'lucide-react';
import { SongTrack } from '../types';
import { ambientPlayer } from '../services/audioSynthesizer';
import { getAudioBlob, saveAudioBlob } from '../services/storage';

interface MusicPlayerProps {
  playlist: SongTrack[];
  onUpdatePlaylist: (playlist: SongTrack[]) => void;
  coverImageUrl?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist, onUpdatePlaylist, coverImageUrl }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  // Custom audio element ref for user uploaded MP3
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string>('');

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  useEffect(() => {
    let cancelled = false;

    const resolveAudio = async () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setResolvedAudioUrl('');

      if (!currentTrack?.audioBlobId) {
        setResolvedAudioUrl(currentTrack?.audioUrl || '');
        return;
      }

      const blob = await getAudioBlob(currentTrack.audioBlobId);
      if (cancelled) return;
      if (!blob) {
        setResolvedAudioUrl('');
        console.error(`Không tìm thấy file nhạc đã lưu: ${currentTrack.title}`);
        return;
      }

      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      setResolvedAudioUrl(url);
    };

    void resolveAudio();
    return () => {
      cancelled = true;
    };
  }, [currentTrack]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    ambientPlayer.setVolume(isMuted ? 0 : volume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && !currentTrack?.isSynthesized && resolvedAudioUrl && audioRef.current) {
      audioRef.current.play().catch(e => console.warn('Audio play prevented:', e));
    }
  }, [currentTrack, isPlaying, resolvedAudioUrl]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (currentTrack.isSynthesized) {
        ambientPlayer.playAmbientSequence(currentTrack.synthTone || 'piano');
      } else if (resolvedAudioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.warn('Audio play prevented:', e));
      }
      setIsPlaying(true);
    } else {
      ambientPlayer.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    ambientPlayer.stop();
    if (audioRef.current) audioRef.current.pause();

    const nextIdx = currentTrackIndex + 1;
    if (nextIdx >= playlist.length) {
      setIsPlaying(false);
      return;
    }

    const shouldContinue = isPlaying;
    setCurrentTrackIndex(nextIdx);
    
    const nextTrack = playlist[nextIdx];
    if (shouldContinue) {
      if (nextTrack.isSynthesized) {
        ambientPlayer.playAmbientSequence(nextTrack.synthTone || 'piano');
      }
    }
  };

  const handlePrev = () => {
    ambientPlayer.stop();
    if (audioRef.current) audioRef.current.pause();

    const prevIdx = Math.max(currentTrackIndex - 1, 0);
    setCurrentTrackIndex(prevIdx);

    const prevTrack = playlist[prevIdx];
    if (isPlaying) {
      if (prevTrack.isSynthesized) {
        ambientPlayer.playAmbientSequence(prevTrack.synthTone || 'piano');
      }
    }
  };

  const handleUploadCustomMp3 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const invalidFile = files.find(file => !file.type.startsWith('audio/'));
      if (invalidFile) {
        window.alert(`"${invalidFile.name}" không phải file âm thanh hợp lệ.`);
        e.target.value = '';
        return;
      }

      try {
        const newTracks = await Promise.all(files.map(async (file): Promise<SongTrack> => {
          const audioBlobId = `audio-${crypto.randomUUID()}`;
          await saveAudioBlob(audioBlobId, file);
          return {
            id: 'track-custom-' + crypto.randomUUID(),
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Nhạc tải lên cá nhân',
            duration: 'Tùy chọn',
            isSynthesized: false,
            audioBlobId
          };
        }));

        onUpdatePlaylist([...newTracks, ...playlist]);
        setCurrentTrackIndex(0);
        setIsPlaying(false);
      } catch (error) {
        console.error('Không thể lưu các file nhạc:', error);
        window.alert('Không thể lưu một hoặc nhiều file nhạc. Vui lòng thử lại.');
      }
      e.target.value = '';
    }
  };

  return (
    <section id="music" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hidden audio element for custom MP3s */}
      <audio
        ref={audioRef}
        src={resolvedAudioUrl}
        preload="auto"
        onEnded={handleNext}
        onError={() => {
          if (currentTrack?.audioBlobId) {
            console.error(`Không thể phát file nhạc: ${currentTrack.title}`);
            setIsPlaying(false);
            window.alert(`Không thể phát "${currentTrack.title}". File có thể bị hỏng hoặc codec không được trình duyệt hỗ trợ.`);
          }
        }}
      />

      <div className="bg-aura-card rounded-3xl p-6 sm:p-10 border border-aura-border shadow-luxury relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-aura-glow rounded-full blur-3xl pointer-events-none opacity-30" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Vinyl / Disc Aesthetic */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative group">
              <div
                className="vinyl-disk vinyl-spinning w-44 h-44 rounded-full p-2 shadow-2xl border-4 border-white/60 flex items-center justify-center"
              >
                {/* Vinyl Grooves */}
                <div className="w-full h-full rounded-full border border-white/35 flex items-center justify-center shadow-inner">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-aura-card via-aura-surface to-aura-highlight border-4 border-white/70 shadow-lg flex flex-col items-center justify-center text-center p-2">
                    <Music size={20} className="text-aura-primary mb-1" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-aura-muted">
                      Aura Music
                    </span>
                  </div>
                </div>
              </div>

              {/* Tonearm Pin */}
              <div className="absolute -top-3 right-2 w-3 h-10 bg-aura-primary/60 rounded-full rotate-45 transform origin-top" />
            </div>
          </div>

          {/* Right: Controller & Playlist */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-aura-primary mb-1">
                  <Radio size={13} />
                  <span>Acoustic & Ambient Sanctuary</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={coverImageUrl || '/couple-background.jfif'}
                    alt="Ảnh bìa nhạc"
                    className="w-14 h-14 rounded-xl object-cover border border-aura-border shadow-sm"
                  />
                  <h3 className="text-2xl font-serif font-bold text-aura-text">
                    {currentTrack.title}
                  </h3>
                </div>
                <p className="text-xs text-aura-muted mt-0.5">
                  {currentTrack.artist} • <span className="font-mono text-aura-primary">{currentTrack.duration}</span>
                </p>
              </div>

              {/* Audio Visualizer Wave */}
              {isPlaying && (
                <div className="flex items-end gap-1 h-6">
                  <span className="w-1 bg-aura-primary rounded-full animate-wave-1" />
                  <span className="w-1 bg-aura-primary rounded-full animate-wave-2" />
                  <span className="w-1 bg-aura-primary rounded-full animate-wave-3" />
                  <span className="w-1 bg-aura-primary rounded-full animate-wave-4" />
                  <span className="w-1 bg-aura-primary rounded-full animate-wave-2" />
                </div>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-aura-border/60">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full hover:bg-aura-surface text-aura-muted hover:text-aura-text transition-colors cursor-pointer"
                  title="Bài trước"
                >
                  <SkipBack size={18} />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="w-12 h-12 rounded-full bg-aura-primary hover:bg-aura-primaryHover text-white flex items-center justify-center shadow-soft-glow transition-all hover:scale-105 cursor-pointer"
                  title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full hover:bg-aura-surface text-aura-muted hover:text-aura-text transition-colors cursor-pointer"
                  title="Bài kế tiếp"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Volume Slider & Upload */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-aura-muted hover:text-aura-text"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-20 sm:w-28 accent-aura-primary h-1.5 bg-aura-surface rounded-lg cursor-pointer"
                  />
                </div>

                <label className="cursor-pointer px-3 py-1.5 rounded-full border border-aura-border hover:bg-aura-surface text-aura-muted hover:text-aura-text text-[11px] font-medium flex items-center gap-1.5 transition-all">
                  <Upload size={13} />
                  <span className="hidden sm:inline">Nạp file MP3</span>
                  <input
                    type="file"
                    accept="audio/mp3,audio/*"
                    multiple
                    onChange={handleUploadCustomMp3}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Playlist Queue */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-aura-muted block mb-1">
                Danh sách phát ({playlist.length})
              </span>
              <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                {playlist.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      ambientPlayer.stop();
                      if (audioRef.current) audioRef.current.pause();
                      setCurrentTrackIndex(idx);
                      if (isPlaying) {
                        if (track.isSynthesized) {
                          ambientPlayer.playAmbientSequence(track.synthTone || 'piano');
                        }
                      }
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentTrackIndex === idx
                        ? 'bg-aura-surface text-aura-primary font-medium'
                        : 'text-aura-muted hover:bg-aura-surface/50 hover:text-aura-text'
                    }`}
                  >
                    <span className="truncate flex items-center gap-2">
                      <span className="font-mono text-[10px] text-aura-muted">0{idx + 1}</span>
                      <span>{track.title}</span>
                    </span>
                    <span className="font-mono text-[10px] text-aura-muted shrink-0 ml-2">
                      {track.isSynthesized ? 'Ambient' : 'MP3'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

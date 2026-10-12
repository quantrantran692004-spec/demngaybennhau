// Web Audio API Ambient Sound Synthesizer for copyright-free relaxing atmosphere

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private gainNode: GainNode | null = null;
  private currentType: string = 'piano';

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 0.4;
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.gainNode) {
      // vol: 0.0 to 1.0
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol * 0.5)), this.ctx?.currentTime || 0);
    }
  }

  // Pentatonic serene scale frequencies (C Major Pentatonic / Lydian dreamy warmth)
  private pentatonicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

  private playTone(freq: number, duration: number, type: 'sine' | 'triangle' = 'sine') {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  public playAmbientSequence(mode: 'piano' | 'ambient' | 'rain' | 'chime') {
    this.initContext();
    this.stop();
    this.isPlaying = true;
    this.currentType = mode;

    const playChord = () => {
      if (!this.isPlaying || !this.ctx) return;
      const noteCount = mode === 'chime' ? 1 : 2;
      for (let i = 0; i < noteCount; i++) {
        const randNote = this.pentatonicNotes[Math.floor(Math.random() * this.pentatonicNotes.length)];
        const duration = mode === 'ambient' ? 4.5 : 2.5;
        this.playTone(randNote, duration, mode === 'piano' ? 'triangle' : 'sine');
      }
    };

    playChord();
    const interval = mode === 'ambient' ? 4000 : 2500;
    this.intervalId = window.setInterval(playChord, interval);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientPlayer = new AmbientEngine();

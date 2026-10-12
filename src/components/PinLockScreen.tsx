import React, { useState } from 'react';
import { Lock, Unlock, Sparkles, ArrowRight } from 'lucide-react';

interface PinLockProps {
  herName: string;
  expectedPin: string;
  onUnlocked: () => void;
}

export const PinLockScreen: React.FC<PinLockProps> = ({ herName, expectedPin, onUnlocked }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin === expectedPin) {
        onUnlocked();
      } else if (nextPin.length === expectedPin.length) {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg text-aura-text p-4">
      <div className="max-w-xs w-full text-center space-y-6">
        
        <div className="w-16 h-16 rounded-full bg-aura-surface border border-aura-border text-aura-primary flex items-center justify-center mx-auto shadow-soft-glow">
          <Lock size={28} />
        </div>

        <div>
          <h2 className="text-2xl font-serif font-bold">Không Gian Riêng Tư</h2>
          <p className="text-xs text-aura-muted mt-1">
            Dành riêng cho {herName} • Nhập mã PIN để mở cửa
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 py-2">
          {[...Array(expectedPin.length || 4)].map((_, i) => (
            <span
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                error
                  ? 'border-rose-500 bg-rose-500 animate-bounce'
                  : i < pin.length
                  ? 'bg-aura-primary border-aura-primary scale-110'
                  : 'border-aura-border bg-aura-surface'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleNumberClick(n)}
              className="w-14 h-14 rounded-full bg-aura-card hover:bg-aura-surface border border-aura-border text-lg font-serif font-medium text-aura-text mx-auto transition-all active:scale-95 shadow-sm"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="w-14 h-14 rounded-full text-xs font-mono text-aura-muted mx-auto hover:text-aura-text flex items-center justify-center"
          >
            Xóa hết
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="w-14 h-14 rounded-full bg-aura-card hover:bg-aura-surface border border-aura-border text-lg font-serif font-medium text-aura-text mx-auto transition-all active:scale-95 shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-full text-xs font-mono text-aura-muted mx-auto hover:text-aura-text flex items-center justify-center"
          >
            ←
          </button>
        </div>

      </div>
    </div>
  );
};

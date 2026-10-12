import React, { useState, useEffect } from 'react';
import { bundledPlaylist, initialData } from './data/defaultData';
import { AppStateData, ThemeMode, MoodType, UserProfile } from './types';
import { loadSavedState, saveState } from './services/storage';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SecretLetters } from './components/SecretLetters';
import { MemoryJournal } from './components/MemoryJournal';
import { MoodRoom } from './components/MoodRoom';
import { InteractiveGames } from './components/InteractiveGames';
import { MusicPlayer } from './components/MusicPlayer';
import { SurpriseExperience } from './components/SurpriseExperience';
import { PhotoGallery } from './components/PhotoGallery';
import { OurTimeline } from './components/OurTimeline';
import { DailyMessage } from './components/DailyMessage';
import { WishList } from './components/WishList';
import { ThemeSelector } from './components/ThemeSelector';
import { SettingsModal } from './components/SettingsModal';
import { PinLockScreen } from './components/PinLockScreen';

export const App: React.FC = () => {
  // Initialize state with stored data or defaults
  const [state, setState] = useState<AppStateData>(() => {
    const saved = loadSavedState();
    if (saved) {
      return {
        ...initialData,
        ...saved,
        profile: { ...initialData.profile, ...(saved.profile || {}) },
        playlist: [
          ...(saved.playlist || []),
          ...bundledPlaylist.filter(
            bundledTrack => !(saved.playlist || []).some(track => track.id === bundledTrack.id)
          ),
        ],
      };
    }
    return initialData;
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // PIN lock protection state
  const [isLockedByPin, setIsLockedByPin] = useState<boolean>(() => {
    return Boolean(state.profile.pinLock && state.profile.pinLock.length > 0);
  });

  // Sync state to LocalStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Apply Theme attribute to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.activeTheme);
  }, [state.activeTheme]);

  // Track scroll position to update active navbar item
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'letters', 'memories', 'mood', 'timeline', 'gallery', 'wishes', 'games', 'music', 'surprise'];
      const scrollPos = window.scrollY + 200;

      for (const sId of sections) {
        const el = document.getElementById(sId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTheme = (theme: ThemeMode) => {
    setState(prev => ({ ...prev, activeTheme: theme }));
  };

  const handleSelectMood = (mood: MoodType | null) => {
    setState(prev => ({ ...prev, currentMood: mood }));
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const handleRestoreState = (newState: AppStateData) => {
    setState(newState);
  };

  const handleResetToDefault = () => {
    setState(initialData);
    localStorage.removeItem('her_private_world_state_v1');
  };

  // If locked by PIN
  if (isLockedByPin && state.profile.pinLock) {
    return (
      <PinLockScreen
        herName={state.profile.herName}
        expectedPin={state.profile.pinLock}
        onUnlocked={() => setIsLockedByPin(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-aura-bg text-aura-text transition-colors duration-500 flex flex-col justify-between selection:bg-aura-accent selection:text-white">
      {/* Top / Mobile Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        currentTheme={state.activeTheme}
      />

      {/* Main Content Area: 12 Sections */}
      <main className="flex-1 w-full">
        {/* 1. The First Impression */}
        <Hero
          profile={state.profile}
          onExplore={handleNavigate}
        />

        {/* 2. Secret Letters */}
        <SecretLetters
          letters={state.letters}
          onUpdateLetters={(letters) => setState(prev => ({ ...prev, letters }))}
        />

        {/* 3. Memory Journal */}
        <MemoryJournal
          memories={state.memories}
          onUpdateMemories={(memories) => setState(prev => ({ ...prev, memories }))}
        />

        {/* 4. Mood Room */}
        <MoodRoom
          currentMood={state.currentMood}
          onSelectMood={handleSelectMood}
          onChangeTheme={handleSelectTheme}
        />

        {/* 9. Our Timeline (Đếm ngày yêu nhau) */}
        <OurTimeline
          anniversaryDate={state.profile.anniversaryDate}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 8. Photo Gallery */}
        <PhotoGallery
          photos={state.photos}
          onUpdatePhotos={(photos) => setState(prev => ({ ...prev, photos }))}
        />

        {/* 10. Daily Message */}
        <DailyMessage
          notes={state.dailyNotes}
          onUpdateNotes={(dailyNotes) => setState(prev => ({ ...prev, dailyNotes }))}
        />

        {/* 11. Wish List */}
        <WishList
          wishes={state.wishes}
          onUpdateWishes={(wishes) => setState(prev => ({ ...prev, wishes }))}
        />

        {/* 5. Interactive Mini Games */}
        <InteractiveGames />

        {/* 6. Music Corner */}
        <MusicPlayer
          coverImageUrl={state.profile.musicCoverUrl}
          playlist={state.playlist}
          onUpdatePlaylist={(playlist) => setState(prev => ({ ...prev, playlist }))}
        />

        {/* 7. Surprise Experience */}
        <SurpriseExperience
          herName={state.profile.herName}
          isUnlocked={state.surpriseUnlocked}
          onToggleUnlocked={(surpriseUnlocked) => setState(prev => ({ ...prev, surpriseUnlocked }))}
        />
      </main>

      {/* Editorial Luxury Footer */}
      <footer className="pt-16 pb-24 md:pb-12 border-t border-aura-border bg-aura-card/40 mt-20 text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="w-8 h-8 rounded-full bg-aura-primary/10 text-aura-primary flex items-center justify-center mx-auto text-sm font-serif">
            ✦
          </div>
          <p className="font-serif italic text-base sm:text-lg text-aura-text">
            "Có những góc nhỏ trên thế giới này, sinh ra chỉ để thuộc về một người duy nhất."
          </p>
          <div className="text-xs text-aura-muted font-mono flex items-center justify-center gap-3">
            <span>{state.profile.siteTitle}</span>
            <span>•</span>
            <span>Dành tặng {state.profile.herName}</span>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-aura-primary hover:underline"
            >
              Tùy chỉnh
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ThemeSelector
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={state.activeTheme}
        onSelectTheme={handleSelectTheme}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentState={state}
        onSaveProfile={handleSaveProfile}
        onRestoreState={handleRestoreState}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
};

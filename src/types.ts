export type ThemeMode = 'morning' | 'dreamy' | 'calm' | 'midnight' | 'bloom';

export type MoodType = 
  | 'joyful' 
  | 'peaceful' 
  | 'melancholy' 
  | 'exhausted' 
  | 'motivated' 
  | 'craving_care' 
  | 'solitude';

export interface UserProfile {
  herName: string;
  myNickname: string;
  avatarUrl: string;
  musicCoverUrl?: string;
  anniversaryDate: string; // YYYY-MM-DD
  siteTitle: string;
  welcomeSub: string;
  heroQuote: string;
  pinLock?: string; // Optional client-side PIN
}

export interface SecretLetter {
  id: string;
  title: string;
  category: 'love' | 'gratitude' | 'future' | 'apology' | 'birthday' | 'comfort';
  author: string;
  dateSent: string;
  unlockDate?: string; // If set and in future, locked
  snippet: string;
  content: string;
  isRead: boolean;
  waxColor?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
  content: string;
  category: 'special' | 'trip' | 'cozy' | 'milestone';
  isFavorite: boolean;
  moodTag?: string;
}

export interface WishItem {
  id: string;
  text: string;
  category: 'travel' | 'food' | 'experience' | 'heart' | 'daily';
  completed: boolean;
  targetDate?: string;
  completedDate?: string;
  notes?: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date: string;
  location?: string;
}

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  isSynthesized?: boolean;
  synthTone?: 'piano' | 'ambient' | 'rain' | 'chime';
  audioUrl?: string; // Custom audio file or URL
  audioBlobId?: string; // ID of a user-uploaded audio file stored in IndexedDB
}

export interface DailyNote {
  id: string;
  quote: string;
  author: string;
  tag: string;
  forDate?: string;
}

export interface GameCard {
  id: string;
  type: 'challenge' | 'compliment' | 'invitation' | 'deep_question';
  title: string;
  description: string;
}

export interface SoulQuestQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    text: string;
    points: string;
    hint: string;
  }[];
}

export interface AppStateData {
  profile: UserProfile;
  activeTheme: ThemeMode;
  currentMood: MoodType | null;
  letters: SecretLetter[];
  memories: MemoryItem[];
  wishes: WishItem[];
  photos: PhotoItem[];
  dailyNotes: DailyNote[];
  surpriseUnlocked: boolean;
  playlist: SongTrack[];
}

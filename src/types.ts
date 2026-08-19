export type ArcanaType = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: number;
  nameCn: string;
  nameEn: string;
  type: ArcanaType;
  number: number;
  element?: string; // 火、水、风、土
  imageUrl?: string;
  keywordsUpright: string[];
  keywordsReversed: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  loveMeaning: string;
  careerMeaning: string;
  lifestyleMeaning: string;
  healerAdvice: string;
  symbol: string;
  colorScheme: {
    from: string;
    to: string;
    accent: string;
    glow: string;
  };
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionIndex: number;
  positionName: string;
  positionMeaning: string;
}

export interface SpreadConfig {
  id: string;
  name: string;
  tag: string;
  cardCount: number;
  description: string;
  suitableFor: string;
  iconName: string;
  positions: {
    name: string;
    meaning: string;
  }[];
}

export interface DivinationRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  question: string;
  spreadId: string;
  spreadName: string;
  drawnCards: {
    cardId: number;
    isReversed: boolean;
    positionName: string;
    positionMeaning: string;
  }[];
  summary: string;
  healerAdvice: string;
  isFavorite?: boolean;
}

export interface DailyFortuneState {
  date: string; // YYYY-MM-DD
  cardId: number;
  isReversed: boolean;
  drawnAt: number;
  oneLiner: string;
}

export type ActiveTab = 'home' | 'spreads' | 'draw' | 'result' | 'encyclopedia' | 'history' | 'settings';

export type AmbientSoundType = 'night' | 'wind' | 'rain' | 'zen';

export interface AppSettings {
  soundEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
  currentSound: AmbientSoundType;
  isSoundPlaying: boolean;
  animationSpeed: 'smooth' | 'fast' | 'reduced';
  hapticFeedback: boolean;
  privacyAgreed?: boolean;
}

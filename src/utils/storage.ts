import { AppSettings, DailyFortuneState, DivinationRecord } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'moon_tarot_history_v1',
  FAVORITE_CARDS: 'moon_tarot_fav_cards_v1',
  DAILY_FORTUNE: 'moon_tarot_daily_fortune_v1',
  SETTINGS: 'moon_tarot_settings_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  bgmVolume: 0.4,
  sfxVolume: 0.6,
  currentSound: 'night',
  isSoundPlaying: false,
  animationSpeed: 'smooth',
  hapticFeedback: true,
  privacyAgreed: false,
};

// ============ History Records ============
export function getHistoryRecords(): DivinationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDivinationRecord(record: DivinationRecord): void {
  try {
    const records = getHistoryRecords();
    const existingIndex = records.findIndex(r => r.id === record.id);
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(records.slice(0, 100))); // Keep last 100
  } catch (err) {
    console.error('Failed to save history', err);
  }
}

export function deleteDivinationRecord(id: string): void {
  try {
    const records = getHistoryRecords().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to delete history', err);
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (err) {
    console.error('Failed to clear history', err);
  }
}

export function toggleRecordFavorite(id: string): boolean {
  try {
    const records = getHistoryRecords();
    const target = records.find(r => r.id === id);
    if (target) {
      target.isFavorite = !target.isFavorite;
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(records));
      return target.isFavorite;
    }
  } catch {
    // ignore
  }
  return false;
}

// ============ Favorite Cards ============
export function getFavoriteCardIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITE_CARDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleCardFavorite(cardId: number): boolean {
  try {
    const favs = getFavoriteCardIds();
    const exists = favs.includes(cardId);
    let updated: number[];
    if (exists) {
      updated = favs.filter(id => id !== cardId);
    } else {
      updated = [...favs, cardId];
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITE_CARDS, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}

export function clearAllFavorites(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.FAVORITE_CARDS);
  } catch (err) {
    console.error('Failed to clear favorites', err);
  }
}

// ============ Daily Fortune ============
export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyFortune(): DailyFortuneState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_FORTUNE);
    if (!raw) return null;
    const data: DailyFortuneState = JSON.parse(raw);
    const today = getTodayDateStr();
    if (data.date === today) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveDailyFortune(fortune: DailyFortuneState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_FORTUNE, JSON.stringify(fortune));
  } catch (err) {
    console.error('Failed to save daily fortune', err);
  }
}

// ============ Settings ============
export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: Partial<AppSettings>): AppSettings {
  try {
    const current = getAppSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

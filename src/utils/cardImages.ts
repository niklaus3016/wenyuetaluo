import { TarotCard } from '../types';

/**
 * Returns potential image URLs for a tarot card in priority order:
 * 1. Explicit card.imageUrl if provided
 * 2. User's local uploaded files in /cards/ directory:
 *    - /cards/${card.id}.jpg
 *    - /cards/${card.id}.png
 *    - /cards/${cleanEnName}.jpg
 * 3. High quality online Rider-Waite-Smith Tarot illustrations
 */

// Mapping of card id to standard Rider-Waite filenames on Wikimedia / GitHub
const CARD_IMAGE_NAMES: Record<number, string> = {
  // Major Arcana (0-21)
  0: 'the_fool',
  1: 'the_magician',
  2: 'the_high_priestess',
  3: 'the_empress',
  4: 'the_emperor',
  5: 'the_hierophant',
  6: 'the_lovers',
  7: 'the_chariot',
  8: 'strength',
  9: 'the_hermit',
  10: 'wheel_of_fortune',
  11: 'justice',
  12: 'the_hanged_man',
  13: 'death',
  14: 'temperance',
  15: 'the_devil',
  16: 'the_tower',
  17: 'the_star',
  18: 'the_moon',
  19: 'the_sun',
  20: 'judgement',
  21: 'the_world',

  // Wands (22-35)
  22: 'ace_of_wands',
  23: 'two_of_wands',
  24: 'three_of_wands',
  25: 'four_of_wands',
  26: 'five_of_wands',
  27: 'six_of_wands',
  28: 'seven_of_wands',
  29: 'eight_of_wands',
  30: 'nine_of_wands',
  31: 'ten_of_wands',
  32: 'page_of_wands',
  33: 'knight_of_wands',
  34: 'queen_of_wands',
  35: 'king_of_wands',

  // Cups (36-49)
  36: 'ace_of_cups',
  37: 'two_of_cups',
  38: 'three_of_cups',
  39: 'four_of_cups',
  40: 'five_of_cups',
  41: 'six_of_cups',
  42: 'seven_of_cups',
  43: 'eight_of_cups',
  44: 'nine_of_cups',
  45: 'ten_of_cups',
  46: 'page_of_cups',
  47: 'knight_of_cups',
  48: 'queen_of_cups',
  49: 'king_of_cups',

  // Swords (50-63)
  50: 'ace_of_swords',
  51: 'two_of_swords',
  52: 'three_of_swords',
  53: 'four_of_swords',
  54: 'five_of_swords',
  55: 'six_of_swords',
  56: 'seven_of_swords',
  57: 'eight_of_swords',
  58: 'nine_of_swords',
  59: 'ten_of_swords',
  60: 'page_of_swords',
  61: 'knight_of_swords',
  62: 'queen_of_swords',
  63: 'king_of_swords',

  // Pentacles (64-77)
  64: 'ace_of_pentacles',
  65: 'two_of_pentacles',
  66: 'three_of_pentacles',
  67: 'four_of_pentacles',
  68: 'five_of_pentacles',
  69: 'six_of_pentacles',
  70: 'seven_of_pentacles',
  71: 'eight_of_pentacles',
  72: 'nine_of_pentacles',
  73: 'ten_of_pentacles',
  74: 'page_of_pentacles',
  75: 'knight_of_pentacles',
  76: 'queen_of_pentacles',
  77: 'king_of_pentacles',
};

// Raw online tarot deck CDN sources
const RWS_ONLINE_BASE = 'https://raw.githubusercontent.com/krates98/tarotcardapi/main/tarotdeck';

const ONLINE_NAME_MAP: Record<number, string> = {
  0: 'thefool.jpeg',
  1: 'themagician.jpeg',
  2: 'thehighpriestess.jpeg',
  3: 'theempress.jpeg',
  4: 'theemperor.jpeg',
  5: 'thehierophant.jpeg',
  6: 'thelovers.jpeg',
  7: 'thechariot.jpeg',
  8: 'strength.jpeg',
  9: 'thehermit.jpeg',
  10: 'wheeloffortune.jpeg',
  11: 'justice.jpeg',
  12: 'thehangedman.jpeg',
  13: 'death.jpeg',
  14: 'temperance.jpeg',
  15: 'thedevil.jpeg',
  16: 'thetower.jpeg',
  17: 'thestar.jpeg',
  18: 'themoon.jpeg',
  19: 'thesun.jpeg',
  20: 'judgement.jpeg',
  21: 'theworld.jpeg',

  22: 'wands01.jpeg',
  23: 'wands02.jpeg',
  24: 'wands03.jpeg',
  25: 'wands04.jpeg',
  26: 'wands05.jpeg',
  27: 'wands06.jpeg',
  28: 'wands07.jpeg',
  29: 'wands08.jpeg',
  30: 'wands09.jpeg',
  31: 'wands10.jpeg',
  32: 'wandspage.jpeg',
  33: 'wandsknight.jpeg',
  34: 'wandsqueen.jpeg',
  35: 'wandsking.jpeg',

  36: 'cups01.jpeg',
  37: 'cups02.jpeg',
  38: 'cups03.jpeg',
  39: 'cups04.jpeg',
  40: 'cups05.jpeg',
  41: 'cups06.jpeg',
  42: 'cups07.jpeg',
  43: 'cups08.jpeg',
  44: 'cups09.jpeg',
  45: 'cups10.jpeg',
  46: 'cupspage.jpeg',
  47: 'cupsknight.jpeg',
  48: 'cupsqueen.jpeg',
  49: 'cupsking.jpeg',

  50: 'swords01.jpeg',
  51: 'swords02.jpeg',
  52: 'swords03.jpeg',
  53: 'swords04.jpeg',
  54: 'swords05.jpeg',
  55: 'swords06.jpeg',
  56: 'swords07.jpeg',
  57: 'swords08.jpeg',
  58: 'swords09.jpeg',
  59: 'swords10.jpeg',
  60: 'swordspage.jpeg',
  61: 'swordsknight.jpeg',
  62: 'swordsqueen.jpeg',
  63: 'swordsking.jpeg',

  64: 'pentacles01.jpeg',
  65: 'pentacles02.jpeg',
  66: 'pentacles03.jpeg',
  67: 'pentacles04.jpeg',
  68: 'pentacles05.jpeg',
  69: 'pentacles06.jpeg',
  70: 'pentacles07.jpeg',
  71: 'pentacles08.jpeg',
  72: 'pentacles09.jpeg',
  73: 'pentacles10.jpeg',
  74: 'pentaclespage.jpeg',
  75: 'pentaclesknight.jpeg',
  76: 'pentaclesqueen.jpeg',
  77: 'pentaclesking.jpeg',
};

export function getCardPrimaryImageUrl(card: TarotCard): string {
  if (card.imageUrl) {
    return card.imageUrl;
  }

  // 1. Try local uploaded file by id
  // Note: if user puts files in public/cards/0.jpg, /cards/0.jpg will resolve directly
  const onlineFilename = ONLINE_NAME_MAP[card.id];
  if (onlineFilename) {
    return `${RWS_ONLINE_BASE}/${onlineFilename}`;
  }

  return `/cards/${card.id}.jpg`;
}

export function getCardFallbackImageUrls(card: TarotCard): string[] {
  const cleanEn = CARD_IMAGE_NAMES[card.id] || card.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const noSpaceEn = card.nameEn.toLowerCase().replace(/\s+/g, '');

  return [
    `/cards/${card.id}.jpg`,
    `/cards/${card.id}.png`,
    `/cards/${cleanEn}.jpg`,
    `/cards/${cleanEn}.png`,
    `/cards/${noSpaceEn}.jpg`,
    `/cards/${noSpaceEn}.png`,
    `${RWS_ONLINE_BASE}/${ONLINE_NAME_MAP[card.id] || 'thefool.jpeg'}`
  ];
}

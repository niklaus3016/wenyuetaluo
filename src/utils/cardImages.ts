import { TarotCard } from '../types';

/**
 * 返回一张塔罗牌候选图片 URL 的优先级顺序（调整后 2026-08 内置卡图优先）：
 * 1. 显式 card.imageUrl（如果提供）
 * 2. 应用内置的 78 张卡图（78pai 资源复制到 public/cards）：/cards/<kebab>.webp
 * 3. 用户通过上传放到 /cards/ 目录的自定义图：
 *    - /cards/${id}.jpg
 *    - /cards/${id}.png
 *    - /cards/${cleanEnName}.jpg
 *    - /cards/${noSpaceEnName}.jpg
 * 4. 在线 Rider-Waite-Smith 插画（CDN 兜底）
 */

// ================= 78 张内置卡图映射：card.id → public/cards/<value>.webp =================
// 与 /home/devbox/project/public/cards/ 目录下的 78pai 文件名（不带 .webp）严格一一对应
const BUILTIN_WEBP_MAP: Record<number, string> = {
  // Major Arcana — 大阿卡纳 0–21
  0:  'the-fool',
  1:  'the-magician',
  2:  'the-high-priestess',
  3:  'the-empress',
  4:  'the-emperor',
  5:  'the-hierophant',
  6:  'the-lovers',
  7:  'the-chariot',
  8:  'strength',
  9:  'the-hermit',
  10: 'wheel-of-fortune',
  11: 'justice',
  12: 'the-hanged-man',
  13: 'death',
  14: 'temperance',
  15: 'the-devil',
  16: 'the-tower',
  17: 'the-star',
  18: 'the-moon',
  19: 'the-sun',
  20: 'judgement',
  21: 'the-world',

  // Wands — 权杖 22–35
  22: 'ace-of-wands',
  23: 'two-of-wands',
  24: 'three-of-wands',
  25: 'four-of-wands',
  26: 'five-of-wands',
  27: 'six-of-wands',
  28: 'seven-of-wands',
  29: 'eight-of-wands',
  30: 'nine-of-wands',
  31: 'ten-of-wands',
  32: 'page-of-wands',
  33: 'knight-of-wands',
  34: 'queen-of-wands',
  35: 'king-of-wands',

  // Cups — 圣杯 36–49
  36: 'ace-of-cups',
  37: 'two-of-cups',
  38: 'three-of-cups',
  39: 'four-of-cups',
  40: 'five-of-cups',
  41: 'six-of-cups',
  42: 'seven-of-cups',
  43: 'eight-of-cups',
  44: 'nine-of-cups',
  45: 'ten-of-cups',
  46: 'page-of-cups',
  47: 'knight-of-cups',
  48: 'queen-of-cups',
  49: 'king-of-cups',

  // Swords — 宝剑 50–63
  50: 'ace-of-swords',
  51: 'two-of-swords',
  52: 'three-of-swords',
  53: 'four-of-swords',
  54: 'five-of-swords',
  55: 'six-of-swords',
  56: 'seven-of-swords',
  57: 'eight-of-swords',
  58: 'nine-of-swords',
  59: 'ten-of-swords',
  60: 'page-of-swords',
  61: 'knight-of-swords',
  62: 'queen-of-swords',
  63: 'king-of-swords',

  // Pentacles — 星币/钱币 64–77
  64: 'ace-of-pentacles',
  65: 'two-of-pentacles',
  66: 'three-of-pentacles',
  67: 'four-of-pentacles',
  68: 'five-of-pentacles',
  69: 'six-of-pentacles',
  70: 'seven-of-pentacles',
  71: 'eight-of-pentacles',
  72: 'nine-of-pentacles',
  73: 'ten-of-pentacles',
  74: 'page-of-pentacles',
  75: 'knight-of-pentacles',
  76: 'queen-of-pentacles',
  77: 'king-of-pentacles',
};

// 原有映射：保留，用于用户本地上传兜底的 cleanEnName 解析
const CARD_IMAGE_NAMES: Record<number, string> = {
  // Major Arcana (0-21)
  0:  'the_fool',
  1:  'the_magician',
  2:  'the_high_priestess',
  3:  'the_empress',
  4:  'the_emperor',
  5:  'the_hierophant',
  6:  'the_lovers',
  7:  'the_chariot',
  8:  'strength',
  9:  'the_hermit',
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

// CDN 兜底源（在线 RWS 插画，最后一道防线）
const RWS_ONLINE_BASE = 'https://raw.githubusercontent.com/krates98/tarotcardapi/main/tarotdeck';

const ONLINE_NAME_MAP: Record<number, string> = {
  0:  'thefool.jpeg',
  1:  'themagician.jpeg',
  2:  'thehighpriestess.jpeg',
  3:  'theempress.jpeg',
  4:  'theemperor.jpeg',
  5:  'thehierophant.jpeg',
  6:  'thelovers.jpeg',
  7:  'thechariot.jpeg',
  8:  'strength.jpeg',
  9:  'thehermit.jpeg',
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

function getBuiltinWebpFilename(cardId: number): string | null {
  const f = BUILTIN_WEBP_MAP[cardId];
  // 防御性：只有在映射存在且不是空字符串时才返回
  return f ? f : null;
}

/**
 * 主图 URL。优先级：
 * 1. card.imageUrl（用户显式设置）
 * 2. 内置 78 张卡图 /cards/<kebab>.webp（99% 情况命中这条）
 * 3. 在线 CDN 的 RWS 插画
 * 4. 兜底 /cards/${id}.jpg
 */
export function getCardPrimaryImageUrl(card: TarotCard): string {
  if (card.imageUrl) {
    return card.imageUrl;
  }

  const builtinFile = getBuiltinWebpFilename(card.id);
  if (builtinFile) {
    return `/cards/${builtinFile}.webp`;
  }

  const onlineFilename = ONLINE_NAME_MAP[card.id];
  if (onlineFilename) {
    return `${RWS_ONLINE_BASE}/${onlineFilename}`;
  }

  return `/cards/${card.id}.jpg`;
}

/**
 * 候选兜底 URL 列表（TarotCardView 按顺序尝试，失败就切换到下一个）
 * 顺序按命中概率从高到低：
 * 1. 内置 78pai 的 webp → 必中，直接显示
 * 2–7. 用户可能上传的自定义本地文件（/cards/${id|cleanEn|noSpaceEn}.jpg/.png）
 * 8. 在线 CDN 兜底
 */
export function getCardFallbackImageUrls(card: TarotCard): string[] {
  const cleanEn = CARD_IMAGE_NAMES[card.id] || card.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const noSpaceEn = card.nameEn.toLowerCase().replace(/\s+/g, '');

  const candidates: string[] = [];

  // 1) 内置 78 张：第 1 优先级
  const builtinFile = getBuiltinWebpFilename(card.id);
  if (builtinFile) {
    candidates.push(`/cards/${builtinFile}.webp`);
  }

  // 2) 用户上传自定义（保留原有多种命名规范的兼容）
  candidates.push(`/cards/${card.id}.jpg`);
  candidates.push(`/cards/${card.id}.png`);
  candidates.push(`/cards/${cleanEn}.jpg`);
  candidates.push(`/cards/${cleanEn}.png`);
  candidates.push(`/cards/${noSpaceEn}.jpg`);
  candidates.push(`/cards/${noSpaceEn}.png`);

  // 3) CDN 兜底
  candidates.push(`${RWS_ONLINE_BASE}/${ONLINE_NAME_MAP[card.id] || 'thefool.jpeg'}`);

  return candidates;
}

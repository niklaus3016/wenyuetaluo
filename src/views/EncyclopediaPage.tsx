import React, { useState } from 'react';
import { Search, Sparkles, Filter, BookOpen, Heart } from 'lucide-react';
import { TAROT_DECK } from '../data/tarotDeck';
import { ArcanaType, TarotCard } from '../types';
import { TarotCardView } from '../components/TarotCardView';
import { CardDetailModal } from '../components/CardDetailModal';
import { getFavoriteCardIds } from '../utils/storage';
import { soundEngine } from '../utils/audio';

export const EncyclopediaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ArcanaType | 'all' | 'fav'>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favCardIds, setFavCardIds] = useState<number[]>(getFavoriteCardIds());

  const refreshFavs = () => {
    setFavCardIds(getFavoriteCardIds());
  };

  const handleCardClick = (card: TarotCard) => {
    soundEngine.playClick();
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const filteredCards = TAROT_DECK.filter((card) => {
    // Type filtering
    if (selectedType === 'fav') {
      if (!favCardIds.includes(card.id)) return false;
    } else if (selectedType !== 'all') {
      if (card.type !== selectedType) return false;
    }

    // Search query matching (Chinese name, English name, keywords, element)
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      card.nameCn.toLowerCase().includes(q) ||
      card.nameEn.toLowerCase().includes(q) ||
      card.keywordsUpright.some((kw) => kw.toLowerCase().includes(q)) ||
      card.keywordsReversed.some((kw) => kw.toLowerCase().includes(q)) ||
      (card.element && card.element.includes(q))
    );
  });

  return (
    <div className="w-full space-y-4 pb-8 animate-fadeIn text-left">
      {/* Header */}
      <div className="text-center pt-2 space-y-1">
        <h2 className="text-lg font-bold text-[#F5F7FF] font-serif">
          卡牌百科全书
        </h2>
        <p className="text-xs text-[#F5F7FF]/50">
          收录完整 78 张经典韦特塔罗 · 随心检索与释义深研
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4C296]/60" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索卡牌名称、英文名或关键词（如：愚人、爱、新生）..."
          className="w-full bg-[#1A2340]/90 border border-[#D4C296]/25 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#F5F7FF] placeholder-[#F5F7FF]/40 focus:outline-none focus:border-[#D4C296] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#F5F7FF]/40 hover:text-[#F5F7FF]"
          >
            清空
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            selectedType === 'all'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          全部 (78)
        </button>
        <button
          onClick={() => setSelectedType('major')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            selectedType === 'major'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          大阿卡纳 (22)
        </button>
        <button
          onClick={() => setSelectedType('wands')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            selectedType === 'wands'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          权杖 (14)
        </button>
        <button
          onClick={() => setSelectedType('cups')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            selectedType === 'cups'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          圣杯 (14)
        </button>
        <button
          onClick={() => setSelectedType('swords')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            selectedType === 'swords'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          宝剑 (14)
        </button>
        <button
          onClick={() => setSelectedType('pentacles')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            selectedType === 'pentacles'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          星币 (14)
        </button>
        <button
          onClick={() => setSelectedType('fav')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center space-x-1 transition-all ${
            selectedType === 'fav'
              ? 'bg-rose-500 text-white font-bold shadow'
              : 'bg-white/5 text-rose-300 hover:bg-white/10'
          }`}
        >
          <Heart className="w-3 h-3 fill-current" />
          <span>我的收藏 ({favCardIds.length})</span>
        </button>
      </div>

      {/* Cards Grid List */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
          {filteredCards.map((card) => {
            const isFav = favCardIds.includes(card.id);
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="bg-[#1A2340]/80 hover:bg-[#1A2340] border border-[#D4C296]/20 hover:border-[#D4C296]/60 rounded-2xl p-2.5 flex flex-col items-center justify-between cursor-pointer group transition-all duration-300 active:scale-95 relative"
              >
                {/* Heart Favorite Tag */}
                {isFav && (
                  <span className="absolute top-1.5 right-1.5 text-rose-400 text-xs">
                    ♥
                  </span>
                )}

                <TarotCardView
                  card={card}
                  isFlipped={true}
                  size="sm"
                  showLabel={false}
                  glow={false}
                />

                <div className="mt-2 text-center w-full">
                  <div className="text-xs font-bold text-[#F5F7FF] group-hover:text-[#D4C296] transition-colors truncate">
                    {card.nameCn}
                  </div>
                  <div className="text-[9px] text-[#F5F7FF]/40 truncate">
                    {card.nameEn}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center bg-white/5 rounded-3xl border border-white/10 space-y-2">
          <BookOpen className="w-8 h-8 text-[#D4C296]/40 mx-auto" />
          <div className="text-xs text-[#F5F7FF]/70">没有找到匹配的卡牌</div>
          <p className="text-[11px] text-[#F5F7FF]/40">
            尝试更换检索词或切换不同分类标签
          </p>
        </div>
      )}

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFavoriteChange={refreshFavs}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { X, Heart, Sparkles, Compass, Briefcase, Smile, Info, BookOpen } from 'lucide-react';
import { TarotCard } from '../types';
import { TarotCardView } from './TarotCardView';
import { toggleCardFavorite, getFavoriteCardIds } from '../utils/storage';
import { soundEngine } from '../utils/audio';

interface CardDetailModalProps {
  card: TarotCard | null;
  isOpen: boolean;
  onClose: () => void;
  onFavoriteChange?: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  onFavoriteChange,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'upright' | 'reversed' | 'scenarios'>('overview');
  const [isFav, setIsFav] = useState(false);

  React.useEffect(() => {
    if (card) {
      const favs = getFavoriteCardIds();
      setIsFav(favs.includes(card.id));
    }
  }, [card]);

  if (!isOpen || !card) return null;

  const handleToggleFavorite = () => {
    const updated = toggleCardFavorite(card.id);
    setIsFav(updated);
    soundEngine.playClick();
    if (onFavoriteChange) onFavoriteChange();
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'major': return '大阿卡纳 (Major Arcana)';
      case 'wands': return '权杖家族 (Wands - 火)';
      case 'cups': return '圣杯家族 (Cups - 水)';
      case 'swords': return '宝剑家族 (Swords - 风)';
      case 'pentacles': return '星币家族 (Pentacles - 土)';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg max-h-[92vh] bg-[#1A2340] border border-[#D4C296]/35 rounded-3xl p-6 shadow-2xl overflow-y-auto flex flex-col relative text-left">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-[#D4C296]/15 text-[#D4C296]">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-[#F5F7FF] font-bold text-base">{card.nameCn} · {card.nameEn}</h3>
              <span className="text-[#D4C296]/80 text-[11px] font-medium">{getTypeName(card.type)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleFavorite}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isFav ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-white/5 text-[#F5F7FF]/50 hover:bg-white/10'
              }`}
              title={isFav ? '已收藏' : '收藏此卡牌'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#F5F7FF]/50 hover:text-[#F5F7FF] hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Visual Hero Area */}
        <div className="my-4 flex items-center justify-center bg-gradient-to-b from-black/30 to-black/10 rounded-2xl p-4 border border-white/5">
          <TarotCardView
            card={card}
            isFlipped={true}
            size="lg"
            glow={true}
            showLabel={false}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-medium mb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'overview' ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow' : 'text-[#F5F7FF]/70 hover:text-[#F5F7FF]'
            }`}
          >
            概览与关键词
          </button>
          <button
            onClick={() => setActiveTab('upright')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'upright' ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow' : 'text-[#F5F7FF]/70 hover:text-[#F5F7FF]'
            }`}
          >
            正位详解
          </button>
          <button
            onClick={() => setActiveTab('reversed')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'reversed' ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow' : 'text-[#F5F7FF]/70 hover:text-[#F5F7FF]'
            }`}
          >
            逆位详解
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'scenarios' ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow' : 'text-[#F5F7FF]/70 hover:text-[#F5F7FF]'
            }`}
          >
            场景应用
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-4 text-xs leading-relaxed text-[#F5F7FF]/80">
          {activeTab === 'overview' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2">
                <div className="text-[#D4C296] font-semibold text-xs flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>正位核心关键词</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.keywordsUpright.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                      ✦ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2">
                <div className="text-rose-300 font-semibold text-xs flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>逆位核心关键词</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.keywordsReversed.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-rose-950/40 text-rose-300 border border-rose-500/30">
                      ✦ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#7B68EE]/10 border border-[#7B68EE]/25 rounded-2xl p-4">
                <div className="text-[#D4C296] font-semibold text-xs mb-1.5">✦ 月光治愈指引 ✦</div>
                <p className="italic text-[#F5F7FF]/90 font-serif leading-relaxed">
                  {card.healerAdvice}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'upright' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-xs">正位</span>
                <span>光明能量与顺境寓意</span>
              </div>
              <p className="text-sm text-[#F5F7FF]/90 leading-relaxed">
                {card.uprightMeaning}
              </p>
            </div>
          )}

          {activeTab === 'reversed' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-xs">逆位</span>
                <span>隐患提示与调整方向</span>
              </div>
              <p className="text-sm text-[#F5F7FF]/90 leading-relaxed">
                {card.reversedMeaning}
              </p>
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
                <div className="text-[#D4C296] font-semibold flex items-center space-x-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>感情与关系解读</span>
                </div>
                <p className="text-xs text-[#F5F7FF]/80 leading-relaxed">
                  {card.loveMeaning}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
                <div className="text-[#D4C296] font-semibold flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                  <span>事业与学业解读</span>
                </div>
                <p className="text-xs text-[#F5F7FF]/80 leading-relaxed">
                  {card.careerMeaning}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
                <div className="text-[#D4C296] font-semibold flex items-center space-x-1.5">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  <span>身心与生活建议</span>
                </div>
                <p className="text-xs text-[#F5F7FF]/80 leading-relaxed">
                  {card.lifestyleMeaning}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

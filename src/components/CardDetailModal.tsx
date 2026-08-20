import React, { useState } from 'react';
import ReactDOM from 'react-dom';
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

  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(
    /* 遮罩层：z-[100]（绝对高于 BottomNav 的 z-40），去掉过度黑色和模糊，只保留浅半透明遮罩
       注意：必须用 createPortal 挂到 document.body！因为父级容器有 backdrop-blur/transform
       会把 fixed 定位的包含块锁在父容器里（高度=页面滚动高度几千px），导致羊皮纸div被居中到
       视口外几千像素，用户以为"点击没反应"。挂到 body 后 fixed 以 viewport 为包含块，真正全屏。 */
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/20 animate-fadeIn">
      {/* Modal 本体：羊皮纸奶白背景 + 金色边框，去掉所有深蓝色/黑色底 */}
      <div className="w-full max-w-lg max-h-[94vh] bg-[#FFFBEF] border-2 border-[#D4C296]/60 rounded-3xl shadow-2xl overflow-y-auto flex flex-col relative text-left">
        {/* Header Bar —— 浅底深色文字 */}
        <div className="sticky top-0 z-20 bg-[#FFFBEF]/95 backdrop-blur-sm flex items-center justify-between p-5 pb-3 border-b border-[#D4C296]/25 rounded-t-3xl">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-[#D4C296]/20 text-[#8B6F2E]">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-[#1A2340] font-extrabold text-lg tracking-wide">{card.nameCn} · {card.nameEn}</h3>
              <span className="text-[#8B6F2E]/90 text-[11px] font-semibold">{getTypeName(card.type)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleToggleFavorite}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                isFav ? 'bg-rose-100 text-rose-500 border-rose-300' : 'bg-[#F3E8C8]/60 text-[#5A4B2E]/70 hover:bg-[#F3E8C8] border-[#D4C296]/30'
              }`}
              title={isFav ? '已收藏' : '收藏此卡牌'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#5A4B2E]/70 hover:text-[#1A2340] hover:bg-[#F3E8C8] border border-[#D4C296]/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Visual Hero Area —— 奶白卡片区，无黑色渐变，卡面直接展示 */}
        <div className="flex items-center justify-center bg-[#F9F2DE]/60 border-y border-[#D4C296]/15 py-6 px-4">
          <TarotCardView
            card={card}
            isFlipped={true}
            size="lg"
            glow={true}
            showLabel={false}
          />
        </div>

        {/* Navigation Tabs —— 浅米色底 */}
        <div className="flex items-center bg-[#F3E8C8]/50 p-1 rounded-2xl border border-[#D4C296]/30 text-xs font-semibold mt-4 mx-5 mb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 rounded-xl text-center transition-all ${
              activeTab === 'overview' ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow-md' : 'text-[#5A4B2E] hover:text-[#1A2340] hover:bg-[#EEDFB2]/50'
            }`}
          >
            概览与关键词
          </button>
          <button
            onClick={() => setActiveTab('upright')}
            className={`flex-1 py-2 rounded-xl text-center transition-all ${
              activeTab === 'upright' ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow-md' : 'text-[#5A4B2E] hover:text-[#1A2340] hover:bg-[#EEDFB2]/50'
            }`}
          >
            正位详解
          </button>
          <button
            onClick={() => setActiveTab('reversed')}
            className={`flex-1 py-2 rounded-xl text-center transition-all ${
              activeTab === 'reversed' ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow-md' : 'text-[#5A4B2E] hover:text-[#1A2340] hover:bg-[#EEDFB2]/50'
            }`}
          >
            逆位详解
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex-1 py-2 rounded-xl text-center transition-all ${
              activeTab === 'scenarios' ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow-md' : 'text-[#5A4B2E] hover:text-[#1A2340] hover:bg-[#EEDFB2]/50'
            }`}
          >
            场景应用
          </button>
        </div>

        {/* Tab Contents —— 全部浅色化，去掉所有黑色底盒子 */}
        <div className="px-5 pb-6 space-y-3 text-sm leading-relaxed text-[#1A2340]/85">
          {activeTab === 'overview' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="text-emerald-700 font-bold text-sm flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>正位核心关键词</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.keywordsUpright.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-white text-emerald-700 border border-emerald-200 text-xs font-medium shadow-sm">
                      ✦ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 space-y-2">
                <div className="text-rose-600 font-bold text-sm flex items-center space-x-1.5">
                  <Info className="w-4 h-4" />
                  <span>逆位核心关键词</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.keywordsReversed.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-white text-rose-600 border border-rose-200 text-xs font-medium shadow-sm">
                      ✦ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#FFF4DD]/90 border-2 border-[#D4C296]/40 rounded-2xl p-4 shadow-sm">
                <div className="text-[#8B6F2E] font-bold text-sm mb-2 flex items-center space-x-1">✦ 月光治愈指引 ✦</div>
                <p className="italic text-[#1A2340]/90 font-serif leading-relaxed text-[15px]">
                  {card.healerAdvice}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'upright' && (
            <div className="bg-white border border-emerald-200 rounded-2xl p-5 space-y-3 animate-fadeIn shadow-sm">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-xs border border-emerald-200">正位</span>
                <span>光明能量与顺境寓意</span>
              </div>
              <p className="text-[15px] text-[#1A2340] leading-[1.9]">
                {card.uprightMeaning}
              </p>
            </div>
          )}

          {activeTab === 'reversed' && (
            <div className="bg-white border border-rose-200 rounded-2xl p-5 space-y-3 animate-fadeIn shadow-sm">
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
                <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-xs border border-rose-200">逆位</span>
                <span>隐患提示与调整方向</span>
              </div>
              <p className="text-[15px] text-[#1A2340] leading-[1.9]">
                {card.reversedMeaning}
              </p>
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-white border border-rose-200 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="text-rose-600 font-bold text-sm flex items-center space-x-1.5">
                  <Heart className="w-4 h-4" />
                  <span>感情与关系解读</span>
                </div>
                <p className="text-[14px] text-[#1A2340]/90 leading-[1.85]">
                  {card.loveMeaning}
                </p>
              </div>

              <div className="bg-white border border-sky-200 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="text-sky-700 font-bold text-sm flex items-center space-x-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>事业与学业解读</span>
                </div>
                <p className="text-[14px] text-[#1A2340]/90 leading-[1.85]">
                  {card.careerMeaning}
                </p>
              </div>

              <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="text-amber-700 font-bold text-sm flex items-center space-x-1.5">
                  <Smile className="w-4 h-4" />
                  <span>身心与生活建议</span>
                </div>
                <p className="text-[14px] text-[#1A2340]/90 leading-[1.85]">
                  {card.lifestyleMeaning}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

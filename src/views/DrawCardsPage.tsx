import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, RotateCcw, Check, Compass } from 'lucide-react';
import { DrawnCard, SpreadConfig, TarotCard } from '../types';
import { TAROT_DECK } from '../data/tarotDeck';
import { TarotCardView } from '../components/TarotCardView';
import { soundEngine } from '../utils/audio';

interface DrawCardsPageProps {
  spread: SpreadConfig;
  question: string;
  onFinishDraw: (drawnCards: DrawnCard[]) => void;
  onBack: () => void;
}

export const DrawCardsPage: React.FC<DrawCardsPageProps> = ({
  spread,
  question,
  onFinishDraw,
  onBack,
}) => {
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [deckRemaining, setDeckRemaining] = useState<TarotCard[]>([]);

  // Initialize shuffled deck with crypto randomness
  useEffect(() => {
    const shuffleDeck = [...TAROT_DECK];
    for (let i = shuffleDeck.length - 1; i > 0; i--) {
      // Secure random
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const j = array[0] % (i + 1);
      [shuffleDeck[i], shuffleDeck[j]] = [shuffleDeck[j], shuffleDeck[i]];
    }
    setDeckRemaining(shuffleDeck);
    setDrawnCards([]);
    setActiveSlotIndex(0);
  }, [spread]);

  const handleDrawNextCard = (cardIndexInDeck?: number) => {
    if (isAnimating || drawnCards.length >= spread.cardCount || deckRemaining.length === 0) {
      return;
    }

    setIsAnimating(true);
    soundEngine.playCardFlip();

    // Pick card from remaining deck
    const chosenIndex = typeof cardIndexInDeck === 'number' && cardIndexInDeck >= 0 && cardIndexInDeck < deckRemaining.length
      ? cardIndexInDeck
      : Math.floor(Math.random() * deckRemaining.length);

    const chosenCard = deckRemaining[chosenIndex];
    const newRemaining = deckRemaining.filter((_, idx) => idx !== chosenIndex);

    // Cryptographic random for Upright/Reversed (approx 40% reversed)
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const isReversed = (array[0] % 100) < 40;

    const currentPos = spread.positions[activeSlotIndex] || {
      name: `位置 ${activeSlotIndex + 1}`,
      meaning: '能量指引'
    };

    const newDrawn: DrawnCard = {
      card: chosenCard,
      isReversed,
      positionIndex: activeSlotIndex,
      positionName: currentPos.name,
      positionMeaning: currentPos.meaning,
    };

    setTimeout(() => {
      setDrawnCards(prev => [...prev, newDrawn]);
      setDeckRemaining(newRemaining);
      setActiveSlotIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 800);
  };

  const handleReset = () => {
    soundEngine.playClick();
    const shuffleDeck = [...TAROT_DECK];
    for (let i = shuffleDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffleDeck[i], shuffleDeck[j]] = [shuffleDeck[j], shuffleDeck[i]];
    }
    setDeckRemaining(shuffleDeck);
    setDrawnCards([]);
    setActiveSlotIndex(0);
    setIsAnimating(false);
  };

  const isComplete = drawnCards.length === spread.cardCount;

  return (
    <div className="w-full min-h-[85vh] flex flex-col justify-between pb-8 animate-fadeIn select-none">
      {/* Top Header & Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 text-xs text-[#D4C296] hover:text-[#F5F7FF] px-2 py-1 rounded-lg bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>更换牌阵</span>
          </button>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7B68EE]/20 border border-[#7B68EE]/30 text-[#D4C296] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{spread.name}</span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs text-[#F5F7FF]/50 hover:text-[#F5F7FF] px-2 py-1 rounded-lg bg-white/5"
            title="重新洗牌"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重洗</span>
          </button>
        </div>

        {/* Question & Meditation Prompt */}
        <div className="text-center bg-[#1A2340]/60 border border-white/10 rounded-2xl p-2.5">
          <div className="text-xs text-[#D4C296] font-medium truncate">
            {question ? `念想：“${question}”` : '念想：“随心直觉指引”'}
          </div>
          <div className="text-[11px] text-[#F5F7FF]/60 mt-0.5 animate-pulse">
            {isComplete ? '已抽齐所有牌张 · 请点击下方开启解读' : `静心冥想 · 抽取第 ${activeSlotIndex + 1} 张【${spread.positions[activeSlotIndex]?.name || ''}】`}
          </div>
        </div>
      </div>

      {/* ================= Slots Area (Target Spread Layout) ================= */}
      <div className="my-auto py-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {spread.positions.map((pos, idx) => {
            const drawn = drawnCards.find(d => d.positionIndex === idx);
            const isCurrentActive = idx === activeSlotIndex && !isComplete;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Position Title Pill */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full mb-1 font-medium transition-colors ${
                  drawn
                    ? 'bg-[#D4C296]/20 text-[#D4C296] border border-[#D4C296]/30'
                    : isCurrentActive
                    ? 'bg-[#7B68EE]/30 text-[#F5F7FF] border border-[#7B68EE] animate-pulse'
                    : 'bg-white/5 text-[#F5F7FF]/40'
                }`}>
                  {idx + 1}. {pos.name}
                </span>

                {/* Card Container */}
                {drawn ? (
                  <TarotCardView
                    card={drawn.card}
                    isFlipped={true}
                    isReversed={drawn.isReversed}
                    size={spread.cardCount > 3 ? 'sm' : 'md'}
                    glow={true}
                  />
                ) : (
                  <div
                    onClick={() => handleDrawNextCard()}
                    className={`rounded-xl flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer ${
                      spread.cardCount > 3 ? 'w-24 h-36' : 'w-32 h-48'
                    } ${
                      isCurrentActive
                        ? 'border-[#D4C296] bg-[#D4C296]/5 shadow-lg shadow-[#D4C296]/10 animate-pulse'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <Sparkles className={`w-5 h-5 ${isCurrentActive ? 'text-[#D4C296]' : 'text-white/20'}`} />
                    <span className="text-[10px] text-[#F5F7FF]/40 mt-1">
                      {isCurrentActive ? '待翻开' : `位置 ${idx + 1}`}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= Interactive Deck Fan / Draw Action Bar ================= */}
      <div className="space-y-4 pt-2">
        {!isComplete ? (
          <div className="space-y-3">
            {/* Visual Deck Stack */}
            <div className="relative h-28 flex items-center justify-center overflow-hidden py-2">
              <div className="flex items-center -space-x-8 hover:-space-x-5 transition-all duration-300">
                {deckRemaining.slice(0, 10).map((card, idx) => (
                  <div
                    key={card.id}
                    onClick={() => handleDrawNextCard(idx)}
                    className="transform hover:-translate-y-3 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                    style={{
                      transform: `rotate(${(idx - 4.5) * 3}deg)`,
                    }}
                  >
                    <TarotCardView
                      isFlipped={false}
                      size="sm"
                      showLabel={false}
                      glow={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Draw Button */}
            <button
              onClick={() => handleDrawNextCard()}
              disabled={isAnimating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4C296] to-[#E8D8B0] text-[#1A2340] text-sm font-bold shadow-xl shadow-[#D4C296]/20 flex items-center justify-center space-x-2 active:scale-98 transition-all hover:brightness-105 disabled:opacity-50"
            >
              {isAnimating ? (
                <>
                  <Compass className="w-4 h-4 animate-spin text-[#1A2340]" />
                  <span>正在翻转牌面...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#1A2340]" />
                  <span>点击抽取第 {activeSlotIndex + 1} 张牌</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3 animate-fadeIn">
            <button
              onClick={() => onFinishDraw(drawnCards)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4C296] via-[#FDE68A] to-[#D4C296] text-[#1A2340] text-base font-extrabold shadow-2xl shadow-[#D4C296]/30 flex items-center justify-center space-x-2 active:scale-98 transition-all hover:scale-[1.02] animate-bounce"
            >
              <Sparkles className="w-5 h-5 text-[#1A2340]" />
              <span>解读牌阵答案与启示</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

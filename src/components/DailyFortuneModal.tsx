import React, { useState, useEffect } from 'react';
import { X, Moon, Sparkles, Share2, Compass, Check } from 'lucide-react';
import { getCardById, getRandomTarotCard } from '../data/tarotDeck';
import { DailyFortuneState } from '../types';
import { getDailyFortune, getTodayDateStr, saveDailyFortune } from '../utils/storage';
import { TarotCardView } from './TarotCardView';
import { soundEngine } from '../utils/audio';

interface DailyFortuneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare?: (state: DailyFortuneState) => void;
}

export const DailyFortuneModal: React.FC<DailyFortuneModalProps> = ({
  isOpen,
  onClose,
  onShare,
}) => {
  const [fortune, setFortune] = useState<DailyFortuneState | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [countdownStr, setCountdownStr] = useState('');

  const today = getTodayDateStr();

  useEffect(() => {
    if (!isOpen) return;

    const existing = getDailyFortune();
    if (existing && existing.date === today) {
      setFortune(existing);
      setIsFlipped(true);
    } else {
      setFortune(null);
      setIsFlipped(false);
    }

    // Midnight Countdown Timer
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdownStr(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isOpen, today]);

  if (!isOpen) return null;

  const handleDraw = () => {
    if (isDrawing || fortune) return;
    setIsDrawing(true);
    soundEngine.playCardFlip();

    setTimeout(() => {
      const card = getRandomTarotCard();
      const isReversed = Math.random() < 0.35; // 35% gentle reversed probability
      const oneLiner = isReversed
        ? `今日提醒：${card.nameCn}逆位提示你${card.keywordsReversed[0]}与${card.keywordsReversed[1]}，慢下来听从内在声音。`
        : `今日月运：${card.nameCn}正位为你带来${card.keywordsUpright[0]}与${card.keywordsUpright[1]}的丰盛祝福。`;

      const newFortune: DailyFortuneState = {
        date: today,
        cardId: card.id,
        isReversed,
        drawnAt: Date.now(),
        oneLiner,
      };

      saveDailyFortune(newFortune);
      setFortune(newFortune);
      setIsFlipped(true);
      setIsDrawing(false);
    }, 900);
  };

  const cardData = fortune ? getCardById(fortune.cardId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] bg-[#1A2340] border border-[#D4C296]/35 rounded-3xl p-6 shadow-2xl overflow-y-auto flex flex-col items-center relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#F5F7FF]/50 hover:text-[#F5F7FF] hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center space-x-2 text-[#D4C296] mb-1">
          <Moon className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wider">今日月运占卜</span>
        </div>
        <div className="text-xs text-[#F5F7FF]/50 mb-5">
          {today} · 每日限抽一次 · 零点自动刷新
        </div>

        {/* Card Stage */}
        <div className="my-2 relative flex flex-col items-center">
          <TarotCardView
            card={cardData || undefined}
            isFlipped={isFlipped}
            isReversed={fortune?.isReversed || false}
            size="lg"
            glow={true}
            onClick={fortune ? undefined : handleDraw}
          />

          {!fortune && !isDrawing && (
            <div className="mt-4 animate-bounce">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#D4C296]/20 text-[#D4C296] text-xs border border-[#D4C296]/40">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                点击牌背，抽取今日专属牌
              </span>
            </div>
          )}

          {isDrawing && (
            <div className="mt-4 text-[#D4C296] text-xs flex items-center space-x-2">
              <Compass className="w-4 h-4 animate-spin" />
              <span>正在连接今日月相星盘...</span>
            </div>
          )}
        </div>

        {/* Fortune Interpretation */}
        {fortune && cardData && (
          <div className="w-full mt-4 space-y-3 text-left animate-fadeIn">
            {/* One-Liner Box */}
            <div className="bg-[#7B68EE]/15 border border-[#7B68EE]/30 rounded-2xl p-3.5 text-center">
              <div className="text-sm text-[#F5F7FF] font-medium leading-relaxed">
                {fortune.oneLiner}
              </div>
            </div>

            {/* Keyword Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 py-1">
              {(fortune.isReversed ? cardData.keywordsReversed : cardData.keywordsUpright).map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-[#D4C296]">
                  ✦ {kw}
                </span>
              ))}
            </div>

            {/* Advice Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-semibold text-[#D4C296] flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>今日能量启示</span>
              </div>
              <p className="text-xs text-[#F5F7FF]/80 leading-relaxed">
                {fortune.isReversed ? cardData.reversedMeaning : cardData.uprightMeaning}
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-[#D4C296]/90 font-serif italic">
                {cardData.healerAdvice}
              </div>
            </div>

            {/* Midnight Lock Countdown */}
            <div className="text-center pt-2 text-[11px] text-[#F5F7FF]/40">
              距离明天新牌刷新还有：<span className="font-mono text-[#D4C296]">{countdownStr}</span>
            </div>
          </div>
        )}

        {/* Footer Button */}
        <div className="w-full mt-5">
          {fortune ? (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#F5F7FF] text-xs font-medium transition-all"
            >
              完成并铭记今日启示
            </button>
          ) : (
            <button
              onClick={handleDraw}
              disabled={isDrawing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4C296] to-[#E8D8B0] text-[#1A2340] text-sm font-bold shadow-lg shadow-[#D4C296]/20 active:scale-98 transition-all"
            >
              一键抽取今日月运
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

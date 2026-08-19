import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  HeartHandshake,
  Briefcase,
  GitFork,
  Sun,
  ChevronRight,
  Info
} from 'lucide-react';
import { TAROT_SPREADS } from '../data/spreads';
import { SpreadConfig } from '../types';
import { QuestionModal } from '../components/QuestionModal';
import { soundEngine } from '../utils/audio';

interface SpreadSelectorPageProps {
  onStartSpread: (spread: SpreadConfig, question: string) => void;
  defaultSpreadId?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Compass,
  HeartHandshake,
  Briefcase,
  GitFork,
  Sun,
};

export const SpreadSelectorPage: React.FC<SpreadSelectorPageProps> = ({
  onStartSpread,
  defaultSpreadId,
}) => {
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfig | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'quick' | 'love' | 'career' | 'decision'>('all');

  const handleSelectSpread = (spread: SpreadConfig) => {
    soundEngine.playClick();
    setSelectedSpread(spread);
    setIsQuestionModalOpen(true);
  };

  const handleConfirmQuestion = (question: string) => {
    if (!selectedSpread) return;
    setIsQuestionModalOpen(false);
    onStartSpread(selectedSpread, question);
  };

  const filteredSpreads = TAROT_SPREADS.filter((s) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'quick') return s.id === 'single' || s.id === 'three_time';
    if (activeCategory === 'love') return s.id === 'love_triangle';
    if (activeCategory === 'career') return s.id === 'career_growth';
    if (activeCategory === 'decision') return s.id === 'decision_choice' || s.id === 'overall_energy';
    return true;
  });

  return (
    <div className="w-full space-y-4 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center pt-2 space-y-1">
        <h2 className="text-lg font-bold text-[#F5F7FF] font-serif">
          占卜牌阵选择
        </h2>
        <p className="text-xs text-[#F5F7FF]/50">
          根据所思所感选择契合的阵法 · 本地真随机运算
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            activeCategory === 'all'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          全部牌阵 ({TAROT_SPREADS.length})
        </button>
        <button
          onClick={() => setActiveCategory('quick')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            activeCategory === 'quick'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          日常速占
        </button>
        <button
          onClick={() => setActiveCategory('love')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            activeCategory === 'love'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          感情人际
        </button>
        <button
          onClick={() => setActiveCategory('career')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            activeCategory === 'career'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          事业学业
        </button>
        <button
          onClick={() => setActiveCategory('decision')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
            activeCategory === 'decision'
              ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow'
              : 'bg-white/5 text-[#F5F7FF]/70 hover:bg-white/10'
          }`}
        >
          抉择与综合
        </button>
      </div>

      {/* Spreads List */}
      <div className="space-y-3">
        {filteredSpreads.map((spread) => {
          const Icon = ICON_MAP[spread.iconName] || Sparkles;
          return (
            <div
              key={spread.id}
              onClick={() => handleSelectSpread(spread)}
              className="bg-[#1A2340]/85 hover:bg-[#1A2340] border border-[#D4C296]/25 hover:border-[#D4C296]/60 rounded-2xl p-4 shadow-md transition-all cursor-pointer group active:scale-99 relative overflow-hidden"
            >
              {/* Top Row: Icon + Name + Tag + Card Count */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7B68EE]/20 border border-[#7B68EE]/30 flex items-center justify-center text-[#D4C296] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-[#F5F7FF]">{spread.name}</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#D4C296]/15 text-[#D4C296] border border-[#D4C296]/30">
                        {spread.tag}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#F5F7FF]/50 mt-0.5 block">
                      {spread.cardCount} 张牌 · {spread.suitableFor}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#D4C296]/70 group-hover:text-[#D4C296] group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Positions Preview Row */}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                {spread.positions.map((pos, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-[#F5F7FF]/70 border border-white/5"
                  >
                    {idx + 1}. {pos.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Question Input Modal */}
      {selectedSpread && (
        <QuestionModal
          spread={selectedSpread}
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          onConfirm={handleConfirmQuestion}
        />
      )}
    </div>
  );
};

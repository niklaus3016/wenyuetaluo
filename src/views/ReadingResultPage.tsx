import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Share2,
  Heart,
  RotateCcw,
  BookOpen,
  Check,
  Compass,
  ArrowLeft,
  ChevronRight,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { DivinationRecord, DrawnCard, SpreadConfig, TarotCard } from '../types';
import { TarotCardView } from '../components/TarotCardView';
import { CardDetailModal } from '../components/CardDetailModal';
import { ShareImageModal } from '../components/ShareImageModal';
import { generateDivinationCardImage } from '../utils/imageExporter';
import { saveDivinationRecord, toggleRecordFavorite } from '../utils/storage';
import { soundEngine } from '../utils/audio';

interface ReadingResultPageProps {
  spread: SpreadConfig;
  question: string;
  drawnCards: DrawnCard[];
  onRedo: () => void;
  onBackToHome: () => void;
}

export const ReadingResultPage: React.FC<ReadingResultPageProps> = ({
  spread,
  question,
  drawnCards,
  onRedo,
  onBackToHome,
}) => {
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<TarotCard | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [shareImageModalOpen, setShareImageModalOpen] = useState(false);
  const [generatedImageDataUrl, setGeneratedImageDataUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeCardTab, setActiveCardTab] = useState(0);

  // Synthesize holistic summary
  const generateHolisticSummary = () => {
    if (drawnCards.length === 1) {
      const d = drawnCards[0];
      return d.isReversed
        ? `【${d.card.nameCn}·逆位】作为核心启示，提醒你当前正处于调整与沉淀的关键期。${d.card.reversedMeaning} 保持耐心，顺应内在节律，无须强求速成。`
        : `【${d.card.nameCn}·正位】为你揭示了光明的核心能量。${d.card.uprightMeaning} 把握好这份当下的顺境与机缘，坚定迈出行动步伐。`;
    }

    const firstCard = drawnCards[0];
    const lastCard = drawnCards[drawnCards.length - 1];

    let tone = '从整体牌势来看，能量正在经历从内省到外显的自然流动。';
    if (lastCard.isReversed) {
      tone += `在发展阶段需要多加留意【${lastCard.card.nameCn}·逆位】所提示的${lastCard.card.keywordsReversed[0]}与${lastCard.card.keywordsReversed[1]}。`;
    } else {
      tone += `终局与走向受到【${lastCard.card.nameCn}·正位】的庇佑，象征着${lastCard.card.keywordsUpright[0]}与美好的达成。`;
    }

    return `${tone} 将各阶段经验融会贯通，遵从本心，方得始终。`;
  };

  const holisticSummary = generateHolisticSummary();
  const primaryAdvice = drawnCards[0]?.card.healerAdvice || '愿月光抚平所有不安，指引你走向笃定与安宁。';

  // Save to offline history automatically
  const [recordId] = useState(`record_${Date.now()}`);
  const recordDateStr = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    const record: DivinationRecord = {
      id: recordId,
      timestamp: Date.now(),
      dateStr: recordDateStr,
      question: question.trim() || '随心直觉指引',
      spreadId: spread.id,
      spreadName: spread.name,
      drawnCards: drawnCards.map(d => ({
        cardId: d.card.id,
        isReversed: d.isReversed,
        positionName: d.positionName,
        positionMeaning: d.positionMeaning,
      })),
      summary: holisticSummary,
      healerAdvice: primaryAdvice,
      isFavorite: false,
    };
    saveDivinationRecord(record);
  }, [recordId, spread, question, drawnCards, holisticSummary, primaryAdvice, recordDateStr]);

  const handleToggleFavorite = () => {
    soundEngine.playClick();
    const updated = toggleRecordFavorite(recordId);
    setIsFavorite(updated);
  };

  const handleGenerateShareImage = async () => {
    soundEngine.playClick();
    setIsGeneratingImage(true);
    try {
      const record: DivinationRecord = {
        id: recordId,
        timestamp: Date.now(),
        dateStr: recordDateStr,
        question: question.trim() || '随心直觉指引',
        spreadId: spread.id,
        spreadName: spread.name,
        drawnCards: drawnCards.map(d => ({
          cardId: d.card.id,
          isReversed: d.isReversed,
          positionName: d.positionName,
          positionMeaning: d.positionMeaning,
        })),
        summary: holisticSummary,
        healerAdvice: primaryAdvice,
        isFavorite,
      };
      const dataUrl = await generateDivinationCardImage(record);
      setGeneratedImageDataUrl(dataUrl);
      setShareImageModalOpen(true);
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const openCardDetail = (card: TarotCard) => {
    soundEngine.playClick();
    setSelectedCardForDetail(card);
    setIsDetailModalOpen(true);
  };

  const currentActiveDrawn = drawnCards[activeCardTab] || drawnCards[0];

  return (
    <div className="w-full space-y-5 pb-10 animate-fadeIn text-left">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-1 text-xs text-[#D4C296] hover:text-[#F5F7FF] px-2.5 py-1.5 rounded-xl bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回首页</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleFavorite}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all border ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white/5 text-[#F5F7FF]/70 border-white/10 hover:bg-white/10'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-300' : ''}`} />
            <span>{isFavorite ? '已收藏' : '收藏'}</span>
          </button>

          <button
            onClick={handleGenerateShareImage}
            disabled={isGeneratingImage}
            className="px-3 py-1.5 rounded-xl text-xs bg-[#D4C296]/20 border border-[#D4C296]/40 text-[#D4C296] hover:bg-[#D4C296]/30 flex items-center space-x-1.5 font-medium transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isGeneratingImage ? '生成中...' : '生成结果图'}</span>
          </button>
        </div>
      </div>

      {/* Overview Info Banner */}
      <div className="bg-[#1A2340]/90 border border-[#D4C296]/30 rounded-3xl p-5 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-[#7B68EE]/20 text-[#D4C296] border border-[#7B68EE]/30 font-semibold">
            {spread.name}
          </span>
          <span className="text-[#F5F7FF]/40 text-[11px]">{recordDateStr}</span>
        </div>

        <div className="text-base font-bold text-[#F5F7FF] font-serif pt-1">
          {question ? `“ ${question} ”` : '“ 随心直觉指引 ”'}
        </div>
        <p className="text-xs text-[#F5F7FF]/50">
          已自动保存存档 · 点击单牌可放大查看百科详解
        </p>
      </div>

      {/* ================= Drawn Cards Visual Gallery ================= */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-[#D4C296] flex items-center space-x-1 px-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>抽牌阵容 ({drawnCards.length}张)</span>
        </div>

        <div className="flex items-center justify-start space-x-3 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none">
          {drawnCards.map((drawn, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveCardTab(idx);
                openCardDetail(drawn.card);
              }}
              className="flex flex-col items-center shrink-0 cursor-pointer group transform hover:-translate-y-1 transition-all"
            >
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-[#D4C296] border border-white/10 mb-1.5 font-medium">
                {idx + 1}. {drawn.positionName}
              </span>
              <TarotCardView
                card={drawn.card}
                isFlipped={true}
                isReversed={drawn.isReversed}
                size={drawnCards.length > 3 ? 'sm' : 'md'}
                glow={activeCardTab === idx}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= Layered Interpretation ================= */}
      <div className="space-y-4">
        {/* Section A: Individual Position Card Interpretation Tabs */}
        <div className="bg-[#1A2340]/80 border border-white/10 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="text-xs font-bold text-[#D4C296] flex items-center space-x-1.5">
              <Compass className="w-4 h-4" />
              <span>单牌逐位解析</span>
            </div>
            {/* Position selector pill buttons */}
            <div className="flex items-center space-x-1 overflow-x-auto max-w-[200px] scrollbar-none">
              {drawnCards.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCardTab(i)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                    activeCardTab === i
                      ? 'bg-[#D4C296] text-[#1A2340] font-bold'
                      : 'bg-white/5 text-[#F5F7FF]/60 hover:bg-white/10'
                  }`}
                >
                  第{i + 1}张
                </button>
              ))}
            </div>
          </div>

          {/* Active Card Detail View */}
          {currentActiveDrawn && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#F5F7FF] flex items-center space-x-2">
                    <span>{currentActiveDrawn.card.nameCn}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-normal ${
                      currentActiveDrawn.isReversed
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {currentActiveDrawn.isReversed ? '【逆位】' : '【正位】'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#D4C296]/80 block mt-0.5">
                    位置：第 {currentActiveDrawn.positionIndex + 1} 位 · {currentActiveDrawn.positionName}（{currentActiveDrawn.positionMeaning}）
                  </span>
                </div>

                <button
                  onClick={() => openCardDetail(currentActiveDrawn.card)}
                  className="text-xs text-[#D4C296] hover:underline flex items-center space-x-1 shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>查看全解</span>
                </button>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(currentActiveDrawn.isReversed
                  ? currentActiveDrawn.card.keywordsReversed
                  : currentActiveDrawn.card.keywordsUpright
                ).map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-[#F5F7FF]/80 border border-white/10"
                  >
                    ✦ {kw}
                  </span>
                ))}
              </div>

              {/* Positional Interpretation Text */}
              <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-2">
                <div className="text-xs font-semibold text-[#D4C296]">
                  {currentActiveDrawn.positionName}启示：
                </div>
                <p className="text-xs text-[#F5F7FF]/85 leading-relaxed">
                  {currentActiveDrawn.isReversed
                    ? currentActiveDrawn.card.reversedMeaning
                    : currentActiveDrawn.card.uprightMeaning}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section B: Holistic Synthesis Across Spread */}
        <div className="bg-gradient-to-br from-[#1A2340] to-[#232F54] border border-[#7B68EE]/30 rounded-3xl p-5 shadow-lg space-y-2.5">
          <div className="text-xs font-bold text-[#D4C296] flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4" />
            <span>牌阵综合解读</span>
          </div>
          <p className="text-xs text-[#F5F7FF]/90 leading-relaxed">
            {holisticSummary}
          </p>
        </div>

        {/* Section C: Healing Advice & Mindset Direction */}
        <div className="bg-[#7B68EE]/10 border border-[#D4C296]/35 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="text-xs font-bold text-[#D4C296] flex items-center space-x-1.5">
            <Sun className="w-4 h-4" />
            <span>月光治愈启示与行动建议</span>
          </div>
          <p className="text-xs text-[#F5F7FF]/90 font-serif italic leading-relaxed">
            {primaryAdvice}
          </p>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2 flex items-center space-x-3">
        <button
          onClick={onRedo}
          className="flex-1 py-3.5 rounded-2xl border border-[#D4C296]/30 text-[#D4C296] text-xs font-bold flex items-center justify-center space-x-1.5 hover:bg-[#D4C296]/10 active:scale-98 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>重新占卜</span>
        </button>
        <button
          onClick={handleGenerateShareImage}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4C296] to-[#E8D8B0] text-[#1A2340] text-xs font-bold shadow-lg shadow-[#D4C296]/20 flex items-center justify-center space-x-1.5 active:scale-98 transition-all hover:brightness-105"
        >
          <Share2 className="w-4 h-4" />
          <span>生成高清卡片</span>
        </button>
      </div>

      {/* Encyclopedia Single Card Modal */}
      <CardDetailModal
        card={selectedCardForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Share Image Export Modal */}
      <ShareImageModal
        imageDataUrl={generatedImageDataUrl}
        isOpen={shareImageModalOpen}
        onClose={() => setShareImageModalOpen(false)}
      />
    </div>
  );
};

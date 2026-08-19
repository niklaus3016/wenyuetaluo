import React, { useState } from 'react';
import {
  History,
  Trash2,
  Share2,
  Heart,
  Calendar,
  Sparkles,
  ChevronRight,
  Search,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { DivinationRecord } from '../types';
import { getHistoryRecords, deleteDivinationRecord, clearAllHistory, toggleRecordFavorite } from '../utils/storage';
import { getCardById } from '../data/tarotDeck';
import { ShareImageModal } from '../components/ShareImageModal';
import { generateDivinationCardImage } from '../utils/imageExporter';
import { soundEngine } from '../utils/audio';

interface HistoryPageProps {
  onReopenRecord: (record: DivinationRecord) => void;
  onStartNewReading: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onReopenRecord,
  onStartNewReading,
}) => {
  const [records, setRecords] = useState<DivinationRecord[]>(getHistoryRecords());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavOnly, setFilterFavOnly] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const refreshRecords = () => {
    setRecords(getHistoryRecords());
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundEngine.playClick();
    if (window.confirm('确定要删除这条占卜记录吗？')) {
      deleteDivinationRecord(id);
      refreshRecords();
    }
  };

  const handleClearAll = () => {
    soundEngine.playClick();
    if (window.confirm('确定要清空所有占卜历史吗？此操作无法撤销。')) {
      clearAllHistory();
      refreshRecords();
    }
  };

  const handleToggleFav = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundEngine.playClick();
    toggleRecordFavorite(id);
    refreshRecords();
  };

  const handleShareImage = async (e: React.MouseEvent, record: DivinationRecord) => {
    e.stopPropagation();
    soundEngine.playClick();
    try {
      const url = await generateDivinationCardImage(record);
      setShareImageUrl(url);
      setIsShareModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRecords = records.filter((r) => {
    if (filterFavOnly && !r.isFavorite) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.question.toLowerCase().includes(q) ||
      r.spreadName.toLowerCase().includes(q) ||
      r.drawnCards.some((dc) => {
        const c = getCardById(dc.cardId);
        return c && c.nameCn.includes(q);
      })
    );
  });

  return (
    <div className="w-full space-y-4 pb-8 animate-fadeIn text-left">
      {/* Header */}
      <div className="text-center pt-2 space-y-1">
        <h2 className="text-lg font-bold text-[#F5F7FF] font-serif">
          占卜历史记录
        </h2>
        <p className="text-xs text-[#F5F7FF]/50">
          所有结果安全保存在本地 · 不上传、不泄露
        </p>
      </div>

      {/* Top Bar Actions */}
      <div className="flex items-center justify-between gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#D4C296]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索历史问题或卡牌..."
            className="w-full bg-[#1A2340]/90 border border-[#D4C296]/25 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F5F7FF] placeholder-[#F5F7FF]/40 focus:outline-none focus:border-[#D4C296]"
          />
        </div>

        {/* Favorite Filter Toggle */}
        <button
          onClick={() => setFilterFavOnly(!filterFavOnly)}
          className={`px-3 py-2 rounded-xl text-xs flex items-center space-x-1 transition-all border shrink-0 ${
            filterFavOnly
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
              : 'bg-white/5 text-[#F5F7FF]/70 border-white/10 hover:bg-white/10'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${filterFavOnly ? 'fill-rose-300' : ''}`} />
          <span>收藏</span>
        </button>

        {/* Clear All Button */}
        {records.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-2 rounded-xl text-xs bg-white/5 text-[#F5F7FF]/50 hover:text-rose-400 hover:bg-white/10 border border-white/10 transition-all shrink-0"
            title="清空所有记录"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* History Records List */}
      {filteredRecords.length > 0 ? (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => onReopenRecord(record)}
              className="bg-[#1A2340]/85 hover:bg-[#1A2340] border border-[#D4C296]/20 hover:border-[#D4C296]/50 rounded-2xl p-4 shadow-md transition-all cursor-pointer group active:scale-99 space-y-3"
            >
              {/* Record Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] bg-[#7B68EE]/20 text-[#D4C296] border border-[#7B68EE]/30 font-medium">
                    {record.spreadName}
                  </span>
                  <span className="text-[11px] text-[#F5F7FF]/40">
                    {record.dateStr}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={(e) => handleToggleFav(e, record.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      record.isFavorite ? 'text-rose-400' : 'text-[#F5F7FF]/30 hover:text-[#F5F7FF]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${record.isFavorite ? 'fill-rose-400' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleShareImage(e, record)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#F5F7FF]/40 hover:text-[#D4C296]"
                    title="导出图片"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleDelete(e, record.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#F5F7FF]/40 hover:text-rose-400"
                    title="删除记录"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question */}
              <div className="text-sm font-bold text-[#F5F7FF] font-serif group-hover:text-[#D4C296] transition-colors">
                “ {record.question} ”
              </div>

              {/* Cards Preview Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {record.drawnCards.map((dc, i) => {
                  const c = getCardById(dc.cardId);
                  if (!c) return null;
                  return (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-black/40 text-[#F5F7FF]/80 border border-white/10 flex items-center space-x-1"
                    >
                      <span>{c.nameCn}</span>
                      <span className={`text-[9px] ${dc.isReversed ? 'text-rose-300' : 'text-emerald-300'}`}>
                        {dc.isReversed ? '(逆)' : '(正)'}
                      </span>
                    </span>
                  );
                })}
              </div>

              {/* Summary Snippet */}
              <p className="text-xs text-[#F5F7FF]/60 line-clamp-2 leading-relaxed pt-1 border-t border-white/5">
                {record.summary}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white/5 rounded-3xl border border-white/10 space-y-3">
          <History className="w-10 h-10 text-[#D4C296]/30 mx-auto" />
          <div className="text-sm font-medium text-[#F5F7FF]/70">暂无占卜历史记录</div>
          <p className="text-xs text-[#F5F7FF]/40 max-w-xs mx-auto">
            每一次的提问与启示都会安全珍藏在这里
          </p>
          <button
            onClick={onStartNewReading}
            className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-[#D4C296] text-[#1A2340] text-xs font-bold shadow hover:brightness-105 active:scale-98 transition-all"
          >
            <span>立即开启一次新占卜</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Share Image Export Modal */}
      <ShareImageModal
        imageDataUrl={shareImageUrl}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};

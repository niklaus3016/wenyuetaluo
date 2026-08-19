import React from 'react';
import {
  Sparkles,
  Compass,
  BookOpen,
  History,
  Moon,
  ChevronRight,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab, AppSettings, DailyFortuneState } from '../types';
import { getCardById } from '../data/tarotDeck';
import { SoundBar } from '../components/SoundBar';
import { TarotCardView } from '../components/TarotCardView';
import { soundEngine } from '../utils/audio';

interface HomePageProps {
  onNavigate: (tab: ActiveTab, params?: any) => void;
  onOpenDailyFortune: () => void;
  dailyFortune: DailyFortuneState | null;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenDailyFortune,
  dailyFortune,
  settings,
  onUpdateSettings,
}) => {
  const dailyCard = dailyFortune ? getCardById(dailyFortune.cardId) : null;

  const handleQuickSingle = () => {
    soundEngine.playClick();
    onNavigate('spreads', { startSpreadId: 'single' });
  };

  const handleSpreads = () => {
    soundEngine.playClick();
    onNavigate('spreads');
  };

  const handleEncyclopedia = () => {
    soundEngine.playClick();
    onNavigate('encyclopedia');
  };

  const handleHistory = () => {
    soundEngine.playClick();
    onNavigate('history');
  };

  return (
    <div className="w-full space-y-5 pb-8 animate-fadeIn">
      {/* App Slogan & Atmospheric Header */}
      <div className="text-center pt-2 pb-1 space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#D4C296]/10 border border-[#D4C296]/20 text-[#D4C296] text-[11px] font-medium tracking-wider">
          <Moon className="w-3.5 h-3.5" />
          <span>问月塔罗 · 深夜治愈空间</span>
        </div>
        <h1 className="text-xl font-bold text-[#F5F7FF] tracking-wide font-serif">
          心向明月，塔罗知意
        </h1>
        <p className="text-xs text-[#F5F7FF]/50">
          深夜静心空间 · 沉浸倾听内在真实心声
        </p>
      </div>

      {/* ================= 1. Daily Fortune Moon Card ================= */}
      <div
        onClick={onOpenDailyFortune}
        className="w-full bg-gradient-to-br from-[#1A2340]/90 via-[#232F54]/80 to-[#12192E]/90 backdrop-blur-md border border-[#D4C296]/35 rounded-3xl p-5 shadow-xl hover:border-[#D4C296]/60 transition-all cursor-pointer group active:scale-99 relative overflow-hidden"
      >
        {/* Ambient Glow in card */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#7B68EE]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1 space-y-2 pr-3">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-[#D4C296]/15 text-[#D4C296]">
                <Sun className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-[#D4C296] tracking-wider">今日月运</span>
                <span className="text-[11px] text-[#F5F7FF]/50 block font-light">
                  {dailyFortune ? '已开启今日启示' : '零点刷新 · 点击抽取'}
                </span>
              </div>
            </div>

            {dailyFortune && dailyCard ? (
              <div>
                <div className="text-sm font-bold text-[#F5F7FF] flex items-center space-x-1.5">
                  <span>{dailyCard.nameCn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                    dailyFortune.isReversed ? 'bg-rose-900/60 text-rose-300' : 'bg-emerald-900/60 text-emerald-300'
                  }`}>
                    {dailyFortune.isReversed ? '逆位' : '正位'}
                  </span>
                </div>
                <p className="text-xs text-[#F5F7FF]/70 line-clamp-2 mt-1 leading-relaxed">
                  {dailyFortune.oneLiner}
                </p>
              </div>
            ) : (
              <div className="py-1">
                <p className="text-xs text-[#F5F7FF]/80 leading-relaxed">
                  静心呼吸，抽取今天专属的月运单牌与心灵指引。
                </p>
                <div className="inline-flex items-center space-x-1 text-[#D4C296] text-xs font-medium mt-1.5">
                  <span>立即抽取</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>

          {/* Mini Tarot Preview */}
          <div className="shrink-0">
            <TarotCardView
              card={dailyCard || undefined}
              isFlipped={!!dailyFortune}
              isReversed={dailyFortune?.isReversed || false}
              size="sm"
              showLabel={false}
              glow={false}
            />
          </div>
        </div>
      </div>

      {/* ================= 2. Core Four Hub Entries ================= */}
      <div className="space-y-2.5">
        <div className="text-xs font-semibold text-[#D4C296] flex items-center space-x-1.5 px-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>核心占卜入口</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Hub 1: Quick Single Draw */}
          <div
            onClick={handleQuickSingle}
            className="bg-[#1A2340]/80 hover:bg-[#1A2340] border border-[#D4C296]/20 hover:border-[#D4C296]/50 rounded-2xl p-4 transition-all cursor-pointer shadow-md active:scale-98 flex flex-col justify-between space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B68EE]/30 to-[#38BDF8]/20 flex items-center justify-center text-[#D4C296] border border-[#7B68EE]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#F5F7FF] flex items-center justify-between">
                <span>快速单抽</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D4C296]/60 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#F5F7FF]/50 mt-0.5">
                随心抽单牌 · 临时疑惑
              </p>
            </div>
          </div>

          {/* Hub 2: Classic Spreads */}
          <div
            onClick={handleSpreads}
            className="bg-[#1A2340]/80 hover:bg-[#1A2340] border border-[#D4C296]/20 hover:border-[#D4C296]/50 rounded-2xl p-4 transition-all cursor-pointer shadow-md active:scale-98 flex flex-col justify-between space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4C296]/30 to-[#F59E0B]/20 flex items-center justify-center text-[#D4C296] border border-[#D4C296]/30 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#F5F7FF] flex items-center justify-between">
                <span>经典牌阵</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D4C296]/60 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#F5F7FF]/50 mt-0.5">
                时空三牌 · 感情 · 抉择
              </p>
            </div>
          </div>

          {/* Hub 3: Card Encyclopedia */}
          <div
            onClick={handleEncyclopedia}
            className="bg-[#1A2340]/80 hover:bg-[#1A2340] border border-[#D4C296]/20 hover:border-[#D4C296]/50 rounded-2xl p-4 transition-all cursor-pointer shadow-md active:scale-98 flex flex-col justify-between space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981]/30 to-[#06B6D4]/20 flex items-center justify-center text-emerald-300 border border-[#10B981]/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#F5F7FF] flex items-center justify-between">
                <span>卡牌百科</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D4C296]/60 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#F5F7FF]/50 mt-0.5">
                完整78张韦特 · 正逆详解
              </p>
            </div>
          </div>

          {/* Hub 4: History Records */}
          <div
            onClick={handleHistory}
            className="bg-[#1A2340]/80 hover:bg-[#1A2340] border border-[#D4C296]/20 hover:border-[#D4C296]/50 rounded-2xl p-4 transition-all cursor-pointer shadow-md active:scale-98 flex flex-col justify-between space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899]/30 to-[#8B5CF6]/20 flex items-center justify-center text-purple-300 border border-[#EC4899]/30 group-hover:scale-105 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#F5F7FF] flex items-center justify-between">
                <span>占卜记录</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D4C296]/60 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#F5F7FF]/50 mt-0.5">
                完整占卜归档 · 随心复盘
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. Ambient Soundscape Bar ================= */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#D4C296] flex items-center space-x-1.5 px-1">
          <Moon className="w-3.5 h-3.5" />
          <span>占卜前静心白噪音</span>
        </div>
        <SoundBar settings={settings} onUpdateSettings={onUpdateSettings} />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Moon,
  Info,
  Trash2,
  CheckCircle,
  HelpCircle,
  Smartphone,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Shield
} from 'lucide-react';
import { AppSettings } from '../types';
import { clearAllFavorites, clearAllHistory, getFavoriteCardIds, getHistoryRecords } from '../utils/storage';
import { soundEngine } from '../utils/audio';
import { PrivacyModal } from '../components/PrivacyModal';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onNavigateToFavCards: () => void;
  onNavigateToHistory: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onNavigateToFavCards,
  onNavigateToHistory,
}) => {
  const [favCount, setFavCount] = useState(getFavoriteCardIds().length);
  const [historyCount, setHistoryCount] = useState(getHistoryRecords().length);
  const [toastMsg, setToastMsg] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleToggleSoundEnabled = () => {
    soundEngine.playClick();
    const next = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: next });
    if (!next) {
      soundEngine.stopAmbient();
      onUpdateSettings({ isSoundPlaying: false });
    }
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setSfxVolume(val);
    onUpdateSettings({ sfxVolume: val });
  };

  const handleClearHistory = () => {
    soundEngine.playClick();
    if (window.confirm('确定要清空所有占卜历史吗？')) {
      clearAllHistory();
      setHistoryCount(0);
      showToast('历史记录已清空');
    }
  };

  const handleClearFavorites = () => {
    soundEngine.playClick();
    if (window.confirm('确定要清空所有收藏卡牌吗？')) {
      clearAllFavorites();
      setFavCount(0);
      showToast('卡牌收藏已重置');
    }
  };

  return (
    <div className="w-full space-y-4 pb-8 animate-fadeIn text-left">
      {/* Header */}
      <div className="text-center pt-2 space-y-1">
        <h2 className="text-lg font-bold text-[#F5F7FF] font-serif">
          个人中心与设置
        </h2>
        <p className="text-xs text-[#F5F7FF]/50">
          系统设置 · 贴心交互与沉浸音效管理
        </p>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs text-center flex items-center justify-center space-x-1.5 animate-fadeIn">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= 1. My Collections ================= */}
      <div className="bg-[#1A2340]/90 border border-[#D4C296]/20 rounded-3xl p-4 shadow-lg space-y-3">
        <div className="text-xs font-bold text-[#D4C296] flex items-center space-x-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>我的收藏与资产</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={onNavigateToFavCards}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all active:scale-98 flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#F5F7FF]">已收藏卡牌</div>
              <span className="text-[11px] text-[#D4C296]">{favCount} 张</span>
            </div>
            <Heart className="w-4 h-4 text-rose-400/70" />
          </div>

          <div
            onClick={onNavigateToHistory}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all active:scale-98 flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#F5F7FF]">历史占卜记录</div>
              <span className="text-[11px] text-[#D4C296]">{historyCount} 条</span>
            </div>
            <Sparkles className="w-4 h-4 text-[#7B68EE]/70" />
          </div>
        </div>
      </div>

      {/* ================= 2. Audio & Sound FX ================= */}
      <div className="bg-[#1A2340]/90 border border-[#D4C296]/20 rounded-3xl p-4 shadow-lg space-y-3">
        <div className="text-xs font-bold text-[#D4C296] flex items-center space-x-1.5">
          <Volume2 className="w-3.5 h-3.5" />
          <span>音效与静心冥想设置</span>
        </div>

        {/* SFX Switch */}
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-xs font-medium text-[#F5F7FF]">抽牌空灵音效</div>
            <span className="text-[10px] text-[#F5F7FF]/50">卡牌翻转时的拟真纸张与水晶泛音</span>
          </div>
          <button
            onClick={handleToggleSoundEnabled}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.soundEnabled ? 'bg-[#D4C296]' : 'bg-white/20'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#1A2340] transition-transform ${
                settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* SFX Volume */}
        {settings.soundEnabled && (
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#F5F7FF]/70">
              <span>音效音量</span>
              <span className="font-mono text-[#D4C296]">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={handleSfxVolumeChange}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4C296]"
            />
          </div>
        )}
      </div>

      {/* ================= 3. Privacy Policy Entry Button (Above Performance Mode) ================= */}
      <div 
        onClick={() => {
          soundEngine.playClick();
          setShowPrivacyModal(true);
        }}
        className="bg-[#1A2340]/90 hover:bg-[#1A2340] border border-[#D4C296]/20 rounded-3xl p-4 shadow-lg flex items-center justify-between cursor-pointer transition-all active:scale-98"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-[#7B68EE]/20 border border-[#7B68EE]/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#D4C296]" />
          </div>
          <div className="text-xs font-bold text-[#F5F7FF] flex items-center space-x-1.5">
            <span>用户隐私保护政策</span>
          </div>
        </div>

        <button
          type="button"
          className="px-3 py-1.5 rounded-xl bg-[#D4C296]/15 hover:bg-[#D4C296]/25 border border-[#D4C296]/40 text-xs font-semibold text-[#D4C296] transition-all flex items-center space-x-1 shrink-0 ml-2 pointer-events-none"
        >
          <span>查看政策</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ================= 4. Animation & Performance ================= */}
      <div className="bg-[#1A2340]/90 border border-[#D4C296]/20 rounded-3xl p-4 shadow-lg space-y-3">
        <div className="text-xs font-bold text-[#D4C296] flex items-center space-x-1.5">
          <Smartphone className="w-3.5 h-3.5" />
          <span>动效与性能模式</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateSettings({ animationSpeed: 'smooth' })}
            className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
              settings.animationSpeed === 'smooth'
                ? 'bg-[#D4C296] text-[#1A2340] font-bold border-[#D4C296]'
                : 'bg-white/5 text-[#F5F7FF]/70 border-white/10'
            }`}
          >
            丝滑极致 (60FPS)
          </button>
          <button
            onClick={() => onUpdateSettings({ animationSpeed: 'reduced' })}
            className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
              settings.animationSpeed === 'reduced'
                ? 'bg-[#D4C296] text-[#1A2340] font-bold border-[#D4C296]'
                : 'bg-white/5 text-[#F5F7FF]/70 border-white/10'
            }`}
          >
            低功耗省电
          </button>
        </div>
      </div>

      {/* ================= 5. Daily Fortune Rules ================= */}
      <div className="bg-[#1A2340]/90 border border-[#D4C296]/20 rounded-3xl p-4 shadow-lg space-y-2">
        <div className="text-xs font-bold text-[#D4C296] flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>每日运势刷新规则</span>
        </div>
        <p className="text-[11px] text-[#F5F7FF]/70 leading-relaxed">
          「今日月运」遵循塔罗传统的虔诚守则，每日限抽一张单牌作为当天的能量聚焦。每天零点（00:00）系统会自动重置抽牌池，不可重复刷新。
        </p>
      </div>

      {/* ================= 6. Local Storage Data Management ================= */}
      <div className="bg-[#1A2340]/90 border border-[#D4C296]/20 rounded-3xl p-4 shadow-lg space-y-3">
        <div className="text-xs font-bold text-[#D4C296] flex items-center space-x-1.5">
          <Trash2 className="w-3.5 h-3.5" />
          <span>本地数据管理</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearHistory}
            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-xs text-[#F5F7FF]/70 hover:text-rose-300 border border-white/10 transition-all"
          >
            清空历史记录
          </button>
          <button
            onClick={handleClearFavorites}
            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-xs text-[#F5F7FF]/70 hover:text-rose-300 border border-white/10 transition-all"
          >
            清空卡牌收藏
          </button>
        </div>
      </div>

      {/* App Version Info Footer */}
      <div className="text-center py-2">
        <div className="text-[10px] text-[#F5F7FF]/30">
          问月塔罗 v1.0 (com.wenyuetaluo.app)
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
};

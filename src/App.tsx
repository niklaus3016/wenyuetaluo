import React, { useState, useEffect } from 'react';
import {
  Moon,
  Compass,
  BookOpen,
  History,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  Heart,
  ShieldAlert,
  AlertOctagon
} from 'lucide-react';
import { ActiveTab, AppSettings, DailyFortuneState, DivinationRecord, DrawnCard, SpreadConfig } from './types';
import { TAROT_SPREADS } from './data/spreads';
import { getCardById } from './data/tarotDeck';
import { getAppSettings, getDailyFortune, saveAppSettings } from './utils/storage';
import { soundEngine } from './utils/audio';

import { StarfieldBackground } from './components/StarfieldBackground';
import { DailyFortuneModal } from './components/DailyFortuneModal';
import { ConsentModal } from './components/ConsentModal';

import { HomePage } from './views/HomePage';
import { SpreadSelectorPage } from './views/SpreadSelectorPage';
import { DrawCardsPage } from './views/DrawCardsPage';
import { ReadingResultPage } from './views/ReadingResultPage';
import { EncyclopediaPage } from './views/EncyclopediaPage';
import { HistoryPage } from './views/HistoryPage';
import { SettingsPage } from './views/SettingsPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [dailyFortune, setDailyFortune] = useState<DailyFortuneState | null>(getDailyFortune());
  const [isDailyFortuneModalOpen, setIsDailyFortuneModalOpen] = useState(false);

  // Consent / Privacy Agreement states
  const [showConsentModal, setShowConsentModal] = useState<boolean>(() => {
    const saved = getAppSettings();
    return !saved.privacyAgreed;
  });
  // true: 用户显式拒绝过协议 -> 展示受限页面，而非反复弹
  const [consentDeclined, setConsentDeclined] = useState<boolean>(false);

  // Consent Accept Handler
  const handleConsentAccept = () => {
    const updated = { ...settings, privacyAgreed: true };
    setSettings(updated);
    saveAppSettings(updated);
    setShowConsentModal(false);
    setConsentDeclined(false);
  };

  // Consent Decline Handler
  const handleConsentDecline = () => {
    setShowConsentModal(false);
    setConsentDeclined(true);
  };

  // Re-open consent modal from declined page
  const handleReopenConsent = () => {
    soundEngine.playClick();
    setConsentDeclined(false);
    setShowConsentModal(true);
  };

  // Active divination flow states
  const [currentSpread, setCurrentSpread] = useState<SpreadConfig>(TAROT_SPREADS[0]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentDrawnCards, setCurrentDrawnCards] = useState<DrawnCard[]>([]);

  // Update Settings handler
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveAppSettings(updated);
  };

  // Switch sound toggle from top header
  const handleToggleTopSound = () => {
    if (settings.isSoundPlaying) {
      soundEngine.stopAmbient();
      handleUpdateSettings({ isSoundPlaying: false });
    } else {
      soundEngine.startAmbient(settings.currentSound);
      handleUpdateSettings({ isSoundPlaying: true });
    }
  };

  // Navigation router handler
  const handleNavigate = (tab: ActiveTab, params?: any) => {
    soundEngine.playClick();
    if (params?.startSpreadId) {
      const sp = TAROT_SPREADS.find(s => s.id === params.startSpreadId) || TAROT_SPREADS[0];
      setCurrentSpread(sp);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start Drawing Flow
  const handleStartSpread = (spread: SpreadConfig, question: string) => {
    soundEngine.playClick();
    setCurrentSpread(spread);
    setCurrentQuestion(question);
    setCurrentDrawnCards([]);
    setCurrentTab('draw');
  };

  // Complete Drawing Flow
  const handleFinishDraw = (drawn: DrawnCard[]) => {
    setCurrentDrawnCards(drawn);
    setCurrentTab('result');
  };

  // Reopen past record from History
  const handleReopenRecord = (record: DivinationRecord) => {
    const sp = TAROT_SPREADS.find(s => s.id === record.spreadId) || TAROT_SPREADS[0];
    const fullDrawn: DrawnCard[] = record.drawnCards.map((dc, idx) => {
      const card = getCardById(dc.cardId) || getCardById(0)!;
      return {
        card,
        isReversed: dc.isReversed,
        positionIndex: idx,
        positionName: dc.positionName,
        positionMeaning: dc.positionMeaning,
      };
    });

    setCurrentSpread(sp);
    setCurrentQuestion(record.question);
    setCurrentDrawnCards(fullDrawn);
    setCurrentTab('result');
  };

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#F5F7FF] flex flex-col items-center relative overflow-x-hidden font-sans select-none">
      {/* 1. Dynamic Low-Power Starfield Canvas */}
      <StarfieldBackground reducedMotion={settings.animationSpeed === 'reduced'} />

      {/* 2. Soft Ambient Moon Nebula Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-[#7B68EE]/12 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-[#D4C296]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ============================================================
         DECLINED PAGE（拒绝后受限页）：替代主界面，无法使用任何功能
         ============================================================ */}
      {consentDeclined && (
        <div className="w-full max-w-md min-h-screen flex flex-col items-center justify-center relative z-20 px-6">
          <div className="w-full flex flex-col items-center text-center animate-[fadeIn_.35s_ease-out]">
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full bg-red-500/15 blur-2xl scale-150" />
              <div className="relative w-24 h-24 rounded-full bg-[#161F38] border-2 border-red-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(248,113,113,0.2)]">
                <ShieldAlert className="w-12 h-12 text-red-300" strokeWidth={1.4} />
              </div>
            </div>

            <h2
              className="text-2xl font-bold text-[#F5F7FF] mb-3"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              暂时无法进入问月塔罗空间
            </h2>
            <p className="text-[11px] text-[#8D9BC8] tracking-[0.18em] font-mono mb-6">
              CONSENT REQUIRED · 需要您的协议同意
            </p>

            <div className="w-full p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-[#161F38]/70 to-transparent border border-red-400/20 space-y-3 text-left mb-8">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-red-300 shrink-0 mt-0.5" strokeWidth={1.8} />
                <p className="text-[13px] text-[#C9D4FF] leading-relaxed">
                  由于您选择了<strong className="text-red-300 font-semibold">拒绝</strong>《用户服务协议》与《隐私政策》，
                  根据《个人信息保护法》及相关法规的要求，本应用无法为您提供占卜、记录、收藏等任何服务功能。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#D4C296] shrink-0 mt-0.5" strokeWidth={1.8} />
                <p className="text-[13px] text-[#C9D4FF] leading-relaxed">
                  问月塔罗始终恪守
                  <strong className="text-[#D4C296] font-semibold">数据不出设备、零权限索取、零第三方 SDK</strong>
                  的极致隐私理念。所有协议内容均可自由查阅，如您仍有顾虑，欢迎随时通过邮箱与我们联系。
                </p>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleReopenConsent}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-[#D4C296] to-[#B2996B] text-[#0E1526] font-bold text-[15px] shadow-lg shadow-[#D4C296]/15 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-5 h-5" strokeWidth={2.1} />
                重新阅读并同意协议
              </button>
              <p className="text-[11px] text-[#6B76A0] text-center pt-1">
                运营主体：深圳丰佰瑞网络科技有限公司 · 联系邮箱：Jp182025@163.com
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
         MAIN APP SHELL（主界面）：仅在用户未显式拒绝时可用
         未同意时 ConsentModal 会覆盖在最上层拦截操作
         ============================================================ */}
      {!consentDeclined && (
        <>
          {/* ================= Container (Android Phone Simulation Shell) ================= */}
      <div className="w-full max-w-md min-h-screen flex flex-col justify-between relative z-10 px-4 sm:px-5">
        {/* ================= Top App Header (Sticky Mobile Header) ================= */}
        <header className="sticky top-0 z-30 w-full pt-3 pb-3 flex items-center justify-between border-b border-white/5 bg-[#0E1526]/90 backdrop-blur-md">
          {/* Brand Logo & Name */}
          <div
            onClick={() => handleNavigate('home')}
            className="flex items-center space-x-2.5 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4C296]/30 to-[#7B68EE]/30 border border-[#D4C296]/50 flex items-center justify-center shadow-md overflow-hidden shrink-0">
              <img
                src="/icon.png"
                alt="问月塔罗"
                className="w-full h-full object-cover"
                loading="eager"
                draggable={false}
              />
            </div>
            <div>
              <span className="text-sm font-bold tracking-widest text-[#F5F7FF] font-serif block leading-none">
                问月塔罗
              </span>
              <span className="text-[9px] text-[#D4C296]/70 block tracking-wider mt-0.5 leading-none">
                MOON TAROT
              </span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center space-x-2">
            {/* Quick Ambient Sound Indicator Button */}
            <button
              onClick={handleToggleTopSound}
              className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-1.5 transition-all border active:scale-95 ${
                settings.isSoundPlaying
                  ? 'bg-[#7B68EE]/25 text-[#D4C296] border-[#D4C296]/40 animate-pulse'
                  : 'bg-white/5 text-[#F5F7FF]/60 border-white/10 hover:bg-white/10'
              }`}
              title="白噪音环境音开关"
            >
              {settings.isSoundPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-medium">{settings.isSoundPlaying ? '静心中' : '静心音'}</span>
            </button>
          </div>
        </header>

        {/* ================= Main View Router Outlet ================= */}
        <main className="flex-1 py-3 w-full pb-28">
          {currentTab === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenDailyFortune={() => setIsDailyFortuneModalOpen(true)}
              dailyFortune={dailyFortune}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {currentTab === 'spreads' && (
            <SpreadSelectorPage
              onStartSpread={handleStartSpread}
            />
          )}

          {currentTab === 'draw' && (
            <DrawCardsPage
              spread={currentSpread}
              question={currentQuestion}
              onFinishDraw={handleFinishDraw}
              onBack={() => handleNavigate('spreads')}
            />
          )}

          {currentTab === 'result' && (
            <ReadingResultPage
              spread={currentSpread}
              question={currentQuestion}
              drawnCards={currentDrawnCards}
              onRedo={() => handleNavigate('draw')}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentTab === 'encyclopedia' && (
            <EncyclopediaPage />
          )}

          {currentTab === 'history' && (
            <HistoryPage
              onReopenRecord={handleReopenRecord}
              onStartNewReading={() => handleNavigate('spreads')}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onNavigateToFavCards={() => handleNavigate('encyclopedia')}
              onNavigateToHistory={() => handleNavigate('history')}
            />
          )}
        </main>

        {/* ================= Bottom Mobile Navigation Bar (Fixed Floating Dock) ================= */}
        {currentTab !== 'draw' && (
          <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[#1A2340]/95 backdrop-blur-xl border border-[#D4C296]/30 rounded-3xl p-1.5 shadow-2xl flex items-center justify-around z-40 mb-safe">
            {/* Nav 1: Home */}
            <button
              onClick={() => handleNavigate('home')}
              className={`flex-1 py-2 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                currentTab === 'home'
                  ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow-md'
                  : 'text-[#F5F7FF]/60 hover:text-[#F5F7FF]'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">首页</span>
            </button>

            {/* Nav 2: Spreads */}
            <button
              onClick={() => handleNavigate('spreads')}
              className={`flex-1 py-2 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                currentTab === 'spreads' || currentTab === 'result'
                  ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow-md'
                  : 'text-[#F5F7FF]/60 hover:text-[#F5F7FF]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">牌阵</span>
            </button>

            {/* Nav 3: Encyclopedia */}
            <button
              onClick={() => handleNavigate('encyclopedia')}
              className={`flex-1 py-2 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                currentTab === 'encyclopedia'
                  ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow-md'
                  : 'text-[#F5F7FF]/60 hover:text-[#F5F7FF]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">百科</span>
            </button>

            {/* Nav 4: History */}
            <button
              onClick={() => handleNavigate('history')}
              className={`flex-1 py-2 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                currentTab === 'history'
                  ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow-md'
                  : 'text-[#F5F7FF]/60 hover:text-[#F5F7FF]'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">记录</span>
            </button>

            {/* Nav 5: Settings / Me */}
            <button
              onClick={() => handleNavigate('settings')}
              className={`flex-1 py-2 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                currentTab === 'settings'
                  ? 'bg-[#D4C296] text-[#1A2340] font-bold shadow-md'
                  : 'text-[#F5F7FF]/60 hover:text-[#F5F7FF]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">我的</span>
            </button>
          </nav>
        )}
      </div>

      {/* ================= Daily Fortune Modal ================= */}
      <DailyFortuneModal
        isOpen={isDailyFortuneModalOpen}
        onClose={() => {
          setIsDailyFortuneModalOpen(false);
          setDailyFortune(getDailyFortune());
        }}
      />

      {/* ================= Consent Modal (隐私与协议同意弹窗) ================= */}
      <ConsentModal
        isOpen={showConsentModal}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />
        </>
      )}
    </div>
  );
}

export default App;

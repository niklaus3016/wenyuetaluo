import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Moon, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import {
  AgreementDetailModal,
  AgreementDetailType,
} from './AgreementDetailModal';

type DetailType = 'agreement' | 'privacy' | null;

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onAccept, onDecline }) => {
  const [detailType, setDetailType] = useState<DetailType>(null);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  if (!isOpen) return null;

  const playClick = () => soundEngine.playClick();

  const openAgreement = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setDetailType('agreement');
  };

  const openPrivacy = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setDetailType('privacy');
  };

  const closeDetail = () => {
    playClick();
    setDetailType(null);
  };

  const handleAcceptClick = () => {
    playClick();
    onAccept();
  };

  const handleDeclineClick = () => {
    playClick();
    setShowDeclineConfirm(true);
  };

  const handleDeclineCancel = () => {
    playClick();
    setShowDeclineConfirm(false);
  };

  const handleDeclineConfirm = () => {
    playClick();
    onDecline();
  };

  return (
    <>
      {/* ========== 主同意弹窗 Layer ========== */}
      <div
        className={`fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn ${
          detailType || showDeclineConfirm ? 'pointer-events-none opacity-30' : ''
        } transition-opacity duration-300`}
      >
        <div className="relative z-10 w-full max-w-sm bg-[#161F38]/98 backdrop-blur-md border border-[#D4C296]/30 rounded-[28px] shadow-[0_0_60px_rgba(123,104,238,0.25)] overflow-hidden animate-[scaleIn_.28s_ease-out]">
          {/* Decorative Header Glow */}
          <div className="relative pt-7 pb-4 px-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#7B68EE]/12 to-transparent pointer-events-none" />
            <div className="relative mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#D4C296]/20 via-[#7B68EE]/15 to-transparent border border-[#D4C296]/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,194,150,0.18)]">
              <div className="relative">
                <Moon className="w-8 h-8 text-[#D4C296]" strokeWidth={1.4} />
                <Sparkles className="w-3 h-3 text-[#9B88F7] absolute -top-1 -right-1" strokeWidth={2.2} />
              </div>
            </div>
            <h3
              className="text-xl font-bold text-[#F5F7FF] mb-1"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              用户协议与隐私政策
            </h3>
            <p className="text-[10px] text-[#8D9BC8] tracking-[0.2em] font-mono">
              MOON TAROT · CONSENT NOTICE
            </p>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 space-y-4">
            {/* 核心承诺条 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D4C296]/10 via-[#7B68EE]/8 to-transparent border border-[#D4C296]/20 space-y-2">
              <p className="text-[13px] text-[#C9D4FF] leading-relaxed">
                <span className="text-[#D4C296] font-semibold">（1）</span>
                《<span className="text-[#F5F7FF] font-medium">隐私政策</span>》中关于
                <strong className="text-[#F5F7FF]">占卜记录、卡牌收藏、个性化设置</strong>
                等信息的本地存储与使用说明。
              </p>
              <p className="text-[13px] text-[#C9D4FF] leading-relaxed">
                <span className="text-[#D4C296] font-semibold">（2）</span>
                《<span className="text-[#F5F7FF] font-medium">隐私政策</span>》中关于
                <strong className="text-[#F5F7FF]">零第三方 SDK、零设备标识采集、零云端上传</strong>
                的极致隐私保护承诺。
              </p>
            </div>

            {/* 协议阅读提示 */}
            <div className="space-y-1.5">
              <p className="text-[12px] text-[#8D9BC8]">用户协议和隐私政策说明：</p>
              <p className="text-[13px] text-[#B9C6F0] leading-relaxed">
                请您务必仔细阅读完整的
                <span
                  onClick={openAgreement}
                  className="mx-1 inline-block text-[#9B88F7] hover:text-[#B5A3FF] underline underline-offset-2 cursor-pointer font-semibold transition-colors"
                >
                  《用户服务协议》
                </span>
                和
                <span
                  onClick={openPrivacy}
                  className="mx-1 inline-block text-[#9B88F7] hover:text-[#B5A3FF] underline underline-offset-2 cursor-pointer font-semibold transition-colors"
                >
                  《隐私政策》
                </span>
                ，了解详细内容与您的全部权利。
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex border-t border-white/10 divide-x divide-white/10">
            <button
              onClick={handleDeclineClick}
              className="flex-1 py-4 text-[15px] font-medium text-[#8D9BC8] hover:text-[#C9D4FF] hover:bg-white/5 transition-all"
            >
              不同意
            </button>
            <button
              onClick={handleAcceptClick}
              className="flex-1 py-4 text-[15px] font-bold text-[#0E1526] bg-gradient-to-r from-[#D4C296] to-[#B2996B] hover:brightness-110 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" strokeWidth={2.3} />
                同意并继续
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#E7D6A9] via-[#D4C296] to-[#E7D6A9] bg-[length:200%_100%] group-hover:animate-[shimmer_1.5s_ease-in-out] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      {/* ========== 协议详情子弹窗（可覆盖在主弹窗之上） ========== */}
      {detailType && (
        <AgreementDetailModal
          isOpen
          type={detailType as AgreementDetailType}
          onClose={closeDetail}
          zIndex={130}
        />
      )}

      {/* ========== 拒绝二次确认弹窗 ========== */}
      {showDeclineConfirm && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="absolute inset-0" onClick={handleDeclineCancel} />
          <div
            className="relative z-10 w-full max-w-sm bg-[#161F38]/98 backdrop-blur-md border border-[#D4C296]/20 rounded-[28px] shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden animate-[scaleIn_.22s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-red-500/15 border border-red-400/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-300" strokeWidth={2} />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold text-[#F5F7FF] mb-1.5"
                    style={{ fontFamily: "'Noto Serif SC', serif" }}
                  >
                    确认拒绝
                  </h2>
                  <p className="text-[13px] text-[#B9C6F0] leading-relaxed">
                    您确定要拒绝《用户服务协议》与《隐私政策》吗？
                    <br />
                    <strong className="text-red-300">拒绝后将无法进入问月塔罗空间。</strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-t border-white/10 divide-x divide-white/10">
              <button
                onClick={handleDeclineCancel}
                className="flex-1 py-4 text-center text-[14px] text-[#8D9BC8] hover:text-[#C9D4FF] hover:bg-white/5 font-medium transition-all"
              >
                取消，再想想
              </button>
              <button
                onClick={handleDeclineConfirm}
                className="flex-1 py-4 text-center text-[14px] text-red-300 hover:text-red-200 hover:bg-red-500/10 font-semibold transition-all"
              >
                确定拒绝
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

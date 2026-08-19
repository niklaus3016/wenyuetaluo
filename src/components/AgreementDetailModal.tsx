import React from 'react';
import { X, ShieldCheck, FileCheck2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { PrivacyPolicyContent } from './PrivacyPolicyContent';
import { UserAgreementContent } from './UserAgreementContent';

export type AgreementDetailType = 'privacy' | 'agreement';

interface AgreementDetailModalProps {
  isOpen: boolean;
  type: AgreementDetailType;
  onClose: () => void;
  /** 可选：覆盖 z-index 层级，默认 130。子弹窗嵌在主同意弹窗之上时使用更高值 */
  zIndex?: number;
}

export const AgreementDetailModal: React.FC<AgreementDetailModalProps> = ({
  isOpen,
  type,
  onClose,
  zIndex = 130,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    soundEngine.playClick();
    onClose();
  };

  const isPrivacy = type === 'privacy';

  const title = isPrivacy ? '隐私政策' : '用户服务协议';
  const subtitleEn = isPrivacy
    ? 'PRIVACY POLICY · 数据零上传承诺'
    : 'USER AGREEMENT · 服务条款说明';
  const IconComp = isPrivacy ? ShieldCheck : FileCheck2;
  const iconBg = isPrivacy
    ? 'bg-[#D4C296]/12 border-[#D4C296]/30'
    : 'bg-[#7B68EE]/15 border-[#7B68EE]/35';
  const iconColor = isPrivacy ? 'text-[#D4C296]' : 'text-[#9B88F7]';

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn`}
      style={{ zIndex }}
    >
      <div className="absolute inset-0" onClick={handleClose} />
      <div
        className="relative z-10 w-full max-w-2xl h-[85vh] bg-[#161F38]/98 backdrop-blur-md border border-[#D4C296]/30 rounded-[28px] shadow-[0_0_60px_rgba(123,104,238,0.25)] flex flex-col overflow-hidden animate-[scaleIn_.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-gradient-to-b from-[#1A2247] to-[#161F38]">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner border ${iconBg}`}
            >
              <IconComp className={`w-5 h-5 ${iconColor}`} strokeWidth={1.8} />
            </div>
            <div>
              <h3
                className="text-[17px] font-bold text-[#F5F7FF]"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                {title}
              </h3>
              <p className="text-[10px] text-[#8D9BC8] tracking-[0.15em] mt-0.5 font-mono">
                {subtitleEn}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-[#8D9BC8] hover:text-[#F5F7FF] flex items-center justify-center transition-all active:scale-90 border border-white/5"
            aria-label="关闭"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 pr-5 scrollbar-none bg-[#0E1526]/40">
          {type === 'privacy' ? <PrivacyPolicyContent /> : <UserAgreementContent />}
        </div>
      </div>
    </div>
  );
};

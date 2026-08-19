import React, { useState } from 'react';
import { X, Sparkles, HelpCircle } from 'lucide-react';
import { SpreadConfig } from '../types';

interface QuestionModalProps {
  spread: SpreadConfig;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (question: string) => void;
}

const SAMPLE_QUESTIONS: Record<string, string[]> = {
  single: ['今天我的整体运势与提醒是什么？', '当前这件事我该如何抉择？', '此刻宇宙想传递给我的启示？'],
  three_time: ['近期事业发展的过去、现状与未来趋势？', '当前项目的阶段性走向如何？', '这段经历带给我的核心成长？'],
  love_triangle: ['我和TA未来的感情走向如何？', '对方当下对我的真实态度是什么？', '近期我该如何改善双方的相处模式？'],
  career_growth: ['接下来的工作晋升/跳槽发展如何？', '我在职场中最大的潜在优势是什么？', '如何突破当下的学业/工作瓶颈？'],
  decision_choice: ['留在当前岗位 VS 跳槽新机会，哪条路更顺？', '方案A与方案B各自的发展与结局如何？', '在两难抉择中我该如何权衡？'],
  overall_energy: ['我近期整体的能量状态与运势指引？', '近阶段有什么潜藏的机遇与转机？', '近期需要规避的隐患与内耗点？'],
};

export const QuestionModal: React.FC<QuestionModalProps> = ({
  spread,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [question, setQuestion] = useState('');

  if (!isOpen) return null;

  const samples = SAMPLE_QUESTIONS[spread.id] || SAMPLE_QUESTIONS.single;

  const handleStart = () => {
    onConfirm(question.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#1A2340] border border-[#D4C296]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col space-y-4">
        {/* Background glow circle */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#7B68EE]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#D4C296]/15 text-[#D4C296]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-[#F5F7FF] text-lg font-bold">准备占卜 · 静心冥想</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#F5F7FF]/50 hover:text-[#F5F7FF] hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spread Info Pill */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[#D4C296] text-xs font-semibold">{spread.name}</div>
            <div className="text-[#F5F7FF]/60 text-xs mt-0.5">{spread.description}</div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs bg-[#7B68EE]/25 text-[#D4C296] border border-[#7B68EE]/30 shrink-0">
            {spread.cardCount} 张牌
          </span>
        </div>

        {/* Question Input */}
        <div>
          <label className="block text-[#F5F7FF]/80 text-xs font-medium mb-1.5">
            心中所念问题（可填或留空随心占卜）
          </label>
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：想了解近期工作状态与建议..."
              rows={3}
              maxLength={80}
              className="w-full bg-[#0F172A]/80 border border-[#D4C296]/25 rounded-xl p-3 text-sm text-[#F5F7FF] placeholder-[#F5F7FF]/30 focus:outline-none focus:border-[#D4C296] resize-none"
            />
            <span className="absolute bottom-2 right-2 text-[10px] text-[#F5F7FF]/40">
              {question.length}/80
            </span>
          </div>
        </div>

        {/* Quick Sample Questions */}
        <div>
          <div className="flex items-center space-x-1 text-[#D4C296] text-xs font-medium mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>灵感示例（点击填入）</span>
          </div>
          <div className="space-y-1.5">
            {samples.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(sample)}
                className="w-full text-left text-xs text-[#F5F7FF]/70 hover:text-[#F5F7FF] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D4C296]/30 rounded-lg px-2.5 py-1.5 transition-all truncate"
              >
                ✦ {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center space-x-3">
          <button
            onClick={() => onConfirm('')}
            className="flex-1 py-3 rounded-xl border border-[#D4C296]/30 text-[#D4C296] text-sm font-medium hover:bg-[#D4C296]/10 active:scale-98 transition-all"
          >
            随心直觉抽牌
          </button>
          <button
            onClick={handleStart}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4C296] to-[#E8D8B0] text-[#1A2340] text-sm font-bold shadow-lg shadow-[#D4C296]/20 hover:brightness-105 active:scale-98 transition-all"
          >
            开启沉浸抽牌
          </button>
        </div>
      </div>
    </div>
  );
};

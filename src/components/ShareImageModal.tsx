import React from 'react';
import { X, Download, Share2, Sparkles, Check } from 'lucide-react';
import { downloadImage } from '../utils/imageExporter';

interface ShareImageModalProps {
  imageDataUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareImageModal: React.FC<ShareImageModalProps> = ({
  imageDataUrl,
  isOpen,
  onClose,
}) => {
  const [downloaded, setDownloaded] = React.useState(false);

  if (!isOpen || !imageDataUrl) return null;

  const handleDownload = () => {
    downloadImage(imageDataUrl, `问月塔罗占卜_${Date.now()}.png`);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md max-h-[92vh] bg-[#1A2340] border border-[#D4C296]/35 rounded-3xl p-5 shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2 text-[#D4C296]">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-sm">占卜结果卡片生成</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#F5F7FF]/50 hover:text-[#F5F7FF] hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview Container */}
        <div className="w-full my-3 flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-2 flex items-center justify-center">
          <img
            src={imageDataUrl}
            alt="问月塔罗占卜结果"
            className="w-full h-auto rounded-xl shadow-lg object-contain max-h-[60vh]"
          />
        </div>

        {/* Bottom Actions */}
        <div className="w-full pt-2 flex items-center space-x-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4C296] to-[#E8D8B0] text-[#1A2340] text-sm font-bold shadow-lg shadow-[#D4C296]/20 flex items-center justify-center space-x-2 hover:brightness-105 active:scale-98 transition-all"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span>已保存到相册</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>一键保存高清无水印图片</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Flame,
  Droplet,
  Crown,
  Heart,
  Shield,
  Award,
  Zap,
  Scale,
  Compass,
  Package,
  CheckCircle,
  Clock,
  Key,
  Lock,
  Sunrise,
  Search,
  Eye,
  Hammer,
  Sprout,
  Users,
  Feather,
  Globe,
  Anchor,
  BookOpen,
  CloudRain,
  Image as ImageIcon
} from 'lucide-react';
import { TarotCard } from '../types';
import { getCardPrimaryImageUrl, getCardFallbackImageUrls } from '../utils/cardImages';

interface TarotCardViewProps {
  card?: TarotCard;
  isFlipped?: boolean; // true = show front, false = show back
  isReversed?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  onClick?: () => void;
  className?: string;
  glow?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Moon,
  Sun,
  Flame,
  Droplet,
  Crown,
  Heart,
  Shield,
  Award,
  Zap,
  Scale,
  Compass,
  Package,
  CheckCircle,
  Clock,
  Key,
  Lock,
  Sunrise,
  Search,
  Eye,
  Hammer,
  Sprout,
  Users,
  Feather,
  Globe,
  Anchor,
  BookOpen,
  CloudRain
};

const SIZE_STYLES = {
  xs: { width: 'w-16', height: 'h-24', text: 'text-[10px]', iconSize: 14, badge: 'text-[8px] px-1 py-0.5' },
  sm: { width: 'w-24', height: 'h-36', text: 'text-xs', iconSize: 20, badge: 'text-[9px] px-1.5 py-0.5' },
  md: { width: 'w-32', height: 'h-48', text: 'text-sm', iconSize: 28, badge: 'text-[10px] px-2 py-0.5' },
  lg: { width: 'w-44', height: 'h-64', text: 'text-base', iconSize: 36, badge: 'text-xs px-2.5 py-1' },
  xl: { width: 'w-56', height: 'h-80', text: 'text-lg', iconSize: 48, badge: 'text-sm px-3 py-1' },
};

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  isFlipped = false,
  isReversed = false,
  size = 'md',
  showLabel = true,
  onClick,
  className = '',
  glow = true,
}) => {
  const sizeConfig = SIZE_STYLES[size];
  const [imgErrorIndex, setImgErrorIndex] = useState<number>(0);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  // Helper for Roman numerals for Major Arcana
  const getRomanNumber = (num: number) => {
    const romans = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
    return romans[num] || String(num);
  };

  const IconComponent = (card && ICON_MAP[card.symbol]) || Sparkles;

  const fallbackUrls = card ? getCardFallbackImageUrls(card) : [];
  const currentImgSrc = card
    ? (imgErrorIndex < fallbackUrls.length ? fallbackUrls[imgErrorIndex] : getCardPrimaryImageUrl(card))
    : '';

  const handleImageError = () => {
    if (imgErrorIndex < fallbackUrls.length - 1) {
      setImgErrorIndex(prev => prev + 1);
    } else {
      setImgLoaded(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-block cursor-pointer select-none transition-transform duration-300 active:scale-98 ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative ${sizeConfig.width} ${sizeConfig.height} rounded-xl transition-all duration-700 shadow-xl overflow-hidden`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          boxShadow: glow
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 194, 150, 0.2)'
            : '0 4px 12px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* ================= CARD BACK ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-[#1A2340] via-[#121B33] to-[#0A0E1A] p-2 flex flex-col items-center justify-between border border-[#D4C296]/30"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Inner golden geometric frame */}
          <div className="w-full h-full rounded-lg border border-[#D4C296]/20 p-1.5 flex flex-col items-center justify-between relative overflow-hidden">
            {/* Corner celestial dots */}
            <div className="absolute top-1 left-1 text-[#D4C296]/40 text-[9px]">✦</div>
            <div className="absolute top-1 right-1 text-[#D4C296]/40 text-[9px]">✦</div>
            <div className="absolute bottom-1 left-1 text-[#D4C296]/40 text-[9px]">✦</div>
            <div className="absolute bottom-1 right-1 text-[#D4C296]/40 text-[9px]">✦</div>

            {/* Top motif */}
            <div className="flex items-center space-x-1 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4C296]" />
              <div className="w-4 h-[1px] bg-[#D4C296]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4C296]" />
            </div>

            {/* Central Sacred Moon & Sun Geometry */}
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D4C296]/40 flex items-center justify-center animate-pulse">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D4C296]/60 flex items-center justify-center bg-[#D4C296]/10">
                  <Moon className="w-4 h-4 text-[#D4C296]" />
                </div>
              </div>
              <div className="absolute -inset-2 border border-dashed border-[#D4C296]/20 rounded-full" />
            </div>

            {/* Bottom motif */}
            <div className="text-[#D4C296]/60 text-[10px] tracking-widest font-serif font-light">
              问月
            </div>
          </div>
        </div>

        {/* ================= CARD FRONT ================= */}
        {card && (
          <div
            className="absolute inset-0 w-full h-full rounded-xl flex flex-col justify-between border border-[#D4C296]/50 overflow-hidden bg-[#121B33]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Reversed visual orientation modifier */}
            <div
              className={`w-full h-full relative flex flex-col justify-between transition-transform duration-500 ${
                isReversed ? 'rotate-180' : ''
              }`}
            >
              {/* 1. Real Card Artwork Image with Object Fit */}
              {currentImgSrc ? (
                <div className="absolute inset-0 w-full h-full bg-[#0E1526]">
                  <img
                    src={currentImgSrc}
                    alt={card.nameCn}
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    onLoad={() => setImgLoaded(true)}
                    className="w-full h-full object-cover select-none"
                  />
                  {/* Subtle inner dark gradient overlay at top and bottom for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
                </div>
              ) : null}

              {/* 2. Fallback Graphic if Image is not rendered/loaded */}
              {(!currentImgSrc || !imgLoaded) && (
                <div
                  className="absolute inset-0 w-full h-full p-2 flex flex-col justify-between"
                  style={{
                    background: `linear-gradient(145deg, ${card.colorScheme.from} 0%, #1A2340 60%, ${card.colorScheme.to} 100%)`,
                  }}
                >
                  <div className="my-auto flex flex-col items-center justify-center relative py-1">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center relative"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        boxShadow: `0 0 20px ${card.colorScheme.glow}`,
                      }}
                    >
                      <IconComponent
                        size={sizeConfig.iconSize}
                        className="text-[#F5F7FF] drop-shadow-md"
                        style={{ color: card.colorScheme.accent }}
                      />
                      <div className="absolute inset-0 rounded-full border border-white/20" />
                    </div>
                  </div>
                </div>
              )}

              {/* Card Header Layer: Roman Number & Type */}
              <div className="relative z-10 flex items-center justify-between p-1.5">
                <span className="text-[#D4C296] font-serif font-bold text-[11px] tracking-wider px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-white/10">
                  {card.type === 'major' ? getRomanNumber(card.number) : card.number}
                </span>
                <span className="text-[#F5F7FF]/80 text-[9px] px-1 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-white/10">
                  {card.element ? `${card.element}` : '韦特'}
                </span>
              </div>

              {/* Card Footer Layer: Chinese & English Name */}
              <div className="relative z-10 p-1">
                <div className="text-center bg-black/70 backdrop-blur-xs rounded-lg py-1 px-1 border border-white/15 shadow-md">
                  <div className="text-[#F5F7FF] font-bold text-xs leading-tight tracking-wide font-serif">
                    {card.nameCn}
                  </div>
                  <div className="text-[#D4C296]/90 text-[8px] tracking-tight truncate font-mono">
                    {card.nameEn}
                  </div>
                </div>
              </div>
            </div>

            {/* Upright / Reversed Floating Badge (Pinned on top layer) */}
            {isFlipped && (
              <div
                className={`absolute top-1.5 right-1.5 rounded-full font-bold shadow-lg z-20 ${
                  sizeConfig.badge
                } ${
                  isReversed
                    ? 'bg-rose-950/90 text-rose-300 border border-rose-500/50'
                    : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                }`}
              >
                {isReversed ? '逆位' : '正位'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional Subtitle under Card */}
      {showLabel && card && isFlipped && (
        <div className="mt-1.5 text-center">
          <span className="text-xs text-[#D4C296] font-medium block truncate max-w-[120px]">
            {card.nameCn} {isReversed ? '(逆)' : '(正)'}
          </span>
        </div>
      )}
    </div>
  );
};


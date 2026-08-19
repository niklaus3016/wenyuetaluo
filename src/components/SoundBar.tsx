import React, { useState } from 'react';
import { Volume2, VolumeX, Moon, Wind, CloudRain, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { AmbientSoundType, AppSettings } from '../types';
import { soundEngine } from '../utils/audio';

interface SoundBarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

const SOUND_OPTIONS: { id: AmbientSoundType; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'night', label: '月夜静谧', icon: Moon, desc: '432Hz 治愈低频与月光和声' },
  { id: 'wind', label: '星空微风', icon: Wind, desc: '轻柔拂过的星际暖风' },
  { id: 'rain', label: '细雨冥想', icon: CloudRain, desc: '屋檐轻落的净化细雨' },
  { id: 'zen', label: '空灵禅音', icon: Sparkles, desc: '西藏颂钵悠扬余韵' },
];

export const SoundBar: React.FC<SoundBarProps> = ({ settings, onUpdateSettings }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSound = () => {
    if (settings.isSoundPlaying) {
      soundEngine.stopAmbient();
      onUpdateSettings({ isSoundPlaying: false });
    } else {
      soundEngine.startAmbient(settings.currentSound);
      onUpdateSettings({ isSoundPlaying: true });
    }
  };

  const handleSelectSound = (type: AmbientSoundType) => {
    onUpdateSettings({ currentSound: type });
    if (settings.isSoundPlaying) {
      soundEngine.startAmbient(type);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    soundEngine.setBgmVolume(vol);
    onUpdateSettings({ bgmVolume: vol });
  };

  const currentOption = SOUND_OPTIONS.find(s => s.id === settings.currentSound) || SOUND_OPTIONS[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="w-full bg-[#1A2340]/90 backdrop-blur-md border border-[#D4C296]/25 rounded-2xl p-3 shadow-lg transition-all duration-300">
      {/* Top Bar Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            settings.isSoundPlaying ? 'bg-[#7B68EE]/30 text-[#D4C296] border border-[#7B68EE]/50' : 'bg-white/5 text-[#F5F7FF]/50'
          }`}>
            <CurrentIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[#F5F7FF] text-sm font-medium">{currentOption.label}</span>
              {settings.isSoundPlaying && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-[#7B68EE]/20 text-[#D4C296] animate-pulse">
                  播放中
                </span>
              )}
            </div>
            <span className="text-[#F5F7FF]/50 text-xs truncate max-w-[180px] block">
              {currentOption.desc}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Play/Pause Button */}
          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              settings.isSoundPlaying
                ? 'bg-[#D4C296] text-[#1A2340] shadow-md shadow-[#D4C296]/20'
                : 'bg-white/10 text-[#F5F7FF]/80 hover:bg-white/20'
            }`}
            title={settings.isSoundPlaying ? '暂停白噪音' : '开启白噪音'}
          >
            {settings.isSoundPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#F5F7FF]/60 hover:text-[#F5F7FF]"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Sound Picker & Volume Panel */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-3 animate-fadeIn">
          {/* 4 Sound Buttons Grid */}
          <div className="grid grid-cols-2 gap-2">
            {SOUND_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = settings.currentSound === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSound(item.id)}
                  className={`p-2.5 rounded-xl text-left flex items-center space-x-2.5 transition-all border ${
                    isSelected
                      ? 'bg-[#7B68EE]/20 border-[#D4C296]/60 text-[#F5F7FF]'
                      : 'bg-white/5 border-transparent text-[#F5F7FF]/70 hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#D4C296]' : 'text-[#F5F7FF]/50'}`} />
                  <div className="truncate">
                    <div className="text-xs font-medium">{item.label}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className="flex items-center space-x-3 px-1 pt-1">
            <Volume2 className="w-4 h-4 text-[#D4C296]/70 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.bgmVolume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4C296]"
            />
            <span className="text-[11px] text-[#F5F7FF]/60 w-8 text-right">
              {Math.round(settings.bgmVolume * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

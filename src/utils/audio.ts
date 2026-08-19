import { AmbientSoundType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentSourceNodes: (AudioNode | number)[] = [];
  private activeSound: AmbientSoundType | null = null;
  private isPlayingBgm: boolean = false;
  private noiseBuffer: AudioBuffer | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private getWhiteNoiseBuffer(): AudioBuffer {
    if (this.noiseBuffer && this.ctx) return this.noiseBuffer;
    this.initContext();
    const bufferSize = this.ctx!.sampleRate * 4; // 4 seconds loop
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public setBgmVolume(volume: number) {
    this.initContext();
    if (this.bgmGain && this.ctx) {
      const safeVol = Math.max(0, Math.min(1, volume));
      this.bgmGain.gain.setTargetAtTime(safeVol, this.ctx.currentTime, 0.1);
    }
  }

  public setSfxVolume(volume: number) {
    this.initContext();
    if (this.sfxGain && this.ctx) {
      const safeVol = Math.max(0, Math.min(1, volume));
      this.sfxGain.gain.setTargetAtTime(safeVol, this.ctx.currentTime, 0.1);
    }
  }

  public playCardFlip() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;

      // Soft whoosh (card slip)
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getWhiteNoiseBuffer();
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.2);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.4);

      // Delicate celestial chime tone (Crystal harmonic)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.1); // E6

      oscGain.gain.setValueAtTime(0.15, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Audio fallback silent
    }
  }

  public playClick() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  }

  public stopAmbient() {
    this.currentSourceNodes.forEach(node => {
      if (typeof node === 'number') {
        window.clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore disconnect
        }
      }
    });
    this.currentSourceNodes = [];
    this.isPlayingBgm = false;
    this.activeSound = null;
  }

  public startAmbient(type: AmbientSoundType) {
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    this.stopAmbient();
    this.activeSound = type;
    this.isPlayingBgm = true;
    const now = this.ctx.currentTime;

    if (type === 'night') {
      // 432Hz ambient chord + soothing drone
      const freqs = [108, 216, 432, 648];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Gentle tremolo
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();
        lfo.frequency.setValueAtTime(0.15 + idx * 0.05, now);
        lfoGain.gain.setValueAtTime(freq * 0.02, now);
        lfo.connect(osc.frequency);
        lfo.start(now);

        const baseGain = idx === 2 ? 0.08 : 0.04;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(baseGain, now + 1.5);

        osc.connect(gain);
        gain.connect(this.bgmGain!);
        osc.start(now);

        this.currentSourceNodes.push(osc, lfo, gain, lfoGain);
      });
    } else if (type === 'wind') {
      // Filtered wind
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getWhiteNoiseBuffer();
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(350, now);
      filter.Q.setValueAtTime(4.0, now);

      // Modulate wind frequency
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.1, now);
      lfoGain.gain.setValueAtTime(200, now);
      lfo.connect(filter.frequency);
      lfo.start(now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noise.start(now);
      this.currentSourceNodes.push(noise, filter, lfo, lfoGain, gain);
    } else if (type === 'rain') {
      // Continuous Rain Simulation
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getWhiteNoiseBuffer();
      noise.loop = true;

      const lpFilter = this.ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(1200, now);

      const hpFilter = this.ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.setValueAtTime(400, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 1.2);

      noise.connect(hpFilter);
      hpFilter.connect(lpFilter);
      lpFilter.connect(gain);
      gain.connect(this.bgmGain);

      noise.start(now);
      this.currentSourceNodes.push(noise, hpFilter, lpFilter, gain);

      // Periodic gentle droplets
      const intervalId = window.setInterval(() => {
        if (!this.ctx || !this.isPlayingBgm) return;
        try {
          const dropNow = this.ctx.currentTime;
          const dropOsc = this.ctx.createOscillator();
          const dropGain = this.ctx.createGain();
          const dropFreq = 1600 + Math.random() * 800;
          dropOsc.type = 'sine';
          dropOsc.frequency.setValueAtTime(dropFreq, dropNow);
          dropOsc.frequency.exponentialRampToValueAtTime(dropFreq * 0.6, dropNow + 0.05);

          dropGain.gain.setValueAtTime(0.04, dropNow);
          dropGain.gain.exponentialRampToValueAtTime(0.001, dropNow + 0.06);

          dropOsc.connect(dropGain);
          dropGain.connect(this.bgmGain!);
          dropOsc.start(dropNow);
          dropOsc.stop(dropNow + 0.07);
        } catch {
          // ignore
        }
      }, 400);

      this.currentSourceNodes.push(intervalId);
    } else if (type === 'zen') {
      // Singing bowl chime harmonics loop
      const bowlHarmonics = [261.63, 523.25, 784.88, 1046.5]; // C4 chord
      const triggerChime = () => {
        if (!this.ctx || !this.isPlayingBgm) return;
        try {
          const chimeNow = this.ctx.currentTime;
          bowlHarmonics.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq + (Math.random() * 2 - 1), chimeNow);

            const initialGain = 0.09 / (idx + 1);
            gain.gain.setValueAtTime(initialGain, chimeNow);
            gain.gain.exponentialRampToValueAtTime(0.0001, chimeNow + 4.5);

            osc.connect(gain);
            gain.connect(this.bgmGain!);
            osc.start(chimeNow);
            osc.stop(chimeNow + 4.6);
          });
        } catch {
          // ignore
        }
      };

      triggerChime();
      const intervalId = window.setInterval(triggerChime, 5000);
      this.currentSourceNodes.push(intervalId);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlayingBgm,
      activeSound: this.activeSound
    };
  }
}

export const soundEngine = new SoundEngine();

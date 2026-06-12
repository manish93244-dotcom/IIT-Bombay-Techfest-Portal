// Web Audio API ambient synth-wave generator for IIT Bombay Techfest Portal
// Avoids external assets, fully self-contained synth-wave soundscape

class TechfestAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private chimeTimeout: any = null;
  private isCurrentlyPlaying = false;

  constructor() {
    // Lazy initialized on play to conform to browser autoplay policy
  }

  public toggle(forceState?: boolean): boolean {
    const targetState = forceState !== undefined ? forceState : !this.isCurrentlyPlaying;

    if (targetState) {
      this.play();
    } else {
      this.stop();
    }

    return this.isCurrentlyPlaying;
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  private play() {
    if (this.isCurrentlyPlaying) return;

    try {
      // Initialize Audio Context on user request
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();
      
      // Resume if context is suspended (Chrome/Vivaldi requirement)
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + 3.0); // Smooth fade in

      // Ambient dynamic resonant lowpass filter for deep space sci-fi feel
      const lowpassFilter = this.ctx.createBiquadFilter();
      lowpassFilter.type = 'lowpass';
      lowpassFilter.frequency.setValueAtTime(260, this.ctx.currentTime);
      lowpassFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Stereo delay node for deep immersive atmosphere
      const delayNode = this.ctx.createDelay();
      delayNode.delayTime.setValueAtTime(0.4, this.ctx.currentTime);
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.45, this.ctx.currentTime);

      // Connect Delay loop
      delayNode.connect(delayFeedback);
      delayFeedback.connect(delayNode);

      // Main pipeline routing
      lowpassFilter.connect(this.masterGain);
      delayNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.oscillators = [];
      this.isCurrentlyPlaying = true;

      // 1. Synth-wave Bass Drone: fundamental low frequencies (C#1: ~34.65Hz, G#1: ~49.00Hz, C#2: ~69.30Hz)
      const frequencies = [34.65, 49.00, 69.30];
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();

        // Warm saw and triangle waves
        osc.type = idx === 0 ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        subGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

        // Connect through lowpass filter to shave off digital bite
        osc.connect(subGain);
        subGain.connect(lowpassFilter);
        osc.start();

        this.oscillators.push({ osc, gain: subGain });
      });

      // 2. Cosmic Synth Pad arpeggiator or gentle random chime
      this.scheduleNextChime();

    } catch (e) {
      console.error('Audio synthesizer engine failed to start:', e);
      this.isCurrentlyPlaying = false;
    }
  }

  private scheduleNextChime() {
    if (!this.isCurrentlyPlaying || !this.ctx || !this.masterGain) return;

    // Cyber synth notes (Pentatonic scale: C#4, D#4, F4, G#4, A#4, C#5)
    const chimes = [277.18, 311.13, 349.23, 415.30, 466.16, 554.37];
    const targetFreq = chimes[Math.floor(Math.random() * chimes.length)];

    const osc = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(targetFreq, this.ctx.currentTime);

    // Warm resonant frequency modulation for cyber sweep
    osc.frequency.exponentialRampToValueAtTime(targetFreq * 0.98, this.ctx.currentTime + 1.2);

    chimeGain.gain.setValueAtTime(0, this.ctx.currentTime);
    chimeGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.1);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

    // Connect to stereophonic delay and master line
    osc.connect(chimeGain);
    chimeGain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.0);

    // Dynamic scheduling intervals
    const delayRange = 1800 + Math.random() * 3200;
    this.chimeTimeout = setTimeout(() => this.scheduleNextChime(), delayRange);
  }

  private stop() {
    if (!this.isCurrentlyPlaying) return;

    if (this.chimeTimeout) {
      clearTimeout(this.chimeTimeout);
      this.chimeTimeout = null;
    }

    // High frequency fade out
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
      } catch (err) {
        // Safe bypass
      }
    }

    // Stop and close everything with 400ms delay for a neat decay fade
    setTimeout(() => {
      this.oscillators.forEach(({ osc }) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (err) {
          // already closed
        }
      });
      this.oscillators = [];

      if (this.ctx) {
        this.ctx.close().catch(() => {});
        this.ctx = null;
      }
      this.masterGain = null;
    }, 450);

    this.isCurrentlyPlaying = false;
  }
}

export const techfestAudio = new TechfestAudioEngine();

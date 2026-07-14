/**
 * High-Quality Polyphonic Synthesizer & SFX Engine built on Web Audio API.
 * Emulates acoustic piano timbre with rich harmonics, velocity filtering, and decay tails.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeVoices: Map<number, { oscs: OscillatorNode[]; gain: GainNode }> = new Map();
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Converts a MIDI note number to fundamental frequency in Hz (A4 = 440Hz).
   */
  private midiToFrequency(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /**
   * Triggers a polyphonic acoustic piano note sound.
   */
  public playNote(midiNumber: number, velocity = 100) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      // Stop any existing voice playing on the same pitch
      this.stopNote(midiNumber);

      const freq = this.midiToFrequency(midiNumber);
      const now = this.ctx.currentTime;
      const normalizedVel = Math.min(1, Math.max(0.1, velocity / 127));

      // 1. Primary Fundamental Oscillator (Sine for warmth)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // 2. Second Harmonic Oscillator (Triangle for woody string resonance)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // 3. Subtle Sub-harmonic (Sine)
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 0.5, now);

      // Velocity-sensitive Low-pass Filter for acoustic brightness
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const cutoffFreq = Math.min(10000, freq * (2 + normalizedVel * 4));
      filter.frequency.setValueAtTime(cutoffFreq, now);

      // Envelope Gain Node
      const noteGain = this.ctx.createGain();
      const peakVolume = 0.5 * normalizedVel;

      noteGain.gain.setValueAtTime(0.0001, now);
      // Fast acoustic hammer attack (3ms)
      noteGain.gain.exponentialRampToValueAtTime(peakVolume, now + 0.003);
      // Exponential piano decay tail (1.8 seconds)
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      // Connect nodes
      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);

      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      // Store active nodes for damper release
      this.activeVoices.set(midiNumber, {
        oscs: [osc1, osc2, osc3],
        gain: noteGain,
      });

      // Auto-cleanup after decay completes
      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          osc3.stop();
          this.activeVoices.delete(midiNumber);
        } catch (e) {
          // Ignore cleanup errors
        }
      }, 2300);
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }

  /**
   * Releases an active playing piano note (simulates felt damper pedal release).
   */
  public stopNote(midiNumber: number) {
    const voice = this.activeVoices.get(midiNumber);
    if (voice && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
        voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        setTimeout(() => {
          voice.oscs.forEach(osc => {
            try { osc.stop(); } catch (e) {}
          });
          this.activeVoices.delete(midiNumber);
        }, 160);
      } catch (e) {
        this.activeVoices.delete(midiNumber);
      }
    }
  }

  /**
   * Sound effect for level completion victory arpeggio!
   */
  public playVictoryFanfare() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const chord = [60, 64, 67, 72, 76, 79, 84]; // C major extended arpeggio
      chord.forEach((midi, i) => {
        setTimeout(() => {
          this.playNote(midi, 110);
        }, i * 90);
      });
    } catch (e) {
      // Ignore audio context lock errors
    }
  }

  /**
   * Sound effect for target success chime.
   */
  public playSuccessChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.playNote(72, 90); // High C
      setTimeout(() => this.playNote(79, 100), 70); // High G
    } catch (e) {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();

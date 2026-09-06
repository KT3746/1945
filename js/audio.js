/**
 * Áudio procedural premium (Web Audio) — sem samples com copyright.
 */
import { STORAGE_MUTE } from "./version.js";

export class AudioSys {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.comp = null;
    this.unlocked = false;
    this.muted = localStorage.getItem(STORAGE_MUTE) === "1";
    this._pad = null;
    this._beat = 0;
    this._step = 0;
    this._intense = 0;
    this._bassStep = 0;
  }

  unlock() {
    if (this.unlocked) {
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();

    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.92;

    // compressor suave = sensação mais "mixada"/premium
    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -18;
    this.comp.knee.value = 18;
    this.comp.ratio.value = 3.2;
    this.comp.attack.value = 0.01;
    this.comp.release.value = 0.22;
    this.comp.connect(this.master);
    this.master.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.3;
    this.musicGain.connect(this.comp);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.85;
    this.sfxGain.connect(this.comp);

    this.unlocked = true;
    this._startBed();
  }

  setMuted(m) {
    this.muted = m;
    localStorage.setItem(STORAGE_MUTE, m ? "1" : "0");
    if (this.master) this.master.gain.value = m ? 0 : 0.92;
    if (this.ctx && this.ctx.state === "suspended" && !m) this.ctx.resume();
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setIntense(v) {
    this._intense = v;
    if (this._pad && this._pad.f && this.ctx) {
      const t = this.ctx.currentTime;
      this._pad.f.frequency.setTargetAtTime(v ? 2600 : 1100, t, 0.4);
      this._pad.drive.gain.setTargetAtTime(v ? 0.11 : 0.06, t, 0.4);
      this._pad.sparkleG.gain.setTargetAtTime(v ? 0.03 : 0.014, t, 0.4);
    }
  }

  update(dt) {
    if (!this.unlocked || this.muted || !this.ctx) return;
    this._beat -= dt;
    if (this._beat <= 0) {
      this._groove();
      this._beat = this._intense ? 0.18 : 0.28;
    }
  }

  _startBed() {
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const bass = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const bassG = ctx.createGain();
    bass.type = "sine";
    sub.type = "sine";
    bass.frequency.value = 55;
    sub.frequency.value = 27.5;
    bassG.gain.value = 0.09;
    bass.connect(bassG);
    sub.connect(bassG);

    const mid = ctx.createOscillator();
    const mid2 = ctx.createOscillator();
    const midG = ctx.createGain();
    const f = ctx.createBiquadFilter();
    mid.type = "sawtooth";
    mid2.type = "triangle";
    mid.frequency.value = 110;
    mid2.frequency.value = 164.8;
    f.type = "lowpass";
    f.frequency.value = 1100;
    f.Q.value = 0.85;
    midG.gain.value = 0.032;
    mid.connect(f);
    mid2.connect(f);
    f.connect(midG);

    // shimmer / sparkle
    const sparkle = ctx.createOscillator();
    const sparkleG = ctx.createGain();
    const sf = ctx.createBiquadFilter();
    sparkle.type = "sine";
    sparkle.frequency.value = 880;
    sf.type = "highpass";
    sf.frequency.value = 600;
    sparkleG.gain.value = 0.014;
    sparkle.connect(sf);
    sf.connect(sparkleG);

    const nLen = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, nLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < nLen; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = "bandpass";
    nf.frequency.value = 520;
    nf.Q.value = 0.55;
    const ng = ctx.createGain();
    ng.gain.value = 0.02;
    noise.connect(nf);
    nf.connect(ng);

    const drive = ctx.createGain();
    drive.gain.value = 0.06;
    bassG.connect(drive);
    midG.connect(drive);
    sparkleG.connect(drive);
    ng.connect(drive);
    drive.connect(this.musicGain);

    bass.start(t);
    sub.start(t);
    mid.start(t);
    mid2.start(t);
    sparkle.start(t);
    noise.start(t);
    this._pad = { bass, sub, mid, mid2, sparkle, noise, f, drive, sparkleG };
  }

  _groove() {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const intense = !!this._intense;

    // kick
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(intense ? 150 : 118, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.13);
    g.gain.setValueAtTime(intense ? 0.14 : 0.1, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    o.connect(g);
    g.connect(this.musicGain);
    o.start(t);
    o.stop(t + 0.16);

    this._step++;
    // snare/noise every other
    if (this._step % 2 === 0) this.noise(0.05, intense ? 0.05 : 0.03, 3500);

    // melodic pluck
    if (this._step % 2 === 0) {
      const scale = intense
        ? [349, 415, 466, 554, 622]
        : [294, 349, 392, 440, 523];
      const f0 = scale[this._bassStep % scale.length];
      this._bassStep++;
      const pl = ctx.createOscillator();
      const pl2 = ctx.createOscillator();
      const pg = ctx.createGain();
      const pf = ctx.createBiquadFilter();
      pl.type = "triangle";
      pl2.type = "sine";
      pl.frequency.value = f0;
      pl2.frequency.value = f0 * 2;
      pf.type = "lowpass";
      pf.frequency.setValueAtTime(3200, t);
      pf.frequency.exponentialRampToValueAtTime(700, t + 0.24);
      pg.gain.setValueAtTime(0.055, t);
      pg.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
      pl.connect(pf);
      pl2.connect(pf);
      pf.connect(pg);
      pg.connect(this.musicGain);
      pl.start(t);
      pl2.start(t);
      pl.stop(t + 0.28);
      pl2.stop(t + 0.28);
    }

    this.noise(0.02, intense ? 0.028 : 0.016, 8000);
  }

  _env(g, t, a, d, vol) {
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + Math.max(0.004, a));
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  tone(freq, type, dur, vol = 0.1, slide = 0) {
    if (!this.unlocked || this.muted) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = type;
    o2.type = "sine";
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    o2.frequency.setValueAtTime(freq * 2.01, ctx.currentTime);
    if (slide) {
      const end = Math.max(40, freq + slide);
      o.frequency.exponentialRampToValueAtTime(end, ctx.currentTime + dur);
      o2.frequency.exponentialRampToValueAtTime(Math.max(40, end * 2), ctx.currentTime + dur);
    }
    f.type = "lowpass";
    f.frequency.value = Math.min(9000, freq * 5);
    this._env(g, ctx.currentTime, 0.006, dur, vol);
    o.connect(f);
    o2.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    o.start();
    o2.start();
    o.stop(ctx.currentTime + dur + 0.06);
    o2.stop(ctx.currentTime + dur + 0.06);
  }

  noise(dur, vol = 0.1, filterFreq = 1400) {
    if (!this.unlocked || this.muted) return;
    const ctx = this.ctx;
    const n = Math.max(1, (ctx.sampleRate * dur) | 0);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = filterFreq;
    const g = ctx.createGain();
    this._env(g, ctx.currentTime, 0.002, dur, vol);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    src.start();
  }

  shoot() {
    this.tone(980, "square", 0.04, 0.05, -580);
    this.tone(1600, "triangle", 0.028, 0.028, -900);
    this.noise(0.022, 0.04, 5200);
  }

  enemyShot() {
    this.tone(300, "sawtooth", 0.07, 0.048, -110);
    this.noise(0.035, 0.028, 2000);
  }

  explosion() {
    this.noise(0.3, 0.24, 1200);
    this.noise(0.2, 0.14, 3200);
    this.tone(72, "sine", 0.32, 0.16, -28);
    this.tone(150, "sawtooth", 0.18, 0.08, -70);
  }

  bigBoom() {
    this.noise(0.6, 0.34, 700);
    this.noise(0.4, 0.2, 2000);
    this.tone(44, "sine", 0.7, 0.22, -10);
    this.tone(100, "sawtooth", 0.4, 0.12, -45);
    this.tone(210, "triangle", 0.22, 0.07, -80);
  }

  hit() {
    this.tone(150, "sawtooth", 0.09, 0.12, -45);
    this.noise(0.06, 0.13, 1000);
  }

  hurt() {
    this.tone(240, "sawtooth", 0.22, 0.15, -170);
    this.tone(170, "square", 0.16, 0.07, -95);
    this.noise(0.15, 0.15, 750);
  }

  pickup() {
    this.tone(659, "sine", 0.06, 0.1);
    setTimeout(() => this.tone(880, "triangle", 0.08, 0.09), 40);
    setTimeout(() => this.tone(1174, "sine", 0.14, 0.08), 90);
  }

  ui() {
    this.tone(780, "triangle", 0.045, 0.06);
    this.tone(1040, "sine", 0.035, 0.03);
  }

  warning() {
    this.tone(466, "square", 0.1, 0.085);
    setTimeout(() => this.tone(370, "square", 0.14, 0.075), 95);
  }

  stage() {
    this.tone(311, "triangle", 0.11, 0.1);
    setTimeout(() => this.tone(392, "triangle", 0.11, 0.1), 80);
    setTimeout(() => this.tone(466, "triangle", 0.16, 0.11), 160);
    setTimeout(() => this.tone(622, "sine", 0.22, 0.09), 250);
  }

  gameover() {
    this.tone(208, "sawtooth", 0.32, 0.13, -40);
    setTimeout(() => this.tone(155, "triangle", 0.42, 0.11, -30), 150);
    setTimeout(() => this.tone(103, "sine", 0.58, 0.11), 300);
  }

  extraLife() {
    this.tone(466, "sine", 0.08, 0.1);
    setTimeout(() => this.tone(587, "sine", 0.1, 0.1), 65);
    setTimeout(() => this.tone(698, "triangle", 0.12, 0.1), 130);
    setTimeout(() => this.tone(932, "sine", 0.18, 0.09), 210);
  }
}

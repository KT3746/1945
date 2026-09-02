/**
 * Som procedural com Web Audio — sem samples com copyright.
 * Só liga depois do primeiro toque/clique (regra do navegador).
 */
import { STORAGE_MUTE } from "./version.js";

export class AudioSys {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.unlocked = false;
    this.muted = localStorage.getItem(STORAGE_MUTE) === "1";
    this._pad = null;
    this._beat = 0;
    this._step = 0;
    this._intense = 0;
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
    this.master.gain.value = this.muted ? 0 : 0.82;
    this.master.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.2;
    this.musicGain.connect(this.master);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.72;
    this.sfxGain.connect(this.master);

    this.unlocked = true;
    this._startBed();
  }

  setMuted(m) {
    this.muted = m;
    localStorage.setItem(STORAGE_MUTE, m ? "1" : "0");
    if (this.master) this.master.gain.value = m ? 0 : 0.82;
    if (this.ctx && this.ctx.state === "suspended" && !m) this.ctx.resume();
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setIntense(v) {
    this._intense = v;
  }

  update(dt) {
    if (!this.unlocked || this.muted || !this.ctx) return;
    this._beat -= dt;
    if (this._beat <= 0) {
      this._plink();
      this._beat = this._intense ? 0.22 : 0.36;
    }
  }

  _startBed() {
    const ctx = this.ctx;
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const o3 = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o1.type = "sine";
    o2.type = "sine";
    o3.type = "triangle";
    o1.frequency.value = 65.4;
    o2.frequency.value = 98;
    o3.frequency.value = 196;
    f.type = "lowpass";
    f.frequency.value = 640;
    g.gain.value = 0.055;
    o1.connect(g);
    o2.connect(g);
    o3.connect(g);
    g.connect(f);
    f.connect(this.musicGain);
    o1.start();
    o2.start();
    o3.start();
    this._pad = { o1, o2, o3, g, f };
  }

  _plink() {
    const ctx = this.ctx;
    const scale = this._intense
      ? [196, 233, 262, 311, 349]
      : [174, 196, 220, 262, 294];
    const f = scale[this._step % scale.length];
    this._step++;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = f;
    g.gain.value = 0.028;
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.028, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    const flt = ctx.createBiquadFilter();
    flt.type = "lowpass";
    flt.frequency.value = 1400;
    o.connect(flt);
    flt.connect(g);
    g.connect(this.musicGain);
    o.start();
    o.stop(t + 0.2);
  }

  _env(g, t, a, d, vol) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  tone(freq, type, dur, vol = 0.1, slide = 0) {
    if (!this.unlocked || this.muted) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slide) {
      o.frequency.exponentialRampToValueAtTime(
        Math.max(40, freq + slide),
        ctx.currentTime + dur
      );
    }
    this._env(g, ctx.currentTime, 0.01, dur, vol);
    o.connect(g);
    g.connect(this.sfxGain);
    o.start();
    o.stop(ctx.currentTime + dur + 0.05);
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
    this._env(g, ctx.currentTime, 0.004, dur, vol);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    src.start();
  }

  shoot() {
    this.tone(780, "square", 0.05, 0.05, -420);
    this.noise(0.03, 0.04, 2400);
  }

  enemyShot() {
    this.tone(240, "square", 0.07, 0.045, -80);
  }

  explosion() {
    this.noise(0.22, 0.18, 900);
    this.tone(90, "sawtooth", 0.2, 0.1, -40);
  }

  bigBoom() {
    this.noise(0.45, 0.28, 500);
    this.tone(60, "sine", 0.5, 0.16, -20);
    this.tone(140, "sawtooth", 0.28, 0.08, -60);
  }

  hit() {
    this.tone(110, "sawtooth", 0.12, 0.1, -30);
    this.noise(0.08, 0.1, 700);
  }

  hurt() {
    this.tone(220, "sawtooth", 0.18, 0.12, -140);
    this.noise(0.12, 0.12, 500);
  }

  pickup() {
    this.tone(523, "sine", 0.08, 0.08);
    this.tone(784, "sine", 0.12, 0.07);
  }

  ui() {
    this.tone(660, "sine", 0.05, 0.05);
  }

  warning() {
    this.tone(392, "square", 0.12, 0.07);
    this.tone(311, "square", 0.16, 0.06);
  }

  stage() {
    this.tone(262, "triangle", 0.14, 0.08);
    setTimeout(() => this.tone(330, "triangle", 0.14, 0.08), 90);
    setTimeout(() => this.tone(392, "triangle", 0.22, 0.09), 180);
  }

  gameover() {
    this.tone(196, "sawtooth", 0.35, 0.1, -50);
    setTimeout(() => this.tone(130, "triangle", 0.5, 0.08), 180);
  }

  extraLife() {
    this.tone(392, "sine", 0.1, 0.08);
    setTimeout(() => this.tone(523, "sine", 0.12, 0.08), 80);
    setTimeout(() => this.tone(784, "sine", 0.16, 0.08), 160);
  }
}

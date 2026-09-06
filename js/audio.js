/**
 * Som procedural moderno (Web Audio) — sem samples com copyright.
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
    this.master.gain.value = this.muted ? 0 : 0.88;
    this.master.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.26;
    this.musicGain.connect(this.master);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.78;
    this.sfxGain.connect(this.master);

    this.unlocked = true;
    this._startBed();
  }

  setMuted(m) {
    this.muted = m;
    localStorage.setItem(STORAGE_MUTE, m ? "1" : "0");
    if (this.master) this.master.gain.value = m ? 0 : 0.88;
    if (this.ctx && this.ctx.state === "suspended" && !m) this.ctx.resume();
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setIntense(v) {
    this._intense = v;
    if (this._pad && this._pad.f) {
      const t = this.ctx.currentTime;
      this._pad.f.frequency.cancelScheduledValues(t);
      this._pad.f.frequency.setTargetAtTime(v ? 2200 : 900, t, 0.35);
      this._pad.drive.gain.setTargetAtTime(v ? 0.09 : 0.05, t, 0.35);
    }
  }

  update(dt) {
    if (!this.unlocked || this.muted || !this.ctx) return;
    this._beat -= dt;
    if (this._beat <= 0) {
      this._pulse();
      this._beat = this._intense ? 0.2 : 0.32;
    }
  }

  _startBed() {
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // Drone grave moderno
    const bass = ctx.createOscillator();
    const bass2 = ctx.createOscillator();
    const bassG = ctx.createGain();
    bass.type = "sine";
    bass2.type = "triangle";
    bass.frequency.value = 55;
    bass2.frequency.value = 82.5;
    bassG.gain.value = 0.07;
    bass.connect(bassG);
    bass2.connect(bassG);

    // Camada mid com filtro (pad)
    const mid = ctx.createOscillator();
    const midG = ctx.createGain();
    const f = ctx.createBiquadFilter();
    mid.type = "sawtooth";
    mid.frequency.value = 110;
    f.type = "lowpass";
    f.frequency.value = 900;
    f.Q.value = 0.7;
    midG.gain.value = 0.028;
    mid.connect(f);
    f.connect(midG);

    // Ruído atmosférico filtrado
    const nLen = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, nLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < nLen; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = "bandpass";
    nf.frequency.value = 480;
    nf.Q.value = 0.6;
    const ng = ctx.createGain();
    ng.gain.value = 0.018;
    noise.connect(nf);
    nf.connect(ng);

    const drive = ctx.createGain();
    drive.gain.value = 0.05;
    bassG.connect(drive);
    midG.connect(drive);
    ng.connect(drive);
    drive.connect(this.musicGain);

    bass.start(t);
    bass2.start(t);
    mid.start(t);
    noise.start(t);
    this._pad = { bass, bass2, mid, noise, f, drive, bassG, midG };
  }

  _pulse() {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const intense = this._intense;
    // Kick sintético curto
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(intense ? 140 : 110, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(intense ? 0.12 : 0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    o.connect(g);
    g.connect(this.musicGain);
    o.start(t);
    o.stop(t + 0.15);

    // Arpejo / pluck a cada 2 steps
    this._step++;
    if (this._step % 2 === 0) {
      const scale = intense
        ? [330, 392, 440, 523, 587]
        : [262, 311, 349, 392, 466];
      const f0 = scale[this._bassStep % scale.length];
      this._bassStep++;
      const pl = ctx.createOscillator();
      const pg = ctx.createGain();
      const pf = ctx.createBiquadFilter();
      pl.type = "triangle";
      pl.frequency.value = f0;
      pf.type = "lowpass";
      pf.frequency.setValueAtTime(2400, t);
      pf.frequency.exponentialRampToValueAtTime(600, t + 0.2);
      pg.gain.setValueAtTime(0.045, t);
      pg.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      pl.connect(pf);
      pf.connect(pg);
      pg.connect(this.musicGain);
      pl.start(t);
      pl.stop(t + 0.24);
    }

    // Hi-hat noise tick
    this.noise(0.03, intense ? 0.035 : 0.022, 6000);
  }

  _env(g, t, a, d, vol) {
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + Math.max(0.005, a));
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  tone(freq, type, dur, vol = 0.1, slide = 0) {
    if (!this.unlocked || this.muted) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slide) {
      o.frequency.exponentialRampToValueAtTime(
        Math.max(40, freq + slide),
        ctx.currentTime + dur
      );
    }
    f.type = "lowpass";
    f.frequency.value = Math.min(8000, freq * 4);
    this._env(g, ctx.currentTime, 0.008, dur, vol);
    o.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    o.start();
    o.stop(ctx.currentTime + dur + 0.06);
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
    this._env(g, ctx.currentTime, 0.003, dur, vol);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    src.start();
  }

  shoot() {
    // Tiro laser curto e nítido
    this.tone(920, "square", 0.045, 0.055, -520);
    this.tone(1400, "triangle", 0.03, 0.03, -800);
    this.noise(0.025, 0.045, 4200);
  }

  enemyShot() {
    this.tone(280, "sawtooth", 0.08, 0.05, -100);
    this.noise(0.04, 0.03, 1800);
  }

  explosion() {
    this.noise(0.28, 0.22, 1100);
    this.noise(0.18, 0.12, 2800);
    this.tone(78, "sine", 0.28, 0.14, -30);
    this.tone(160, "sawtooth", 0.16, 0.07, -70);
  }

  bigBoom() {
    this.noise(0.55, 0.32, 650);
    this.noise(0.35, 0.18, 1800);
    this.tone(48, "sine", 0.6, 0.2, -12);
    this.tone(110, "sawtooth", 0.35, 0.1, -50);
    this.tone(220, "triangle", 0.2, 0.06, -80);
  }

  hit() {
    this.tone(140, "sawtooth", 0.1, 0.11, -40);
    this.noise(0.07, 0.12, 900);
  }

  hurt() {
    this.tone(260, "sawtooth", 0.2, 0.14, -160);
    this.tone(180, "square", 0.15, 0.06, -90);
    this.noise(0.14, 0.14, 700);
  }

  pickup() {
    this.tone(587, "sine", 0.07, 0.09);
    setTimeout(() => this.tone(784, "triangle", 0.08, 0.08), 45);
    setTimeout(() => this.tone(1046, "sine", 0.12, 0.07), 95);
  }

  ui() {
    this.tone(740, "triangle", 0.05, 0.055);
    this.tone(980, "sine", 0.04, 0.03);
  }

  warning() {
    this.tone(440, "square", 0.1, 0.08);
    setTimeout(() => this.tone(349, "square", 0.14, 0.07), 100);
  }

  stage() {
    this.tone(294, "triangle", 0.12, 0.09);
    setTimeout(() => this.tone(370, "triangle", 0.12, 0.09), 85);
    setTimeout(() => this.tone(440, "triangle", 0.18, 0.1), 170);
    setTimeout(() => this.tone(587, "sine", 0.22, 0.08), 260);
  }

  gameover() {
    this.tone(220, "sawtooth", 0.3, 0.12, -40);
    setTimeout(() => this.tone(165, "triangle", 0.4, 0.1, -30), 160);
    setTimeout(() => this.tone(110, "sine", 0.55, 0.1), 320);
  }

  extraLife() {
    this.tone(440, "sine", 0.09, 0.09);
    setTimeout(() => this.tone(554, "sine", 0.1, 0.09), 70);
    setTimeout(() => this.tone(659, "triangle", 0.12, 0.09), 140);
    setTimeout(() => this.tone(880, "sine", 0.18, 0.08), 220);
  }
}

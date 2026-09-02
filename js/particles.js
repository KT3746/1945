/** Partículas, rastros, flashes e textos de combo. */

export class FX {
  constructor() {
    this.bits = [];
    this.texts = [];
    this.shake = 0;
    this.flash = 0;
    this.hurt = 0;
  }

  reset() {
    this.bits.length = 0;
    this.texts.length = 0;
    this.shake = 0;
    this.flash = 0;
    this.hurt = 0;
  }

  boom(x, y, n = 18, color = "#e8c070") {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 180;
      this.bits.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.35 + Math.random() * 0.4,
        max: 0.55,
        r: 1.5 + Math.random() * 3,
        color: i % 3 === 0 ? "#fff4d0" : color,
        kind: "spark",
      });
    }
    this.shake = Math.min(10, this.shake + 3.2);
    this.flash = 0.12;
  }

  trail(x, y, color = "#9ad4ff") {
    this.bits.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 12,
      vy: 40 + Math.random() * 30,
      life: 0.22,
      max: 0.22,
      r: 1.6,
      color,
      kind: "trail",
    });
  }

  puff(x, y, color = "#c9d4e0") {
    this.bits.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 20,
      vy: -10,
      life: 0.4,
      max: 0.4,
      r: 4 + Math.random() * 4,
      color,
      kind: "puff",
    });
  }

  floatText(x, y, text, color = "#ffe08a") {
    this.texts.push({ x, y, text, color, life: 0.85, max: 0.85 });
  }

  playerHurt() {
    this.shake = 8;
    this.hurt = 0.35;
  }

  update(dt) {
    this.shake = Math.max(0, this.shake - dt * 18);
    this.flash = Math.max(0, this.flash - dt);
    this.hurt = Math.max(0, this.hurt - dt);
    for (let i = this.bits.length - 1; i >= 0; i--) {
      const p = this.bits[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 40 * dt;
      if (p.life <= 0) this.bits.splice(i, 1);
    }
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.life -= dt;
      t.y -= 28 * dt;
      if (t.life <= 0) this.texts.splice(i, 1);
    }
  }

  draw(ctx) {
    for (const p of this.bits) {
      const a = Math.max(0, p.life / p.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      if (p.kind === "puff") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1.4 - a * 0.4), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
    }
    ctx.globalAlpha = 1;
    ctx.font = "700 12px Barlow, sans-serif";
    ctx.textAlign = "center";
    for (const t of this.texts) {
      ctx.globalAlpha = Math.max(0, t.life / t.max);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }
}

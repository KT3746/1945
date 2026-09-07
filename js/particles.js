/** Particulas, rastros, flashes e textos de combo — premium. */

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

  _cap(max) {
    if (this.bits.length > max) this.bits.splice(0, this.bits.length - max);
  }

  boom(x, y, n = 18, color = "#e8c070") {
    this._cap(70);
    n = Math.min(n, 22);
    this.bits.push({
      x, y, vx: 0, vy: 0,
      life: 0.18, max: 0.18, r: 10 + Math.random() * 6,
      color: "#fff6c8", kind: "glow",
    });
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 50 + Math.random() * 220;
      this.bits.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.35 + Math.random() * 0.45,
        max: 0.6,
        r: 1.2 + Math.random() * 3.2,
        color: i % 4 === 0 ? "#fff4d0" : i % 3 === 0 ? "#ff9a4a" : color,
        kind: i % 5 === 0 ? "streak" : "spark",
      });
    }
    for (let i = 0; i < 4; i++) {
      this.bits.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 30,
        vy: -20 - Math.random() * 40,
        life: 0.45 + Math.random() * 0.25,
        max: 0.6,
        r: 3 + Math.random() * 5,
        color: "#c9d4e088",
        kind: "puff",
      });
    }
    this.shake = Math.min(12, this.shake + 3.8);
    this.flash = 0.16;
  }

  trail(x, y, color = "#9ad4ff") {
    this._cap(80);
    this.bits.push({
      x, y,
      vx: (Math.random() - 0.5) * 14,
      vy: 35 + Math.random() * 40,
      life: 0.28, max: 0.28, r: 1.8 + Math.random(),
      color, kind: "spark",
    });
    if (Math.random() < 0.35) {
      this.bits.push({
        x, y: y + 4,
        vx: (Math.random() - 0.5) * 8,
        vy: 20,
        life: 0.18, max: 0.18, r: 3,
        color: "#ffe08a55", kind: "glow",
      });
    }
  }

  puff(x, y, color = "#c9d4e0") {
    this._cap(60);
    this.bits.push({
      x, y,
      vx: (Math.random() - 0.5) * 20,
      vy: -10,
      life: 0.4, max: 0.4,
      r: 4 + Math.random() * 4,
      color, kind: "puff",
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
      if (p.kind !== "glow") p.vy += 40 * dt;
      else p.r *= 1 + dt * 2.2;
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
      if (p.kind === "glow") {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (0.6 + a));
        g.addColorStop(0, "rgba(255,246,200,0.9)");
        g.addColorStop(0.45, "rgba(255,160,60,0.35)");
        g.addColorStop(1, "rgba(255,120,40,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.7 + a * 0.5), 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === "puff") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1.5 - a * 0.5), 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === "streak") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.atan2(p.vy, p.vx));
        ctx.fillRect(-p.r * 2.2, -p.r * 0.4, p.r * 4.4, p.r * 0.8);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.font = "800 13px Oswald, Barlow, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 3;
    for (const t of this.texts) {
      const a = Math.max(0, t.life / t.max);
      ctx.globalAlpha = a;
      ctx.strokeStyle = "#00000088";
      ctx.fillStyle = t.color;
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }
}

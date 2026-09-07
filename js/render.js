/** Fundo em camadas, entidades e suco visual. */
import { W, H, PICKUP_LABEL } from "./core.js";
import { bakeSprites, drawProp } from "./sprites.js";

const PAL = {
  tropic: { sea0: "#0b3a58", sea1: "#1a7aa0", sea2: "#3ec0c8", foam: "#c8f0f4", sky: "#7ec8e8" },
  overcast: { sea0: "#1a2a38", sea1: "#2a4458", sea2: "#4a6a78", foam: "#b0c4cc", sky: "#6a8494" },
  dusk: { sea0: "#1a1838", sea1: "#6a3060", sea2: "#d47848", foam: "#f0d0a0", sky: "#f0a060" },
  storm: { sea0: "#081018", sea1: "#163040", sea2: "#2a5060", foam: "#80c0d0", sky: "#2a4050" },
  fortress: { sea0: "#0a1018", sea1: "#1a2838", sea2: "#3a3040", foam: "#d0a070", sky: "#2a2030" },
};

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sprites = bakeSprites();
    this.islands = this._scatter(9, 0);
    this.clouds = this._scatter(11, 1);
    this.time = 0;
  }

  _scatter(n, layer) {
    const list = [];
    for (let i = 0; i < n; i++) {
      list.push({
        x: (i * 97 + layer * 40) % W,
        y: ((i * 173 + 50) % (H + 160)) - 80,
        i: i % 3,
        s: 0.7 + (i % 5) * 0.08,
      });
    }
    return list;
  }

  draw(game) {
    const ctx = this.ctx;
    this.time += 0.016;
    const pal = PAL[game.palette()] || PAL.tropic;
    const shakeX = (Math.random() - 0.5) * game.fx.shake;
    const shakeY = (Math.random() - 0.5) * game.fx.shake;

    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = pal.sea0;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(shakeX, shakeY);
    const key = game.palette();
    this._sea(ctx, pal, game.bgScroll, key);
    this._islands(ctx, game.bgScroll * 0.55, key);
    this._clouds(ctx, game.bgScroll * 0.35, pal, key);
    this._stageFX(ctx, game.bgScroll, key);

    if (game.mode !== "title" && game.mode !== "howto") {
      this._pickups(ctx, game);
      this._enemies(ctx, game);
      this._player(ctx, game);
      this._bullets(ctx, game);
      game.fx.draw(ctx);
      this._combo(ctx, game);
      this._status(ctx, game);
      this._banner(ctx, game);
    }
    ctx.restore();

    if (game.fx.flash > 0) {
      const a = game.fx.flash;
      ctx.fillStyle = `rgba(255,240,200,${a * 0.38})`;
      ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W/2, H/2, H*0.15, W/2, H/2, H*0.72);
      g.addColorStop(0, "rgba(255,200,120,0)");
      g.addColorStop(1, `rgba(255,160,40,${a * 0.22})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    if (game.fx.hurt > 0) {
      ctx.fillStyle = `rgba(200,30,20,${game.fx.hurt * 0.35})`;
      ctx.fillRect(0, 0, W, H);
    }
    {
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.78);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.28)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
    }
    if (game.player.invuln > 0 && game.mode === "playing") {
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(game.player.x + shakeX, game.player.y + shakeY, 16, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  _sea(ctx, pal, scroll, key) {
    // céu / horizonte distinto por fase
    if (key === "dusk") {
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.45);
      sky.addColorStop(0, "#2a1848");
      sky.addColorStop(0.55, "#c45838");
      sky.addColorStop(1, pal.sea0);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H * 0.42);
      ctx.fillStyle = pal.sea0;
      ctx.fillRect(0, H * 0.4, W, H);
      // sol
      ctx.fillStyle = "#ffb060";
      ctx.beginPath();
      ctx.arc(W * 0.72, H * 0.28, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#ff8040";
      ctx.beginPath();
      ctx.arc(W * 0.72, H * 0.28, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else if (key === "storm") {
      ctx.fillStyle = pal.sea0;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#0a1828";
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, W, H * 0.35);
      ctx.globalAlpha = 1;
    } else if (key === "fortress") {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#1a1428");
      g.addColorStop(0.4, pal.sea0);
      g.addColorStop(1, "#0a0810");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = pal.sea0;
      ctx.fillRect(0, 0, W, H);
      if (key === "tropic") {
        const g = ctx.createLinearGradient(0, 0, 0, H * 0.3);
        g.addColorStop(0, pal.sky);
        g.addColorStop(1, pal.sea0);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H * 0.28);
      }
    }

    const band = key === "storm" ? 0.14 : key === "tropic" ? 0.28 : 0.2;
    ctx.globalAlpha = band;
    ctx.fillStyle = pal.sea1;
    const bands = key === "tropic" ? 6 : 5;
    for (let i = 0; i < bands; i++) {
      const y = ((i * 130 + scroll * (key === "storm" ? 0.7 : 0.45)) % (H + 130)) - 65;
      ctx.fillRect(0, y, W, key === "dusk" ? 36 : 50);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.foam;
    ctx.lineWidth = key === "tropic" ? 1.4 : 1;
    const waves = key === "storm" ? 14 : 10;
    const amp = key === "storm" ? 3.2 : key === "tropic" ? 2.4 : 1.8;
    for (let i = 0; i < waves; i++) {
      const y = ((i * 64 + scroll * (key === "fortress" ? 0.55 : 0.95)) % (H + 64)) - 32;
      ctx.globalAlpha = key === "overcast" ? 0.08 : 0.12;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += key === "storm" ? 14 : 20) {
        ctx.lineTo(x, y + Math.sin(x * 0.06 + i + scroll * 0.01) * amp);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  _islands(ctx, scroll, key) {
    if (key === "storm") {
      // poucos rochedos escuros
      for (let i = 0; i < 4; i++) {
        const it = this.islands[i];
        const y = (it.y + scroll) % (H + 160) - 80;
        ctx.fillStyle = "#1a2430";
        ctx.beginPath();
        ctx.moveTo(it.x - 22, y + 18);
        ctx.lineTo(it.x - 8, y);
        ctx.lineTo(it.x + 14, y + 6);
        ctx.lineTo(it.x + 20, y + 20);
        ctx.closePath();
        ctx.fill();
      }
      return;
    }
    if (key === "fortress") {
      for (let i = 0; i < this.islands.length; i++) {
        const it = this.islands[i];
        const y = (it.y + scroll * 0.8) % (H + 180) - 90;
        const w = 40 + (i % 3) * 18;
        ctx.fillStyle = i % 2 ? "#3a3048" : "#2a2038";
        ctx.fillRect(it.x - w / 2, y, w, 14);
        ctx.fillStyle = "#e0b84a55";
        ctx.fillRect(it.x - w / 2, y, w, 2);
        ctx.fillStyle = "#ff6a4a88";
        if (i % 3 === 0) ctx.fillRect(it.x - 4, y - 10, 3, 10);
      }
      return;
    }
    if (key === "overcast") {
      for (const it of this.islands) {
        const y = (it.y + scroll) % (H + 160) - 80;
        const spr = this.sprites.island[it.i];
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.filter = "grayscale(0.7) brightness(0.75)";
        ctx.drawImage(spr, it.x - spr.width * it.s * 0.5, y, spr.width * it.s, spr.height * it.s);
        ctx.restore();
      }
      return;
    }
    if (key === "dusk") {
      for (const it of this.islands) {
        const y = (it.y + scroll) % (H + 160) - 80;
        const spr = this.sprites.island[it.i];
        ctx.save();
        ctx.filter = "brightness(0.35) sepia(0.6)";
        ctx.drawImage(spr, it.x - spr.width * it.s * 0.5, y, spr.width * it.s * 1.05, spr.height * it.s);
        ctx.restore();
      }
      return;
    }
    // tropic — ilhas verdes cheias
    for (const it of this.islands) {
      const y = (it.y + scroll) % (H + 160) - 80;
      const spr = this.sprites.island[it.i];
      ctx.drawImage(spr, it.x - spr.width * it.s * 0.5, y, spr.width * it.s, spr.height * it.s);
    }
  }

  _clouds(ctx, scroll, pal, key) {
    if (key === "fortress") return;
    let a = 0.28;
    if (key === "storm") a = 0.45;
    else if (key === "overcast") a = 0.4;
    else if (key === "dusk") a = 0.18;
    else if (key === "tropic") a = 0.22;
    ctx.globalAlpha = a;
    const spd = key === "storm" ? 1.4 : 1;
    for (const it of this.clouds) {
      const y = (it.y + scroll * spd) % (H + 180) - 90;
      const spr = this.sprites.cloud[it.i];
      if (key === "storm" || key === "overcast") {
        ctx.save();
        ctx.filter = "brightness(0.55)";
        ctx.drawImage(spr, it.x - 20, y, spr.width * 1.3, spr.height * 1.2);
        ctx.restore();
      } else if (key === "dusk") {
        ctx.save();
        ctx.filter = "sepia(0.5) hue-rotate(-20deg)";
        ctx.drawImage(spr, it.x - 20, y);
        ctx.restore();
      } else {
        ctx.drawImage(spr, it.x - 20, y);
      }
    }
    ctx.globalAlpha = 1;
  }

  _stageFX(ctx, scroll, key) {
    if (key === "storm") {
      if (Math.random() < 0.02) {
        ctx.fillStyle = "rgba(200,230,255,0.22)";
        ctx.fillRect(0, 0, W, H);
      }
      ctx.strokeStyle = "rgba(180,210,255,0.18)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 18; i++) {
        const x = (i * 37 + scroll * 2.2) % (W + 20) - 10;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 8, H);
        ctx.stroke();
      }
    } else if (key === "fortress") {
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = "#e0b84a";
      ctx.beginPath();
      ctx.moveTo(40, H);
      ctx.lineTo(80 + Math.sin(scroll * 0.02) * 40, 0);
      ctx.lineTo(140 + Math.sin(scroll * 0.02) * 40, 0);
      ctx.lineTo(90, H);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(240, H);
      ctx.lineTo(200 + Math.cos(scroll * 0.015) * 50, 0);
      ctx.lineTo(270 + Math.cos(scroll * 0.015) * 50, 0);
      ctx.lineTo(300, H);
      ctx.fill();
      ctx.restore();
      // faíscas
      ctx.fillStyle = "#ff9a4a";
      for (let i = 0; i < 6; i++) {
        const x = (i * 61 + scroll * 0.3) % W;
        const y = (i * 97 + scroll * 0.8) % H;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(x, y, 2, 2);
      }
      ctx.globalAlpha = 1;
    } else if (key === "tropic") {
      ctx.fillStyle = "rgba(255,255,200,0.04)";
      ctx.fillRect(0, 0, W, H * 0.25);
    } else if (key === "overcast") {
      ctx.fillStyle = "rgba(40,60,80,0.18)";
      ctx.fillRect(0, 0, W, H);
    } else if (key === "dusk") {
      ctx.fillStyle = "rgba(255,100,40,0.08)";
      ctx.fillRect(0, 0, W, H);
    }
  }

  _player(ctx, game) {
    const p = game.player;
    if (!p.alive) return;
    const blink = p.invuln > 0 && ((p.invuln * 12) | 0) % 2 === 0;
    if (blink && p.invuln > 0.2) ctx.globalAlpha = 0.4;
    ctx.drawImage(this.sprites.player, p.x - 16, p.y - 20);
    drawProp(ctx, p.x, p.y - 18, this.time, "rgba(240,240,220,0.5)");
    if (p.shield > 0) {
      ctx.strokeStyle = "rgba(120,200,255,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 18 + Math.sin(this.time * 6) * 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }
    const core = p.focus ? 4.2 : 2.8;
    ctx.fillStyle = p.focus ? "#fff8e0" : "#ff3d6e";
    ctx.strokeStyle = "#140810";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, core, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (p.focus) {
      ctx.strokeStyle = "rgba(255,244,180,0.85)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  _enemies(ctx, game) {
    for (const e of game.enemies) {
      if (e.dead) continue;
      const spr = this.sprites[e.kind] || this.sprites.vespa;
      if (e.flash > 0) ctx.filter = "brightness(2.4)";
      if (e.telegraph > 0) {
        const pulse = 0.45 + Math.sin(this.time * 18) * 0.2;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.strokeStyle = "#ff9a4a";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 4]);
        const ring = e.r + 12 + (0.72 - e.telegraph) * 28;
        ctx.beginPath();
        ctx.arc(e.x, e.y, ring, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = "#ff6a4a";
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r + 6, 0, Math.PI * 2);
        ctx.fill();
        if (e.attack === "aimed" || e.attack === "sweep" || e.attack === "spread") {
          ctx.globalAlpha = 0.55;
          ctx.strokeStyle = "#ffe08a";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(e.x, e.y + e.r);
          ctx.lineTo(game.player.x, game.player.y);
          ctx.stroke();
        }
        ctx.restore();
      }
      const sc = 1.35;
      const dw = spr.width * sc;
      const dh = spr.height * sc;
      ctx.drawImage(spr, e.x - dw / 2, e.y - dh / 2, dw, dh);
      ctx.filter = "none";
      if (e.kind === "vespa" || e.kind === "gaviao" || e.kind === "as" || e.kind === "artilheiro") {
        drawProp(ctx, e.x, e.y + spr.height / 2 - 4, this.time * 1.2 + e.phase, "rgba(200,200,180,0.35)");
      }
    }
  }

  _bullets(ctx, game) {
    for (const b of game.pBullets) {
      const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 8);
      glow.addColorStop(0, "rgba(255,250,200,0.9)");
      glow.addColorStop(0.5, "rgba(255,200,80,0.35)");
      glow.addColorStop(1, "rgba(255,160,40,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff8d0";
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, 2.4, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffe08a";
      ctx.fillRect(b.x - 1.1, b.y - 1, 2.2, 8);
    }
    for (const b of game.eBullets) {
      ctx.fillStyle = "#1a0610";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r + 2, 0, Math.PI * 2);
      ctx.fill();
      const eg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r + 2);
      eg.addColorStop(0, "#ffd060");
      eg.addColorStop(0.55, "#ff2a78");
      eg.addColorStop(1, "#6a0020");
      ctx.fillStyle = eg;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r + 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff0c0";
      ctx.beginPath();
      ctx.arc(b.x, b.y, Math.max(1.8, b.r * 0.38), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _pickups(ctx, game) {
    for (const u of game.pickups) {
      const bob = Math.sin(u.t * 6) * 2;
      const set = this.sprites.pickup || {};
      const spr = set[u.kind] || this.sprites.bomb;
      if (spr) {
        // sombra suave
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(u.x, u.y + bob + 12, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.drawImage(spr, u.x - spr.width / 2, u.y + bob - spr.height / 2);
      }
    }
  }

  _banner(ctx, game) {
    if (game.bannerT <= 0) return;
    const fade = game.bannerT > 0.45 ? 1 : Math.max(0, game.bannerT / 0.45);
    const boss = game.bannerKind === "boss";
    const x = 10;
    const y = 22;
    const w = W - 20;
    const h = boss ? 66 : 58;
    ctx.save();
    ctx.globalAlpha = fade;
    const g = ctx.createLinearGradient(x, y, x, y + h);
    if (boss) {
      g.addColorStop(0, "#2a1010ee");
      g.addColorStop(1, "#140808f2");
    } else {
      g.addColorStop(0, "#0c2230ee");
      g.addColorStop(1, "#061018f2");
    }
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = boss ? "#ff6a4a" : "#e0b84a";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = boss ? "#ff6a4a88" : "#e0b84a66";
    ctx.shadowBlur = 14;
    ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
    ctx.shadowBlur = 0;
    ctx.fillStyle = boss ? "#ffb0a0" : "#ffe7b3";
    ctx.font = "800 19px Oswald, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(game.banner, W / 2, y + (boss ? 28 : 26));
    ctx.fillStyle = "#f4f7fa";
    ctx.font = "700 12px Barlow, sans-serif";
    ctx.fillText(game.bannerSub || "", W / 2, y + (boss ? 50 : 46));
    ctx.restore();
  }

  _combo(ctx, game) {
    if (game.combo < 2) return;
    const label = `COMBO x${game.combo}`;
    ctx.save();
    ctx.textAlign = "right";
    ctx.font = "800 15px Oswald, sans-serif";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#00000099";
    ctx.fillStyle = "#ffe08a";
    ctx.shadowColor = "#e0b84a88";
    ctx.shadowBlur = 12;
    ctx.strokeText(label, W - 12, 36);
    ctx.fillText(label, W - 12, 36);
    ctx.restore();
  }

  _status(ctx, game) {
    if (game.mode === "title" || game.mode === "howto") return;
    const bits = [];
    if (game.player.spreadT > 0) bits.push(game.player.spread >= 5 ? "TIRO++" : "TIRO+");
    if (game.player.rapidT > 0) bits.push("RAJADA");
    if (game.player.shield > 0) bits.push(`ESCUDO ${game.player.shield}`);
    if (game.player.focus) bits.push("FOCO");
    if (!bits.length) return;
    ctx.save();
    ctx.fillStyle = "#ffe08a";
    ctx.font = "700 11px Oswald, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(bits.join(" · "), W - 10, H - 14);
    ctx.restore();
  }
}

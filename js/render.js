/** Fundo em camadas, entidades e suco visual. */
import { W, H, PICKUP_LABEL, STAGE_META } from "./core.js";
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
    this._sea(ctx, pal, game.bgScroll);
    this._islands(ctx, game.bgScroll * 0.55);
    this._clouds(ctx, game.bgScroll * 1.15, pal);
    if (game.palette() === "storm") this._lightning(ctx);
    if (game.palette() === "fortress") this._searchlights(ctx, game.bgScroll);

    if (game.mode !== "title" && game.mode !== "howto") {
      this._pickups(ctx, game);
      this._enemies(ctx, game);
      this._player(ctx, game);
      this._bullets(ctx, game);
      game.fx.draw(ctx);
      this._banner(ctx, game);
      this._combo(ctx, game);
      this._hud(ctx, game);
    }
    ctx.restore();

    if (game.fx.flash > 0) {
      ctx.fillStyle = `rgba(255,240,200,${game.fx.flash * 0.45})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (game.fx.hurt > 0) {
      ctx.fillStyle = `rgba(200,30,20,${game.fx.hurt * 0.35})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (game.player.invuln > 0 && game.mode === "playing") {
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(game.player.x + shakeX, game.player.y + shakeY, 16, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  _sea(ctx, pal, scroll) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, pal.sky);
    g.addColorStop(0.28, pal.sea2);
    g.addColorStop(0.7, pal.sea1);
    g.addColorStop(1, pal.sea0);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = pal.foam;
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i++) {
      const y = ((i * 42 + scroll * 0.8) % (H + 20)) - 10;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += 16) {
        ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 3);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = pal.foam;
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 40; i++) {
      const x = (i * 53) % W;
      const y = ((i * 91 + scroll * 1.4) % (H + 10)) - 5;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  _islands(ctx, scroll) {
    for (const it of this.islands) {
      const y = (it.y + scroll) % (H + 160) - 80;
      const spr = this.sprites.island[it.i];
      ctx.drawImage(spr, it.x - spr.width * it.s * 0.5, y, spr.width * it.s, spr.height * it.s);
    }
  }

  _clouds(ctx, scroll, pal) {
    ctx.globalAlpha = pal === PAL.storm ? 0.55 : 0.8;
    for (const it of this.clouds) {
      const y = (it.y + scroll) % (H + 180) - 90;
      const spr = this.sprites.cloud[it.i];
      ctx.drawImage(spr, it.x - 20, y);
    }
    ctx.globalAlpha = 1;
  }

  _lightning(ctx) {
    if (Math.random() < 0.012) {
      ctx.fillStyle = "rgba(200,230,255,0.18)";
      ctx.fillRect(0, 0, W, H);
    }
  }

  _searchlights(ctx, scroll) {
    ctx.save();
    ctx.globalAlpha = 0.12;
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
    ctx.globalAlpha = 1;
  }

  _enemies(ctx, game) {
    for (const e of game.enemies) {
      if (e.dead) continue;
      const spr = this.sprites[e.kind] || this.sprites.vespa;
      if (e.flash > 0) ctx.filter = "brightness(2.4)";
      if (e.telegraph > 0) {
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = "#ffe08a";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r + 10 + (0.55 - e.telegraph) * 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        if (e.attack === "aimed" || e.attack === "sweep") {
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(game.player.x, game.player.y);
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.drawImage(spr, e.x - spr.width / 2, e.y - spr.height / 2);
      ctx.filter = "none";
      if (e.kind === "vespa" || e.kind === "gaviao" || e.kind === "as" || e.kind === "artilheiro") {
        drawProp(ctx, e.x, e.y + spr.height / 2 - 4, this.time * 1.2 + e.phase, "rgba(200,200,180,0.35)");
      }
    }
  }

  _bullets(ctx, game) {
    ctx.fillStyle = "#fff4b0";
    for (const b of game.pBullets) {
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, 2.2, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffe08a";
      ctx.fillRect(b.x - 1, b.y, 2, 6);
      ctx.fillStyle = "#fff4b0";
    }
    for (const b of game.eBullets) {
      ctx.fillStyle = "#ff6a4a";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffd0c0";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _pickups(ctx, game) {
    for (const u of game.pickups) {
      const bob = Math.sin(u.t * 6) * 2;
      ctx.fillStyle = "#111c";
      ctx.beginPath();
      ctx.arc(u.x, u.y + bob + 2, 10, 0, Math.PI * 2);
      ctx.fill();
      const col =
        u.kind === "spread"
          ? "#e0b84a"
          : u.kind === "rapid"
            ? "#e85d4c"
            : u.kind === "shield"
              ? "#7ec8e3"
              : u.kind === "bomb"
                ? "#6aa0e8"
                : "#ffe08a";
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(u.x, u.y + bob - 11);
      ctx.lineTo(u.x + 11, u.y + bob);
      ctx.lineTo(u.x, u.y + bob + 11);
      ctx.lineTo(u.x - 11, u.y + bob);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#1a1208";
      ctx.font = "700 9px Oswald, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(PICKUP_LABEL[u.kind][0], u.x, u.y + bob + 3);
    }
    ctx.textAlign = "left";
  }

  _banner(ctx, game) {
    if (game.bannerT <= 0) return;
    const a = Math.min(1, game.bannerT);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = "#00000066";
    ctx.fillRect(30, 118, W - 60, 52);
    ctx.strokeStyle = "#e0b84a";
    ctx.strokeRect(30, 118, W - 60, 52);
    ctx.fillStyle = "#ffe7b3";
    ctx.font = "700 18px Oswald, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(game.banner, W / 2, 140);
    ctx.fillStyle = "#c9d4e0";
    ctx.font = "600 11px Barlow, sans-serif";
    const meta = STAGE_META[game.stageIndex];
    ctx.fillText(meta.subtitle, W / 2, 158);
    ctx.restore();
  }

  _combo(ctx, game) {
    if (game.combo < 2) return;
    ctx.fillStyle = "#ffe08a";
    ctx.font = "700 14px Oswald, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`COMBO x${game.combo}`, W - 12, 36);
    ctx.textAlign = "left";
  }

  _hud(ctx, game) {
    if (game.mode === "gameover") return;
    ctx.save();
    ctx.fillStyle = "#ffe08a";
    ctx.font = "700 13px Oswald, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(String(game.score).padStart(6, "0"), 10, 18);
    ctx.fillStyle = "#c9d4e0";
    ctx.font = "600 10px Barlow, sans-serif";
    ctx.fillText("vidas", 10, H - 14);
    for (let i = 0; i < Math.max(0, game.lives); i++) {
      ctx.drawImage(this.sprites.player, 42 + i * 16, H - 28, 14, 18);
    }
    ctx.fillText("bombas", 140, H - 14);
    ctx.fillStyle = "#6aa0e8";
    for (let i = 0; i < game.bombs; i++) {
      ctx.beginPath();
      ctx.arc(188 + i * 12, H - 18, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    if (game.player.rapidT > 0 || game.player.spreadT > 0 || game.player.shield > 0) {
      ctx.fillStyle = "#ffe08a";
      const bits = [];
      if (game.player.spreadT > 0) bits.push("Leque");
      if (game.player.rapidT > 0) bits.push("Rajada");
      if (game.player.shield > 0) bits.push(`Escudo ${game.player.shield}`);
      ctx.textAlign = "right";
      ctx.fillText(bits.join(" · "), W - 10, H - 14);
    }
    ctx.restore();
  }
}

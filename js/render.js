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
    this._sea(ctx, pal, game.bgScroll);
    this._islands(ctx, game.bgScroll * 0.55);
    this._clouds(ctx, game.bgScroll * 0.35, pal);
    if (game.palette() === "storm") this._lightning(ctx);
    if (game.palette() === "fortress") this._searchlights(ctx, game.bgScroll);

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
    ctx.fillStyle = pal.sea0;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = pal.sea1;
    for (let i = 0; i < 5; i++) {
      const y = ((i * 130 + scroll * 0.45) % (H + 130)) - 65;
      ctx.fillRect(0, y, W, 50);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.foam;
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const y = ((i * 64 + scroll * 0.95) % (H + 64)) - 32;
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += 20) {
        ctx.lineTo(x, y + Math.sin(x * 0.06 + i) * 1.8);
      }
      ctx.stroke();
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
    ctx.globalAlpha = pal === PAL.storm ? 0.22 : 0.28;
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
      ctx.fillStyle = "#1a0610";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r + 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff2a78";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffb020";
      ctx.beginPath();
      ctx.arc(b.x, b.y, Math.max(2.2, b.r * 0.42), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _pickups(ctx, game) {
    for (const u of game.pickups) {
      const bob = Math.sin(u.t * 6) * 2;
      if (u.kind === "bomb" && this.sprites.bomb) {
        const spr = this.sprites.bomb;
        ctx.drawImage(spr, u.x - spr.width / 2, u.y + bob - spr.height / 2);
        continue;
      }
      ctx.fillStyle = "#111c";
      ctx.beginPath();
      ctx.arc(u.x, u.y + bob + 2, 13, 0, Math.PI * 2);
      ctx.fill();
      const col =
        u.kind === "shot"
          ? "#fff06a"
          : u.kind === "spread"
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
      ctx.moveTo(u.x, u.y + bob - 14);
      ctx.lineTo(u.x + 14, u.y + bob);
      ctx.lineTo(u.x, u.y + bob + 14);
      ctx.lineTo(u.x - 14, u.y + bob);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#140c08";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#1a1208";
      ctx.font = "800 10px Oswald, sans-serif";
      ctx.textAlign = "center";
      const lab = PICKUP_LABEL[u.kind] || "BONUS";
      ctx.fillText(lab[0], u.x, u.y + bob + 3);
      ctx.font = "800 9px Barlow, sans-serif";
      ctx.fillStyle = "#fff8e0";
      ctx.strokeStyle = "#140c08";
      ctx.lineWidth = 3;
      ctx.strokeText(lab, u.x, u.y + bob + 24);
      ctx.fillText(lab, u.x, u.y + bob + 24);
    }
    ctx.textAlign = "left";
  }

  _banner(ctx, game) {
    if (game.bannerT <= 0) return;
    const fade = game.bannerT > 0.4 ? 1 : Math.max(0, game.bannerT / 0.4);
    const x = 12;
    const y = 26;
    const w = W - 24;
    const h = 58;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.fillStyle = "#061018";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#0c2230";
    ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
    ctx.strokeStyle = "#e0b84a";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
    ctx.fillStyle = "#ffe7b3";
    ctx.font = "700 18px Oswald, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(game.banner, W / 2, y + 26);
    ctx.fillStyle = "#f4f7fa";
    ctx.font = "700 12px Barlow, sans-serif";
    ctx.fillText(game.bannerSub || "", W / 2, y + 46);
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

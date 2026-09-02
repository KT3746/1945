/** Sprites vetoriais originais — nenhum asset de terceiros. */

function canvas(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  draw(g, w, h);
  return c;
}

function wing(g, x, y, w, h, fill, edge) {
  g.fillStyle = fill;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + w, y + h * 0.35);
  g.lineTo(x + w * 0.92, y + h);
  g.lineTo(x, y + h * 0.7);
  g.closePath();
  g.fill();
  g.strokeStyle = edge;
  g.lineWidth = 1;
  g.stroke();
}

export function bakeSprites() {
  const s = {};

  s.player = canvas(32, 40, (g) => {
    g.fillStyle = "#3d4a22";
    g.beginPath();
    g.moveTo(16, 2);
    g.lineTo(20, 14);
    g.lineTo(19, 32);
    g.lineTo(16, 38);
    g.lineTo(13, 32);
    g.lineTo(12, 14);
    g.closePath();
    g.fill();
    g.fillStyle = "#7a8c3a";
    g.beginPath();
    g.moveTo(16, 4);
    g.lineTo(19, 14);
    g.lineTo(18, 30);
    g.lineTo(16, 34);
    g.lineTo(14, 30);
    g.lineTo(13, 14);
    g.closePath();
    g.fill();
    g.fillStyle = "#4a5c28";
    g.fillRect(4, 16, 24, 6);
    g.fillStyle = "#d4c24a";
    g.fillRect(4, 16, 4, 6);
    g.fillRect(24, 16, 4, 6);
    g.fillStyle = "#b33a2a";
    g.fillRect(14, 22, 4, 5);
    g.fillStyle = "#7ec8e3";
    g.beginPath();
    g.ellipse(16, 12, 3, 4, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#e8e0c8";
    g.fillRect(15, 1, 2, 5);
    g.fillStyle = "#2a2010";
    g.fillRect(13, 34, 6, 3);
  });

  s.vespa = canvas(24, 24, (g) => {
    g.fillStyle = "#3a3f48";
    g.beginPath();
    g.moveTo(12, 22);
    g.lineTo(16, 12);
    g.lineTo(14, 4);
    g.lineTo(12, 2);
    g.lineTo(10, 4);
    g.lineTo(8, 12);
    g.closePath();
    g.fill();
    g.fillStyle = "#6a7180";
    g.fillRect(3, 10, 18, 5);
    g.fillStyle = "#c9a227";
    g.beginPath();
    g.arc(12, 11, 3, 0.4, Math.PI - 0.4);
    g.stroke();
    g.strokeStyle = "#c9a227";
    g.lineWidth = 1.5;
    g.beginPath();
    g.arc(12, 12, 3.2, 0.3, Math.PI - 0.3);
    g.stroke();
    g.fillStyle = "#8ab0c8";
    g.fillRect(11, 6, 2, 3);
  });

  s.gaviao = canvas(28, 28, (g) => {
    g.fillStyle = "#2a3340";
    g.beginPath();
    g.moveTo(14, 26);
    g.lineTo(20, 10);
    g.lineTo(14, 2);
    g.lineTo(8, 10);
    g.closePath();
    g.fill();
    g.fillStyle = "#4a5a6a";
    g.beginPath();
    g.moveTo(14, 12);
    g.lineTo(27, 8);
    g.lineTo(22, 14);
    g.lineTo(14, 16);
    g.lineTo(6, 14);
    g.lineTo(1, 8);
    g.closePath();
    g.fill();
    g.fillStyle = "#d4a017";
    g.fillRect(12, 4, 4, 4);
    g.fillStyle = "#6ec0d8";
    g.fillRect(13, 8, 2, 4);
  });

  s.bufalo = canvas(40, 28, (g) => {
    g.fillStyle = "#3a4632";
    g.fillRect(8, 8, 24, 14);
    g.fillStyle = "#5a6a44";
    g.fillRect(12, 6, 16, 8);
    g.fillStyle = "#2a3224";
    g.fillRect(4, 12, 8, 6);
    g.fillRect(28, 12, 8, 6);
    g.fillStyle = "#1a2018";
    g.beginPath();
    g.arc(8, 15, 4, 0, Math.PI * 2);
    g.arc(32, 15, 4, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#8ab0c8";
    g.fillRect(18, 8, 4, 4);
    g.fillStyle = "#b33a2a";
    g.fillRect(18, 18, 4, 3);
  });

  s.artilheiro = canvas(26, 26, (g) => {
    g.fillStyle = "#4a3a32";
    g.beginPath();
    g.moveTo(13, 24);
    g.lineTo(18, 12);
    g.lineTo(13, 3);
    g.lineTo(8, 12);
    g.closePath();
    g.fill();
    g.fillStyle = "#6a5044";
    g.fillRect(4, 11, 18, 5);
    g.fillStyle = "#222";
    g.fillRect(12, 6, 2, 8);
    g.fillStyle = "#e85d4c";
    g.fillRect(11, 4, 4, 3);
  });

  s.ninho = canvas(28, 20, (g) => {
    g.fillStyle = "#6b5a3a";
    g.beginPath();
    g.ellipse(14, 14, 12, 6, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#8a7448";
    g.beginPath();
    g.ellipse(14, 12, 9, 5, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#333";
    g.fillRect(12, 2, 4, 10);
    g.fillStyle = "#c9a227";
    g.fillRect(11, 1, 6, 3);
  });

  s.as = canvas(28, 28, (g) => {
    g.fillStyle = "#7a5a12";
    g.beginPath();
    g.moveTo(14, 26);
    g.lineTo(22, 10);
    g.lineTo(14, 2);
    g.lineTo(6, 10);
    g.closePath();
    g.fill();
    g.fillStyle = "#e0b84a";
    g.beginPath();
    g.moveTo(14, 12);
    g.lineTo(27, 7);
    g.lineTo(20, 14);
    g.lineTo(14, 16);
    g.lineTo(8, 14);
    g.lineTo(1, 7);
    g.closePath();
    g.fill();
    g.fillStyle = "#fff3c0";
    g.fillRect(13, 6, 2, 6);
  });

  s.albatroz = canvas(80, 52, (g) => {
    g.fillStyle = "#2e3844";
    g.fillRect(18, 16, 44, 18);
    g.fillStyle = "#4a5868";
    g.fillRect(8, 20, 64, 8);
    g.fillStyle = "#1a222c";
    g.beginPath();
    g.ellipse(40, 14, 18, 10, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#6ec0d8";
    g.fillRect(36, 10, 8, 6);
    g.fillStyle = "#c9a227";
    g.fillRect(10, 18, 6, 12);
    g.fillRect(64, 18, 6, 12);
    g.fillStyle = "#b33a2a";
    g.fillRect(38, 28, 4, 8);
  });

  s.sentinela = canvas(72, 56, (g) => {
    g.fillStyle = "#4a4030";
    g.fillRect(16, 22, 40, 26);
    g.fillStyle = "#6a5a3a";
    g.fillRect(24, 8, 24, 20);
    g.fillStyle = "#2a2418";
    g.fillRect(8, 28, 12, 10);
    g.fillRect(52, 28, 12, 10);
    g.fillStyle = "#333";
    g.fillRect(18, 6, 4, 16);
    g.fillRect(50, 6, 4, 16);
    g.fillStyle = "#e85d4c";
    g.fillRect(32, 12, 8, 6);
  });

  s.serpente = canvas(88, 40, (g) => {
    g.fillStyle = "#6a3a1a";
    g.beginPath();
    g.moveTo(6, 20);
    g.quadraticCurveTo(28, 4, 48, 20);
    g.quadraticCurveTo(68, 36, 84, 16);
    g.lineTo(84, 24);
    g.quadraticCurveTo(68, 44, 48, 28);
    g.quadraticCurveTo(28, 12, 6, 28);
    g.closePath();
    g.fill();
    g.fillStyle = "#c48a1a";
    g.beginPath();
    g.moveTo(8, 20);
    g.quadraticCurveTo(28, 8, 46, 20);
    g.lineTo(46, 24);
    g.quadraticCurveTo(28, 12, 8, 24);
    g.closePath();
    g.fill();
    g.fillStyle = "#e85d4c";
    g.beginPath();
    g.arc(78, 18, 6, 0, Math.PI * 2);
    g.fill();
  });

  s.tempestade = canvas(76, 76, (g) => {
    g.fillStyle = "#1a2838";
    g.beginPath();
    g.arc(38, 38, 28, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#7ec8e3";
    g.lineWidth = 3;
    g.beginPath();
    g.arc(38, 38, 22, 0, Math.PI * 1.4);
    g.stroke();
    g.fillStyle = "#4a6a88";
    g.fillRect(20, 34, 36, 8);
    g.fillStyle = "#e0b84a";
    g.beginPath();
    g.arc(38, 38, 6, 0, Math.PI * 2);
    g.fill();
  });

  s.nadir = canvas(96, 64, (g) => {
    g.fillStyle = "#2a2e38";
    g.fillRect(8, 22, 80, 22);
    g.fillStyle = "#4a5060";
    g.fillRect(20, 10, 56, 18);
    g.fillStyle = "#1a1e28";
    g.fillRect(0, 26, 16, 10);
    g.fillRect(80, 26, 16, 10);
    g.fillStyle = "#6a3040";
    g.fillRect(40, 40, 16, 12);
    g.fillStyle = "#e0b84a";
    g.fillRect(12, 18, 8, 28);
    g.fillRect(76, 18, 8, 28);
    g.fillStyle = "#7ec8e3";
    g.fillRect(44, 14, 8, 8);
    g.fillStyle = "#e85d4c";
    g.fillRect(28, 8, 4, 12);
    g.fillRect(64, 8, 4, 12);
  });

  s.island = [
    canvas(80, 48, (g) => island(g, 80, 48, "#2a6a3a", "#1a4a28")),
    canvas(64, 40, (g) => island(g, 64, 40, "#3a7a44", "#245830")),
    canvas(96, 52, (g) => island(g, 96, 52, "#2e6040", "#183c28")),
  ];

  s.cloud = [
    canvas(70, 28, (g) => cloud(g, 70, 28, "rgba(255,255,255,0.55)")),
    canvas(50, 22, (g) => cloud(g, 50, 22, "rgba(255,255,255,0.4)")),
    canvas(90, 30, (g) => cloud(g, 90, 30, "rgba(255,255,255,0.35)")),
  ];

  return s;
}

function island(g, w, h, top, bottom) {
  g.fillStyle = bottom;
  g.beginPath();
  g.ellipse(w / 2, h * 0.62, w * 0.46, h * 0.32, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = top;
  g.beginPath();
  g.ellipse(w / 2, h * 0.5, w * 0.38, h * 0.28, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1a3a20";
  g.fillRect(w * 0.3, h * 0.18, 4, 12);
  g.fillRect(w * 0.55, h * 0.12, 5, 16);
  g.fillStyle = "#245c30";
  g.beginPath();
  g.arc(w * 0.3 + 2, h * 0.18, 7, 0, Math.PI * 2);
  g.arc(w * 0.55 + 2, h * 0.12, 9, 0, Math.PI * 2);
  g.fill();
}

function cloud(g, w, h, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.ellipse(w * 0.3, h * 0.6, w * 0.22, h * 0.32, 0, 0, Math.PI * 2);
  g.ellipse(w * 0.52, h * 0.45, w * 0.28, h * 0.4, 0, 0, Math.PI * 2);
  g.ellipse(w * 0.72, h * 0.6, w * 0.2, h * 0.3, 0, 0, Math.PI * 2);
  g.fill();
}

export function drawProp(ctx, x, y, t, color = "rgba(220,220,200,0.45)") {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(t * 28);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(8, 0);
  ctx.moveTo(0, -7);
  ctx.lineTo(0, 7);
  ctx.stroke();
  ctx.restore();
}

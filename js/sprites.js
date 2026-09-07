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
    // sombra
    g.fillStyle = "#00000044";
    g.beginPath();
    g.ellipse(16, 38, 8, 2.5, 0, 0, Math.PI * 2);
    g.fill();
    // fuselagem escura
    g.fillStyle = "#2a3418";
    g.beginPath();
    g.moveTo(16, 1);
    g.lineTo(21, 13);
    g.lineTo(20, 31);
    g.lineTo(16, 39);
    g.lineTo(12, 31);
    g.lineTo(11, 13);
    g.closePath();
    g.fill();
    // painel claro
    const body = g.createLinearGradient(16, 2, 16, 34);
    body.addColorStop(0, "#9aaa4a");
    body.addColorStop(0.5, "#6a7c32");
    body.addColorStop(1, "#3a4a20");
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(16, 3);
    g.lineTo(19.5, 13);
    g.lineTo(18.5, 30);
    g.lineTo(16, 35);
    g.lineTo(13.5, 30);
    g.lineTo(12.5, 13);
    g.closePath();
    g.fill();
    // asas
    g.fillStyle = "#4a5c28";
    g.fillRect(3, 15, 26, 7);
    g.fillStyle = "#d4c24a";
    g.fillRect(3, 15, 5, 7);
    g.fillRect(24, 15, 5, 7);
    g.fillStyle = "#1a2010";
    g.fillRect(8, 17, 16, 1);
    // estrela / marca
    g.fillStyle = "#b33a2a";
    g.fillRect(14, 21, 4, 5);
    g.fillStyle = "#ffe08a";
    g.fillRect(15, 22, 2, 3);
    // cockpit
    const ck = g.createRadialGradient(16, 11, 0, 16, 11, 5);
    ck.addColorStop(0, "#d8f0ff");
    ck.addColorStop(0.6, "#5aa8d0");
    ck.addColorStop(1, "#2a6080");
    g.fillStyle = ck;
    g.beginPath();
    g.ellipse(16, 11, 3.2, 4.2, 0, 0, Math.PI * 2);
    g.fill();
    // nariz
    g.fillStyle = "#f0e8d0";
    g.fillRect(15, 0, 2, 5);
    // escapamento
    g.fillStyle = "#1a1408";
    g.fillRect(13, 34, 6, 3);
    const eg = g.createRadialGradient(16, 37, 0, 16, 38, 9);
    eg.addColorStop(0, "rgba(180,240,255,0.95)");
    eg.addColorStop(0.4, "rgba(80,170,255,0.45)");
    eg.addColorStop(1, "rgba(40,100,255,0)");
    g.fillStyle = eg;
    g.beginPath();
    g.arc(16, 38, 9, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#fff0a0";
    g.fillRect(15, 35, 2, 4);
  });

  s.vespa = canvas(24, 24, (g) => {
    g.fillStyle = "#5a1820";
    g.beginPath();
    g.moveTo(12, 22);
    g.lineTo(16, 12);
    g.lineTo(14, 4);
    g.lineTo(12, 2);
    g.lineTo(10, 4);
    g.lineTo(8, 12);
    g.closePath();
    g.fill();
    g.fillStyle = "#c43a28";
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
    g.fillStyle = "#4a1018";
    g.beginPath();
    g.moveTo(14, 26);
    g.lineTo(20, 10);
    g.lineTo(14, 2);
    g.lineTo(8, 10);
    g.closePath();
    g.fill();
    g.fillStyle = "#e85d2a";
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
    g.fillStyle = "#3a1810";
    g.fillRect(8, 8, 24, 14);
    g.fillStyle = "#c45a20";
    g.fillRect(12, 6, 16, 8);
    g.fillStyle = "#1a0c08";
    g.fillRect(4, 12, 8, 6);
    g.fillRect(28, 12, 8, 6);
    g.fillStyle = "#0a0604";
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
    g.fillStyle = "#6a2010";
    g.beginPath();
    g.moveTo(13, 24);
    g.lineTo(18, 12);
    g.lineTo(13, 3);
    g.lineTo(8, 12);
    g.closePath();
    g.fill();
    g.fillStyle = "#e07030";
    g.fillRect(4, 11, 18, 5);
    g.fillStyle = "#222";
    g.fillRect(12, 6, 2, 8);
    g.fillStyle = "#e85d4c";
    g.fillRect(11, 4, 4, 3);
  });

  s.ninho = canvas(28, 20, (g) => {
    g.fillStyle = "#8a3018";
    g.beginPath();
    g.ellipse(14, 14, 12, 6, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#e09040";
    g.beginPath();
    g.ellipse(14, 12, 9, 5, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#333";
    g.fillRect(12, 2, 4, 10);
    g.fillStyle = "#c9a227";
    g.fillRect(11, 1, 6, 3);
  });

  s.as = canvas(28, 28, (g) => {
    g.fillStyle = "#8a2008";
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
    g.fillStyle = "#3a1420";
    g.fillRect(18, 16, 44, 18);
    g.fillStyle = "#d45028";
    g.fillRect(8, 20, 64, 8);
    g.fillStyle = "#1a080c";
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
    g.fillStyle = "#5a1810";
    g.fillRect(16, 22, 40, 26);
    g.fillStyle = "#e08030";
    g.fillRect(24, 8, 24, 20);
    g.fillStyle = "#1a0808";
    g.fillRect(8, 28, 12, 10);
    g.fillRect(52, 28, 12, 10);
    g.fillStyle = "#333";
    g.fillRect(18, 6, 4, 16);
    g.fillRect(50, 6, 4, 16);
    g.fillStyle = "#e85d4c";
    g.fillRect(32, 12, 8, 6);
  });

  s.serpente = canvas(88, 40, (g) => {
    g.fillStyle = "#8a1808";
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
    g.fillStyle = "#2a0810";
    g.beginPath();
    g.arc(38, 38, 28, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#7ec8e3";
    g.lineWidth = 3;
    g.beginPath();
    g.arc(38, 38, 22, 0, Math.PI * 1.4);
    g.stroke();
    g.fillStyle = "#c04020";
    g.fillRect(20, 34, 36, 8);
    g.fillStyle = "#e0b84a";
    g.beginPath();
    g.arc(38, 38, 6, 0, Math.PI * 2);
    g.fill();
  });

  s.nadir = canvas(96, 64, (g) => {
    g.fillStyle = "#3a1018";
    g.fillRect(8, 22, 80, 22);
    g.fillStyle = "#d45828";
    g.fillRect(20, 10, 56, 18);
    g.fillStyle = "#12060a";
    g.fillRect(0, 26, 16, 10);
    g.fillRect(80, 26, 16, 10);
    g.fillStyle = "#e04020";
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

  // Ícones de power-up (sem texto) — estilo shmup clássico
  s.pickup = {};
  s.pickup.shot = canvas(32, 32, (g) => {
    g.fillStyle = "#0a1820";
    g.beginPath(); g.arc(16, 16, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#ffe08a";
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#c48a1a";
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#1a1208";
    g.beginPath();
    g.moveTo(16, 6); g.lineTo(20, 18); g.lineTo(16, 15); g.lineTo(12, 18);
    g.closePath(); g.fill();
    g.fillStyle = "#fff6c8";
    g.fillRect(15, 8, 2, 10);
  });
  s.pickup.spread = canvas(32, 32, (g) => {
    g.fillStyle = "#0a1820";
    g.beginPath(); g.arc(16, 16, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#e0b84a";
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#1a1208"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#1a1208";
    for (const [dx, rot] of [[0, 0], [-7, -0.45], [7, 0.45]]) {
      g.save();
      g.translate(16 + dx, 17);
      g.rotate(rot);
      g.beginPath();
      g.moveTo(0, -8); g.lineTo(3, 4); g.lineTo(0, 2); g.lineTo(-3, 4);
      g.closePath(); g.fill();
      g.restore();
    }
  });
  s.pickup.rapid = canvas(32, 32, (g) => {
    g.fillStyle = "#0a1820";
    g.beginPath(); g.arc(16, 16, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#e85d4c";
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#1a1208"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#fff0c0";
    g.beginPath();
    g.moveTo(11, 7); g.lineTo(20, 14); g.lineTo(15, 14); g.lineTo(19, 25);
    g.lineTo(10, 16); g.lineTo(15, 16); g.closePath(); g.fill();
  });
  s.pickup.shield = canvas(32, 32, (g) => {
    g.fillStyle = "#0a1820";
    g.beginPath(); g.arc(16, 16, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#5ec0e8";
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#1a1208"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#e8f7ff";
    g.beginPath();
    g.moveTo(16, 7);
    g.quadraticCurveTo(24, 10, 23, 18);
    g.quadraticCurveTo(16, 26, 16, 26);
    g.quadraticCurveTo(16, 26, 9, 18);
    g.quadraticCurveTo(8, 10, 16, 7);
    g.fill();
    g.fillStyle = "#3a90c0";
    g.beginPath();
    g.moveTo(16, 10);
    g.quadraticCurveTo(21, 12, 20, 17);
    g.quadraticCurveTo(16, 22, 16, 22);
    g.quadraticCurveTo(16, 22, 12, 17);
    g.quadraticCurveTo(11, 12, 16, 10);
    g.fill();
  });
  s.pickup.bomb = canvas(32, 32, (g) => {
    g.fillStyle = "#0a1820";
    g.beginPath(); g.arc(16, 16, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#4a90d8";
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#1a1208"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#1a2838";
    g.beginPath(); g.arc(16, 18, 7, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#9ad4ff";
    g.beginPath(); g.arc(13, 15, 2, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#e0b84a"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(16, 10); g.quadraticCurveTo(20, 6, 18, 4); g.stroke();
    g.fillStyle = "#e85d4c";
    g.beginPath(); g.arc(18, 4, 2, 0, Math.PI * 2); g.fill();
  });
  s.pickup.medal = canvas(32, 32, (g) => {
    g.fillStyle = "#0a1820";
    g.beginPath(); g.arc(16, 16, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#ffe08a";
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#1a1208"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#c48a1a";
    g.beginPath();
    const R = 8, r = 3.5;
    g.moveTo(16, 16 - R);
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 === 0 ? R : r;
      g.lineTo(16 + Math.cos(a) * rad, 16 + Math.sin(a) * rad);
    }
    g.closePath(); g.fill();
  });
  s.bomb = s.pickup.bomb;

  s.island = [
    canvas(80, 48, (g) => island(g, 80, 48, "#2a6a3a", "#1a4a28")),
    canvas(64, 40, (g) => island(g, 64, 40, "#3a7a44", "#245830")),
    canvas(96, 52, (g) => island(g, 96, 52, "#2e6040", "#183c28")),
  ];
  s.islandPalm = [
    canvas(72, 64, (g) => palmIsle(g, 72, 64)),
    canvas(88, 70, (g) => palmIsle(g, 88, 70)),
    canvas(60, 56, (g) => palmIsle(g, 60, 56)),
  ];
  s.islandRock = [
    canvas(70, 40, (g) => rockIsle(g, 70, 40, "#4a5560", "#2a3038")),
    canvas(90, 48, (g) => rockIsle(g, 90, 48, "#5a6570", "#303840")),
    canvas(56, 34, (g) => rockIsle(g, 56, 34, "#3a4450", "#1a2028")),
  ];
  s.islandDusk = [
    canvas(80, 44, (g) => rockIsle(g, 80, 44, "#2a1830", "#140818")),
    canvas(100, 50, (g) => rockIsle(g, 100, 50, "#3a2040", "#1a1020")),
    canvas(64, 36, (g) => rockIsle(g, 64, 36, "#241828", "#100810")),
  ];
  s.plat = [
    canvas(96, 28, (g) => fortressPlat(g, 96, 28)),
    canvas(70, 22, (g) => fortressPlat(g, 70, 22)),
    canvas(110, 30, (g) => fortressPlat(g, 110, 30)),
  ];
  s.cloud = [
    canvas(70, 28, (g) => cloud(g, 70, 28, "rgba(255,255,255,0.55)")),
    canvas(50, 22, (g) => cloud(g, 50, 22, "rgba(255,255,255,0.4)")),
    canvas(90, 30, (g) => cloud(g, 90, 30, "rgba(255,255,255,0.35)")),
  ];
  s.cloudDark = [
    canvas(90, 36, (g) => cloud(g, 90, 36, "rgba(40,50,70,0.7)")),
    canvas(110, 40, (g) => cloud(g, 110, 40, "rgba(30,40,55,0.65)")),
    canvas(70, 30, (g) => cloud(g, 70, 30, "rgba(50,60,80,0.6)")),
  ];
  s.cloudDusk = [
    canvas(80, 30, (g) => cloud(g, 80, 30, "rgba(180,90,70,0.45)")),
    canvas(100, 34, (g) => cloud(g, 100, 34, "rgba(160,70,90,0.4)")),
    canvas(60, 26, (g) => cloud(g, 60, 26, "rgba(200,110,60,0.35)")),
  ];

  return s;
}

function island(g, w, h, top, bottom) {
  // areia
  g.fillStyle = "#d2c08a";
  g.beginPath();
  g.ellipse(w * 0.5, h * 0.62, w * 0.46, h * 0.32, 0, 0, Math.PI * 2);
  g.fill();
  // terra
  g.fillStyle = top;
  g.beginPath();
  g.ellipse(w * 0.5, h * 0.55, w * 0.38, h * 0.26, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = bottom;
  g.beginPath();
  g.ellipse(w * 0.5, h * 0.58, w * 0.3, h * 0.18, 0, 0, Math.PI * 2);
  g.fill();
  // vegetação simples
  g.fillStyle = "#1f5a28";
  for (let i = 0; i < 4; i++) {
    const tx = w * (0.28 + i * 0.14);
    const ty = h * 0.42;
    g.beginPath();
    g.moveTo(tx, ty + 8);
    g.lineTo(tx - 4, ty);
    g.lineTo(tx + 4, ty);
    g.fill();
  }
}

function cloud(g, w, h, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.ellipse(w * 0.35, h * 0.55, w * 0.28, h * 0.35, 0, 0, Math.PI * 2);
  g.ellipse(w * 0.55, h * 0.5, w * 0.32, h * 0.38, 0, 0, Math.PI * 2);
  g.ellipse(w * 0.72, h * 0.58, w * 0.22, h * 0.28, 0, 0, Math.PI * 2);
  g.fill();
}


function palmIsle(g, w, h) {
  g.fillStyle = "#d8c078";
  g.beginPath();
  g.ellipse(w * 0.5, h * 0.78, w * 0.42, h * 0.16, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#2e8a48";
  g.beginPath();
  g.ellipse(w * 0.5, h * 0.68, w * 0.34, h * 0.14, 0, 0, Math.PI * 2);
  g.fill();
  // tronco
  g.fillStyle = "#6a4420";
  g.fillRect(w * 0.46, h * 0.28, w * 0.08, h * 0.4);
  // folhas
  g.strokeStyle = "#1f7a38";
  g.lineWidth = 3;
  for (let i = -2; i <= 2; i++) {
    g.beginPath();
    g.moveTo(w * 0.5, h * 0.3);
    g.quadraticCurveTo(w * 0.5 + i * 14, h * 0.18, w * 0.5 + i * 22, h * 0.34);
    g.stroke();
  }
  g.fillStyle = "#c9a227";
  g.beginPath();
  g.arc(w * 0.42, h * 0.42, 2, 0, Math.PI * 2);
  g.arc(w * 0.58, h * 0.44, 2, 0, Math.PI * 2);
  g.fill();
}

function rockIsle(g, w, h, top, bottom) {
  g.fillStyle = bottom;
  g.beginPath();
  g.moveTo(w * 0.08, h * 0.85);
  g.lineTo(w * 0.2, h * 0.4);
  g.lineTo(w * 0.45, h * 0.22);
  g.lineTo(w * 0.7, h * 0.35);
  g.lineTo(w * 0.92, h * 0.8);
  g.closePath();
  g.fill();
  g.fillStyle = top;
  g.beginPath();
  g.moveTo(w * 0.18, h * 0.7);
  g.lineTo(w * 0.35, h * 0.32);
  g.lineTo(w * 0.55, h * 0.28);
  g.lineTo(w * 0.78, h * 0.65);
  g.closePath();
  g.fill();
  g.fillStyle = "#ffffff22";
  g.fillRect(w * 0.4, h * 0.35, 4, 3);
}

function fortressPlat(g, w, h) {
  g.fillStyle = "#2a2438";
  g.fillRect(2, h * 0.35, w - 4, h * 0.45);
  g.fillStyle = "#4a4060";
  g.fillRect(0, h * 0.28, w, 5);
  g.fillStyle = "#e0b84a";
  g.fillRect(4, h * 0.28, w - 8, 2);
  g.fillStyle = "#ff6a4a";
  g.fillRect(w * 0.2, 2, 3, h * 0.28);
  g.fillRect(w * 0.7, 4, 3, h * 0.24);
  g.fillStyle = "#9ad4ff55";
  g.fillRect(w * 0.4, h * 0.5, w * 0.2, 4);
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

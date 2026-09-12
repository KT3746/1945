/** Roteiros dos 5 estágios — cada fase com identidade própria de combate. */

function e(at, spawn, extra = {}) {
  return { at, spawn, ...extra };
}

export const STAGES = [
  {
    // Mar de Vidro — treinamento: linhas leves, sine, poucos swoops
    boss: "albatroz",
    waves: [
      e(1.0, "line", { kind: "vespa", n: 3, x0: 60, gap: 100, pattern: "down" }),
      e(4.0, "line", { kind: "vespa", n: 4, x0: 48, gap: 88, pattern: "sine" }),
      e(7.5, "diag", { kind: "vespa", n: 5, from: "left" }),
      e(11.0, "swoop", { kind: "gaviao", n: 2, side: "left" }),
      e(14.5, "line", { kind: "vespa", n: 5, x0: 40, gap: 70, pattern: "sine" }),
      e(18.0, "single", { kind: "as", x: 180, pattern: "hover" }),
      e(21.0, "v", { kind: "vespa", n: 5 }),
      e(24.5, "swoop", { kind: "gaviao", n: 2, side: "right" }),
      e(27.5, "single", { kind: "bufalo", x: 180, pattern: "down" }),
      e(30.5, "line", { kind: "artilheiro", n: 2, x0: 90, gap: 180, pattern: "aim" }),
      e(33.5, "diag", { kind: "vespa", n: 6, from: "right" }),
      e(36.0, "boss", { kind: "albatroz" }),
    ],
  },
  {
    // Arquipélago Cinza — costa: ninhos + artilheiros, pressão do chão
    boss: "sentinela",
    waves: [
      e(0.6, "ground", { kind: "ninho", x: 60 }),
      e(0.6, "ground", { kind: "ninho", x: 300 }),
      e(1.8, "line", { kind: "artilheiro", n: 3, x0: 70, gap: 110, pattern: "aim" }),
      e(4.5, "ground", { kind: "ninho", x: 180 }),
      e(5.5, "line", { kind: "vespa", n: 5, x0: 40, gap: 60, pattern: "down" }),
      e(8.5, "wall", { kind: "artilheiro", n: 4, y: -20 }),
      e(11.5, "swoop", { kind: "gaviao", n: 3, side: "left" }),
      e(14.0, "ground", { kind: "ninho", x: 100 }),
      e(14.2, "ground", { kind: "ninho", x: 260 }),
      e(16.0, "line", { kind: "bufalo", n: 2, x0: 100, gap: 160, pattern: "down" }),
      e(19.0, "v", { kind: "artilheiro", n: 5 }),
      e(21.5, "rain", { kind: "vespa", n: 8 }),
      e(24.5, "ground", { kind: "ninho", x: 180 }),
      e(26.0, "boss", { kind: "sentinela" }),
    ],
  },
  {
    // Estreito de Bronze — frota: búfalos + ases, paredes densas
    boss: "serpente",
    waves: [
      e(0.8, "wall", { kind: "vespa", n: 6, y: -18 }),
      e(3.5, "single", { kind: "bufalo", x: 90, pattern: "down" }),
      e(4.0, "single", { kind: "bufalo", x: 180, pattern: "down" }),
      e(4.5, "single", { kind: "bufalo", x: 270, pattern: "down" }),
      e(7.5, "single", { kind: "as", x: 120, pattern: "hover" }),
      e(8.5, "single", { kind: "as", x: 240, pattern: "sine" }),
      e(11.0, "swoop", { kind: "gaviao", n: 4, side: "right" }),
      e(14.0, "line", { kind: "artilheiro", n: 3, x0: 80, gap: 100, pattern: "aim" }),
      e(17.0, "pinch", { kind: "gaviao", n: 4 }),
      e(20.0, "wall", { kind: "bufalo", n: 3, y: -24 }),
      e(23.0, "v", { kind: "vespa", n: 7 }),
      e(26.0, "single", { kind: "as", x: 180, pattern: "hover" }),
      e(28.5, "boss", { kind: "serpente" }),
    ],
  },
  {
    // Cânion de Nuvens — caos aéreo: mergulhos e swoops
    boss: "tempestade",
    waves: [
      e(0.5, "swoop", { kind: "gaviao", n: 5, side: "left" }),
      e(1.2, "swoop", { kind: "gaviao", n: 5, side: "right" }),
      e(4.0, "line", { kind: "gaviao", n: 5, x0: 40, gap: 70, pattern: "dive" }),
      e(6.5, "pinch", { kind: "gaviao", n: 6 }),
      e(9.0, "rain", { kind: "vespa", n: 10 }),
      e(11.5, "single", { kind: "as", x: 100, pattern: "hover" }),
      e(12.2, "single", { kind: "as", x: 260, pattern: "sine" }),
      e(14.5, "swoop", { kind: "gaviao", n: 6, side: "left" }),
      e(15.2, "swoop", { kind: "gaviao", n: 6, side: "right" }),
      e(18.0, "line", { kind: "artilheiro", n: 4, x0: 50, gap: 80, pattern: "aim" }),
      e(20.5, "diag", { kind: "gaviao", n: 6, from: "left" }),
      e(23.0, "ground", { kind: "ninho", x: 60 }),
      e(23.2, "ground", { kind: "ninho", x: 180 }),
      e(23.4, "ground", { kind: "ninho", x: 300 }),
      e(26.0, "boss", { kind: "tempestade" }),
    ],
  },
  {
    // Fortaleza — industrial: grade de artilharia + plataformas + ases
    boss: "nadir",
    waves: [
      e(0.8, "wall", { kind: "artilheiro", n: 5, y: -20 }),
      e(3.0, "ground", { kind: "ninho", x: 70 }),
      e(3.2, "ground", { kind: "ninho", x: 290 }),
      e(5.0, "line", { kind: "vespa", n: 6, x0: 40, gap: 52, pattern: "down" }),
      e(8.0, "single", { kind: "as", x: 90, pattern: "hover" }),
      e(8.6, "single", { kind: "as", x: 270, pattern: "hover" }),
      e(11.0, "wall", { kind: "bufalo", n: 3, y: -22 }),
      e(14.0, "ground", { kind: "ninho", x: 120 }),
      e(14.2, "ground", { kind: "ninho", x: 240 }),
      e(16.0, "v", { kind: "artilheiro", n: 6 }),
      e(19.0, "pinch", { kind: "gaviao", n: 5 }),
      e(22.0, "line", { kind: "bufalo", n: 2, x0: 80, gap: 200, pattern: "down" }),
      e(24.5, "rain", { kind: "vespa", n: 9 }),
      e(27.0, "single", { kind: "as", x: 180, pattern: "hover" }),
      e(27.8, "wall", { kind: "artilheiro", n: 5, y: -18 }),
      e(31.0, "boss", { kind: "nadir" }),
    ],
  },
];

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clamp,
  circleHit,
  scoreKill,
  extraLifeEarned,
  lerp,
  fireIntervalScale,
  vespaFires,
  softenShot,
} from "../js/core.js";

test("clamp limita o valor", () => {
  assert.equal(clamp(5, 0, 3), 3);
  assert.equal(clamp(-2, 0, 3), 0);
  assert.equal(clamp(1, 0, 3), 1);
});

test("colisão circular justa", () => {
  assert.equal(circleHit(0, 0, 5, 8, 0, 4), true);
  assert.equal(circleHit(0, 0, 5, 20, 0, 4), false);
});

test("combo aumenta a pontuação", () => {
  const a = scoreKill(100, 1, 0);
  const b = scoreKill(100, 5, 0);
  assert.ok(b > a);
});

test("vida extra nos marcos", () => {
  assert.equal(extraLifeEarned(19999, 20000), 1);
  assert.equal(extraLifeEarned(0, 100), 0);
});

test("lerp interpola", () => {
  assert.equal(lerp(0, 10, 0.5), 5);
});

test("começo do jogo atira bem mais devagar", () => {
  const early = fireIntervalScale(0, 0, 10);
  const late = fireIntervalScale(3, 0, 200);
  assert.ok(early > 2.5);
  assert.ok(late === 1);
  assert.ok(early > fireIntervalScale(1, 0, 80));
});

test("vespas do estágio 1 quase não atiram", () => {
  assert.equal(vespaFires(0, 0, 0), true);
  assert.equal(vespaFires(0, 0, 1), false);
  assert.equal(vespaFires(0, 0, 2), false);
  assert.equal(vespaFires(2, 0, 1), true);
});

test("tiros mirados viram tiro reto no Mar de Vidro", () => {
  assert.equal(softenShot("gaviao", "aim", 0, 0), "down");
  assert.equal(softenShot("bufalo", "spread", 0, 0), "down");
  assert.equal(softenShot("gaviao", "aim", 2, 0), "aim");
});

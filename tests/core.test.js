import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clamp,
  circleHit,
  scoreKill,
  extraLifeEarned,
  lerp,
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

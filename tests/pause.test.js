import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../js/game.js";
import { START_BOMBS } from "../js/core.js";

if (typeof globalThis.localStorage === "undefined") {
  const mem = new Map();
  globalThis.localStorage = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
  };
}

function silentAudio() {
  const n = () => {};
  return {
    shoot: n,
    enemyShot: n,
    explosion: n,
    bigBoom: n,
    hit: n,
    hurt: n,
    pickup: n,
    ui: n,
    warning: n,
    stage: n,
    gameover: n,
    extraLife: n,
  };
}

function fakeInput(over = {}) {
  return {
    moveX: 0,
    moveY: 0,
    fireHeld: false,
    focusHeld: false,
    _bomb: false,
    cleared: false,
    consumeBomb() {
      const v = this._bomb;
      this._bomb = false;
      return v;
    },
    clearPlay() {
      this.cleared = true;
      this.fireHeld = false;
      this._bomb = false;
      this.moveX = 0;
      this.moveY = 0;
    },
    ...over,
  };
}

test("na pausa não gasta bomba nem dispara tiro na fila", () => {
  const game = new Game(silentAudio());
  game.start(0);
  assert.equal(game.bombs, START_BOMBS);
  const input = fakeInput({ fireHeld: true, _bomb: true });
  game.pause();
  game.update(0.05, input);
  assert.equal(game.mode, "paused");
  assert.equal(game.bombs, START_BOMBS);
  assert.equal(game.pBullets.length, 0);
  assert.equal(input.cleared, true);
  assert.equal(input.fireHeld, false);
  assert.equal(input._bomb, false);
});

test("Continuar com input limpo não solta bomba atrasada", () => {
  const game = new Game(silentAudio());
  game.start(0);
  const input = fakeInput({ fireHeld: true, _bomb: true });
  game.pause();
  game.update(0.016, input);
  input.clearPlay();
  game.resume();
  game.update(0.016, input);
  assert.equal(game.mode, "playing");
  assert.equal(game.bombs, START_BOMBS);
  assert.equal(game.pBullets.length, 0);
});

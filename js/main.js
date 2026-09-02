import { VERSION } from "./version.js";
import { AudioSys } from "./audio.js";
import { Input } from "./input.js";
import { Game } from "./game.js";
import { Renderer } from "./render.js";
import { UI } from "./ui.js";

const audio = new AudioSys();
const input = new Input();
const game = new Game(audio);
const canvas = document.getElementById("game");
const renderer = new Renderer(canvas);
const ui = new UI(game, audio, input);

let last = performance.now();
let lastMode = game.mode;

function frame(now) {
  const raw = (now - last) / 1000;
  last = now;
  const dt = Math.min(0.05, Math.max(0, raw));

  input.poll();
  if (input.consumePause()) {
    audio.unlock();
    ui.togglePause();
  }

  if (game.mode !== "playing") {
    input.playLocked = true;
    input.clearPlay();
  } else {
    input.playLocked = false;
  }

  game.update(dt, input);
  audio.update(dt);
  audio.setIntense(game.boss && game.mode === "playing" ? 1 : 0);
  renderer.draw(game);

  if (game.mode !== lastMode) {
    ui.onMode();
    lastMode = game.mode;
  }
  ui.refresh();

  requestAnimationFrame(frame);
}

window.addEventListener(
  "pointerdown",
  () => {
    audio.unlock();
  },
  { once: false }
);

requestAnimationFrame(frame);

document.title = `Céu de Aço`;
void VERSION;

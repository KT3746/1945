/** Telas (título, como jogar, pausa, vitória, game over) e HUD. */
import { STAGE_META, BOSS_NAMES } from "./core.js";
import { VERSION } from "./version.js";

export class UI {
  constructor(game, audio) {
    this.game = game;
    this.audio = audio;
    this.els = {
      title: document.getElementById("screen-title"),
      howto: document.getElementById("screen-howto"),
      pause: document.getElementById("screen-pause"),
      stage: document.getElementById("screen-stage"),
      over: document.getElementById("screen-over"),
      score: document.getElementById("stat-score"),
      high: document.getElementById("stat-high"),
      lives: document.getElementById("stat-lives"),
      bombs: document.getElementById("stat-bombs"),
      chip: document.getElementById("stage-chip"),
      titleHigh: document.getElementById("title-high"),
      overScore: document.getElementById("over-score"),
      overHigh: document.getElementById("over-high"),
      stageH: document.getElementById("stage-h"),
      stageText: document.getElementById("stage-text"),
      stageScore: document.getElementById("stage-score"),
      stageEyebrow: document.getElementById("stage-eyebrow"),
      bossBar: document.getElementById("boss-bar"),
      bossName: document.getElementById("boss-name"),
      bossFill: document.getElementById("boss-fill"),
      mute: document.getElementById("btn-mute"),
      pauseBtn: document.getElementById("btn-pause"),
      ver: document.getElementById("ver"),
    };
    if (this.els.ver) this.els.ver.textContent = `v${VERSION}`;
    this._bind();
    this._syncMute();
    this.show("title");
  }

  _bind() {
    const g = this.game;
    const a = this.audio;
    const go = (fn) => (ev) => {
      ev.preventDefault();
      a.unlock();
      a.ui();
      fn();
    };

    document.getElementById("btn-play").addEventListener("click", go(() => this._play()));
    document.getElementById("btn-howto").addEventListener("click", go(() => this.show("howto")));
    document.getElementById("btn-howto-go").addEventListener("click", go(() => this._play()));
    document.getElementById("btn-howto-back").addEventListener("click", go(() => this.show("title")));
    document.getElementById("btn-resume").addEventListener("click", go(() => this.resume()));
    document.getElementById("btn-restart").addEventListener("click", go(() => this._play()));
    document.getElementById("btn-menu").addEventListener("click", go(() => this.toTitle()));
    document.getElementById("btn-next").addEventListener("click", go(() => this.next()));
    document.getElementById("btn-again").addEventListener("click", go(() => this._play()));
    document.getElementById("btn-over-menu").addEventListener("click", go(() => this.toTitle()));
    this.els.mute.addEventListener("click", go(() => {
      a.unlock();
      const m = a.toggleMute();
      this._syncMute();
      void m;
    }));
    this.els.pauseBtn.addEventListener("click", go(() => this.togglePause()));
  }

  _play() {
    const q = new URLSearchParams(location.search);
    const st = Number(q.get("stage") || 0);
    this.game.start(Number.isFinite(st) ? st : 0);
    this.show(null);
    this.refresh();
  }

  toTitle() {
    this.game.mode = "title";
    this.game.resetRun();
    this.show("title");
    this.refresh();
  }

  resume() {
    this.game.resume();
    this.show(null);
  }

  togglePause() {
    if (this.game.mode === "playing") {
      this.game.pause();
      this.show("pause");
    } else if (this.game.mode === "paused") {
      this.resume();
    }
  }

  next() {
    this.game.nextStage();
    this.show(null);
  }

  show(name) {
    const map = {
      title: this.els.title,
      howto: this.els.howto,
      pause: this.els.pause,
      stage: this.els.stage,
      over: this.els.over,
    };
    for (const [k, el] of Object.entries(map)) {
      el.classList.toggle("hidden", k !== name);
    }
  }

  _syncMute() {
    this.els.mute.textContent = this.audio.muted ? "Mudo" : "Som";
    this.els.mute.setAttribute("aria-pressed", this.audio.muted ? "true" : "false");
  }

  onMode() {
    const m = this.game.mode;
    if (m === "stageclear") {
      const looped = this.game.stageIndex === 4;
      const meta = STAGE_META[this.game.stageIndex];
      this.els.stageEyebrow.textContent = this.game.loop && this.game.stageIndex === 4
        ? "Ciclo completo"
        : "Estágio concluído";
      this.els.stageH.textContent = looped && this.game.loop === 0
        ? "Horizonte aberto"
        : `Vitória: ${meta.name}`;
      this.els.stageText.textContent =
        this.game.stageIndex === 4
          ? "A Frota recua — mas o céu recomeça mais duro. Prepare-se para o próximo ciclo."
          : meta.subtitle;
      this.els.stageScore.textContent = `Pontos: ${this.game.score}`;
      const next = document.getElementById("btn-next");
      next.textContent = this.game.stageIndex === 4 ? "Continuar o ciclo" : "Próximo estágio";
      this.show("stage");
    } else if (m === "gameover") {
      this.els.overScore.textContent = String(this.game.score);
      this.els.overHigh.textContent = String(this.game.high);
      this.show("over");
    }
  }

  refresh() {
    const g = this.game;
    this.els.score.textContent = String(g.score);
    this.els.high.textContent = String(g.high);
    this.els.lives.textContent = String(Math.max(0, g.lives));
    this.els.bombs.textContent = String(g.bombs);
    this.els.titleHigh.textContent = String(g.high);
    const meta = STAGE_META[g.stageIndex];
    const loop = g.loop ? ` · ciclo ${g.loop + 1}` : "";
    this.els.chip.textContent =
      g.mode === "title"
        ? "Domine o céu. Sobreviva às ondas."
        : `${meta.name}${loop}`;

    if (g.boss && !g.boss.dead) {
      this.els.bossBar.classList.remove("hidden");
      this.els.bossName.textContent = BOSS_NAMES[g.boss.bossId] || "Chefe";
      const r = Math.max(0, g.boss.hp / g.boss.maxHp);
      this.els.bossFill.style.transform = `scaleX(${r})`;
    } else {
      this.els.bossBar.classList.add("hidden");
    }
  }
}

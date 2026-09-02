/**
 * Teclado + stick virtual + botões de fogo/bomba.
 */
export class Input {
  constructor() {
    this.moveX = 0;
    this.moveY = 0;
    this.fireHeld = false;
    this.bombPressed = false;
    this.pausePressed = false;
    this.touchEnabled = false;

    this._keys = new Set();
    this._stick = { active: false, x: 0, y: 0, id: null };
    this._fireBtn = false;
    this._bombBtn = false;

    window.addEventListener("keydown", (e) => this._down(e));
    window.addEventListener("keyup", (e) => this._up(e));
    window.addEventListener("contextmenu", (e) => {
      if (e.target && (e.target.id === "game" || e.target.closest(".touch"))) {
        e.preventDefault();
      }
    });
    this._bindTouch();
  }

  _down(e) {
    const block = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Space",
    ];
    if (block.includes(e.code)) e.preventDefault();
    if (e.repeat) {
      this._keys.add(e.code);
      return;
    }
    this._keys.add(e.code);
    if (e.code === "KeyX" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
      this.bombPressed = true;
    }
    if (e.code === "Escape" || e.code === "KeyP") this.pausePressed = true;
  }

  _up(e) {
    this._keys.delete(e.code);
  }

  _bindTouch() {
    const stick = document.getElementById("stick");
    const knob = document.getElementById("stick-knob");
    const fire = document.getElementById("btn-fire");
    const bomb = document.getElementById("btn-bomb");
    if (!stick) return;

    const setFrom = (clientX, clientY) => {
      const r = stick.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const max = r.width * 0.38;
      const len = Math.hypot(dx, dy) || 1;
      if (len > max) {
        dx = (dx / len) * max;
        dy = (dy / len) * max;
      }
      this._stick.x = dx / max;
      this._stick.y = dy / max;
      if (knob) knob.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const endStick = () => {
      this._stick.active = false;
      this._stick.x = 0;
      this._stick.y = 0;
      this._stick.id = null;
      if (knob) knob.style.transform = "translate(0,0)";
    };

    stick.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      stick.setPointerCapture(e.pointerId);
      this._stick.active = true;
      this._stick.id = e.pointerId;
      this.touchEnabled = true;
      setFrom(e.clientX, e.clientY);
    });
    stick.addEventListener("pointermove", (e) => {
      if (!this._stick.active || e.pointerId !== this._stick.id) return;
      setFrom(e.clientX, e.clientY);
    });
    stick.addEventListener("pointerup", endStick);
    stick.addEventListener("pointercancel", endStick);

    const hold = (el, setter) => {
      if (!el) return;
      const on = (e) => {
        e.preventDefault();
        this.touchEnabled = true;
        setter(true);
      };
      const off = () => setter(false);
      el.addEventListener("pointerdown", on);
      el.addEventListener("pointerup", off);
      el.addEventListener("pointercancel", off);
      el.addEventListener("pointerleave", off);
    };

    hold(fire, (v) => {
      this._fireBtn = v;
    });
    if (bomb) {
      bomb.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        this.touchEnabled = true;
        this.bombPressed = true;
        this._bombBtn = true;
      });
      bomb.addEventListener("pointerup", () => {
        this._bombBtn = false;
      });
    }
  }

  poll() {
    let x = 0;
    let y = 0;
    if (this._keys.has("ArrowLeft") || this._keys.has("KeyA")) x -= 1;
    if (this._keys.has("ArrowRight") || this._keys.has("KeyD")) x += 1;
    if (this._keys.has("ArrowUp") || this._keys.has("KeyW")) y -= 1;
    if (this._keys.has("ArrowDown") || this._keys.has("KeyS")) y += 1;
    if (this._stick.active) {
      x += this._stick.x;
      y += this._stick.y;
    }
    const l = Math.hypot(x, y);
    if (l > 1) {
      x /= l;
      y /= l;
    }
    this.moveX = x;
    this.moveY = y;
    this.fireHeld =
      this._fireBtn ||
      this._keys.has("Space") ||
      this._keys.has("KeyZ");
  }

  consumeBomb() {
    const v = this.bombPressed;
    this.bombPressed = false;
    return v;
  }

  consumePause() {
    const v = this.pausePressed;
    this.pausePressed = false;
    return v;
  }
}

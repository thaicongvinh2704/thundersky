export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.pointer = {
      x: 0, y: 0, active: false, fire: false, id: null,
      pointerActive: false, pointerDown: false, dragging: false,
      lastPointerX: 0, lastPointerY: 0, lastKnownInsideViewport: true
    };
    this.mobile = false;
    this.skillRequested = false;
    this.autoFire = true;
    this.onStart = null;
    this.onPause = null;
    this.onDebug = null;
    this.cornerTaps = [];
    this.justActivated = false;
    this.viewport = () => ({ width: window.innerWidth, height: window.innerHeight });
  }

  bind() {
    window.addEventListener("keydown", (event) => {
      this.keys.add(event.key);
      if (event.key === " ") event.preventDefault();
      if (event.key === "Enter" && this.onStart) this.onStart();
      if ((event.key === "p" || event.key === "P" || event.key === "Escape") && this.onPause) {
        event.preventDefault();
        this.onPause();
      }
      if (event.key === "F3" && this.onDebug) {
        event.preventDefault();
        this.onDebug();
      }
      if (event.key === "e" || event.key === "E" || event.key === "q" || event.key === "Q" || event.key === "Shift") this.skillRequested = true;
    });

    window.addEventListener("keyup", (event) => this.keys.delete(event.key));

    this.canvas.addEventListener("pointermove", (event) => this.setPointer(event, false), { passive: false });
    window.addEventListener("pointermove", (event) => {
      if (this.pointer.active && this.pointer.id === event.pointerId) this.setPointer(event, false);
    }, { passive: false });
    window.addEventListener("mousemove", (event) => {
      if (!this.mobile && this.pointer.dragging) this.setMousePointer(event);
    }, { passive: false });
    this.canvas.addEventListener("pointerdown", (event) => {
      if (event.button === 2 && !this.mobile) {
        event.preventDefault();
        this.skillRequested = true;
        return;
      }
      if (event.button === 1 || event.button === 3) {
        event.preventDefault();
        if (this.onPause) this.onPause();
        return;
      }
      if (event.button !== 0) return;
      this.capturePointer(event);
      this.setPointer(event, true);
      this.trackDebugTap(event);
      if (this.onStart) this.onStart();
    }, { passive: false });
    window.addEventListener("pointerup", (event) => {
      this.releasePointer(event);
      if (this.pointer.id === event.pointerId) this.resetPointer();
    }, { passive: false });
    window.addEventListener("pointercancel", (event) => {
      this.releasePointer(event);
      if (this.pointer.id === event.pointerId) this.preserveLastTarget();
    }, { passive: false });
    window.addEventListener("mouseup", (event) => {
      if (event.button === 0) this.resetPointer();
    }, { passive: false });
    window.addEventListener("touchmove", (event) => {
      if (!event.target.closest?.(".menu")) event.preventDefault();
    }, { passive: false });
    this.canvas.addEventListener("contextmenu", (event) => event.preventDefault());
    window.addEventListener("contextmenu", (event) => {
      if (this.pointer.active || event.target === this.canvas) event.preventDefault();
    });
    window.addEventListener("blur", () => {
      this.preserveLastTarget();
      this.pointer.id = null;
      this.justActivated = false;
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.preserveLastTarget();
    });
  }

  setMobile(mobile) {
    this.mobile = mobile;
    this.autoFire = true;
  }

  setViewportProvider(provider) {
    if (typeof provider === "function") this.viewport = provider;
  }

  setPointer(event, fire) {
    event.preventDefault();
    if (this.pointer.id !== null && this.pointer.id !== event.pointerId) return;
    this.pointer.active = true;
    this.pointer.pointerActive = true;
    this.pointer.id = event.pointerId;
    this.pointer.fire = fire || this.pointer.fire;
    this.pointer.pointerDown = fire || this.pointer.pointerDown;
    this.pointer.dragging = fire || this.pointer.dragging;
    this.updateClampedPosition(event.clientX, event.clientY);
    if (fire) this.justActivated = true;
  }

  setMousePointer(event) {
    event.preventDefault();
    if (!this.pointer.dragging) return;
    if (event.buttons === 0 && document.hasFocus()) {
      this.resetPointer();
      return;
    }
    this.pointer.active = true;
    this.pointer.pointerActive = true;
    this.pointer.fire = true;
    this.pointer.pointerDown = true;
    this.updateClampedPosition(event.clientX, event.clientY);
  }

  updateClampedPosition(clientX, clientY) {
    const viewport = this.viewport();
    this.pointer.lastKnownInsideViewport = clientX >= 0 && clientX <= viewport.width && clientY >= 0 && clientY <= viewport.height;
    this.pointer.x = Math.max(0, Math.min(viewport.width, clientX));
    this.pointer.y = Math.max(0, Math.min(viewport.height, clientY));
    this.pointer.lastPointerX = this.pointer.x;
    this.pointer.lastPointerY = this.pointer.y;
  }

  preserveLastTarget() {
    if (!this.pointer.dragging) return;
    this.pointer.active = true;
    this.pointer.pointerActive = true;
    this.pointer.x = this.pointer.lastPointerX;
    this.pointer.y = this.pointer.lastPointerY;
  }

  resetPointer() {
    this.pointer.active = false;
    this.pointer.pointerActive = false;
    this.pointer.fire = false;
    this.pointer.id = null;
    this.pointer.pointerDown = false;
    this.pointer.dragging = false;
    this.justActivated = false;
  }

  consumeJustActivated() {
    if (!this.justActivated) return false;
    this.justActivated = false;
    return true;
  }

  trackDebugTap(event) {
    if (!this.mobile || !this.onDebug || event.clientX > 56 || event.clientY > 56) return;
    const now = performance.now();
    this.cornerTaps = this.cornerTaps.filter((tap) => now - tap < 1600);
    this.cornerTaps.push(now);
    if (this.cornerTaps.length >= 5) {
      this.cornerTaps.length = 0;
      this.onDebug();
    }
  }

  capturePointer(event) {
    if (!this.canvas.setPointerCapture || !event.pointerId) return;
    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch {
      // Some embedded browsers reject capture; the game still works normally.
    }
  }

  releasePointer(event) {
    if (!this.canvas.releasePointerCapture || !event.pointerId) return;
    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer may already be released by the browser.
    }
  }

  axis() {
    const x = (this.keys.has("ArrowRight") || this.keys.has("d") ? 1 : 0) -
      (this.keys.has("ArrowLeft") || this.keys.has("a") ? 1 : 0);
    const y = (this.keys.has("ArrowDown") || this.keys.has("s") ? 1 : 0) -
      (this.keys.has("ArrowUp") || this.keys.has("w") ? 1 : 0);
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  }

  wantsFire() {
    return this.autoFire || this.keys.has(" ") || this.pointer.fire;
  }

  requestSkill() {
    this.skillRequested = true;
  }

  consumeSkillRequest() {
    if (!this.skillRequested) return false;
    this.skillRequested = false;
    return true;
  }
}

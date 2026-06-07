export class AudioSystem {
  constructor(button) {
    this.button = button;
    this.ctx = null;
    this.muted = this.loadMuted();
    this.musicTimer = null;
    this.musicMode = "menu";
    this.nextNote = 0;
    this.updateButton();
  }

  bind() {
    if (!this.button) return;
    this.button.addEventListener("pointerdown", (event) => event.stopPropagation());
    this.button.addEventListener("click", (event) => {
      event.preventDefault();
      this.setMuted(!this.muted);
      this.ensure();
      if (!this.muted) this.play("upgrade");
    });
  }

  loadMuted() {
    try {
      return localStorage.getItem("skyThunderMuted") === "1";
    } catch {
      return false;
    }
  }

  ensure() {
    if (this.ctx) return this.ctx;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    this.ctx = new AudioContext();
    return this.ctx;
  }

  setMuted(muted) {
    this.muted = muted;
    try {
      localStorage.setItem("skyThunderMuted", muted ? "1" : "0");
    } catch {
      // Portals sometimes lock storage; audio state can still live in memory.
    }
    this.updateButton();
  }

  updateButton() {
    if (!this.button) return;
    this.button.textContent = this.muted ? "Sound Off" : "Sound On";
    this.button.setAttribute("aria-pressed", String(this.muted));
  }

  play(name) {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    const map = {
      shoot: () => this.tone(620, 0.035, "square", 0.035, t),
      explosion: () => this.noise(0.18, 0.12, t),
      pickup: () => this.tone(880, 0.08, "sine", 0.05, t),
      hit: () => this.tone(180, 0.09, "sawtooth", 0.08, t),
      upgrade: () => this.arpeggio([520, 660, 880], 0.08, t),
      warning: () => this.arpeggio([320, 250], 0.11, t),
      thunder: () => {
        this.noise(0.32, 0.2, t);
        this.arpeggio([180, 360, 720, 960], 0.075, t);
      }
    };
    if (map[name]) map[name]();
  }

  startMusic(mode = "menu") {
    this.musicMode = mode;
    if (this.musicTimer) return;
    this.musicTimer = setInterval(() => this.musicTick(), 280);
  }

  stopMusic() {
    if (!this.musicTimer) return;
    clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  musicTick() {
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const menu = [196, 247, 294, 247];
    const play = [220, 277, 330, 392, 330, 277];
    const notes = this.musicMode === "gameplay" ? play : menu;
    const note = notes[this.nextNote % notes.length];
    this.nextNote += 1;
    this.tone(note, 0.11, "triangle", 0.018, ctx.currentTime);
  }

  tone(freq, duration, type, volume, start) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  arpeggio(notes, step, start) {
    notes.forEach((note, index) => this.tone(note, step * 0.9, "sine", 0.045, start + index * step));
  }

  noise(duration, volume, start) {
    const ctx = this.ctx;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(start);
  }
}

export class Menu {
  constructor(elements) {
    this.elements = elements;
    this.startHandler = null;
    this.defaultStartHandler = null;
    this.hangarButton = this.makeActionButton("Hangar");
    this.hangarButton.className = "hangar-button";
    this.elements.startButton.insertAdjacentElement("afterend", this.hangarButton);
    this.pauseActions = document.createElement("div");
    this.pauseActions.className = "pause-actions hidden";
    this.resumeButton = this.makeActionButton("Resume", "primary");
    this.restartButton = this.makeActionButton("Restart");
    this.soundButton = this.makeActionButton("Sound");
    this.controlsButton = this.makeActionButton("Controls");
    this.mainMenuButton = this.makeActionButton("Main Menu");
    this.pauseActions.append(this.resumeButton, this.restartButton, this.soundButton, this.controlsButton, this.mainMenuButton);
    this.elements.startButton.insertAdjacentElement("beforebegin", this.pauseActions);
  }

  makeActionButton(text, tone = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.className = tone ? `pause-action ${tone}` : "pause-action";
    return button;
  }

  bindStart(handler) {
    this.defaultStartHandler = handler;
    this.startHandler = handler;
    this.elements.startButton.addEventListener("click", () => {
      if (this.startHandler) this.startHandler();
    });
  }

  bindSecondary(handler) {
    if (this.elements.secondaryButton) this.elements.secondaryButton.addEventListener("click", handler);
  }

  bindHangar(handler) {
    this.hangarButton.addEventListener("click", handler);
  }

  bindPauseActions({ resume, restart, sound, controls, mainMenu }) {
    this.resumeButton.addEventListener("click", resume);
    this.restartButton.addEventListener("click", restart);
    this.soundButton.addEventListener("click", sound);
    this.controlsButton.addEventListener("click", controls);
    this.mainMenuButton.addEventListener("click", mainMenu);
  }

  setSoundLabel(muted) {
    this.soundButton.textContent = muted ? "Sound Off" : "Sound On";
  }

  showMenu() {
    this.startHandler = this.defaultStartHandler;
    this.show("Sky Thunder", "Song sot qua cac wave, gom nang luong va kich hoat Thunder Storm khi day pin.", "Bat dau", true);
  }

  show(title, text, buttonText, showControls = false, secondaryText = "") {
    this.elements.overlay.classList.remove("hidden");
    this.elements.overlay.classList.remove("pause-mode");
    this.elements.title.textContent = title;
    this.elements.text.textContent = text;
    this.elements.startButton.textContent = buttonText;
    this.elements.startButton.classList.remove("hidden");
    if (this.elements.secondaryButton) {
      this.elements.secondaryButton.textContent = secondaryText;
      this.elements.secondaryButton.classList.toggle("hidden", !secondaryText);
    }
    this.elements.controls.classList.toggle("hidden", !showControls);
    this.elements.upgradeOptions.classList.add("hidden");
    this.elements.upgradeOptions.innerHTML = "";
    this.elements.upgradeOptions.classList.remove("hangar-grid");
    this.pauseActions.classList.add("hidden");
    this.hangarButton.classList.toggle("hidden", title !== "Sky Thunder");
  }

  showHangar({ ships, save, onSelect, onBack }) {
    this.elements.overlay.classList.remove("hidden");
    this.elements.overlay.classList.remove("pause-mode");
    this.elements.title.textContent = "Hangar";
    this.elements.text.textContent = `Credits ${save.best.credits || 0} | Choose your fighter`;
    this.elements.controls.classList.add("hidden");
    this.elements.startButton.textContent = "Back";
    this.elements.startButton.classList.remove("hidden");
    this.elements.secondaryButton?.classList.add("hidden");
    this.hangarButton.classList.add("hidden");
    this.pauseActions.classList.add("hidden");
    this.elements.upgradeOptions.classList.remove("hidden");
    this.elements.upgradeOptions.innerHTML = "";
    this.elements.upgradeOptions.classList.add("hangar-grid");
    this.startHandler = onBack;

    for (const ship of ships) {
      const unlocked = save.isShipUnlocked(ship.id);
      const selected = save.best.selectedShipId === ship.id;
      const card = document.createElement("button");
      card.type = "button";
      card.className = `ship-card ${selected ? "selected" : ""}`;
      const costText = unlocked ? (selected ? "Selected" : "Unlocked") : `${ship.unlockCost} credits`;
      card.innerHTML = `
        <span class="ship-swatch" style="--ship-color:${ship.color};--ship-accent:${ship.accent}"></span>
        <strong>${ship.name}</strong>
        <em>${ship.difficulty} | ${costText}</em>
        <span>${ship.description}</span>
        <small>${ship.passiveName}: ${ship.passiveDescription}</small>
        <div class="ship-bars">
          ${this.statBar("HP", ship.stats.hp / 140)}
          ${this.statBar("SPD", ship.stats.speed / 540)}
          ${this.statBar("DMG", ship.stats.damageScale / 1.2)}
          ${this.statBar("ENG", ship.stats.energyScale / 1.35)}
        </div>
      `;
      card.addEventListener("click", () => onSelect(ship));
      this.elements.upgradeOptions.appendChild(card);
    }
  }

  statBar(label, value) {
    const pct = Math.max(0.08, Math.min(1, value)) * 100;
    return `<label>${label}<i><b style="width:${pct}%"></b></i></label>`;
  }

  showPause(text, muted) {
    this.show("Tam dung", text, "Resume");
    this.elements.overlay.classList.add("pause-mode");
    this.elements.startButton.classList.add("hidden");
    if (this.elements.secondaryButton) this.elements.secondaryButton.classList.add("hidden");
    this.setSoundLabel(muted);
    this.pauseActions.classList.remove("hidden");
  }

  showPauseControls() {
    this.elements.text.innerHTML = [
      "Move: Mouse / WASD / Arrow Keys",
      "Fire: Auto / Left Mouse",
      "Thunder: Right Mouse / E / Shift / Q",
      "Pause: ESC / P"
    ].join("<br>");
  }

  hide() {
    this.elements.overlay.classList.add("hidden");
    this.elements.upgradeOptions.classList.remove("hangar-grid");
  }
}

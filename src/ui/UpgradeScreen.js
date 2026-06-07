export class UpgradeScreen {
  constructor(elements) {
    this.elements = elements;
  }

  show(choices, onPick, result = null) {
    this.elements.overlay.classList.remove("hidden");
    this.elements.title.textContent = "Stage Clear";
    this.elements.text.textContent = result
      ? `Rank ${result.rank} | Kills ${result.kills} | Damage ${result.damageTaken} | Max Combo x${result.maxCombo.toFixed(2)} | Credits +${result.credits}`
      : "Chon 1 nang cap de tiep tuc chien dau.";
    this.elements.controls.classList.add("hidden");
    this.elements.startButton.classList.add("hidden");
    if (this.elements.secondaryButton) this.elements.secondaryButton.classList.add("hidden");
    this.elements.upgradeOptions.classList.remove("hidden");
    this.elements.upgradeOptions.classList.remove("hangar-grid");
    this.elements.upgradeOptions.innerHTML = "";

    for (const upgrade of choices) {
      const button = document.createElement("button");
      button.className = "upgrade-card";
      button.innerHTML = `<em>${upgrade.group || "upgrade"}</em><strong>${upgrade.name}</strong><span>${upgrade.description}</span>`;
      button.addEventListener("click", () => onPick(upgrade));
      this.elements.upgradeOptions.appendChild(button);
    }
  }

  hide() {
    this.elements.upgradeOptions.classList.add("hidden");
    this.elements.upgradeOptions.innerHTML = "";
    this.elements.startButton.classList.remove("hidden");
    this.elements.overlay.classList.add("hidden");
  }
}

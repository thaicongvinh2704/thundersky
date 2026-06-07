export const LANGUAGES = {
  vi: {
    "menu.start": "Bat dau", "menu.hangar": "Nha chua", "menu.intro": "Song sot qua cac dot tan cong, nap nang luong va kich hoat Bao Sam.",
    "common.back": "Quay lai", "common.restart": "Choi lai", "common.mainMenu": "Menu chinh", "common.soundOn": "Am thanh: Bat", "common.soundOff": "Am thanh: Tat",
    "language.label": "Ngon ngu: Tieng Viet", "pause.title": "Tam dung", "pause.resume": "Tiep tuc", "pause.help": "Chon thao tac hoac xem lai dieu khien.",
    "controls.controls": "Dieu khien", "controls.moveFire": "Di chuyen + Ban", "controls.leftMouse": "Chuot trai", "controls.thunder": "Bao Sam", "controls.rightKeys": "Chuot phai / Q / E", "controls.pause": "Tam dung", "controls.pauseKeys": "ESC / P",
    "hud.score": "Diem", "hud.health": "Mau", "hud.upgrades": "Nang cap", "hud.stage": "Chang", "hud.boss": "Trum", "hud.ship": "Tau", "hud.gun": "Sung", "hud.none": "Chua co",
    "thunder.ready": "Bao Sam san sang", "thunder.cooldown": "Hoi chieu {seconds}s", "thunder.notReady": "Bao Sam {percent}%",
    "game.over": "Het tran", "game.overLine": "Phi doi dich van con tren bau troi.", "game.victory": "Chien thang", "game.victoryLine": "Ban da ha trum cuoi. Tiep tuc vo tan de san diem cao hon.",
    "game.playAgain": "Choi lai", "game.continueEndless": "Tiep tuc vo tan", "game.summary": "Diem: {score}. Ky luc: {best}. Chang: {stage}. Dich ha: {kills}. Combo cao nhat: x{combo}.",
    "upgrade.stageClear": "Hoan thanh chang", "upgrade.choose": "Chon 1 nang cap de tiep tuc.", "hangar.title": "Nha chua", "hangar.choose": "Chon chien co", "hangar.credits": "Tin dung", "hangar.selected": "Da chon", "hangar.unlocked": "Da mo",
    "power.repair": "SUA CHUA +18", "power.shield": "KHIEN +1", "power.bomb": "BOM XUNG KICH", "power.rapid": "BAN NHANH", "power.magnet": "NAM CHAM", "power.levelUp": "{weapon} LEN CAP!", "power.switch": "DOI SANG {weapon}",
    "orientation": "Xoay doc man hinh de choi tot nhat"
  },
  en: {
    "menu.start": "Start", "menu.hangar": "Hangar", "menu.intro": "Survive enemy waves, charge energy, and unleash Thunder Storm.",
    "common.back": "Back", "common.restart": "Restart", "common.mainMenu": "Main Menu", "common.soundOn": "Sound On", "common.soundOff": "Sound Off",
    "language.label": "Language: English", "pause.title": "Paused", "pause.resume": "Resume", "pause.help": "Choose an action or review the controls.",
    "controls.controls": "Controls", "controls.moveFire": "Move + Fire", "controls.leftMouse": "Left Mouse", "controls.thunder": "Thunder", "controls.rightKeys": "Right Click / Q / E", "controls.pause": "Pause", "controls.pauseKeys": "ESC / P",
    "hud.score": "Score", "hud.health": "HP", "hud.upgrades": "Upgrades", "hud.stage": "Stage", "hud.boss": "Boss", "hud.ship": "Ship", "hud.gun": "Gun", "hud.none": "None",
    "thunder.ready": "Thunder Ready", "thunder.cooldown": "Cooldown {seconds}s", "thunder.notReady": "Thunder {percent}%",
    "game.over": "Game Over", "game.overLine": "The enemy fleet still controls the sky.", "game.victory": "Victory", "game.victoryLine": "The final boss is down. Continue Endless for a higher score.",
    "game.playAgain": "Play Again", "game.continueEndless": "Continue Endless", "game.summary": "Score: {score}. Best: {best}. Stage: {stage}. Enemies: {kills}. Max combo: x{combo}.",
    "upgrade.stageClear": "Stage Clear", "upgrade.choose": "Choose one upgrade to continue.", "hangar.title": "Hangar", "hangar.choose": "Choose your fighter", "hangar.credits": "Credits", "hangar.selected": "Selected", "hangar.unlocked": "Unlocked",
    "power.repair": "REPAIR +18", "power.shield": "SHIELD +1", "power.bomb": "BOMB BLAST", "power.rapid": "RAPID FIRE", "power.magnet": "MAGNET ON", "power.levelUp": "{weapon} LEVEL UP!", "power.switch": "SWITCHED TO {weapon}",
    "orientation": "Rotate to portrait for best experience"
  }
};

let currentLanguage = (() => {
  try { return localStorage.getItem("skyThunderLang") === "en" ? "en" : "vi"; } catch { return "vi"; }
})();

export function getLanguage() { return currentLanguage; }

export function setLanguage(language) {
  currentLanguage = language === "en" ? "en" : "vi";
  try { localStorage.setItem("skyThunderLang", currentLanguage); } catch {}
  document.documentElement.lang = currentLanguage;
  window.dispatchEvent(new CustomEvent("skythunderlanguagechange", { detail: currentLanguage }));
  return currentLanguage;
}

export function toggleLanguage() {
  return setLanguage(currentLanguage === "vi" ? "en" : "vi");
}

export function t(key, params = {}) {
  const template = LANGUAGES[currentLanguage]?.[key] || LANGUAGES.vi[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}

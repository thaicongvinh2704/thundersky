export const STATES = {
  MENU: "MENU",
  PLAYING: "PLAYING",
  STAGE_CLEAR: "STAGE_CLEAR",
  UPGRADE: "UPGRADE",
  BOSS: "BOSS",
  ENDLESS: "ENDLESS",
  GAME_OVER: "GAME_OVER",
  WIN: "WIN",
  PAUSED: "PAUSED"
};

export class StateManager {
  constructor(initialState = STATES.MENU) {
    this.state = initialState;
    this.previousState = initialState;
  }

  set(state) {
    this.previousState = this.state;
    this.state = state;
  }

  is(state) {
    return this.state === state;
  }
}

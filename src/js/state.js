import {
  timer,
  displayTimer,
  totalWorkTime,
  displayTotalWorkTime,
} from "./countdown";
import { moveBackground } from "./optionsView";
import { updateProgressRing } from "./progressRingView";
import { updateUISettings } from "./settingsPopup";

export let state = {
  // All times in seconds
  promodoro: 5,
  shortBreak: 3,
  longBreak: 10,
  currentInterval: "promodoro",
  currentTimer: 0,
  promodoroCount: 0,
  totalWorkTime: 0,
  isRunning: false,
  font: "kumbh sans",
  accentColor: "salmon",
  colors: {
    salmon: "#f87272",
    cyan: "#72f4f8",
    violet: "#d882f8",
  },
};

const currentOption = document.querySelector(`#${state.currentInterval}`);
export const root = document.documentElement;

const init = function () {
  const storage = localStorage.getItem("state");
  if (storage) state = JSON.parse(storage);

  state.promodoroCount = 0;

  updateUISettings();
  moveBackground(null, currentOption);
  displayTimer(state[state.currentInterval]);
  displayTotalWorkTime(state.totalWorkTime);
  document.title = "promodoro";
};

window.addEventListener("load", init);

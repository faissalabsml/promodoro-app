import { state } from "./state.js";

const path = document.querySelector(".timer__progress--path");
const length = path.getTotalLength();

// Set up the starting positions
path.style.strokeDasharray = length + " " + length;
path.style.strokeDashoffset = length;

path.getBoundingClientRect();

// Define our transition
path.style.transition = path.style.WebkitTransition =
  "stroke-dashoffset 1s ease-in-out";

export const updateProgressRing = function (running = true) {
  if (!running) path.style.strokeDashoffset = length;

  if (running)
    path.style.strokeDashoffset =
      (state.currentTimer * length) / state[state.currentInterval];
};

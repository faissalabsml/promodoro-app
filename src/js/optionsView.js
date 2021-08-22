import { state } from "./state.js";
import {
  timer,
  controlBtn,
  resetBtn,
  stopCountdown,
  displayTimer,
} from "./countdown.js";
import { updateProgressRing } from "./progressRingView.js";

const options = document.querySelectorAll(".option__label");
const background = document.querySelector(".option__background");

// Move the background behind the checked option
export const moveBackground = function (e, target) {
  let input;

  if (e) {
    target = e.target.closest(".option");
    input = e.target.previousElementSibling;
  } else {
    input = target;
    target = target.closest(".option");
  }

  // Set the input to checked
  input.checked = true;

  // Get the distance (left) between the label and the parent element using offsetLeft
  background.style.left = target.offsetLeft + "px";

  // Set the current selected interval
  state.currentInterval = target.querySelector("input").id;
};

// Get the timer from the state object and display it on click
const updateTimer = function (e) {
  const option = e.target.getAttribute("for");

  stopCountdown();

  displayTimer(state[option]);
  controlBtn.textContent = "start";
};

// Move background and change timer on click
options.forEach((option) =>
  option.addEventListener("click", (e) => {
    moveBackground(e);
    updateTimer(e);
    updateProgressRing(false);

    resetBtn.classList.remove("active");

    localStorage.setItem("state", JSON.stringify(state));
  })
);

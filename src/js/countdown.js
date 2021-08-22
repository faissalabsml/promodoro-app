import { state } from "./state.js";
import { moveBackground } from "./optionsView.js";
import { updateProgressRing } from "./progressRingView.js";
import { showNotification } from "./notification.js";

// Get the time from the DOM
export const timer = document.querySelector(".timer__text > h1");
export const totalWorkTime = document.querySelector(".work-time");
const nextSession = document.querySelector(".next-session");
export const controlBtn = document.querySelector(".control");
export const resetBtn = document.querySelector(".reset");

// Declaring the interval
let countdown;

// Start countdown function
const startCountdown = function () {
  // Get the timer displayed on the IU and save it in the state object (in seconds)
  state.currentTimer =
    +timer.textContent.split(":")[0] * 60 + +timer.textContent.split(":")[1];

  state.isRunning = true;

  countdown = setInterval(updateCountdown, 1000);
};

// Update the timer on the UI
const updateCountdown = function () {
  // Update the timer in state object
  state.currentTimer--;

  // Check if the timer is finished
  if (state.currentTimer < 0) {
    showNotification();

    stopCountdown();
    nextTimer();
    updateProgressRing(false);

    return;
  }

  // Display the running timer on the UI
  displayTimer(state.currentTimer);

  // Update progress ring
  updateProgressRing();
};

// Start the next timer (According to the promodoro technique: You do 4 pomodoros/intervals separated by 5 min breaks. After that, you take a longer break of about 15 to 20 minutes)
const nextTimer = function () {
  // Check the current interval/timer and change it to the next interval
  switch (state.currentInterval) {
    case "promodoro":
      state.promodoroCount++;
      state.totalWorkTime += state.promodoro;
      state.currentInterval = "shortBreak";

      displayTotalWorkTime(state.totalWorkTime);
      nextSession.textContent = "promodoro";

      break;

    case "shortBreak":
      state.currentInterval = "promodoro";

      nextSession.textContent = "short break";
      break;

    case "longBreak":
      state.currentInterval = "promodoro";

      nextSession.textContent = "short break";

      state.promodoroCount = 0;
      break;
  }

  if (state.currentInterval === "promodoro" && state.promodoroCount === 3)
    nextSession.textContent = "long break";
  if (state.promodoroCount === 4) state.currentInterval = "longBreak";

  localStorage.setItem("state", JSON.stringify(state));

  // Get the current timer's label on the HTML and move bg
  const nextOption = document.querySelector(`#${state.currentInterval}`);
  moveBackground(null, nextOption);

  // Display and start the next timer about to start
  displayTimer(state[state.currentInterval]);
  startCountdown();
};

// Handle countdown on click event or when pressing the space key
const controlCountdown = function () {
  if (controlBtn.textContent == "start" || controlBtn.textContent == "resume") {
    startCountdown();
    controlBtn.textContent = "pause";
    resetBtn.classList.remove("active");
    return;
  }
  if (controlBtn.textContent == "pause") {
    stopCountdown();
    controlBtn.textContent = "resume";
    resetBtn.classList.add("active");
  }
};

// Stop the countdown interval
export const stopCountdown = function () {
  state.isRunning = false;
  clearInterval(countdown);
};

// Transfer the seconds into minutes and seconds and display the result
export const displayTimer = function (sec) {
  let minutes = Math.floor(sec / 60);
  let seconds = sec % 60;

  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  timer.textContent = document.title = `${minutes}:${seconds}`;
};

export const displayTotalWorkTime = function (sec) {
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec % 3600) / 60);
  let seconds = Math.floor((sec % 3600) % 60);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  totalWorkTime.textContent =
    document.title = `${hours}:${minutes}:${seconds} ${
      hours == 0 ? "min" : hours == 1 ? "hour" : "hours"
    }`;
};

// Reset
export const resetTimer = function () {
  const defaultOption = document.querySelector("#promodoro");

  state.isRunning = false;
  state.currentInterval = "promodoro";
  state.promodoroCount = 0;
  state.totalWorkTime = 0;

  localStorage.setItem("state", JSON.stringify(state));

  resetBtn.classList.remove("active");
  controlBtn.textContent = "start";
  displayTimer(state.promodoro);
  displayTotalWorkTime(state.totalWorkTime);
  moveBackground(null, defaultOption);
  updateProgressRing(false);
};

// Event listeners
controlBtn.addEventListener("click", controlCountdown);
document.addEventListener("keydown", (e) => {
  if (e.keyCode !== 32) return;
  controlCountdown();
});

// Reset timers
resetBtn.addEventListener("click", resetTimer);

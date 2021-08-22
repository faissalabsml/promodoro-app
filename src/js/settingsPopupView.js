import { controlBtn, resetBtn, stopCountdown } from "./countdown.js";
import { state } from "./state.js";

const openSettingsBtn = document.querySelector(".settings-btn");
const closeSettingsBtn = document.querySelector(".close-btn *");
const settingsContainer = document.querySelector(".settings-container");
const inputs = settingsContainer.querySelectorAll(
  "input[type='number'], input[type='radio']"
);
const inputArrows = document.querySelectorAll(".form__inputs--arrows > *");

const openSettings = function () {
  settingsContainer.classList.add("active");
  stopCountdown();
};

export const closeSettings = function () {
  settingsContainer.classList.remove("active");
};

// Change input's value using svg arrows
const changeValue = function (e) {
  // Get the input containing the clicked arrows
  const input = e.target.closest(
    ".form__inputs--arrows"
  ).previousElementSibling;

  // Get the arrow rule (increase or decrease value)
  const role = e.target.closest("svg").dataset.role;

  // Using stepUp method to change input value
  role === "increase" ? input.stepUp() : input.stepDown();
};

// Arrow event listener
inputArrows.forEach((el) =>
  el.addEventListener("click", (e) => {
    changeValue(e);
  })
);

// To prevent text selection when clicking multiple times on the arrows
inputArrows.forEach((el) =>
  el.addEventListener("mousedown", (e) => e.preventDefault(), false)
);

const previousSettings = function () {
  settingsContainer.querySelector(
    `input[value='${state.font}']`
  ).checked = true;
  settingsContainer.querySelector(
    `input[value='${state.accentColor}']`
  ).checked = true;

  settingsContainer
    .querySelectorAll("input[type='number']")
    .forEach((input) => {
      input.value = state[input.id] / 60;
    });
};

// Open settings popup
openSettingsBtn.addEventListener("click", () => {
  openSettings();
  previousSettings();
});

// Close settings
[settingsContainer, closeSettingsBtn].forEach((el) =>
  el.addEventListener("click", (e) => {
    if (e.target === settingsContainer || e.target.closest(".close-btn")) {
      if (controlBtn.textContent !== "start") {
        controlBtn.textContent = "resume";
        resetBtn.classList.add("active");
      }

      closeSettings();
    }
  })
);

document.addEventListener("keydown", (e) => {
  if (e.keyCode !== 27) return;
  closeSettings();
});

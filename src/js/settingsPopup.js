import { state, root } from "./state.js";
import { controlBtn, resetBtn, displayTimer, resetTimer } from "./countdown.js";
import { closeSettings } from "./settingsPopupView.js";
import { updateProgressRing } from "./progressRingView.js";

const settingsForm = document.querySelector(".form");
const applyBtn = document.querySelector(".form__btn");

export const updateUISettings = function () {
  root.style.setProperty("--accent-color", state.colors[state.accentColor]);
  root.style.setProperty("--font", state.font);
};

const applySettings = function () {
  const inputs = settingsForm.querySelectorAll(
    "input[type='number'], input[type='radio']:checked"
  );

  inputs.forEach((input) => {
    const key = input.dataset.change;
    const value = input.value;

    if (key === "font" || key === "accentColor") {
      state[key] = value;
    } else {
      if (value <= 0) return;

      state[key] = value * 60;
    }
  });

  if (controlBtn.textContent !== "start") {
    controlBtn.textContent = "resume";
    resetBtn.classList.add("active");
  } else {
    displayTimer(state[state.currentInterval]);
  }

  updateUISettings();
  closeSettings();

  localStorage.setItem("state", JSON.stringify(state));
};

applyBtn.addEventListener("click", applySettings);
document.addEventListener("keydown", (e) => {
  if (e.keyCode !== 13) return;
  applySettings();
});

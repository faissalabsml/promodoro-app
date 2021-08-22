// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/js/progressRingView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProgressRing = void 0;

var _state = require("./state.js");

var path = document.querySelector(".timer__progress--path");
var length = path.getTotalLength(); // Set up the starting positions

path.style.strokeDasharray = length + " " + length;
path.style.strokeDashoffset = length;
path.getBoundingClientRect(); // Define our transition

path.style.transition = path.style.WebkitTransition = "stroke-dashoffset 1s ease-in-out";

var updateProgressRing = function updateProgressRing() {
  var running = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  if (!running) path.style.strokeDashoffset = length;
  if (running) path.style.strokeDashoffset = _state.state.currentTimer * length / _state.state[_state.state.currentInterval];
};

exports.updateProgressRing = updateProgressRing;
},{"./state.js":"src/js/state.js"}],"src/js/countdown.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetTimer = exports.displayTotalWorkTime = exports.displayTimer = exports.stopCountdown = exports.resetBtn = exports.controlBtn = exports.totalWorkTime = exports.timer = void 0;

var _state = require("./state.js");

var _optionsView = require("./optionsView.js");

var _progressRingView = require("./progressRingView.js");

// Get the time from the DOM
var timer = document.querySelector(".timer__text > h1");
exports.timer = timer;
var totalWorkTime = document.querySelector(".work-time");
exports.totalWorkTime = totalWorkTime;
var nextSession = document.querySelector(".next-session");
var controlBtn = document.querySelector(".control");
exports.controlBtn = controlBtn;
var resetBtn = document.querySelector(".reset"); // Declaring the interval

exports.resetBtn = resetBtn;
var countdown; // Start countdown function

var startCountdown = function startCountdown() {
  // Get the timer displayed on the IU and save it in the state object (in seconds)
  _state.state.currentTimer = +timer.textContent.split(":")[0] * 60 + +timer.textContent.split(":")[1];
  _state.state.isRunning = true;
  countdown = setInterval(updateCountdown, 1000);
}; // Update the timer on the UI


var updateCountdown = function updateCountdown() {
  // Update the timer in state object
  _state.state.currentTimer--; // Check if the timer is finished

  if (_state.state.currentTimer < 0) {
    stopCountdown();
    nextTimer();
    (0, _progressRingView.updateProgressRing)(false);
    return;
  } // Display the running timer on the UI


  displayTimer(_state.state.currentTimer); // Update progress ring

  (0, _progressRingView.updateProgressRing)();
}; // Start the next timer (According to the promodoro technique: You do 4 pomodoros/intervals separated by 5 min breaks. After that, you take a longer break of about 15 to 20 minutes)


var nextTimer = function nextTimer() {
  // Check the current interval/timer and change it to the next interval
  switch (_state.state.currentInterval) {
    case "promodoro":
      _state.state.promodoroCount++;
      _state.state.totalWorkTime += _state.state.promodoro;
      _state.state.currentInterval = "shortBreak";
      displayTotalWorkTime(_state.state.totalWorkTime);
      nextSession.textContent = "promodoro";
      break;

    case "shortBreak":
      _state.state.currentInterval = "promodoro";
      nextSession.textContent = "short break";
      break;

    case "longBreak":
      _state.state.currentInterval = "promodoro";
      nextSession.textContent = "short break";
      _state.state.promodoroCount = 0;
      break;
  }

  if (_state.state.currentInterval === "promodoro" && _state.state.promodoroCount === 3) nextSession.textContent = "long break";
  if (_state.state.promodoroCount === 4) _state.state.currentInterval = "longBreak";
  localStorage.setItem("state", JSON.stringify(_state.state)); // Get the current timer's label on the HTML and move bg

  var nextOption = document.querySelector("#".concat(_state.state.currentInterval));
  (0, _optionsView.moveBackground)(null, nextOption); // Display and start the next timer about to start

  displayTimer(_state.state[_state.state.currentInterval]);
  startCountdown();
}; // Handle countdown on click event or when pressing the space key


var controlCountdown = function controlCountdown() {
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
}; // Stop the countdown interval


var stopCountdown = function stopCountdown() {
  _state.state.isRunning = false;
  clearInterval(countdown);
}; // Transfer the seconds into minutes and seconds and display the result


exports.stopCountdown = stopCountdown;

var displayTimer = function displayTimer(sec) {
  var minutes = Math.floor(sec / 60);
  var seconds = sec % 60;
  minutes = minutes < 10 ? "0".concat(minutes) : minutes;
  seconds = seconds < 10 ? "0".concat(seconds) : seconds;
  timer.textContent = document.title = "".concat(minutes, ":").concat(seconds);
};

exports.displayTimer = displayTimer;

var displayTotalWorkTime = function displayTotalWorkTime(sec) {
  var hours = Math.floor(sec / 3600);
  var minutes = Math.floor(sec % 3600 / 60);
  var seconds = Math.floor(sec % 3600 % 60);
  hours = hours < 10 ? "0".concat(hours) : hours;
  minutes = minutes < 10 ? "0".concat(minutes) : minutes;
  seconds = seconds < 10 ? "0".concat(seconds) : seconds;
  totalWorkTime.textContent = document.title = "".concat(hours, ":").concat(minutes, ":").concat(seconds, " ").concat(hours == 0 ? "min" : hours == 1 ? "hour" : "hours");
}; // Reset


exports.displayTotalWorkTime = displayTotalWorkTime;

var resetTimer = function resetTimer() {
  var defaultOption = document.querySelector("#promodoro");
  _state.state.isRunning = false;
  _state.state.currentInterval = "promodoro";
  _state.state.promodoroCount = 0;
  _state.state.totalWorkTime = 0;
  localStorage.setItem("state", JSON.stringify(_state.state));
  resetBtn.classList.remove("active");
  controlBtn.textContent = "start";
  displayTimer(_state.state.promodoro);
  displayTotalWorkTime(_state.state.totalWorkTime);
  (0, _optionsView.moveBackground)(null, defaultOption);
  (0, _progressRingView.updateProgressRing)(false);
}; // Event listeners


exports.resetTimer = resetTimer;
controlBtn.addEventListener("click", controlCountdown);
document.addEventListener("keydown", function (e) {
  if (e.keyCode !== 32) return;
  controlCountdown();
}); // Reset timers

resetBtn.addEventListener("click", resetTimer);
},{"./state.js":"src/js/state.js","./optionsView.js":"src/js/optionsView.js","./progressRingView.js":"src/js/progressRingView.js"}],"src/js/settingsPopupView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeSettings = void 0;

var _countdown = require("./countdown.js");

var _state = require("./state.js");

var openSettingsBtn = document.querySelector(".settings-btn");
var closeSettingsBtn = document.querySelector(".close-btn *");
var settingsContainer = document.querySelector(".settings-container");
var inputs = settingsContainer.querySelectorAll("input[type='number'], input[type='radio']");
var inputArrows = document.querySelectorAll(".form__inputs--arrows > *");

var openSettings = function openSettings() {
  settingsContainer.classList.add("active");
  (0, _countdown.stopCountdown)();
};

var closeSettings = function closeSettings() {
  settingsContainer.classList.remove("active");
}; // Change input's value using svg arrows


exports.closeSettings = closeSettings;

var changeValue = function changeValue(e) {
  // Get the input containing the clicked arrows
  var input = e.target.closest(".form__inputs--arrows").previousElementSibling; // Get the arrow rule (increase or decrease value)

  var role = e.target.closest("svg").dataset.role; // Using stepUp method to change input value

  role === "increase" ? input.stepUp() : input.stepDown();
}; // Arrow event listener


inputArrows.forEach(function (el) {
  return el.addEventListener("click", function (e) {
    changeValue(e);
  });
}); // To prevent text selection when clicking multiple times on the arrows

inputArrows.forEach(function (el) {
  return el.addEventListener("mousedown", function (e) {
    return e.preventDefault();
  }, false);
});

var previousSettings = function previousSettings() {
  settingsContainer.querySelector("input[value='".concat(_state.state.font, "']")).checked = true;
  settingsContainer.querySelector("input[value='".concat(_state.state.accentColor, "']")).checked = true;
  settingsContainer.querySelectorAll("input[type='number']").forEach(function (input) {
    input.value = _state.state[input.id] / 60;
  });
}; // Open settings popup


openSettingsBtn.addEventListener("click", function () {
  openSettings();
  previousSettings();
}); // Close settings

[settingsContainer, closeSettingsBtn].forEach(function (el) {
  return el.addEventListener("click", function (e) {
    if (e.target === settingsContainer || e.target.closest(".close-btn")) {
      if (_countdown.controlBtn.textContent !== "start") {
        _countdown.controlBtn.textContent = "resume";

        _countdown.resetBtn.classList.add("active");
      }

      closeSettings();
    }
  });
});
document.addEventListener("keydown", function (e) {
  if (e.keyCode !== 27) return;
  closeSettings();
});
},{"./countdown.js":"src/js/countdown.js","./state.js":"src/js/state.js"}],"src/js/settingsPopup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUISettings = void 0;

var _state = require("./state.js");

var _countdown = require("./countdown.js");

var _settingsPopupView = require("./settingsPopupView.js");

var _progressRingView = require("./progressRingView.js");

var settingsForm = document.querySelector(".form");
var applyBtn = document.querySelector(".form__btn");

var updateUISettings = function updateUISettings() {
  _state.root.style.setProperty("--accent-color", _state.state.colors[_state.state.accentColor]);

  _state.root.style.setProperty("--font", _state.state.font);
};

exports.updateUISettings = updateUISettings;

var applySettings = function applySettings() {
  var inputs = settingsForm.querySelectorAll("input[type='number'], input[type='radio']:checked");
  inputs.forEach(function (input) {
    var key = input.dataset.change;
    var value = input.value;
    key === "font" || key === "accentColor" ? _state.state[key] = value : _state.state[key] = value * 60;
  });

  if (_countdown.controlBtn.textContent !== "start") {
    _countdown.controlBtn.textContent = "resume";

    _countdown.resetBtn.classList.add("active");
  } else {
    (0, _countdown.displayTimer)(_state.state[_state.state.currentInterval]);
  }

  updateUISettings();
  (0, _settingsPopupView.closeSettings)();
  localStorage.setItem("state", JSON.stringify(_state.state));
};

applyBtn.addEventListener("click", applySettings);
document.addEventListener("keydown", function (e) {
  if (e.keyCode !== 13) return;
  applySettings();
});
},{"./state.js":"src/js/state.js","./countdown.js":"src/js/countdown.js","./settingsPopupView.js":"src/js/settingsPopupView.js","./progressRingView.js":"src/js/progressRingView.js"}],"src/js/state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.root = exports.state = void 0;

var _countdown = require("./countdown");

var _optionsView = require("./optionsView");

var _progressRingView = require("./progressRingView");

var _settingsPopup = require("./settingsPopup");

var state = {
  // All times in seconds
  promodoro: 1500,
  shortBreak: 300,
  longBreak: 1200,
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
    violet: "#d882f8"
  }
};
exports.state = state;
var currentOption = document.querySelector("#".concat(state.currentInterval));
var root = document.documentElement;
exports.root = root;

var init = function init() {
  var storage = localStorage.getItem("state");
  if (storage) exports.state = state = JSON.parse(storage);
  state.promodoroCount = 0;
  (0, _settingsPopup.updateUISettings)();
  (0, _optionsView.moveBackground)(null, currentOption);
  (0, _countdown.displayTimer)(state[state.currentInterval]);
  (0, _countdown.displayTotalWorkTime)(state.totalWorkTime);
  document.title = "promodoro";
};

window.addEventListener("load", init);
},{"./countdown":"src/js/countdown.js","./optionsView":"src/js/optionsView.js","./progressRingView":"src/js/progressRingView.js","./settingsPopup":"src/js/settingsPopup.js"}],"src/js/optionsView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveBackground = void 0;

var _state = require("./state.js");

var _countdown = require("./countdown.js");

var _progressRingView = require("./progressRingView.js");

var options = document.querySelectorAll(".option__label");
var background = document.querySelector(".option__background"); // Move the background behind the checked option

var moveBackground = function moveBackground(e, target) {
  var input;

  if (e) {
    target = e.target.closest(".option");
    input = e.target.previousElementSibling;
  } else {
    input = target;
    target = target.closest(".option");
  } // Set the input to checked


  input.checked = true; // Get the distance (left) between the label and the parent element using offsetLeft

  background.style.left = target.offsetLeft + "px"; // Set the current selected interval

  _state.state.currentInterval = target.querySelector("input").id;
}; // Get the timer from the state object and display it on click


exports.moveBackground = moveBackground;

var updateTimer = function updateTimer(e) {
  var option = e.target.getAttribute("for");
  (0, _countdown.stopCountdown)();
  (0, _countdown.displayTimer)(_state.state[option]);
  _countdown.controlBtn.textContent = "start";
}; // Move background and change timer on click


options.forEach(function (option) {
  return option.addEventListener("click", function (e) {
    moveBackground(e);
    updateTimer(e);
    (0, _progressRingView.updateProgressRing)(false);

    _countdown.resetBtn.classList.remove("active");

    localStorage.setItem("state", JSON.stringify(_state.state));
  });
});
},{"./state.js":"src/js/state.js","./countdown.js":"src/js/countdown.js","./progressRingView.js":"src/js/progressRingView.js"}],"src/js/script.js":[function(require,module,exports) {
"use strict";

require("./optionsView.js");

require("./settingsPopupView.js");

require("./settingsPopup.js");

require("./progressRingView");

require("./countdown.js");
},{"./optionsView.js":"src/js/optionsView.js","./settingsPopupView.js":"src/js/settingsPopupView.js","./settingsPopup.js":"src/js/settingsPopup.js","./progressRingView":"src/js/progressRingView.js","./countdown.js":"src/js/countdown.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "38321" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/script.js"], null)
//# sourceMappingURL=/script.04c05cf5.js.map
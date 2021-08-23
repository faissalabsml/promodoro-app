import { state } from "./state";

export const showNotification = function () {
  const notification = new Notification("Promodoro App", {
    body: `${state.currentInterval} has finished`,
    icon: "./src/assets/favicon-32x32.png",
  });
};

Notification.requestPermission();

// if (Notification.permission === "granted") {
//   showNotification();
// }
// if (Notification.permission !== "denied") {
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") showNotification();
//   });
// }

// Notification.requestPermission(function(result) {
//   if (result === 'granted') {
//     navigator.serviceWorker.ready.then(function(registration) {
//       registration.showNotification('Notification with ServiceWorker');
//     });
//   }
// });

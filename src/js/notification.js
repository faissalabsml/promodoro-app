import { state } from "./state";

export const showNotification = function () {
  const notification = new Notification("Promodoro App", {
    body: `${state.currentInterval} has finished`,
    icon: "./src/assets/favicon-32x32.png",
  });

  navigator.serviceWorker.ready.then(function (registration) {
    registration.showNotification(notification);
  });
};

Notification.requestPermission();

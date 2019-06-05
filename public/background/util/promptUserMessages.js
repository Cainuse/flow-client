/* eslint-disable no-undef */
//<reference types="chrome"/>

<<<<<<< HEAD
var NotificationTypeEnum = {
=======
let NotificationTypeEnum = {
>>>>>>> Enable Connection to Amazon Instance
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
  SUCCESS: "success"
};

function notification(title, message, notificationType) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "notification",
      notificationType: notificationType,
      title: title,
      message: message
    });
  });
}

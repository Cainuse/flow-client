/* eslint-disable no-undef */
//<reference types="chrome"/>

let NotificationTypeEnum = {
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

/* eslint-disable no-undef */
function notification(message, notificationType) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "general-notification",
      notificationType: notificationType,
      message: message
    });
  });
}

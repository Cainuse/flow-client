/* eslint-disable no-undef */
function storeLocally(key, value) {
  if (getLocalVlue(key) === value) {
    return;
  }

  notification(
    "Connected!",
    "Successful connection to server! You may begin",
    NotificationTypeEnum.Success
  );

  window.localStorage.setItem(key, value);
}

function getLocalVlue(key) {
  return window.localStorage.getItem(key);
}

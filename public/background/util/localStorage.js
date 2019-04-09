function storeLocally(key, value) {
  if (getLocalVlue(key) === value) {
    return;
  }

  window.localStorage.setItem(key, value);
}

function getLocalVlue(key) {
  return window.localStorage.getItem(key);
}

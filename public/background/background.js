/* eslint-disable no-undef */
//<reference types="chrome"/>
async function main() {
  await createWebSocketConnection();
}
main();

//For testing only
async function start(win) {
  console.log("1")
  await toggleStartEndSession(websocket);
}

chrome.browserAction.onClicked.addListener(start);

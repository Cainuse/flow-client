/* eslint-disable no-undef */
//<reference types="chrome"/>
// <reference types="uuid"/>
async function main(){
  await createWebSocketConnection();
}
main();


//For testing only
function start(win) { }

chrome.browserAction.onClicked.addListener(start);



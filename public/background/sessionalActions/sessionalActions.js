/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//<reference types="chrome"/>
let websocket;
async function createWebSocketConnection() {
  let isCommandSuccessful;
  let userEmail, userId;
  await chrome.identity.getProfileUserInfo(user => {
    console.log(user);
    userEmail = user.email;
    userId = user.id;
  });

  //Set timeout for 10 minutes
  let timeoutHandle = window.setTimeout(() => {
    endSession(websocket);
  }, 600000);

  if ("WebSocket" in window) {
    websocket = new WebSocket("ws://localhost:9090/ws");
    websocket.onopen = function() {
      websocket.send(
        `{"email":"${userEmail}", "action":"Sign In", "JWT": "${generateJWT()}"}`
      );
    };

    websocket.onmessage = function(event) {
      if (event.data != null) {
        if (event.data.Message === "Connection successfully established") {
          console.log("successful");
          //Change badge to display that app is on
        }
        isCommandSuccessful = messageHandler(JSON.parse(event.data), websocket);
        websocket.send(isCommandSuccessful);
        console.log(event.data);
        chrome.browserAction.setIcon({path:"./././images/icons/flow-logo.png"});
        // Reset timer
        window.clearTimeout(timeoutHandle);
        timeoutHandle = window.setTimeout(() => {
          endSession(websocket);
        }, 600000);
      }
    };

    // Use messageHandler's return to dictate whether to close websocket or not
  }
}

async function toggleStartEndSession(websocket){
  if(websocket.readyState === websocket.CLOSED){
    await createWebSocketConnection();
  }else if(websocket.readyState === websocket.OPEN){
    await endSession(websocket);
  }else if(websocket.readyState === websocket.CLOSING){
    console.log("Websocket is disconnecting from server, please wait.");
  }else{
    console.log("Websocket is trying to connect to server, please wait.");
  }
}

async function endSession(websocket) {
  console.log("Websocket closed");
  chrome.browserAction.setIcon({path:"./././images/icons/flow-logo-inactive.png"});
  await websocket.close(1000, "Client Termination");
  if (websocket.readyState === websocket.CLOSED) {
    notification(
      "Disconnected",
      "Chrome extension has now closed, please reconnect to continue.",
      NotificationTypeEnum.WARNING
    );
    return;
  }
}



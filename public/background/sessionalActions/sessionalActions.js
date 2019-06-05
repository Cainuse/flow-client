/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//<reference types="chrome"/>

async function createWebSocketConnection() {
  let websocket, isCommandSuccessful;
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
<<<<<<< HEAD
        if (event.data.Message === "Connection successfully established") {
          console.log("successful");
        }
=======
>>>>>>> Enable Connection to Amazon Instance
        isCommandSuccessful = messageHandler(JSON.parse(event.data), websocket);
        websocket.send(isCommandSuccessful);
        if (!validateJWT(JSON.parse(event.data).JWT)) {
          console.log("Invalid JWT Token");
        }
        console.log(event.data);
        // Reset timer
        window.clearTimeout(timeoutHandle);
        timeoutHandle = window.setTimeout(() => {
          endSession(websocket);
        }, 600000);
      }
    };
  }
}

function endSession(websocket) {
  notification(
      "Flow Navigate",
      "Session has ended",
      NotificationTypeEnum.SUCCESS
  );
  console.log("Websocket closed");
  websocket.close(1000, "Client Termination");
  if (websocket.readyState === websocket.CLOSED) {
    notification(
      "Disconnected",
      "Chrome extension has now closed due to inactivity, please reconnect to continue.",
      NotificationTypeEnum.WARNING
    );
    return;
  }
}

function reopenSession(param, extraParam){
  notification(
      "Flow Navigate",
      "Reopening browser",
      NotificationTypeEnum.SUCCESS
  );
  chrome.sessions.restore();
}

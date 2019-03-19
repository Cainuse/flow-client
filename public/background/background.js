/* eslint-disable no-undef */
///<reference types="chrome"/>
/// <reference types="uuid"/>

function helperNumberOfTabs() {
  chrome.tabs.query({ windowType: "normal" }, function(tabs) {
    console.log(
      "Number of open tabs in all normal browser windows:",
      tabs.length
    );
  });
}

function switchTab(parsedMessage) {
  chrome.windows.getCurrent({ populate: true }, function(windowsArray) {
    const currentWindowId = windowsArray.id;
    if (numberString < windowsArray.tabs.length) {
      chrome.tabs.query(
        { index: parseInt(numberString), windowId: currentWindowId },
        function(tabs) {
          chrome.tabs.update(tabs[0].id, { active: true });
        }
      );
    } else {
      new Error("Switch Tab function Error");
    }
  });
}

function commandCreateTab(parsedMessage) {
  chrome.windows.getCurrent({ populate: true }, function(windowsArray) {
    const currentWindowId = windowsArray.id;
    chrome.tabs.create(
      { windowId: currentWindowId, active: true, index: 0 },
      () => {
        return true;
      }
    );
  });
}

function commandDeleteTab(parsedMessage) {
  chrome.windows.getCurrent({ populate: true }, function(windowsArray) {
    if (numberString < windowsArray.tabs.length) {
      chrome.tabs.discard(numberString, () => {
        // successful callback
      });
    }
  });
}

function createWebSocketConnection() {
  let websocket;
  let isCommandSuccessful;
  if ("WebSocket" in window) {
    websocket = new WebSocket("ws://localhost:9090/ws");

    websocket.onopen = function() {
      websocket.send("client reached out");
    };

    // websocket.onmessage = function(e) {
    //   console.log(e.data);
    // };

    websocket.onmessage = function(event) {
      if (event.data != null) {
        isCommandSuccessful = messageHandler(JSON.parse(event.data));
        websocket.send(isCommandSuccessful);
      }
    };

    // Use messageHandler's return to dictate whether to close websocket or not
  }
}
createWebSocketConnection();

function endSession(websocket) {
  websocket.onclose = function() {
    console.log("Websocket closed");
  };
}

// Message marshalling
function messageHandler(parsedMessage) {
  switch (parsedMessage.commandType) {
    case 1:
      return commandCreateTab(parsedMessage);
    case 2:
      return commandDeleteTab(parsedMessage);
    case 3:
      return switchTab(parsedMessage);
    default:
      return false;
  }
}

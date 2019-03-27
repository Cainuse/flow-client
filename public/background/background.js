/* eslint-disable no-undef */
//<reference types="chrome"/>
// <reference types="uuid"/>

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

async function createWebSocketConnection() {
  let websocket, isCommandSuccessful;
  let userEmail;
  let userId;
  await chrome.identity.getProfileUserInfo(user => {
    userEmail = user.email;
    userId = user.id;
  });
  console.log(userEmail);
  // try{

  //   console.log(userInfo);
  // }catch{
  //   alert("Sorry, you may not be logged into your browser, as such we cannot create connection to our server!");
  //   return;
  // }

  if ("WebSocket" in window) {
    websocket = new WebSocket("ws://localhost:8080/ws");

    websocket.onopen = function() {
      console.log(`{"email":${userEmail}, "action":"Sign In"}`);
      websocket.send(
        `{"email":"ABwppHHUAGaEOI2o_jIDCkQpD5re88q4jCSvDe80qoCH1ysCz2eQ8UJk-pY8uP2ccdsqdZud1_NhrA", "action":"Sign In"}`
      );

      console.log("client did reach out");
    };

    websocket.onmessage = function(event) {
      console.log("Entering on message listener");
      if (event.data != null) {
        console.log("Data is not null");
        console.log(JSON.parse(event.data));
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
  chrome.tabs.query(
    {
      currentWindow: true,
      active: true
    },
    tabArray => {
      let extraParam = {
        tabId: tabArray[0].id,
        winId: tabArray[0].windowId
      };
      switch (parsedMessage.command) {
        case "Scroll":
          return scrollPage(parsedMessage.param, extraParam);
        case "Change Scrolling Speed":
          return changeScrollingSpeed(parsedMessage.param, extraParam);
        case "Change Browser Display":
          return changeStateOfBrowser(parsedMessage.param, extraParam);
        case "Navigate Webpage":
          return goToWebPage(parsedMessage.param, extraParam);
        default:
          return false;
      }
    }
  );
}

/**
 * Changes the display state of browser
 * @param {*} win
 */

async function changeStateOfBrowser(param, extraParam) {
  console.log("Activated!");
  let availableStates = ["normal", "minimized", "maximized", "fullscreen"];

  locParam = param.fields.DisplayMode.Kind.StringValue;
  if (availableStates.includes(locParam)) {
    chrome.tabs.query(
      {
        currentWindow: true,
        active: true
      },
      tabArray => {
        chrome.windows.update(tabArray[0].windowId, {
          state: locParam
        });
        console.log(`Updating browser size to ${locParam}`);
      }
    );
  }
}

let scrollParam = {
  speed: 5,
  direction: null
};

let scroll = null;
/**
 * Scrolls down on the highlighted tab
 * @param {*} win
 */
function scrollPage(param, extraParam) {
  let x = 0;
  let y = 0;
  locParam = param.fields.Direction.Kind.StringValue;
  scrollParam.direction = locParam;
  switch (scrollParam.direction) {
    case "up":
      x = 0;
      y = -scrollParam.speed;
      break;
    case "down":
      x = 0;
      y = scrollParam.speed;
      break;
    case "right":
      x = scrollParam.speed;
      y = 0;
      break;
    case "left":
      x = -scrollParam.speed;
      y = 0;
      break;
    default:
      x = 0;
      y = 0;
  }
  scrollPageHelper(x, y, extraParam);
}

function changeScrollingSpeed(param, extraParam) {
  switch (param.fields.ScrollingSpeed.Kind.StringValue) {
    case "slow":
      scrollParam.speed = 5;
      break;
    case "middle":
      scrollParam.speed = 10;
      break;
    case "fast":
      scrollParam.speed = 15;
      break;
    case "lightning":
      scrollParam.speed = 30;
      break;
    default:
      scrollParam.speed = 0;
      break;
  }
  scrollPageHelper(x, y, extraParam);
}

function scrollPageHelper(x, y, extraParam) {
  if (scroll != null) {
    clearInterval(scroll);
  }
  if (scrollParam.direction != "stop") {
    scroll = setInterval(() => {
      chrome.tabs.executeScript(extraParam.tabId, {
        code: `window.scrollBy({top: ${y}, left: ${x}, behavior: 'smooth'})`
      });
    }, 100);
  }
}
function goForwardOrBackward(param) {
  if (param == "forward") {
    chrome.tabs.goForward(currTab.id);
  } else if (param == "backward") {
    chrome.tabs.goBack(currTab.id);
  }
}

function refresh(tab) {
  chrome.tabs.reload();
}

// NOT YET SUPPORTED
function captureScreen(tab) {
  win = chrome.windows.getCurrent;
  chrome.tabs.captureVisibleTab(dataUrl => {
    console.log(dataUrl);
  });
}

function goToWebPage(param, extraParam) {
  let urlParam = param.fields.url.Kind.StringValue;
  if (
    !urlParam.includes(".com") &&
    !urlParam.includes(".ca") &&
    !urlParam.includes(".net") &&
    !urlParam.includes(".org") &&
    !urlParam.includes(".cn") &&
    !urlParam.includes(".gov")
  ) {
    urlParam += ".com";
  }
  chrome.tabs.update(extraParam.tabId, {
    url: "https://www." + urlParam.replace("www.", "")
  });
}
// let currTab = currTab = chrome.tabs.getCurrent(tab => {
//   return tab;
// });

let currWin = null;
function start(win) {}

chrome.browserAction.onClicked.addListener(start);

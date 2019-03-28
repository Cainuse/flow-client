/* eslint-disable no-undef */
//<reference types="chrome"/>
// <reference types="uuid"/>

function focusBrowser(parsedMessage) {
  chrome.bro;
}

function helperNumberOfTabs() {
  chrome.tabs.query({ windowType: "normal" }, function (tabs) {
    console.log(
      "Number of open tabs in all normal browser windows:",
      tabs.length
    );
  });
}


function switchTab(param, extraParam) {
  //Left Right
  if (param.fields.Direction.Kind.StringValue != "") {
    locParam = param.fields.Direction.Kind.StringValue;
    chrome.tabs.get(extraParam.tabId, (tab) => {
      tabInd = tab.index;
      offset = 1;
      if (locParam == "left") {
        offset = -1;
      }
      if (tabInd)
        chrome.tabs.query(
          { index: (tabInd + offset), windowId: extraParam.winId },
          (tabs) => {
            if (tabs.length > 0) {
              chrome.tabs.update(tabs[0].id, { active: true });
            }
          }
        );
    })
  }
  //Leftmost Rightmost
  else if (param.fields.TabDirection.Kind.StringValue) {
    locParam = param.fields.TabDirection.Kind.StringValue;
    locIndex = 1;
    chrome.windows.get(extraParam.winId, { populate: true }, (win) => {
      if (locParam == "rightmost") {
        locIndex = win.tabs.length
      }
      chrome.tabs.query(
        { index: (locIndex - 1), windowId: extraParam.winId },
        (tabs) => {
          if (tabs.length > 0) {
            console.log(tabs[0].id)
            chrome.tabs.update(tabs[0].id, { active: true });
          }
        }
      );
    })
  }
  //Index based
  else if (param.fields.number.Kind.NumberValue) {
    locParam = param.fields.number.Kind.NumberValue;
    chrome.tabs.query(
      { index: (locParam - 1), windowId: extraParam.winId },
      (tabs) => {
        if (tabs.length > 0) {
          console.log(tabs[0].id)
          chrome.tabs.update(tabs[0].id, { active: true });
        }
      }
    );
  }


}

function createTab(param, extraParam) {
  chrome.tabs.create(
    { windowId: extraParam.winId, active: true }
  )
}

function deleteTab(param, extraParam) {
  locStr = param.fields.number.Kind.StringValue;
  locInd = param.fields.number.Kind.NumberValue;
  if (locStr == "") {
    chrome.tabs.remove(extraParam.tabId);
  } else if (locInd != null) {
    chrome.tabs.query({ index: (locInd - 1) }, (tabs) => {
      chrome.tabs.remove(tabs[0].id);
    })
  }

}

async function createWebSocketConnection() {
  let websocket, isCommandSuccessful;
  let userEmail, userId;
  await chrome.identity.getProfileUserInfo(user => {
    userEmail = user.email;
    userId = user.id;
  });

  //Set timeout for 10 minutes
  let timeoutHandle = window.setTimeout(() => {
    endSession(websocket);
  }, 600000);

  if ("WebSocket" in window) {

    websocket = new WebSocket("ws://localhost:9090/ws");
    websocket.onopen = function () {
      websocket.send(`{"email":"${userEmail}", "action":"Sign In"}`);

      console.log("client did reach out");
    };

    websocket.onmessage = function (event) {
      if (event.data != null) {
        isCommandSuccessful = messageHandler(JSON.parse(event.data), websocket);
        websocket.send(isCommandSuccessful);
        console.log(event.data);
        // Reset timer
        window.clearTimeout(timeoutHandle);
        timeoutHandle = window.setTimeout(() => {
          endSession(websocket);
        }, 10000);
      }
    };

    // Use messageHandler's return to dictate whether to close websocket or not
  }
}
createWebSocketConnection();

function endSession(websocket) {
  console.log("Websocket closed");
  websocket.close(1000, "Client Termination");
  if (websocket.readyState === websocket.CLOSED) {
    alert("Chrome Voice Control has ended due to inactivity");
    return;
  }
}

let prevTabId = null;
let prevWinId = null;
// Message marshalling
function messageHandler(parsedMessage, websocket) {
  console.log(websocket);
  chrome.tabs.query(
    {
      currentWindow: true,
      active: true
    },
    tabArray => {
      let extraParam;
      if (tabArray[0]) {
        extraParam = {
          tabId: tabArray[0].id,
          winId: tabArray[0].windowId
        };
        prevTabId = extraParam.tabId;
        prevWinId = extraParam.winId;
      }
      switch (parsedMessage.command) {
        case "Scroll":
          return scrollPage(parsedMessage.param, extraParam, null);
        case "Change Scrolling Speed":
          return changeScrollingSpeed(parsedMessage.param, extraParam);
        case "Change Browser Display":
          return changeStateOfBrowser(parsedMessage.param, extraParam);
        case "Navigate Webpage":
          return goToWebPage(parsedMessage.param, extraParam);
        case "PageAction":
          return backwardForwardRefreshPage(parsedMessage.param, extraParam)
        case "Select Tab":
          return switchTab(parsedMessage.param, extraParam)
        case "Delete Tab":
          return deleteTab(parsedMessage.param, extraParam)
        case "Create Tab":
          return createTab(parsedMessage.param, extraParam)
        case "Exit App":
          return endSession(websocket);
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

function changeStateOfBrowser(param, extraParam) {
  console.log("Activated!");
  let availableStates = ["normal", "minimized", "maximized", "fullscreen"];
  let locParam = param.fields.DisplayMode.Kind.StringValue;
  let browserWinId;
  if (!extraParam) {
    browserWinId = prevWinId;
  } else {
    browserWinId = extraParam.winId;
  }
  console.log(browserWinId);
  if (availableStates.includes(locParam)) {
    chrome.windows.update(browserWinId, { state: locParam });
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
function scrollPage(param, extraParam, fnParam) {
  let x = 0;
  let y = 0;
  let locParam;
  if (param != null) {
    locParam = param.fields.Direction.Kind.StringValue;
  } else {
    locParam = fnParam;
  }
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
  scrollPage(null, extraParam, scrollParam.direction);
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
function backwardForwardRefreshPage(param, extraParam) {
  let locParam = param.fields.PageAction.Kind.StringValue
  if (locParam != "") {
    if (locParam == "forward") {
      chrome.tabs.goForward();
    } else if (locParam == "backward") {
      chrome.tabs.goBack();
    }
  } else {
    locParam = param.fields.PageActionCont.Kind.StringValue
    if (locParam == "refresh") {
      chrome.tabs.reload();
    }
  }
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
  let regex = /\.+/
  let regex1 = /\s+/
  chrome.tabs.update(extraParam.tabId, {
    url:
      "https://www." +
      urlParam
        .replace("www.", "")
        .replace(regex, ".")
        .replace(regex1, "")
  });
}
function start(win) { }

chrome.browserAction.onClicked.addListener(start);

/* eslint-disable no-undef */
//<reference types="chrome"/>

let prevTabId = null;
let prevWinId = null;

// Message marshalling
function messageHandler(parsedMessage, websocket) {
  storeLocally("sessionId", parsedMessage.sessionId);
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
          return backwardForwardRefreshPage(parsedMessage.param, extraParam);
        case "Select Tab":
          return switchTab(parsedMessage.param, extraParam);
        case "Delete Tab":
          return deleteTab(parsedMessage.param, extraParam);
        case "Create Tab":
          return createTab(parsedMessage.param, extraParam);
        case "Web Search":
          return searchWeb(parsedMessage.param, extraParam);
        case "Create Window":
          return createWindow(parsedMessage.param, extraParam);
        case "Close Window":
          return closeWindow(parsedMessage.param, extraParam);
        case "Zoom View":
          return zoomView(parsedMessage.param, extraParam);
        case "Change Window":
          return cycleWindow(parsedMessage.param, extraParam);
        case "Exit App":
          return endSession(websocket);
        case "Click Element":
          return clickElement(parsedMessage.param, extraParam);
        case "Type In Input Bar":
          return fillInputBar(parsedMessage.param, extraParam);
        default:
          return false;
      }
    }
  );
}

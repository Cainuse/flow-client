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
      console.log(parsedMessage);
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
        case "Zoom View":
          return zoomView(parsedMessage.param, extraParam);
        case "Exit App":
          return endSession(websocket);
        default:
          return false;
      }
    }
  );
}

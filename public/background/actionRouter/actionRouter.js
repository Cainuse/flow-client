/* eslint-disable no-undef */
//<reference types="chrome"/>

let prevTabId = null;
let prevWinId = null;

let pinnedTabId = null;
let pinnedWinId = null;
// Message marshalling
function messageHandler(parsedMessage, websocket) {
  storeLocally("sessionId", parsedMessage.sessionId);
  console.log(parsedMessage);
  //console.log("current stored" + window.localStorage.getItem("sessionId"));

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
      //If pinned value are specified, apply overwrite
      if(pinnedWinId!==null){
        extraParam = {
          tabId: pinnedTabId,
          winId: pinnedWinId
        };
      }
      //Move this to inner functions
      let audio = new Audio(chrome.runtime.getURL("./././sound/base/pop.mp3"));
      audio.volume = 0.5;
      audio.play();

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
        case "Click Element - Multiple Selection":
          return clickElementFollowUp(parsedMessage.param, extraParam);
        case "Type In Input Bar":
          return fillInputBar(parsedMessage.param, extraParam);
        case "Video Action":
          return videoPlayback(parsedMessage.param, extraParam);
        case "Capture Screen":
          return captureScreen(parsedMessage.param, extraParam);
        case "Reopen Action":
          return reopenSession(parsedMessage.param, extraParam);
        case "Pin Browser":
          notification(
              "Flow Navigate",
              "Pinning browser",
              NotificationTypeEnum.SUCCESS
          );
          pinnedTabId = extraParam.tabId;
          pinnedWinId = extraParam.winId;
          break;
        case "Unpin Browser":
          notification(
              "Flow Navigate",
              "Unpinning browser",
              NotificationTypeEnum.SUCCESS
          );
          pinnedTabId = null;
          pinnedWinId = null;
          break;
        default:
          return false;
      }
    }
  );
}

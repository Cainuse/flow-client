/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
//<reference types="chrome"/>

function scrollPage(param, extraParam, fnParam) {
  notification(
      "Flow Navigate",
      "Scrolling",
      NotificationTypeEnum.Success
  );
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
  notification(
      "Flow Navigate",
      "Changing scrolling speed",
      NotificationTypeEnum.Success
  );
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
  if (scrollParam.direction !== "stop") {
    scroll = setInterval(() => {
      chrome.tabs.executeScript(extraParam.tabId, {
        code: `window.scrollBy({top: ${y}, left: ${x}, behavior: 'smooth'})`
      });
    }, 100);
  }
}

function zoomView(param, extraParam) {
  notification(
      "Flow Navigate",
      "Zoom view",
      NotificationTypeEnum.Success
  );
  let zoomFactor;
  chrome.tabs.getZoom(currentZoomFactor => {
    zoomFactor = currentZoomFactor;
    switch (param.fields.ZoomDirection.Kind.StringValue) {
      case "out":
        chrome.tabs.setZoom(zoomFactor - 0.1);
        break;
      case "in":
        chrome.tabs.setZoom(zoomFactor + 0.1);
        break;
      case "":
        chrome.tabs.setZoom(zoomFactor + 0.1);
        break;
      default:
        break;
    }
  });
}

function clickElement(param, extraParam) {
  notification(
      "Flow Navigate",
      "Clicking element",
      NotificationTypeEnum.Success
  );
  let userInput = param.fields.ElementName.Kind.StringValue.toLowerCase();
  chrome.tabs.sendMessage(extraParam.tabId, {
    type: "select",
    userInput: userInput
  });
}

function clickElementFollowUp(param, extraParam){
  notification(
      "Flow Navigate",
      "Clicking element",
      NotificationTypeEnum.Success
  );
  let userInput = param.fields.Integer.Kind.NumberValue;
  chrome.tabs.sendMessage(extraParam.tabId, {
    type: "select-followUp",
    userInput: userInput
  });
}

function fillInputBar(param, extraParam) {
  notification(
      "Flow Navigate",
      "Filling input bar",
      NotificationTypeEnum.Success
  );
  let userInput = param.fields.Input.Kind.StringValue.toLowerCase();
  chrome.tabs.sendMessage(extraParam.tabId, {
    type: "input",
    userInput: userInput
  });
}

function videoPlayback(param, extraParam) {
  notification(
      "Flow Navigate",
      "Video playback control",
      NotificationTypeEnum.Success
  );
  let userInput = param.fields.Playback.Kind.StringValue.toLowerCase();
  chrome.tabs.sendMessage(extraParam.tabId, {
    type: "video-playback",
    userInput: userInput
  });
}

function captureScreen(param, extraParam) {
  notification(
      "Flow Navigate",
      "Screen captured",
      NotificationTypeEnum.Success
  );
  chrome.tabs.captureVisibleTab(extraParam.winId, dataUrl => {
    chrome.downloads.download({
      url: dataUrl,
      filename: "flow_screenshot.jpg",
      conflictAction:"uniquify"
    })
  });
}


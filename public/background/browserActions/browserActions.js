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

function backwardForwardRefreshPage(param, extraParam) {
  let locParam = param.fields.PageAction.Kind.StringValue;
  if (locParam != "") {
    if (locParam == "forward") {
      chrome.tabs.goForward();
    } else if (locParam == "backward") {
      chrome.tabs.goBack();
    }
  } else {
    locParam = param.fields.PageActionCont.Kind.StringValue;
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
  let regex = /\.+/;
  let regex1 = /\s+/;
  chrome.tabs.update(extraParam.tabId, {
    url:
      "https://www." +
      urlParam
        .replace("www.", "")
        .replace(regex, ".")
        .replace(regex1, "")
  });
}

function zoomView(param, extraParam) {
  let zoomFactor;

  chrome.tabs.getZoom(function(currentZoomFactor) {
    zoomFactor = currentZoomFactor;
    switch (param.fields.ZoomDirection.Kind.StringValue) {
      case "out":
        chrome.tabs.setZoom(zoomFactor + 0.1);
        break;
      case "in":
        chrome.tabs.setZoom(zoomFactor - 0.1);
        break;
      default:
        break;
    }
  });
}

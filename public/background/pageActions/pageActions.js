/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
//<reference types="chrome"/>

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
  if (scrollParam.direction !== "stop") {
    scroll = setInterval(() => {
      chrome.tabs.executeScript(extraParam.tabId, {
        code: `window.scrollBy({top: ${y}, left: ${x}, behavior: 'smooth'})`
      });
    }, 100);
  }
}

function zoomView(param, extraParam) {
  let zoomFactor;
  chrome.tabs.getZoom((currentZoomFactor)=> {
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

function clickElement(param, extraParam){
  let elementName = param.fields.ElementName.Kind.StringValue.toLowerCase();
  chrome.tabs.executeScript(extraParam.tabId,{
   // file:"./pageActionsUtil/pageActionsUtil.js"
    code: `HTMLElement.prototype.getElementsByInnerText = function (text, escape) {
    var nodes  = this.querySelectorAll("*");
    var matches = [];
    for (var i = 0; i < nodes.length; i++) {
        let nodeCleaned = cleanText(nodes[i].innerText);
        let textCleaned = cleanText(text);
        if(nodeCleaned && textCleaned){
          if (nodeCleaned.contains(textCleaned)) {
            matches.push(nodes[i]);
          }
        } 
    }
    if (escape) {
        return matches;
    }
    var result = [];
    for (var i = 0; i < matches.length; i++) {
        var filter = matches[i].getElementsByInnerText(text, true);
        if (filter.length == 0) {
            result.push(matches[i]);
        }
    }
    return result;
};
document.getElementsByInnerText = HTMLElement.prototype.getElementsByInnerText;

if (!String.prototype.contains) {
    String.prototype.contains = function(s) {
        return this.indexOf(s) > -1
    }
}

function cleanText(text){
    //remove special characters
    if(text){
        let string = text.replace(/[^a-zA-Z ]/g, "");
        string = string.replace(/\\s/g, "");
        //turn to lowercase
        string = string.toLowerCase();
        console.log(string)
        return string;
    }
    return;
}

HTMLElement.prototype.getElementByInnerText = function (text) {
    var result = this.getElementsByInnerText(text);
    if (result.length == 0) return null;
    return result[0];
};

document.getElementByInnerText = HTMLElement.prototype.getElementByInnerText;

document.getElementByInnerText("${elementName}").click();
`
  });

}
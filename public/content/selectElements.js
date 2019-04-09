//<reference types="chrome"/>

function cleanText(text) {
  if (!text) {
    return;
  }

  return text
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s/g, "")
        .toLowerCase();
}

if (!String.prototype.contains) {
  String.prototype.contains = function(s) {
    return this.indexOf(s) > -1;
  };
}
// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(request => {
  const userInput = request.userInput;
  HTMLElement.prototype.getElementsByInnerText = function(text, escape) {
    const textCleaned = cleanText(text);

    let nodes = null;
    nodes = this.querySelectorAll("*");

    let matches = [];
    for (let i = 0; i < nodes.length; i++) {
      switch(request.type){
        case "select":
          if (textCleaned==null){
            return
          }
          if (cleanText(nodes[i].innerText)==textCleaned) {
            matches.push(nodes[i]);
          }
          break;
        case "input":
          if(nodes[i].tagName==="INPUT" && nodes[i].outerHTML.contains('type="text"')){
            matches.push(nodes[i]);
          }
          break;
      }
    }

    if (escape) {
      return matches;
    }

    let result = [];
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].getElementsByInnerText(text, true).length === 0) {
        result.push(matches[i]);
      }
    }
    return result;
  };

  document.getElementsByInnerText =
    HTMLElement.prototype.getElementsByInnerText;

  HTMLElement.prototype.getElementByInnerText = function(text) {
    var result = this.getElementsByInnerText(text, false);
    if (result.length == 0) return null;
    return result[0];
  };

  document.getElementByInnerText =
    HTMLElement.prototype.getElementByInnerText;

  switch(request.type){
    case "select":
      document.getElementByInnerText(`"${userInput}"`).click();
      break;
    case "input":
      let inputBar = document.getElementByInnerText(null);
      inputBar.value = `${userInput}`;
      inputBar.type = "submit";
      inputBar.click();
  }
  
});

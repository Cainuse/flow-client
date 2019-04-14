//<reference types="chrome"/>

function cleanText(text) {
  if (!text) {
    return;
  }

  return text
    .replace(/[^a-zA-Z]/g, "")
    .replace(/\\s/g, "")
    .toLowerCase();
}

function performAction(context, userInput) {
  switch (context) {
    case "select":
      document.getElementByInnerText(`"${userInput}"`).click();
      break;
    case "input":
      let inputBar = document.getElementByInnerText(null);
      inputBar.value = `${userInput}`;
      inputBar.type = "submit";
      inputBar.click();
      break;
    default:
      break;
  }
}

function getElementsByInnerTextHelper(context, node, userText, matches) {
  switch (context) {
    case "select":
      if (node.nodeType === 1) {
        let cleanedNode = cleanText(node.innerText);
        if (cleanedNode && cleanedNode.contains(userText)) {
          matches.push(node);
        }
      }

      break;
    case "input":
      if (node.tagName === "INPUT" && node.outerHTML.contains('type="text"')) {
        matches.push(node);
      }
      break;
    default:
      break;
  }
}

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(request => {
  HTMLElement.prototype.getElementsByInnerText = function(text, escape) {
    if (request.type === "select") {
      const textCleaned = cleanText(text);

      if (textCleaned == null) {
        return;
      }

      let nodes = this.querySelectorAll("*");
      let matches = [];
      for (let i = 0; i < nodes.length; i++) {
        getElementsByInnerTextHelper(
          request.type,
          nodes[i],
          textCleaned,
          matches
        );
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
    }
  };

  document.getElementsByInnerText =
    HTMLElement.prototype.getElementsByInnerText;

  if (!String.prototype.contains) {
    String.prototype.contains = function(s) {
      return this.indexOf(s) > -1;
    };
  }

  HTMLElement.prototype.getElementByInnerText = function(text) {
    var result = this.getElementsByInnerText(text);
    if (result.length === 0) return null;
    return result[0];
  };

  document.getElementByInnerText = HTMLElement.prototype.getElementByInnerText;

  performAction(request.type, request.userInput);
});

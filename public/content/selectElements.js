//<reference types="chrome"/>

function cleanText(text) {
  if (!text) {
    return;
  }

  return text
    .replace(/[^a-zA-Z ]/g, "")
    .replace(/\\s/g, "")
    .toLowerCase();
}

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(request => {
  if (request.type === "select") {
    const elementName = request.elementName;
    HTMLElement.prototype.getElementsByInnerText = function(text, escape) {
      const textCleaned = cleanText(text);

      if (textCleaned == null) {
        return;
      }

      let nodes = null;
      nodes = this.querySelectorAll("*");

      let matches = [];
      for (let i = 0; i < nodes.length; i++) {
        if (cleanText(nodes[i].innerText).contains(textCleaned)) {
          matches.push(nodes[i]);
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

    //Custom contains
    if (!String.prototype.contains) {
      String.prototype.contains = function(s) {
        return this.indexOf(s) > -1;
      };
    }

    // Grabs first element by creaiting new function get element by inner text from getElementsByInnerText
    HTMLElement.prototype.getElementByInnerText = function(text) {
      var result = this.getElementsByInnerText(text);
      if (result.length == 0) return null;
      return result[0];
    };

    document.getElementByInnerText =
      HTMLElement.prototype.getElementByInnerText;

    document.getElementByInnerText(`"${elementName}`).click();
  }
});

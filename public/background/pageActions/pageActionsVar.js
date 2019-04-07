/* eslint-disable no-undef */
//<reference types="chrome"/>

let scrollParam = {
  speed: 5,
  direction: null
};

let scroll = null;

let utilCode =
    `HTMLElement.prototype.getElementsByInnerText = function (text, escape, mode) {
    var nodes  = this.querySelectorAll("*");
    var matches = [];
    console.log(nodes);
    for (var i = 0; i < nodes.length; i++) {
        switch (mode){
            case "select":
                let nodeCleaned = cleanText(nodes[i].innerText);
                let textCleaned = cleanText(text);
                if(nodeCleaned && textCleaned){
                    if (nodeCleaned==textCleaned) {
                        matches.push(nodes[i]);
                    }
                }
                break;
            case "input":
                if(nodes[i].tagName==="INPUT" && nodes[i].outerHTML.contains('type="text"') && !nodes[i].outerHTML.contains('type="hidden"')){
                    matches.push(nodes[i]);
                }
                break;
        }
    }
    if (escape) {
        return matches;
    }
    var result = [];
    for (var i = 0; i < matches.length; i++) {
        var filter = matches[i].getElementsByInnerText(text, true, mode);
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
        return string;
    }
    return;
}

HTMLElement.prototype.getElementByInnerText = function (text, escape, mode) {
    var result = this.getElementsByInnerText(text, escape, mode);
    if (result.length == 0) return null;
    return result[0];
};

 document.getElementByInnerText = HTMLElement.prototype.getElementByInnerText;`;
//<reference types="chrome"/>

function cleanText(text) {
    if (!text) {
        return;
    }

    return text
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();
}

if (!String.prototype.contains) {
    String.prototype.contains = function (s) {
        return this.indexOf(s) > -1;
    };
}

function performAction(context, userInput) {
    switch (context) {
        case "select":
             let allElements = document.getElementsByInnerTextRoot(`"${userInput}"`).filter((element)=>{
                let rect = element.getBoundingClientRect();
                return !(
                    (rect.x + rect.width) < 0
                    || (rect.y + rect.height) < 0
                    || (rect.x > window.innerWidth || rect.y > window.innerHeight)
                );
             });

            //More than 1 elements found
            if(allElements.length>1){
                for(let element of allElements){
                    element.style.backgroundColor = "#FDFF47";
                }
            }
            //Exactly 1 element found
            else if(allElements.length==1){
                allElements[0].click();
            }else{
                console.log("No Element of matching description found");
                return;
            }
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
            if(node.nodeType === 1 && node.nodeName!=="SCRIPT"){
                let cleanedNode = cleanText(node.innerText);
                if(cleanedNode && cleanedNode.contains(userText)){
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
    const userInput = request.userInput;
    HTMLElement.prototype.getElementsByInnerText = function (text, escape) {
        const textCleaned = cleanText(text);

        if (textCleaned == null && request.type == "select") {
            return
        }
        let nodes = null;

        nodes = this.querySelectorAll("*");
        console.log(nodes)
        let matches = [];
        for (let i = 0; i < nodes.length; i++) {
            getElementsByInnerTextHelper(request.type, nodes[i], textCleaned, matches)
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

    HTMLElement.prototype.getElementsByInnerTextRoot = function (text) {
        const textCleaned = cleanText(text);
        if (textCleaned == null && request.type == "select") {
            return
        }
        let nodes = null;
        nodes = this.querySelectorAll("body");
        console.log(nodes);
        return nodes[0].getElementsByInnerText(text, false);
    };

    document.getElementsByInnerText =
        HTMLElement.prototype.getElementsByInnerText;

    HTMLElement.prototype.getElementByInnerText = function (text) {
        var result = this.getElementsByInnerText(text, false);
        if (result.length == 0) return null;
        return result[0];
    };

    document.getElementByInnerText =
        HTMLElement.prototype.getElementByInnerText;

    document.getElementsByInnerTextRoot =
        HTMLElement.prototype.getElementsByInnerTextRoot;
    performAction(request.type, userInput);
});

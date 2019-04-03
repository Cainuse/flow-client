function focusBrowser(parsedMessage) {
    chrome.bro;
}

/**
 * Changes the display state of browser
 * @param {*} win
 */

function changeStateOfBrowser(param, extraParam) {
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
    let locParam = param.fields.PageAction.Kind.StringValue
    if (locParam != "") {
        if (locParam == "forward") {
            chrome.tabs.goForward();
        } else if (locParam == "backward") {
            chrome.tabs.goBack();
        }
    } else {
        locParam = param.fields.PageActionCont.Kind.StringValue
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
    let regex = /\.+/
    let regex1 = /\s+/
    chrome.tabs.update(extraParam.tabId, {
        url:
            "https://www." +
            urlParam
                .replace("www.", "")
                .replace(regex, ".")
                .replace(regex1, "")
    });
}

function searchWeb(param, extraParam){
    let locSearchQuery = param.fields.Query.Kind.StringValue;
    let locSearchEngine = param.fields.SearchEngine.Kind.StringValue;
    switch(locSearchEngine){
        case "Amazon":
            chrome.tabs.update(extraParam.tabId, {
                url: "https://www.amazon.com/s?k="+locSearchQuery
            });
            break;
        case "Youtube":
            chrome.tabs.update(extraParam.tabId, {
                url: "https://www.youtube.com/results?search_query="+locSearchQuery
            });
            break;
        case "Wikipedia":
            chrome.tabs.update(extraParam.tabId, {
                url: "https://en.wikipedia.org/wiki/"+locSearchQuery
            });
            break;
        case "Ebay":
            chrome.tabs.update(extraParam.tabId, {
                url: "https://www.ebay.ca/sch/_nkw="+locSearchQuery
            });
            break;
        case "Bing":
            chrome.tabs.update(extraParam.tabId, {
                url: "https://www.bing.com/search?q="+locSearchQuery
            });
            break;
        case "StackOverflow":
            chrome.tabs.update(extraParam.tabId, {
                url: "https://stackoverflow.com/search?q="+locSearchQuery
            });
            break;
        default:
            chrome.tabs.update(extraParam.tabId, {
                url: "https://www.google.com/search?q="+locSearchQuery
            });
            break;
    }
}

function createWindow(param, extraParam){
    let locParam = param.fields.WindowMode.Kind.StringValue;
    if(locParam==="incognito"){
        return chrome.windows.create({focused:true, incognito:true});
    }
    chrome.windows.create({focused: true});
}

function closeWindow(param, extraParam){
    chrome.windows.remove(extraParam.winId);
}

function cycleWindow(param, extraParam){
    chrome.windows.getAll((windows)=>{
        console.log(windows);
        console.log(extraParam.winId);
       for(let index = 0; index<windows.length; index++){
           let windowId = extraParam.winId;
           if(windowId==null){
               windowId = prevWinId;
           }
           if(windows[index].id===windowId){
               let pointer = 0;
               if(index+1<windows.length){
                   pointer = index + 1;
               }
               console.log(windows[pointer]);
               chrome.windows.update(windows[pointer].id, {focused:true});
           }
       }
    });
}
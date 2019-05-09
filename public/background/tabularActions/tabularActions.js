/* eslint-disable no-undef */
//<reference types="chrome"/>

function createTab(param, extraParam) {
  notification(
      "Flow Navigate",
      "Creating new tab",
      NotificationTypeEnum.SUCCESS
  );
  chrome.tabs.create({ windowId: extraParam.winId, active: true }, (tab)=>{
    if(pinnedTabId!==null){
      pinnedTabId = tab.id;
    }
  });
}

async function deleteTab(param, extraParam) {
  notification(
      "Flow Navigate",
      "Deleting tab",
      NotificationTypeEnum.SUCCESS
  );
  let locStr = param.fields.number.Kind.StringValue;
  let locInd = param.fields.number.Kind.NumberValue;
  let nextPinnedTabId = null;
  if(pinnedWinId!==null){
    chrome.tabs.get(extraParam.tabId, (tab)=>{
      let closedTabIndex = tab.index;
      if(closedTabIndex>0){
        chrome.tabs.query({index:closedTabIndex-1, windowId:extraParam.winId},(tabs)=>{
          if(tabs.length>0){
            nextPinnedTabId = tabs[0].id;
          }
        });
      }else{
        chrome.tabs.query({index:closedTabIndex+1, windowId:extraParam.winId},(tabs)=>{
          if(tabs.length>0){
            nextPinnedTabId = tabs[0].id;
          }
        });
      }
      if (locStr === "") {
        chrome.tabs.remove(extraParam.tabId,()=>{
              pinnedTabId = nextPinnedTabId;
              console.log(pinnedTabId);
            }
        );
      } else if (locInd != null) {
        chrome.tabs.query({ index: locInd - 1 }, tabs => {
          chrome.tabs.remove(tabs[0].id,()=>{
              pinnedTabId = nextPinnedTabId;
              console.log(pinnedTabId);
          });
        });
      }
    });
  }else{
    if (locStr === "") {
      chrome.tabs.remove(extraParam.tabId);
    } else if (locInd != null) {
      chrome.tabs.query({ index: locInd - 1 }, tabs => {
        chrome.tabs.remove(tabs[0].id);
      });
    }
  }
}

function switchTab(param, extraParam) {
  notification(
      "Flow Navigate",
      "Switching tab",
      NotificationTypeEnum.SUCCESS
  );
  //Left Right
  if (param.fields.Direction.Kind.StringValue !== "") {
    locParam = param.fields.Direction.Kind.StringValue;
    chrome.tabs.get(extraParam.tabId, tab => {
      tabInd = tab.index;
      offset = 1;
      if (locParam === "left") {
        offset = -1;
      }
      if (tabInd)
        chrome.tabs.query(
          { index: tabInd + offset, windowId: extraParam.winId },
          tabs => {
            if (tabs.length > 0) {
              chrome.tabs.update(tabs[0].id, { active: true },(tab)=>{
                if(pinnedTabId!==null){
                  pinnedTabId = tab.id;
                }
              });
            }
          }
        );
    });
  }
  //Leftmost Rightmost
  else if (param.fields.TabDirection.Kind.StringValue) {
    locParam = param.fields.TabDirection.Kind.StringValue;
    locIndex = 1;
    chrome.windows.get(extraParam.winId, { populate: true }, win => {
      if (locParam === "rightmost") {
        locIndex = win.tabs.length;
      }
      chrome.tabs.query(
        { index: locIndex - 1, windowId: extraParam.winId },
        tabs => {
          if (tabs.length > 0) {
            console.log(tabs[0].id);
            chrome.tabs.update(tabs[0].id, { active: true }, (tab)=>{
              if(pinnedTabId!==null){
                pinnedTabId = tab.id;
              }
            });
          }
        }
      );
    })
  }
  //Index based
  else if (param.fields.number.Kind.NumberValue) {
    locParam = param.fields.number.Kind.NumberValue;
    chrome.tabs.query(
      { index: locParam - 1, windowId: extraParam.winId },
      tabs => {
        if (tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, { active: true },(tab)=>{
            if(pinnedTabId!==null){
              pinnedTabId = tab.id;
            }
          });
        }
      }
    );
  }
}

function helperNumberOfTabs() {
  chrome.tabs.query({ windowType: "normal" }, function(tabs) {
    console.log(
      "Number of open tabs in all normal browser windows:",
      tabs.length
    );
  });
}

function getNextPinnedTabId(closedTab){
  chrome.tabs.get(closedTab.tabId, (tab)=>{
    let closedTabIndex = tab.index;
    let id = null;
    if(closedTabIndex>0){
      chrome.tabs.query({index:closedTabIndex-1, windowId:closedTab.winId},(tabs)=>{
        if(tabs.length>0){
          id = tabs[0].id;
        }
        return id;
      });
    }else{
      chrome.tabs.query({index:closedTabIndex+1, windowId:closedTab.winId},(tabs)=>{
        if(tabs.length>0){
          id = tabs[0].id;
        }
        return id;
      });
    }
  });
}
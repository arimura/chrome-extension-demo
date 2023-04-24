chrome.browserAction.onClicked.addListener(tab => {
    chrome.storage.sync.get("enabled", data => {
      const enabled = !data.enabled;
      chrome.storage.sync.set({ enabled });
  
      chrome.browserAction.setIcon({
        path: enabled ? "icon-enabled.png" : "icon.png",
        tabId: tab.id
      });
  
      chrome.tabs.sendMessage(tab.id, { enabled });
    });
  });
  
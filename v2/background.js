chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get("enabled", (data) => {
    const enabled = !data.enabled;
    chrome.storage.sync.set({ enabled });

    chrome.action.setIcon({
      path: enabled ? "icon-enabled.png" : "icon.png",
    });

    if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) {
      console.warn('Content script cannot be executed on this URL:', tab.url);
      return;
    }

    // Send a message to the content script using chrome.scripting.executeScript
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: sendMessageToContentScript,
      args: [{ enabled }]
    });
  });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    const { tabId, windowId } = activeInfo;

    chrome.tabs.get(tabId, (tab) => {
      if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) {
        console.warn('Content script cannot be executed on this URL:', tab.url);
        return;
      }

      chrome.storage.sync.get("enabled", (data) => {
        const enabled = data.enabled;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: sendMessageToContentScript,
          args: [{ enabled }]
        });
      });

      console.log('Active tab URL:', tab.url);
    });
  });
});



// Function to send a message to the content script
function sendMessageToContentScript({ enabled }) {
  // Access the content script using the window object
  const contentScript = window.contentScript;
  if (contentScript) {
    contentScript.postMessage({ enabled });
  }
}

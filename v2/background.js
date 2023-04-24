//TODO: make it local
const enabled = false;
chrome.storage.sync.set({ enabled });

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get("enabled", (data) => {
    console.log(data.enabled);
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

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const { tabId, windowId } = activeInfo;

  const tab = await new Promise((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      resolve(tab);
    });
  });

  if (tab.url == undefined) {
    return;
  }

  if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) {
    return;
  }

  const data = await new Promise((resolve) => {
    chrome.storage.sync.get("enabled", (data) => {
      resolve(data);
    });
  });
  const enabled = data.enabled;

  console.log('Active tab URL:', tab.url);

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: sendMessageToContentScript,
    args: [{ enabled }]
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

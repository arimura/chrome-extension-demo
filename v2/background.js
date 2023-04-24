chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get("enabled", (data) => {
    const enabled = !data.enabled;
    chrome.storage.sync.set({ enabled });

    chrome.action.setIcon({
      path: enabled ? "icon-enabled.png" : "icon.png",
      // tabId: tab.id
    });

    // Send a message to the content script using chrome.scripting.executeScript
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: sendMessageToContentScript,
      args: [{ enabled }]
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

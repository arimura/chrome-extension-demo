//TODO: make it local
chrome.storage.sync.set({ enabled: false });

const storage = {
  get: (key) => new Promise(resolve => chrome.storage.sync.get(key, resolve)),
  set: (data) => new Promise(resolve => chrome.storage.sync.set(data, resolve)),
};

async function executeScriptOnTab(tabId, enabled) {
  if (enabled === undefined) {
    const data = await storage.get("enabled");
    enabled = data.enabled;
  }

  chrome.scripting.executeScript({
    target: { tabId },
    function: sendMessageToContentScript,
    args: [{ enabled }],
  });
}

function sendMessageToContentScript({ enabled }) {
  const contentScript = window.contentScript;
  if (contentScript) {
    contentScript.postMessage({ enabled });
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  const { enabled } = await storage.get("enabled");
  const newEnabled = !enabled;
  await storage.set({ enabled: newEnabled });

  chrome.action.setIcon({
    path: newEnabled ? "icon-enabled.png" : "icon.png",
  });

  if (tab.url.startsWith("http://") || tab.url.startsWith("https://")) {
    executeScriptOnTab(tab.id, newEnabled);
  } else {
    console.warn("Content script cannot be executed on this URL:", tab.url);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await new Promise(resolve => chrome.tabs.get(tabId, resolve));

  if (tab.url && (tab.url.startsWith("http://") || tab.url.startsWith("https://"))) {
    console.log("Active tab URL:", tab.url);
    executeScriptOnTab(tab.id);
  }
});



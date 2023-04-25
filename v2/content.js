let enabled = false;

async function fetchJson(localJsonFileUrl) {
    let data = {};
    try {
      const inputJSONUrl = chrome.runtime.getURL(localJsonFileUrl);
      const response = await fetch(inputJSONUrl);
      data = await response.json();
      console.log("JSON data:", data);
    } catch (error) {
      console.error("Error loading JSON data:", error);
    }
  
    return data;
  }
  

async function showInputCandidates(selector, candidates) {
  const input = document.querySelector(selector);
  if (!input) return;

  input.addEventListener("focus", () => {
    if (enabled) {
      const selectedIndex = window.prompt("Select an input candidate:", candidates.join(", "));
      if (selectedIndex >= 0 && selectedIndex < candidates.length) {
        input.value = candidates[selectedIndex];
      }
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.enabled !== undefined) {
    enabled = message.enabled;
  }
});

(async () => {
  const json = await fetchJson("data/" + window.location.hostname + ".json");
  for (const { url, selector, candidates } of json) {
    if (window.location.href === url) {
      showInputCandidates(selector, candidates);
      break;
    }
  }
})();

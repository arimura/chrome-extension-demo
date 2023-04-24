console.log("start ext");

const localJsonFileUrl = "file:///1Users/k-arimura/ghq/github.com/arimura/chrome-extension-demo/v2/input.json";
let enabled = false;

async function fetchJson() {
  const response = await fetch(localJsonFileUrl);
  return await response.json();
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
  const json = await fetchJson();
  for (const { url, selector, candidates } of json) {
    if (window.location.href === url) {
      showInputCandidates(selector, candidates);
      break;
    }
  }
})();

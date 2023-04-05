chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { urlMatches: 'https://example.com/' },
            }),
          ],
          actions: [new chrome.declarativeContent.ShowPageAction()],
        },
      ]);
    });
  });
 
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveTsvData') {
      chrome.storage.local.set({ tsvData: request.tsvData }, () => {
        sendResponse({ success: true });
      });
      return true; // Required to indicate that the response will be sent asynchronously
    }
  });
  
  
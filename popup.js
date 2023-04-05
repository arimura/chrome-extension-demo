chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("onMessage");
    if (message.focusedInput) {
      document.getElementById('suggestion-container').style.display = 'block';
    } else {
      document.getElementById('suggestion-container').style.display = 'none';
    }
  });
  
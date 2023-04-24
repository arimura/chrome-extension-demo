function createSuggestionBox() {
    const box = document.createElement('div');
    box.id = 'suggestion-box';
    box.style.display = 'none';
    box.style.position = 'absolute';
    box.style.zIndex = '9999';
    box.style.backgroundColor = '#fff';
    box.style.border = '1px solid #ccc';
    box.style.padding = '10px';
    box.style.borderRadius = '5px';
    box.innerHTML = `
      <h3>Suggested Value:</h3>
      <p id="suggested-value">example@example.com</p>
    `;
    return box;
  }
  
  const suggestionBox = createSuggestionBox();
  document.body.appendChild(suggestionBox);
  
  document.addEventListener('focusin', (event) => {
    if (event.target.tagName === 'INPUT') {
      const inputRect = event.target.getBoundingClientRect();
      suggestionBox.style.display = 'block';
      suggestionBox.style.top = `${inputRect.bottom + window.pageYOffset + 10}px`;
      suggestionBox.style.left = `${inputRect.left + window.pageXOffset}px`;
    }
  });
  
  document.addEventListener('focusout', (event) => {
    if (event.target.tagName === 'INPUT') {
      suggestionBox.style.display = 'none';
    }
  });
  
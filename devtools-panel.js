function showError(message) {
    const errorElement = document.getElementById("error");
    errorElement.innerText = message;
    errorElement.style.display = "block";
  }
  
  function hideError() {
    document.getElementById("error").style.display = "none";
  }
  
  document.getElementById("submitTsv").addEventListener("click", () => {
    hideError();
  
    const tsvData = document.getElementById("tsvInput").value;
    if (tsvData) {
      console.log("TSV Data:", tsvData);
  
      // Parse TSV data into an array of objects
      const rows = tsvData.split('\n');
      const headers = rows[0].split('\t');
      const data = rows.slice(1).map(row => {
        const rowData = row.split('\t');
        const rowObject = {};
        headers.forEach((header, index) => {
          rowObject[header] = rowData[index];
        });
        return rowObject;
      });
  
      // Save the parsed data to Chrome local storage
      chrome.runtime.sendMessage({ action: 'saveTsvData', tsvData: data }, (response) => {
        if (response.success) {
          console.log('TSV data saved to local storage');
        } else {
          console.error('Failed to save TSV data to local storage');
        }
      });
  
    } else {
      showError("No TSV data provided");
    }
  });
  
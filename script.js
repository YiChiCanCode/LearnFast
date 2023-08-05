document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.getElementById("add-button");
    const tableBody = document.getElementById("vocabulary-data");
  
    const copyButton = document.getElementById("copy-button");

    copyButton.addEventListener("click", function() {
      copyTableToClipboard();
    });

    addButton.addEventListener("click", async function() {
      const englishWord = document.getElementById("english-word").value;
  
      if (englishWord) {
        const chineseMeaning = await fetchChineseMeaning(englishWord);
        const partOfSpeech = await fetchPartOfSpeech(englishWord);
  
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${englishWord}</td>
          <td>${chineseMeaning}</td>
          <td>${partOfSpeech}</td>
        `;
        tableBody.appendChild(newRow);
        document.getElementById("english-word").value = '';
      }
    });
  });
  

  async function fetchPartOfSpeech(englishWord) {
    const response = await fetch(`https://api.datamuse.com/words?sp=${englishWord}&md=p`);
    const data = await response.json();
    return data.length > 0 ? data[0].tags[0] : 'N/A';
  }async function fetchChineseMeaning(englishWord) {
    const apiKey = 'a80eae0a174944ef9e35226ebeb74495'; // Replace with your actual Microsoft Translator API key
    const endpoint = 'https://api.cognitive.microsofttranslator.com/';
  
    try {
      const response = await fetch(`${endpoint}/translate?api-version=3.0&to=zh-Hans`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Ocp-Apim-Subscription-Region': 'global',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ text: englishWord }])
      });
  
      const data = await response.json();
  
      if (data && data[0] && data[0].translations && data[0].translations.length > 0) {
        return data[0].translations[0].text;
      } else {
        console.error('Translation error:', data);
        return null;
      }
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    }
  }
  
// Function to copy the vocabulary table to the clipboard
function copyTableToClipboard() {
  const vocabularyTable = document.getElementById("vocabulary-table");

  if (!navigator.clipboard) {
    console.error("Clipboard API not supported in this browser.");
    return;
  }

  navigator.clipboard.writeText(vocabularyTable.innerText)
    .then(() => {
      console.log("Table copied to clipboard successfully!");
    })
    .catch((error) => {
      console.error("Unable to copy table to clipboard:", error);
    });
}
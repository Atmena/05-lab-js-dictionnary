document.addEventListener("DOMContentLoaded", function() {
  const searchButton = document.querySelector("#but-input");
  const searchInput = document.querySelector("#text-input");
  const errorMessage = document.querySelector("#error-message");
  const noResultMessage = document.querySelector("#no-result-message");
  const colorSelectorButton = document.querySelector(".color-selector");
  const fontOptions = document.querySelectorAll(".font-option");

  searchButton.addEventListener("click", searchWord);
  searchInput.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      searchWord();
    }
  });

  colorSelectorButton.addEventListener("click", toggleDarkMode);

  fontOptions.forEach(option => {
    option.addEventListener("click", changeFont);
  });

  const siteBody = document.querySelector("body");
  siteBody.classList.add("serif");
});

function searchWord() {
  const wordInput = document.querySelector("#text-input");
  const word = wordInput.value.trim();
  const errorMessage = document.querySelector("#error-message");
  const noResultMessage = document.querySelector("#no-result-message");

  if (/^[a-zA-Z]+$/.test(word)) {
    errorMessage.style.display = "none";
    noResultMessage.style.display = "none";
    const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
    const synApiUrl = "https://api.datamuse.com/words?rel_syn=" + word;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const wordElement = document.querySelector("#word");
          const pronunciationIcon = document.querySelector("#prononciation");
          const definitionElement = document.querySelector("#definition");
          const audioElement = document.querySelector("#audio");
          const synonymsElement = document.querySelector("#syn-word");

          if (data[0].phonetics && data[0].phonetics.length > 0 && data[0].phonetics[0].audio) {
            wordElement.innerHTML = `${data[0].word} <img id="prononciation" src="src/media/sound-logo.svg" alt="Logo de son" width="20" height="20">`;
            pronunciationIcon.addEventListener("click", playAudio);
          } else {
            wordElement.textContent = data[0].word;
            pronunciationIcon.style.display = "none";
            pronunciationIcon.removeEventListener("click", playAudio);
          }

          if (data[0].meanings.length > 0) {
            const definition = data[0].meanings[0].definitions[0].definition;
            definitionElement.textContent = definition;
          } else {
            definitionElement.textContent = "Aucune définition trouvée.";
          }

          const audioUrl = data[0].phonetics && data[0].phonetics.length > 0 ? data[0].phonetics[0].audio : "";
          audioElement.src = audioUrl;

          fetch(synApiUrl)
            .then(response => response.json())
            .then(synData => {
              if (synData.length > 0) {
                const synonyms = synData.map(syn => syn.word);
                synonymsElement.textContent = synonyms.join(", ");
              } else {
                synonymsElement.textContent = "No synonyms found.";
              }
            })
            .catch(error => console.log("An error occurred while fetching synonyms: ", error));
        } else {
          errorMessage.style.display = "none";
          noResultMessage.style.display = "block";
        }
      })
      .catch(error => console.log("An error occurred: ", error));
  } else {
    console.log("Please enter a valid word");
    errorMessage.style.display = "block";
    noResultMessage.style.display = "none";
  }
}

function playAudio() {
  const audioElement = document.querySelector("#audio");
  audioElement.play();
}

function changeFont(event) {
  const fontClass = event.target.classList[1];
  const siteBody = document.querySelector("body");
  
  siteBody.classList.remove("serif", "sans-serif", "monospace");
  siteBody.classList.add(fontClass);

  const fontOptions = document.querySelectorAll(".font-option");
  fontOptions.forEach(option => {
    option.classList.remove("selected");
  });

  event.target.classList.add("selected");
}

function toggleDarkMode() {
  const siteBody = document.querySelector("body");
  siteBody.classList.toggle("dark-mode");
}
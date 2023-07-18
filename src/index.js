document.addEventListener("DOMContentLoaded", function() {
  let searchButton = document.querySelector("#but-input");
  let searchInput = document.querySelector("#text-input");

  searchButton.addEventListener("click", searchWord);
  searchInput.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      searchWord();
    }
  });
});

function searchWord() {
  let word = document.querySelector("#text-input").value;
  let apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
  let synApiUrl = "https://api.datamuse.com/words?rel_syn=" + word;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        let wordElement = document.querySelector("#word");
        let pronunciationIcon = document.querySelector("#prononciation");

        if (data[0].phonetics && data[0].phonetics.length > 0 && data[0].phonetics[0].audio) {
          wordElement.innerHTML = `${data[0].word} <img id="prononciation" src="src/media/sound-logo.svg" alt="Logo de son" width="20" height="20">`;
          pronunciationIcon = document.querySelector("#prononciation");
          if (pronunciationIcon) {
            pronunciationIcon.addEventListener("click", playAudio);
          }
        } else {
          wordElement.textContent = data[0].word;
          if (pronunciationIcon) {
            pronunciationIcon.style.display = "none";
            pronunciationIcon.removeEventListener("click", playAudio);
          }
        }

        let definitionElement = document.querySelector("#definition");

        if (data[0].meanings.length > 0) {
          let definition = data[0].meanings[0].definitions[0].definition;
          definitionElement.textContent = definition;
        } else {
          definitionElement.textContent = "Aucune définition trouvée.";
        }

        let audioUrl = data[0].phonetics && data[0].phonetics.length > 0 ? data[0].phonetics[0].audio : "";
        let audioElement = document.querySelector("#audio");
        audioElement.src = audioUrl;

        fetch(synApiUrl)
          .then(response => response.json())
          .then(synData => {
            if (synData.length > 0) {
              let synonymsElement = document.querySelector("#syn-word");
              let synonyms = synData.map(syn => syn.word);
              synonymsElement.textContent = synonyms.join(", ");
            } else {
              let synonymsElement = document.querySelector("#syn-word");
              synonymsElement.textContent = "No synonyms found.";
            }
          })
          .catch(error => console.log("An error occurred while fetching synonyms: ", error));
      } else {
        console.log("No results found for the searched word.");
      }
    })
    .catch(error => console.log("An error occurred: ", error));
}

function playAudio() {
  let audioElement = document.querySelector("#audio");
  audioElement.play();
}

let fontOptions = document.querySelectorAll(".font-option");

fontOptions.forEach(option => {
  option.addEventListener("click", changeFont);
});

document.addEventListener("DOMContentLoaded", function() {
  let siteBody = document.querySelector("body");
  siteBody.classList.add("serif");
});

function changeFont(event) {
  let fontClass = event.target.classList[1];
  let siteBody = document.querySelector("body");
  
  siteBody.classList.remove("serif", "sans-serif", "monospace");

  siteBody.classList.add(fontClass);

  fontOptions.forEach(option => {
    option.classList.remove("selected");
  });

  event.target.classList.add("selected");
}

const modeToggle = document.querySelector(".color-selector");
const siteBody = document.querySelector("body");

modeToggle.addEventListener("click", toggleDarkMode);

function toggleDarkMode() {
  siteBody.classList.toggle("dark-mode");
}
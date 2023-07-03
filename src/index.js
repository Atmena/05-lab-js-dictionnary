const rightMenu = document.querySelector("#right-menu");
const hiddenMenu = document.querySelector("#hidden-menu");

let menuVisible = false;

document.querySelector("#menu-right").addEventListener("click", toggleMenu);

function toggleMenu() {
  if (menuVisible) {
    hideMenu();
  } else {
    showMenu();
  }
}

function showMenu() {
  hiddenMenu.removeAttribute("hidden");
  hiddenMenu.classList.add("show");
  rightMenu.style.transform = "translateX(-3.125rem)";
  menuVisible = true;
}

function hideMenu() {
  hiddenMenu.toggleAttribute("hidden");
  hiddenMenu.classList.remove("show");
  rightMenu.style.transform = "translateX(0)";
  menuVisible = false;
}

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

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        let wordElement = document.querySelector("#word");
        let pronunciationIcon = document.querySelector("#prononciation");

        if (data[0].phonetics && data[0].phonetics.length > 0 && data[0].phonetics[0].audio) {
          wordElement.innerHTML = `${data[0].word} <img id="prononciation" src="src/media/sound-logo-white.svg" alt="Logo de son" width="20" height="20">`;
          pronunciationIcon = document.querySelector("#prononciation");
          pronunciationIcon.addEventListener("click", playAudio);
        } else {
          wordElement.textContent = data[0].word;
          pronunciationIcon.style.display = "none";
          pronunciationIcon.removeEventListener("click", playAudio);
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
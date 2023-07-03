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
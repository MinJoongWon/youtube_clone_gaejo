const iconList = document.querySelectorAll(".sidebar-top ul li");
iconList.forEach((icon) => {
  icon.addEventListener("click", () => {
    const iconSpan = icon.querySelector("span");
    const prevSelectedIcon = document.querySelector(".selected");
    if (prevSelectedIcon) {
      prevSelectedIcon.style.fontVariationSettings =
        "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48";
      prevSelectedIcon.classList.remove("selected");
    }

    iconSpan.style.fontVariationSettings =
      "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48";
    iconSpan.classList.add("selected");
  });
});

const iconList2 = document.querySelectorAll(".sidebar-top2 ul li");
iconList2.forEach((icon) => {
  icon.addEventListener("click", () => {
    const iconSpan = icon.querySelector("span");
    const prevSelectedIcon = document.querySelector(".selected");
    if (prevSelectedIcon) {
      prevSelectedIcon.style.fontVariationSettings =
        "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48";
      prevSelectedIcon.classList.remove("selected");
    }

    iconSpan.style.fontVariationSettings =
      "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48";
    iconSpan.classList.add("selected");
  });
});

let menu = document.querySelector('.yt-button-icon');
// menu.addEventListener("click", menuEvent);
const sidebar = document.querySelector('.sidebar');
const channelSection = document.querySelector('.channel-section');

menu.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  channelSection.classList.toggle('active');
});


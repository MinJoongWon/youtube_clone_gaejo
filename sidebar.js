const iconList = document.querySelectorAll(".sidebar-top ul li");
iconList.forEach((icon) => {
  icon.addEventListener("click", () => {
    const iconSpan = icon.querySelector("span");
    console.log(iconSpan);
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
    console.log(iconSpan);
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

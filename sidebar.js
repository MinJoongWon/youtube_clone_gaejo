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

function menuEvent() {
  let side = document.querySelector('.sidebar');
  let sidebarTop2 = document.querySelector('.sidebar-top2');
  let sidebarSubscriptions = document.querySelector('.sidebar-subscriptions');
  let sidebarMoreFrom = document.querySelector('.sidebar-more-from');
  let sidebarBottom = document.querySelector('.sidebar-bottom');
  let sidebarFooter = document.querySelector('.sidebar-footer');
  let channelSection = document.querySelector('.channel-section');
  let sidebarTop = document.querySelector('.sidebar-top > ul > li');
  
  if (side.style.width == '240px' || side.style.width == 0) {
    side.style.width = '70px'
    sidebarTop2.style.display = 'none';
    sidebarSubscriptions.style.display = 'none';
    sidebarMoreFrom.style.display = 'none';
    sidebarBottom.style.display = 'none';
    sidebarFooter.style.display = 'none';
    channelSection.style.marginLeft = '70px';
  } else {
    side.style.width = '240px';
    sidebarTop.style = '';
    sidebarTop2.style = '';
    sidebarSubscriptions.style = '';
    sidebarMoreFrom.style = '';
    sidebarBottom.style = '';
    sidebarFooter.style = '';
    channelSection.style.marginLeft = '240px';
  }
}

let menu = document.querySelector('.yt-button-icon');
menu.addEventListener("click", menuEvent);
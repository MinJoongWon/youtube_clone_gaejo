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

const sidebarMoreFrom = document.querySelectorAll(".sidebar-more-from ul li");
sidebarMoreFrom.forEach((icon) => {
  icon.addEventListener("click", () => {
    if (icon.children.length > 0) {
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
    }
  });
});

const sidebaBottom = document.querySelectorAll(".sidebar-bottom ul li");
sidebaBottom.forEach((icon) => {
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
const sidebar = document.querySelector('.sidebar');

menu.addEventListener('click', () => {
  const channelSection = document.querySelector('.channel-section');
  const videoSection = document.querySelector('.video-body');
  const homeSection = document.querySelector('.section');
  const topMenu = document.querySelector('.top-menu');
  const topMenuLeft = document.querySelector('.top-menu-icon-left');
  sidebar.classList.toggle('active');
  if (homeSection !== null) {
    homeSection.classList.toggle('active');
    topMenu.classList.toggle('active');
  }
  if (topMenuLeft) {
    if (sidebar.classList.contains('active')) {
      topMenuLeft.style.left = '240px';
    } else {
      topMenuLeft.style.left = '110px';
    }
  }
  if (channelSection !== null) {
    channelSection.classList.toggle('active');
  }
  if (videoSection !== null) {
    if (sidebar.classList.contains('active')) {
      videoSection.style.opacity = 0.5; 
      sidebar.style.width = '240px'; 
      sidebar.style.transition = 'transition: width 0.3s ease, transform 0.3s ease';
      document.querySelector('body').style.overflow = 'hidden';
    } else {
      videoSection.style.opacity = 1;
      sidebar.style.width = '0'; 
      sidebar.style.transition = 'transition: width 0.3s ease, transform 0.3s ease';
      document.querySelector('body').style.overflow = 'auto';
    }
  }
});

document.addEventListener('click', (event) => {
  const videoSection = document.querySelector('.video-body');
  if (videoSection) {
    if (!sidebar.contains(event.target) && !menu.contains(event.target)) {
      if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        videoSection.style.opacity = 1;
        sidebar.style.width = '0'; 
        sidebar.style.transition = 'transition: width 0.3s ease, transform 0.3s ease';
        document.querySelector('body').style.overflow = 'auto';
      }
    }
  }
});

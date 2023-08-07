const userProfile = document.querySelector('.nav-profile-pic > .user-avatar');
const notification = document.querySelector('.nav-profile-notifications');

userProfile.addEventListener("click", () => {
    const profileList = document.querySelector('.nav-profile-pic-list');
    profileList.classList.toggle('active');
    if (profileList.classList.contains('active')) {
        profileList.style.display = 'flex';
    } else {
        profileList.style.display = 'none';
    }
});

function getNotiContent() {
    let notiContent = document.querySelector('.notiContent');
    let notificationList = JSON.parse(localStorage.getItem('notification')) || [];
    const comment = JSON.parse(localStorage.getItem('comment')) || [];
    let userName = getUserProfile().get('userName');
    let notificationCount = 0;
    let notiContentList = [];
    const userData = getUserProfile();

    comment.sort((a, b) => new Date(b.time) - new Date(a.time));

    notificationList.forEach((noti) => {
      if (noti[0] === userName) {
        notificationCount = noti[1].notification;
        notiContentList = noti[1].commentId;
      }
    }); 

    let old = document.querySelector('.noNoti');
    if (notificationCount == 0) {
        let newComment = document.querySelectorAll('.notificationContents');
        for (let i = 0; i < newComment.length; i++) {
            notiContent.removeChild(newComment[i]);
        }
        old.style.display = 'flex';
    } else {
        old.style.display = 'none';
        const currentUrl = window.location.href;     

        for (let i = 0; i < comment.length; i++) {
            const currentUrl = window.location.href;     
            notiContentList.forEach((noti) => {
                if (noti === comment[i].commentId) {
                    let userProfile = comment[i].userProfile;
                    if (currentUrl.includes('index')) {
                        userProfile = comment[i].userProfile.substring(1);
                    } else {
                        userProfile = comment[i].userProfile;
                    }
                    
                    let newComment = document.createElement('div');
                    newComment.setAttribute('class', 'notificationContents');
                    let content = '';
                    let path = currentUrl.includes('index') ? './' : '../';
                    let videoURL = `location.href='${path}html/video.html?id=${comment[i].id}'`;
                    newComment.setAttribute('onclick', videoURL);
                    content += `
                        <img
                            src="${userProfile}"
                            class="user-avatar" alt="${comment[i].userName} avatar" title="${comment[i].userName} avatar"
                        />
                        <p>${comment[i].comment}</p>
                        <p>${timeForToday(comment[i].time)}</p>
                    `;
                    newComment.innerHTML = content;
                    notiContent.prepend(newComment);
                }
            });
        }
    }

    const navNotification = document.querySelector('.nav-profile-notifications');
    const notificationIcon = document.querySelector('.notificationCount');

    navNotification.addEventListener("click", () => {
        notificationList.forEach((noti) => {
            if (noti[0] === userName) {
                noti[1].notification = 0; 
                noti[1].isRead = true; 
                noti[1].commentId = []; 
                notificationIcon.style.display = 'none';  
            }
        });
        localStorage.setItem('notification', JSON.stringify(notificationList));
    });
}

notification.addEventListener("click", () => {
    const notiList = document.querySelector('.notificationList');
    const notiCount = document.querySelector('.notificationCount');
    notiList.classList.toggle('active');
    if (notiList.classList.contains('active')) {
        notiList.style.display = 'flex';
        getNotiContent();
    } else {
        notiList.style.display = 'none';
    }
    notiCount.style.display = 'none';
});

let isProfileListVisible = true;
document.addEventListener('click', (event) => {
    const profileList = document.querySelector('.nav-profile-pic-list');
    isProfileListVisible = !isProfileListVisible;
    if (isProfileListVisible && !profileList.contains(event.target)) {
        profileList.classList.remove('active');
        profileList.style.display = 'none';
        profileList.style.transition = 'transition: width 0.3s ease, transform 0.3s ease';
    }
});

let isNotificationListVisible = true;
document.addEventListener('click', (event) => {
    const nofiList = document.querySelector('.notificationList');
    isNotificationListVisible = !isNotificationListVisible;
    if (isNotificationListVisible && !nofiList.contains(event.target)) {
        nofiList.classList.remove('active');
        nofiList.style.display = 'none';
        nofiList.style.transition = 'transition: width 0.3s ease, transform 0.3s ease';
    }
});

function getUserProfile() {
    let storedUser = localStorage.getItem('user');
    let userName = '';
    let userProfile = '';
  
    if (storedUser) {
      let userData = new Map(JSON.parse(storedUser));
      userName = userData.get('userName');
      userProfile = userData.get('userProfile');
    } else {
      userName = 'oreumi';
      userProfile = '../images/oreumi_logo.jpg';
    }
  
    let userData = new Map();
    userData.set('userName', userName);
    userData.set('userProfile', userProfile);
    return userData;
  }

function setProfile(profile) {
    let userName = profile.querySelector('p').innerText;
    let profileMap = {
        "Oreumi": "../images/oreumi_logo.jpg",
        "Gaejo": "../images/cooldog.jpg",
        "Eunha": "../images/sidebar_user_eunha.jpg",
        "Chaerim": "../images/sidebar_user_chaerim.jpg",
        "Joongwon": "../images/sidebar_user_joongwon.jpg",
        "Junsung": "../images/sidebar_user_junsung.jpg",
    };

    let userProfile = profileMap[userName];
    let userData = new Map();
    userData.set('userName', userName);
    userData.set('userProfile', userProfile);
    
    localStorage.setItem('user', JSON.stringify(Array.from(userData.entries())));
}

function setNotification() {
    const notificationData = localStorage.getItem('notification');
    if (notificationData === null) {
        let oreumi = {
            "notification": 0,
            "commentId": [],
            "isRead": false
        };
        let gaejo = {
            "notification": 0,
            "commentId": [],
            "isRead": false
        };
    
        let notiData = new Map();
        notiData.set('Oreumi', oreumi);
        notiData.set('Gaejo', gaejo);
    
        localStorage.setItem('notification', JSON.stringify(Array.from(notiData.entries())));
    }
}
window.onload = setNotification();

function updateProfile() {
    const commentProfile = document.querySelector('.comment-input-area > .profile-pic > img');
    let navProfile = document.querySelector('.nav-profile-pic > img')
    const userData = getUserProfile();
  
    if (commentProfile) {
        commentProfile.src = userData.get('userProfile');
    }

    const currentUrl = window.location.href;
    if (currentUrl.includes('index')) {
        navProfile.src = userData.get('userProfile').substring(1);
    } else {
        navProfile.src = userData.get('userProfile');
    }
}
window.onload = updateProfile();

function notificationSend() {
    const userData = getUserProfile();
    let notificationList = JSON.parse(localStorage.getItem('notification')) || [];
    const navNotification = document.querySelector('.nav-profile-notifications');
    const notificationIcon = document.querySelector('.notificationCount');

    navNotification.addEventListener("click", () => {
        notificationList.forEach((noti) => {
            if (noti[0] === userData.get('userName')) {
                noti[1].notification = 0; 
                noti[1].isRead = true; 
                noti[1].commentId = [];
                notificationIcon.style.display = 'none';  
            }
        });
        localStorage.setItem('notification', JSON.stringify(notificationList));
    });

}

function updateNotificationProfilePick() {
    const userData = getUserProfile();
    const notificationList = JSON.parse(localStorage.getItem('notification')) || [];
    let notificationIcon = document.querySelector('.notificationCount');
    let notificationIconText = document.querySelector('.notificationCount > span');

    notificationList.forEach((noti) => {
        if (noti[0] === userData.get('userName')) {
            if (noti[1].isRead) {
                notificationIcon.style.display = 'none';
            } else {
                if (noti[1].notification > 0) {
                    notificationIcon.style.display = 'flex';
                    notificationIconText.innerText = noti[1].notification;
                } else {
                    notificationIcon.style.display = 'none';
                }
            }
            notificationSend();
        }
    });
}
window.onload = updateNotificationProfilePick();

const profileCandidateList = document.querySelectorAll(".nav-profile-pic-list > div");
profileCandidateList.forEach((profile) => {
    profile.addEventListener("click", (event) => {
        const profileList = document.querySelector('.nav-profile-pic-list');
        setProfile(profile);
        updateProfile();
        updateNotificationProfilePick();
        if (profile.contains(event.target)) {
            profileList.classList.remove('active');
            profileList.style.display = 'none';
            profileList.style.transition = 'transition: width 0.3s ease, transform 0.3s ease';
        }
    });
});

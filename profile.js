const userProfile = document.querySelector('.nav-profile-pic > .user-avatar');

userProfile.addEventListener("click", () => {
    const profileList = document.querySelector('.nav-profile-pic-list');
    profileList.classList.toggle('active');
    if (profileList.classList.contains('active')) {
        profileList.style.display = 'flex';
    } else {
        profileList.style.display = 'none';
    }
});

let isProfileListVisible = true;
document.addEventListener('click', (event) => {
    const profileList = document.querySelector('.nav-profile-pic-list');
    const profileImg = document.querySelector('.nav-profile-pic-list img');
    isProfileListVisible = !isProfileListVisible;
    if (isProfileListVisible && !profileList.contains(event.target)) {
        profileList.classList.remove('active');
        profileList.style.display = 'none';
        profileList.style.transition = 'transition: width 0.3s ease, transform 0.3s ease';
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

function updateProfile() {
    let commentProfile = document.querySelector('.comment-input-area > .profile-pic > img');
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

const profileCandidateList = document.querySelectorAll(".nav-profile-pic-list > div");
profileCandidateList.forEach((profile) => {
    profile.addEventListener("click", (event) => {
        const profileList = document.querySelector('.nav-profile-pic-list');
        setProfile(profile);
        updateProfile();
        if (profile.contains(event.target)) {
            profileList.classList.remove('active');
            profileList.style.display = 'none';
            profileList.style.transition = 'transition: width 0.3s ease, transform 0.3s ease';
        }
    });
});


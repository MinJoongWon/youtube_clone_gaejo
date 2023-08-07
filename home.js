let topMenuCurrentPosition = 0;

// top-menu에 태그 추가
async function addTopMenu(videoList, selectedTag) {
    const videoTags = new Set(videoList.flatMap(video => video.video_tag));

    const topMenuItem = document.querySelector(".top-menu-item > ul");
    const isTagSelected = videoTags.has(selectedTag.toLowerCase());
    let innerHTML = '';

    if (selectedTag === '' || !isTagSelected) {
        innerHTML += `<li><span class='selected' onclick="clickTagSearch('')">전체</span></li>`;
    } else {
        innerHTML += `<li><span onclick="clickTagSearch('')">전체</span></li>`;
    }

    for (const tag of videoTags) {
        if (selectedTag.toLowerCase() === tag.toLowerCase()) {
            innerHTML += `<li><span class='selected' onclick="clickTagSearch('${tag}')">${tag}</span></li>`;
        } else {
            innerHTML += `<li><span onclick="clickTagSearch('${tag}')">${tag}</span></li>`;
        }
    }

    topMenuItem.innerHTML = innerHTML;

    const tagsContainer = document.querySelector('.top-menu-item ul');
    const topMenuLeft = document.querySelector('.top-menu-icon-left');
    const topMenuIcon = document.querySelector('.top-menu-icon');
    if (topMenuLeft) {
        topMenuLeft.style.visibility = 'hidden';
    }
    if (videoTags.size < 10) {
        topMenuIcon.style.visibility = 'hidden';
    } else {
        topMenuIcon.style.visibility = 'visible';
    }
    tagsContainer.style.transform = `translateX(0)`;
}

function homeHoverPlay(thumbnailItems) {
    for (let i = 0; i < thumbnailItems.length; i++) {
        let item = thumbnailItems[i];
        let thumbnailPic = item.querySelector('.thumbnail-pic');
        let current = item.querySelector('.video-play');
        let videoTime = item.querySelector('.video-time');

        item.addEventListener('mouseenter', function() {
            timeoutId = setTimeout(function() {
                current.style.display = "block";
                videoTime.style.display = "none";
                thumbnailPic.style.height = "0px";
                current.muted = true;
                current.play();
            }, 500);
        });
        item.addEventListener('mouseleave', function() {
            clearTimeout(timeoutId);
            current.currentTime = 0;
            current.style.display = "none";
            videoTime.style.display = "block";
            thumbnailPic.style.height = "inherit";
        });
    }
}

function checkCurrentUrl(currentUrl) {
    if (currentUrl.includes('channel') || currentUrl.includes('video')) {
        let channelSection = document.querySelector('.channel-section');
        if (channelSection != null) {
            channelSection.style.display = 'none';
        }

        let homeBody = document.querySelector('.home-body');
        let video = document.querySelector('.video-body');
        if (video != null) {
            video.style.display = 'none';
            let sidebar = document.querySelector('.sidebar');
            sidebar.style.display = 'flex';
            sidebar.style.width = '240px';
            sidebar.classList.add('active');
            document.querySelector('body').style.backgroundColor = 'black';
        }

        homeBody.style.display = 'flex';
        let setcionTag = `
        <div class="section active">
            <section>
                <div class="top-menu active">
                    <div class="top-menu-item">
                        <ul>
                        </ul>
                    </div>
                    <div class="top-menu-icon">
                        <button class="top-menu-icon-leftBotton">
                            <img src="../images/top-menu-right.png" alt="arrow_right" title="arrow">
                        </button>
                    </div>
                </div>
                <div class="thumbnail-box">
                </div>
        </section>
        </div>`;
        homeBody.innerHTML = setcionTag;
        if (channelSection != null) {
            channelSection.after(homeBody);
        }
        if (video != null) {
            video.after(homeBody);
        }
    }
}

async function getChannelName(videoList) {
    let channelNames = new Set();
    videoList.forEach(video => channelNames.add(video.video_channel));

    let channelNameMap = new Map();
    await Promise.all(
        Array.from(channelNames).map(async (channelName) => {
            let value = await channelData(channelName);
            channelNameMap.set(channelName, value.channel_profile);
        })
    );

    return channelNameMap;
}

// home.html 비디오 리스트 표시
async function displayHomeItem(findVideoList, selecteTag) {
    let videoList;
    if (findVideoList.length > 0) {
        videoList = findVideoList;
    } else {
        videoList = await getVideoList();
    }

    const currentUrl = window.location.href;
    checkCurrentUrl(currentUrl);

    let thumbnail = document.querySelector('.thumbnail-box');
    let info = '';
    let videoInfoPromises = videoList.map((video) => videoData(video.video_id));
    let videoInfoList = await Promise.all(videoInfoPromises);
    let channelNameMap = await getChannelName(videoList);

    for (let i = 0; i < videoList.length; i++) {
        let videoInfo = videoInfoList[i];
        let videoId = videoList[i].video_id;

        const path = currentUrl.includes('/html/') ? '../html' : './html';

        let videoURL = `location.href='${path}/video.html?id=${videoId}'`;
        let channelImg = channelNameMap.get(videoList[i].video_channel);
        let channelUrl = `location.href='${path}/channel.html?id=${videoInfo.video_channel}'`;
        let uploadTime = timeForToday(videoInfo.upload_date);

        info += `
        <div class="thumbnail">
            <div class="thumbnail-item">
                <div class="thumbnail-item-image">
                    <img class="thumbnail-pic" src="${videoInfo.image_link}" onclick="${videoURL}" alt="${videoInfo.video_title}" title="${videoInfo.video_title}">
                    <video class="video-play played" src="${videoInfo.video_link}" onclick="${videoURL}" controls alt="${videoInfo.video_title}" title="${videoInfo.video_title}" style='display:none;'></video>
                    <p class="video-time">0:10</p>
                </div>
            </div>
            
            <div class="thumbnail-desc">
                <div class="thumbnail-profile-pic">
                    <img class="user-avatar" src="${channelImg}" onclick="${channelUrl}">
                </div>
                <div class="thumbnail-desc-box">
                    <div class="thumbnail-desc-title">
                        <span><a href='./html/video.html?id=${videoId}'>${videoInfo.video_title}</a></span>
                    </div>
                    <div class="thumbnail-desc-info">
                        <div class="thumbnail-channelName">
                            <span><a href='./html/channel.html?id=${videoInfo.video_channel}'>${videoInfo.video_channel}</a></span>
                        </div>
                        <div class="thumbnail-time">
                            <span>${formatCount(videoInfo.views)} Views ·</span>
                            <span>${uploadTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    thumbnail.innerHTML = info;
    addTopMenu(videoList, selecteTag);

    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    homeHoverPlay(thumbnailItems);
}

// 검색기능
async function search(searchText) {
    searchText = searchText.toLowerCase();
    let videoList = await getVideoList();
    let videoTags = new Set();
    videoList.forEach(video => video.video_tag.forEach(tag => videoTags.add(tag)));

    let findVideoList = videoList.filter((video) => {
        let title = video.video_title.toLowerCase();
        let detail = video.video_detail.toLowerCase();
        let channelName = video.video_channel.toLowerCase();
        let tag = video.video_tag;
        let lowerCaseTag = tag.map(element => {
            return element.toLowerCase();
        });

        if (title.includes(searchText) || detail.includes(searchText)
            || channelName.includes(searchText) || lowerCaseTag.includes(searchText)) {
            return true;
        }
    });

    if (findVideoList.length !== 0) {
        displayHomeItem(findVideoList, searchText);
    } else {
        alert("no search List T.T");
    }
}

const searchIcon = document.querySelector(".searchBox-icon > .searchBox-Button");
const searchBox = document.querySelector(".searchBox-input");
searchIcon.addEventListener("click", function () {
    search(searchBox.value);
});
searchBox.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        search(searchBox.value);
    }
});

// 태그 클릭시 검색 할 수 있도록
function clickTagSearch(tag) {
    search(tag);

    let topmenu = document.querySelectorAll(".top-menu-item>ul>li>span");
    topmenu.forEach(item => {
        item.addEventListener("click", function() {
            topmenu.forEach(menuItem => {
                menuItem.classList.remove("selected");
            });
        });
    });
}

// top-menu 슬라이드
const slideWidth = 200; // 슬라이드의 너비

function slideTags() {
    const tagsContainer = document.querySelector('.top-menu-item ul');
    const containerWidth = document.querySelector('.top-menu-item').offsetWidth;
    const minPosition = -containerWidth; // 최소 이동 범위
    
    if (topMenuCurrentPosition > minPosition + slideWidth + 72) {
        topMenuCurrentPosition -= slideWidth; // 슬라이드를 왼쪽으로 이동시키기 위해 감소
        top_menu_left_button.style.visibility = 'visible';
    }

    tagsContainer.style.transform = `translateX(${topMenuCurrentPosition}px)`;
}

function slideVideoCardsLeft() {
    const tagsContainer = document.querySelector('.top-menu-item ul');
    const maxPosition = 0; // 최대 이동 범위 (초기 위치)
    
    if (topMenuCurrentPosition < maxPosition) {
        topMenuCurrentPosition += slideWidth; // 슬라이드를 왼쪽으로 이동시키기 위해 증가
    } else if (topMenuCurrentPosition >= 0){
        top_menu_left_button.style.visibility = 'hidden';
    }

    tagsContainer.style.transform = `translateX(${topMenuCurrentPosition}px)`;
}

const top_menu_button = document.querySelector('.top-menu-icon');
if (top_menu_button) {
    top_menu_button.addEventListener('click', slideTags);
}

let top_menu_left_button = document.querySelector('.top-menu-icon-left');
if (top_menu_left_button) {
    top_menu_left_button.addEventListener('click', slideVideoCardsLeft);
}

// 음성 인식 검색
const searchConsole = document.querySelector(".mic");
function availabilityFunc() {
  recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = "ko"; 
  recognition.maxAlternatives = 5;

  if (!recognition) {
    alert("현재 브라우저는 사용이 불가능합니다.");
  }
}

function startRecord() {
  recognition.addEventListener("speechstart", () => {
  });
  recognition.addEventListener("speechend", () => {
    recognition.stop(); 
  });
  //음성인식 결과를 반환
  recognition.addEventListener("result", (e) => {
    const recognitionSearchText = e.results[0][0].transcript;
    document.querySelector(".searchBox-input").value = recognitionSearchText;
    search(recognitionSearchText);
  });
  recognition.start();
}

searchConsole.addEventListener("click", () => {
    availabilityFunc();
    searchConsole.addEventListener("click", startRecord());
});
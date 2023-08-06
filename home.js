// api 주소
// http://oreumi.appspot.com/api-docs
// api Request URL
// http://oreumi.appspot.com/video/getVideoList

//GPT API 불러보기..
// API 엔드포인트 URL
const videoListApi = 'https://oreumi.appspot.com/video/getVideoList';
let topMenuCurrentPosition = 0;
// 비디오 리스트
async function getVideoList() {
    try {
        const response = await fetch(videoListApi);
        const videoInfo = await response.json();
        return videoInfo;
    } catch (error) {
        console.error('API 호출에 실패하였습니다.:', error.message);
    }
}

// 채널 정보
async function channelData(channelId) {
    try {
        const channelUrl = `https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channelId}`;
        const response = await fetch(channelUrl, {
            method: 'POST'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

// 비디오 정보
async function videoData(videoId) {
    try {
        const apiUrl = `https://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

function timeForToday(value) {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);

    if (betweenTime < 1) return '방금전';
    if (betweenTime < 60) {
        return `${betweenTime}분 전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간 전`;
    }

    const betweenWeek = Math.floor(betweenTime / 60 / 24 / 7);
    if (betweenWeek > 1 && betweenWeek <= 4) {
        return `${betweenWeek}주 전`;
    }

    const betweenMonth = Math.floor(betweenTime / 60 / 24 / 30);
    if (betweenMonth >= 1 && betweenMonth < 30) {
        return `${betweenMonth}개월 전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return `${betweenTimeDay}일 전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년 전`;
}

function formatCount(count) {
    if (count < 1000) {
        return `${count.toString()}`;
    } else if (count < 1000000) {
        const thousands = (count / 1000).toFixed(1);
        return `${thousands}K`;
    } else {
        const millions = (count / 1000000).toFixed(1);
        return `${millions}M`;
    }
}

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
    if (topMenuLeft) {
        topMenuLeft.style.visibility = 'hidden';
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

function videoHoverPlay(thumbnailItems) {
    for (let i = 0; i < thumbnailItems.length; i++) {
        let item = thumbnailItems[i];
        let thumbnailPic = item.querySelector('.thumbnail-pic');
        let current = item.querySelector('.secondary-video-play');
        let videoTime = item.querySelector('.secondary-video-time');

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

// home.html 비디오 리스트 표시
async function displayHomeItem(findVideoList, selecteTag) {
    let videoList;
    if (findVideoList.length > 0) {
        videoList = findVideoList;
    } else {
        videoList = await getVideoList();
    }

    const currentUrl = window.location.href;
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

    let thumbnail = document.querySelector('.thumbnail-box');
    let info = '';

    let videoInfoPromises = videoList.map((video) => videoData(video.video_id));
    let videoInfoList = await Promise.all(videoInfoPromises);

    let channelNames = new Set();
    videoList.forEach(video => channelNames.add(video.video_channel));

    let channelNameMap = new Map();
    await Promise.all(
        Array.from(channelNames).map(async (channelName) => {
            let value = await channelData(channelName);
            channelNameMap.set(channelName, value.channel_profile);
        })
    );

    for (let i = 0; i < videoList.length; i++) {
        let videoInfo = videoInfoList[i];
        let videoId = videoList[i].video_id;

        let path = '';
        if (currentUrl.includes('/html/')) {
            path = '../html';
        } else {
            path = './html';
        }
        let videoURL = `location.href='${path}/video.html?id=${videoId}'`;

        let channelImg = channelNameMap.get(videoList[i].video_channel);
        let channelUrl = `location.href='${path}/channel.html?id=${videoInfo.video_channel}'`;
        let uploadTime = timeForToday(videoInfo.upload_date);

        info += `
        <div class="thumbnail">
            <div class="thumbnail-item">
                <div class="thumbnail-item-image">
                    <img class="thumbnail-pic" src="${videoInfo.image_link}" onclick="${videoURL}" alt="${videoInfo.video_title}" title="${videoInfo.video_title}">
                    <video class="video-play played" src="${videoInfo.video_link}" onclick="${videoURL}" control salt="${videoInfo.video_title}" title="${videoInfo.video_title}" style='display:none;'></video>
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

// video.html에 비디오 리스트 출력
async function displayVideoItem(findVideoList) {
    let videoList;
    if (findVideoList.length > 0) {
        videoList = findVideoList;
    } else {
        videoList = await getVideoList();
    }

    let videoTag = document.querySelector('.videos');
    let info = '';

    let videoInfoPromises = videoList.map((video) => videoData(video.video_id));
    let videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;
        let videoInfo = videoInfoList[i];
        let videoURL = `location.href='../html/video.html?id=${videoId}'`;
        let uploadTime = timeForToday(videoInfo.upload_date);

        info += `
            <div class="secondary-thumbnail">
                <div class="video-item">
                    <img class="thumbnail-pic" src="${videoInfo.image_link}" onclick="${videoURL}" alt="${videoInfo.video_title}" title="${videoInfo.video_title}">
                    <video class="secondary-video-play played" src="${videoInfo.video_link}" onclick="${videoURL}" control salt="${videoInfo.video_title}" title="${videoInfo.video_title}" style='display:none;'></video>
                    <p class="secondary-video-time">0:10</p>
                </div>
                <div class="video-text">
                    <p><a href='../html/video.html?id=${videoId}'>${videoInfo.video_title}</a></p>
                    <div class="channel-desc">
                        <span class="channel-name">${videoInfo.video_channel}</span>
                        <p>
                            <span class="channel-views">${formatCount(videoInfo.views)} Views ·</span>
                            <span class="channel-upload-time">${uploadTime}</span>
                        </p>
                    </div>
                </div>
            </div>`;
    }

    videoTag.innerHTML = info;

    const thumbnailItems = document.querySelectorAll('.video-item');
    videoHoverPlay(thumbnailItems);
}

// video.html 비디오 플레이어 데이터 추가
async function getVideoPlayerData() {
    const currentUrl = window.location.href;
    let idx = currentUrl.indexOf('?');

    if (idx !== -1) {
        let id = currentUrl.substring(idx + 4);
        let player = document.querySelector('video');
        let title = document.querySelector('.title > span');
        let channelName = document.querySelector('.profile-name > a');
        let views = document.querySelector('.video-views');
        let upload_date = document.querySelector('.time');
        let video_detail = document.querySelector('.video-description > p');
        let channelProfile = document.querySelector('.profile-pic > .user-avatar');

        let data = videoData(id);
        let name = '';
        data.then((v) => {
            player.src = v.video_link;
            title.innerHTML = v.video_title;
            channelName.innerHTML = v.video_channel;
            channelName.setAttribute("title", v.video_channel);
            channelName.setAttribute("href", `channel.html?id=${v.video_channel}`);
            views.innerHTML = formatCount(v.views);
            upload_date.innerHTML = timeForToday(v.upload_date);
            video_detail.innerHTML = v.video_detail;

            name = v.video_channel;

            let subscribers = document.querySelector('.subscribers > span');
            let channel = channelData(name);
            channel.then((c) => {
                channelProfile.setAttribute("src", c.channel_profile);
                let videoURL = `location.href='../html/channel.html?id=${name}'`;
                channelProfile.setAttribute("onclick", videoURL);
                channelProfile.setAttribute("alt", `${name} 프로필`);
                channelProfile.setAttribute("title", `${name} 프로필`);
                subscribers.innerHTML = `${formatCount(c.subscribers)}`;
            });
        });
    }
}

// video.html의 top-menu 태그 클릭 시 검색
const tags = document.querySelectorAll('.video-top-menu li');

tags.forEach(tag => {
    tag.addEventListener('click', function (event) {
        const clickedTag = event.target;
        if (clickedTag.textContent == 'ALL') {
            displayVideoItem([]);
        } else {
            searchVideoTag(clickedTag.textContent);
        }
    });
});

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

async function searchVideoTag(searchText) {
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
        displayVideoItem(findVideoList);
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
    const maxPosition = 0; // 최대 이동 범위 (초기 위치)
    const minPosition = -containerWidth; // 최소 이동 범위
    
    if (topMenuCurrentPosition > minPosition + slideWidth) {
        topMenuCurrentPosition -= slideWidth; // 슬라이드를 왼쪽으로 이동시키기 위해 감소
        top_menu_left_button.style.visibility = 'visible';
    } else if (topMenuCurrentPosition != 0){
    }

    tagsContainer.style.transform = `translateX(${topMenuCurrentPosition}px)`;
}

function slideVideoCardsLeft() {
    const tagsContainer = document.querySelector('.top-menu-item ul');
    const containerWidth = document.querySelector('.top-menu-item').offsetWidth;
    const maxPosition = 0; // 최대 이동 범위 (초기 위치)
    const minPosition = -containerWidth; // 최소 이동 범위
    
    if (topMenuCurrentPosition < maxPosition) {
        topMenuCurrentPosition += slideWidth; // 슬라이드를 왼쪽으로 이동시키기 위해 wmdrk
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

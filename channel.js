const channelInfoApi = 'http://oreumi.appspot.com/channel/getChannelInfo?video_channel=oreumi';
const channelVideoListApi = 'http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi';

async function getChannelInfo(channelName) {
    let newUrl = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channelName}`;
    try {
        const response = await fetch(newUrl, {
            method: 'POST'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

async function getChannelVideo(channelName) {
    let newUrl = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=${channelName}`;
    try {
        const response = await fetch(newUrl, {
            method: 'POST'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

async function getVideoData(videoId) {
    try {
        const apiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
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
        return `${betweenTime}분전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간전`;
    }

    const betweenWeek = Math.floor(betweenTime / 60 / 24 / 7);
    if (betweenWeek > 1 && betweenWeek <= 4) {
        return `${betweenWeek}주전`;
    }

    const betweenMonth = Math.floor(betweenTime / 60 / 24 / 30);
    if (betweenMonth >= 1 && betweenMonth < 30) {
        return `${betweenMonth}개월전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return `${betweenTimeDay}일전`;
    }


    return `${Math.floor(betweenTimeDay / 365)}년전`;
}

async function displayChannelVideoList(channelName, findChannelVideoList) {
    let channelVideoList;
    if (findChannelVideoList.length > 0) {
        channelVideoList = findChannelVideoList;
    } else {
        channelVideoList = await getChannelVideo(channelName);
    }
    
    let videoIdList = [];
    channelVideoList.forEach(videoList => videoIdList.push(videoList.video_id));

    let mainVideo = document.querySelector('.small-video .player video');
    let mainVideoTitle = document.querySelector('.small-video-desc .video-title .title');
    let mainVideoTime = document.querySelector('.small-video-desc .video-title .time');
    let mainVideoDesc = document.querySelector('.small-video-desc .descriptions');
    let videoCard = document.querySelector('.video-card');
    let innerInfo = ''

    for (let i = 0; i < videoIdList.length; i++) {
        let videoId = videoIdList[i];
        let videoInfo = await getVideoData(videoId);
        let videoURL = `location.href='../html/video.html?id=${videoId}'`;
        let uploadTime = timeForToday(videoInfo.upload_date);

        if (i == 0) {
            mainVideo.src = videoInfo.video_link;
            mainVideoTitle.innerText = videoInfo.video_title;
            mainVideoTitle.setAttribute("title", videoInfo.video_title);
            mainVideoTime.innerText = videoInfo.views.toLocaleString() + ' views . ' + uploadTime;
            mainVideoDesc.innerText = videoInfo.video_detail;
        }

        innerInfo += `
        <div class="xsamll-video">
            <div class="video-desc">
                <video src="${videoInfo.video_link}" onclick="${videoURL}" controls></video>
                <p title="${videoInfo.video_title}">${videoInfo.video_title}</p>
                <div class="video-desc-views">
                    <p class="channel-name">${videoInfo.video_channel}</p>
                    <p class="channel-views">${videoInfo.views.toLocaleString() + ' views. ' + uploadTime}</p>
                </div>
            </div>
        </div>
        `
    }
    videoCard.innerHTML = innerInfo;
}

async function displayChannelInfo() {
    const currentUrl = window.location.href;
    let idx = currentUrl.indexOf('?');
    let parseChannelName = '';

    if (idx !== -1) {
        parseChannelName = currentUrl.substring(idx + 4);
    }

    let channelBanner = document.querySelector(".channel-cover img");
    let channelProfile = document.querySelector(".channel-profile .profile-pic .user-avatar");
    let channelName = document.querySelector(".channel-profile-name");
    let channelSubscribers = document.querySelector(".channel-subscribes");

    let data = getChannelInfo(parseChannelName);
    data.then((v) => {
        channelBanner.src = v.channel_banner;
        channelProfile.src = v.channel_profile;
        channelProfile.setAttribute('alt', `${v.channel_name} 프로필`);
        channelProfile.setAttribute('title', `${v.channel_name} 프로필`);
        channelName.innerHTML = v.channel_name;
        channelSubscribers.innerHTML = formatSubscribersCount(v.subscribers);
    });

    displayChannelVideoList(parseChannelName, []);
}

function formatSubscribersCount(subscribers) {
    if (subscribers < 1000) {
        return `${subscribers.toString()} subscribers`;
    } else if (subscribers < 1000000) {
        const thousands = (subscribers / 1000).toFixed(1);
        return `${thousands}K subscribers`;
    } else {
        const millions = (subscribers / 1000000).toFixed(1);
        return `${millions}M subscribers`;
    }
}

// 채널 내에서 검색
async function searchInChannel(channelName, searchText) {
    let videoList = await getChannelVideo(channelName);

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
        displayChannelVideoList(parseChannelName, findVideoList);
    } else {
        let channel = document.querySelector('.channel');
        let smallVideo = document.querySelector('.small-video');
        let contentTag = document.querySelector('.content');

        let pTag = document.createElement('p');
        pTag.innerText = `이 채널에 ‘${searchText}’와(과) 일치하는 콘텐츠가 없습니다.`;
        pTag.style.color = 'white';
        pTag.setAttribute('class', 'searchResult');
        
        smallVideo.replaceChildren('');
        contentTag.replaceChildren('');

        let newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'result');
        newDiv.appendChild(pTag);
        channel.after(newDiv);
    }
}

// 채널내에서 검색
const channelSearchIcon = document.querySelector(".channel-toolbar-search > .leftArrow");
const channelSearchBox = document.querySelector(".channel-toolbar-search > input");
const currentUrl = window.location.href;
let idx = currentUrl.indexOf('?');
let parseChannelName = '';
if (idx !== -1) {
    parseChannelName = currentUrl.substring(idx + 4);
}
channelSearchIcon.addEventListener("click", function() {
    searchInChannel(parseChannelName, channelSearchBox.value);
});
channelSearchBox.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        searchInChannel(parseChannelName, channelSearchBox.value);
    }
});

// 비디오 슬라이드 
let currentPosition = 0;
const left_button_container = document.querySelector('.left-arrow-container');

function slideVideoCards() {
    const video_cards = document.querySelector('.video-card');
    currentPosition = currentPosition - 218;
    console.log(currentPosition);
    video_cards.style.transform = translateX(`${currentPosition}px`);

    if(currentPosition != 0) {
        left_button_container.style.visibility = 'visible';
    }
}

function slideVideoCardsLeft() {
    const video_cards = document.querySelector('.video-card');
    currentPosition = currentPosition + 218;
    video_cards.style.transform = translateX(`${currentPosition}px`);

    if(currentPosition == 0) {
        left_button_container.style.visibility = 'hidden';
    }
}

const right_button = document.querySelector('.right-arrow');
right_button.addEventListener('click', slideVideoCards);

const left_button = document.querySelector('.left-arrow');
left_button.addEventListener('click', slideVideoCardsLeft);
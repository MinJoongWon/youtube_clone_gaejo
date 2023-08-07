function getParseUrl() {
    const currentUrl = window.location.href;
    let idx = currentUrl.indexOf('?');
    let parseChannelName = '';

    if (idx !== -1) {
        parseChannelName = currentUrl.substring(idx + 4);
    }

    return parseChannelName;
}

async function displayMainVideo(videoInfoList) {
    let mainVideo = document.querySelector('.small-video .player video');
    let mainVideoTitle = document.querySelector('.small-video-desc .video-title .title');
    let mainVideoTime = document.querySelector('.small-video-desc .video-title .time');
    let mainVideoDesc = document.querySelector('.small-video-desc .descriptions');
    
    let viewscount = 0;
    let maxViewVideoId = 0;
    
    for (let i = 0; i < videoInfoList.length; i++) {
        let vInfo = videoInfoList[i];
        if (vInfo.views > viewscount) {
            viewscount = vInfo.views;
            maxViewVideoId = vInfo.video_id;
        }
    }

    let videoInfo = videoInfoList.find(v => v.video_id === maxViewVideoId);
    let uploadTime = timeForToday(videoInfo.upload_date);

    mainVideo.src = videoInfo.video_link;
    mainVideoTitle.innerText = videoInfo.video_title;
    mainVideoTitle.setAttribute("title", videoInfo.video_title);
    mainVideoTime.innerText = videoInfo.views.toLocaleString() + ' views · ' + uploadTime;
    mainVideoDesc.innerText = videoInfo.video_detail;
}

function hoverPlay(thumbnailItems) {
    for (let i = 0; i < thumbnailItems.length; i++) {
        let item = thumbnailItems[i];
        let thumbnailPic = item.querySelector('.xsamll-video-img');
        let current = item.querySelector('.xsamll-video-video');
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

async function displayChannelVideoList(channelName, findChannelVideoList) {
    let channelVideoList;
    if (findChannelVideoList.length > 0) {
        channelVideoList = findChannelVideoList;
    } else {
        channelVideoList = await getChannelVideo(channelName);
    }

    let videoIdList = [];
    channelVideoList.forEach(videoList => videoIdList.push(videoList.video_id));
    
    let videoInfoPromises = videoIdList.map((video) => videoData(video));
    let videoInfoList = await Promise.all(videoInfoPromises);

    displayMainVideo(videoInfoList);

    let videoCard = document.querySelector('.video-card');
    let innerInfo = ''

    for (let i = 0; i < videoInfoList.length; i++) {
        let videoInfo = videoInfoList[i];
        let videoURL = `location.href='../html/video.html?id=${videoInfo.video_id}'`;
        let uploadTime = timeForToday(videoInfo.upload_date);

        innerInfo += `
        <div class="xsamll-video">
            <div class="video-desc">
                <div>
                    <img class="xsamll-video-img" src="${videoInfo.image_link}" onclick="${videoURL}" alt="${videoInfo.video_title}" title="${videoInfo.video_title}">
                    <video class="xsamll-video-video played" src="${videoInfo.video_link}" onclick="${videoURL}" controls style='display:none;'></video>
                    <p class="video-time">0:10</p>
                </div>
                <p title="${videoInfo.video_title}">${videoInfo.video_title}</p>
                <div class="video-desc-views">
                    <p class="channel-name">${videoInfo.video_channel}</p>
                    <p class="channel-views">${formatCount(videoInfo.views) + ' views · ' + uploadTime}</p>
                </div>
            </div>
        </div>
        `
    }
    videoCard.innerHTML = innerInfo;

    const right_button = document.querySelector('.right-arrow');
    if (videoIdList.length < 5) {
        right_button.style.visibility = 'hidden';
    }

    const thumbnailItems = document.querySelectorAll('.video-desc');
    hoverPlay(thumbnailItems);
}

async function displayChannelInfo() {
    let parseChannelName = getParseUrl();

    let channelBanner = document.querySelector(".channel-cover img");
    let channelProfile = document.querySelector(".channel-profile .profile-pic .user-avatar");
    let channelName = document.querySelector(".channel-profile-name");
    let channelSubscribers = document.querySelector(".channel-subscribes");

    if (parseChannelName) {
        let data = getChannelInfo(parseChannelName);
        data.then((v) => {
            channelBanner.src = v.channel_banner;
            channelProfile.src = v.channel_profile;
            channelProfile.setAttribute('alt', `${v.channel_name} 프로필`);
            channelProfile.setAttribute('title', `${v.channel_name} 프로필`);
            channelName.innerHTML = v.channel_name;
            channelSubscribers.innerHTML = `${formatCount(v.subscribers)} subscribers`;
        });
        displayChannelVideoList(parseChannelName, []);
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

    let smallVideo = document.querySelector('.small-video');
    let contentTag = document.querySelector('.content');
    let result = document.querySelector('.result');

    if (findVideoList.length !== 0) {
        if (smallVideo.style.display === 'none') {
            smallVideo.style.display = 'inline-flex';
        }
        if (contentTag.style.display === 'none') {
            contentTag.style.display = 'flex';
        }
        result.style.display = 'none';
        displayChannelVideoList(parseChannelName, findVideoList);
    } else {
        result.style.display = 'flex';

        let pTag = document.querySelector('.result > p');
        pTag.innerText = `이 채널에 ‘${searchText}’와(과) 일치하는 콘텐츠가 없습니다.`;

        smallVideo.style.display = 'none';
        contentTag.style.display = 'none';

        let old = document.querySelector('.result > p');

        if (old != null) {
            result.removeChild(old);
            result.appendChild(pTag);
        } else {
            result.replaceChild(pTag, old);
        }
    }
}

// 채널내에서 검색
const channelSearchIcon = document.querySelector(".channel-toolbar-search > .leftArrow");
const channelSearchBox = document.querySelector(".channel-toolbar-search > input");

channelSearchIcon.addEventListener("click", function () {
    searchInChannel(getParseUrl(), channelSearchBox.value);
});
channelSearchBox.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        searchInChannel(getParseUrl(), channelSearchBox.value);
    }
});

// 비디오 슬라이드 
let currentPosition = 0;
const left_button_container = document.querySelector('.left-arrow-container');
const videoCardsWidth = document.querySelector('.video-card').offsetWidth;

function slideVideoCards() {
    const videoCards = document.querySelector('.video-card');
    const minPosition = -videoCardsWidth; 
    
    if (currentPosition >= minPosition + 218) {
        currentPosition = currentPosition - 218;
    }

    if (currentPosition <= minPosition) {
        right_button.style.visibility = 'hidden';
    }

    videoCards.style.transform = `translateX(${currentPosition}px)`;

    if (currentPosition != 0) {
        left_button_container.style.visibility = 'visible';
    }
}

function slideVideoCardsLeft() {
    const video_cards = document.querySelector('.video-card');

    if (videoCardsWidth >= 0) {
        currentPosition = currentPosition + 218;
    }

    video_cards.style.transform = `translateX(${currentPosition}px)`;

    if (currentPosition == 0) {
        left_button_container.style.visibility = 'hidden';
    }

    if (currentPosition >= -videoCardsWidth) {
        right_button.style.visibility = 'visible';
    }
}

const right_button = document.querySelector('.right-arrow');
right_button.addEventListener('click', slideVideoCards);

const left_button = document.querySelector('.left-arrow');
left_button.addEventListener('click', slideVideoCardsLeft);
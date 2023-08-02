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

async function displayChannelVideoList(channelName) {
    let channelVideoList = await getChannelVideo(channelName);
    
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

        if (i == 0) {
            mainVideo.src = videoInfo.video_link;
            mainVideoTitle.innerText = videoInfo.video_title;
            mainVideoTitle.setAttribute("title", videoInfo.video_title);
            mainVideoTime.innerText = videoInfo.views.toLocaleString() + ' views . ' + videoInfo.upload_date;
            mainVideoDesc.innerText = videoInfo.video_detail;
        }

        innerInfo += `
        <div class="xsamll-video">
            <div class="video-desc">
                <video src="${videoInfo.video_link}" onclick="${videoURL}" controls></video>
                <p title="${videoInfo.video_title}">${videoInfo.video_title}</p>
                <div class="video-desc-views">
                    <p class="channel-name">${videoInfo.video_channel}</p>
                    <p class="channel-views">${videoInfo.views.toLocaleString() + ' views. ' + videoInfo.upload_date}</p>
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
        channelName.innerHTML = v.channel_name;
        channelSubscribers.innerHTML = formatSubscribersCount(v.subscribers);
    });

    displayChannelVideoList(parseChannelName);
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


const channelInfoApi = 'http://oreumi.appspot.com/channel/getChannelInfo?video_channel=oreumi';
const channelVideoListApi = 'http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi';

// 은하님 수정본 적용시 채널 배너/이미지/이름/구독자수 까지만 수정됨
async function getChannelInfo() {
    const currentUrl = window.location.href;
    let idx = currentUrl.indexOf('?');
    let channelName = '';

    if (idx !== -1) {
        channelName = currentUrl.substring(idx + 4);
    }
    try {
        let newUrl = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channelName}`;
        let response;
        if (idx !== -1) {
            response = await fetch(newUrl, {
                method: 'POST'
            });
        } else {
            response = await fetch(channelInfoApi, {
                method: 'POST'
            });
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('API 호출에 실패했습니다.', error);
    }
}
// 수정전 원본 이상태에서는 api 주소를 oreumi 부분을 채널명으로 바꿔주면 전부적용되긴한다.
//     try {
//         const response = await fetch(channelInfoApi, {
//             method: 'POST'
//         });
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('API 호출에 실패했습니다:', error);
//     }
// }

async function getChannelVideoList() {
    try {
        const response = await fetch(channelVideoListApi, {
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

async function displayChannelVideoList() {
    let videoList = await getChannelVideoList();

    let mainVideo = document.querySelector('.small-video .player video');
    let mainVideoTitle = document.querySelector('.small-video-desc .video-title .title');
    let mainVideoTime = document.querySelector('.small-video-desc .video-title .time');
    let mainVideoDesc = document.querySelector('.small-video-desc .descriptions');
    let videoCard = document.querySelector('.video-card');
    let innerInfo = ''

    let videoInfoPromises = videoList.map((video) => getVideoData(video.video_id));
    let videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoList.length; i++) {
        let videoInfo = videoInfoList[i];
        let videoId = videoList[i].video_id;

        let videoURL = `location.href='../html/video.html?id=${videoId}'`;

        if (i == 0) {
            mainVideo.src = videoInfo.video_link;
            mainVideoTitle.innerText = videoInfo.video_title;
            mainVideoTitle.setAttribute("title", videoInfo.video_title);
            mainVideoTime.innerText = videoInfo.views.toLocaleString() + ' views . ' + videoInfo.upload_date;
            mainVideoDesc.innerText = videoInfo.video_detail;
            continue;
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

    let channelBanner = document.querySelector(".channel-cover img");
    let channelProfile = document.querySelector(".channel-profile .profile-pic .user-avatar");
    let channelName = document.querySelector(".channel-profile-name");
    let channelSubscribers = document.querySelector(".channel-subscribes");

    let data = getChannelInfo();
    data.then((v) => {
        channelBanner.src = v.channel_banner;
        channelProfile.src = v.channel_profile;
        channelName.innerHTML = v.channel_name;
        channelSubscribers.innerHTML = formatSubscribersCount(v.subscribers);
    });

    displayChannelVideoList();
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
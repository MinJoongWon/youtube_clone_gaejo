// api 주소
// http://oreumi.appspot.com/api-docs
// api Request URL
// http://oreumi.appspot.com/video/getVideoList

//GPT API 불러보기..
// API 엔드포인트 URL
const videoListApi = 'http://oreumi.appspot.com/video/getVideoList';

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

// 비디오 정보
async function videoData(videoId) {
    try {
        const apiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

// home.html 비디오 리스트 표시
async function displayHomeItem() {
    let videoList = await getVideoList();
    let thumbnail = document.querySelector('.thumbnail-box');
    let createDiv = document.createElement("div");
    let info = '';

    let videoInfoPromises = videoList.map((video) => videoData(video.video_id));
    let videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoList.length; i++) {
        let videoInfo = videoInfoList[i];
        let videoId = videoList[i].video_id;

        let videoURL = `location.href='../html/video.html?id=${videoId}'`;

        info += `
        <div class="thumbnail">
            <div class="thumbnail-item">
                <div class="thumbnail-item-image">
                    <img class="thumbnail-pic" src="${videoInfo.image_link}" onclick="${videoURL}">
                </div>
            </div>
            
            <div class="thumbnail-desc">
                <div class="thumbnail-profile-pic">
                    <img class="user-avatar" src="../images/sidebar_user_avatar.png">
                </div>
                <div class="thumbnail-desc-box">
                    <div class="thumbnail-desc-title">
                        <span><a href='../html/video.html?id=${videoId}'>${videoInfo.video_title}</a></span>
                    </div>
                    <div class="thumbnail-desc-info">
                        <div class="thumbnail-channelName">
                            <span>${videoInfo.video_channel}</span>
                        </div>
                        <div class="thumbnail-time">
                            <span>${videoInfo.views.toLocaleString()} Views .</span>
                            <span>${videoInfo.upload_date}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    createDiv.innerHTML = info;
    thumbnail.appendChild(createDiv);
}

// video.html에 비디오 리스트 출력
async function displayVideoItem() {
    let videoList = await getVideoList();
    let videoTag = document.querySelector('.videos');
    let createDiv = document.createElement("div");
    let info = '';

    let videoInfoPromises = videoList.map((video) => videoData(video.video_id));
    let videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoList.length - 1; i++) {
        let videoId = videoList[i].video_id;
        let videoInfo = videoInfoList[i];
        let videoURL = `location.href='../html/video.html?id=${videoId}'`;

        info += `
            <div class="secondary-thumbnail">
                <div class="video-item">
                    <img src="${videoInfo.image_link}" onclick="${videoURL}" controls></video>
                </div>
                <div class="video-text">
                    <p><a href='../html/video.html?id=${videoId}'>${videoInfo.video_title}</a></p>
                    <div class="channel-desc">
                        <span class="channel-name">${videoInfo.video_channel}</span>
                        <span>
                            <span class="channel-views">${videoInfo.views.toLocaleString()} Views.</span>
                            <span class="channel-upload-time">${videoInfo.upload_date}</span>
                        </span>
                    </div>
                </div>
            </div>`;
    }

    createDiv.innerHTML = info;
    videoTag.appendChild(createDiv);
}

// video.html 비디오 플레이어 데이터 추가
async function getVideoPlayerData() {
    const currentUrl = window.location.href; 
    let idx = currentUrl.indexOf('?');

    if (idx !== -1) {
        let id = currentUrl.substring(idx + 4);
        let player = document.querySelector('#video');
        let title = document.querySelector('.title > span');
        let channelName = document.querySelector('.profile-name > p');
        let views = document.querySelector('.video-views');
        let upload_date = document.querySelector('.time');
        let video_detail = document.querySelector('.video-description > p');

        let data = videoData(id);
        data.then((v) => {
            player.src = v.video_link;
            title.innerHTML = v.video_title;
            channelName.innerHTML = v.video_channel;
            views.innerHTML = v.views.toLocaleString();
            upload_date.innerHTML = v.upload_date;
            video_detail.innerHTML = v.video_detail;
        });
    }
}   
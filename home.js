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

        info += `
        <div class="thumbnail">
            <div class="thumbnail-item">
                <div class="thumbnail-item-image">
                    <img class="thumbnail-pic" src="${videoInfo.image_link}">
                </div>
            </div>
            
            <div class="thumbnail-desc">
                <div class="thumbnail-profile-pic">
                    <img class="user-avatar" src="../images/sidebar_user_avatar.png">
                </div>
                <div class="thumbnail-desc-box">
                    <div class="thumbnail-desc-title">
                        <span>${videoInfo.video_title}</span>
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

        info += `
                    <div class="secondary-thumbnail">
                        <img src="${videoInfo.image_link}" controls></video>
                    </div>
                    <div class="video-text">
                        <p>${videoInfo.video_title}</p>
                        <div class="channel-desc">
                            <span class="channel-name">${videoInfo.video_channel}</p>
                            <span class="channel-views">${videoInfo.views.toLocaleString()} Views.</p>
                            <span class="channel-upload-time">${videoInfo.upload_date}</p>
                        </div>
                    </div>`;
    }

    createDiv.innerHTML = info;
    videoTag.appendChild(createDiv);
}
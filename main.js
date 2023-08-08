// api 주소
// http://oreumi.appspot.com/api-docs
// api Request URL
// http://oreumi.appspot.com/video/getVideoList

//GPT API 불러보기..
// API 엔드포인트 URL
const videoListApi = 'https://oreumi.appspot.com/video/getVideoList';
const channelInfoApi = 'https://oreumi.appspot.com/channel/getChannelInfo?video_channel=oreumi';
const channelVideoListApi = 'https://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi';

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
    } else if (count < 1000000 && count >= 1000) {
        const thousands = (count / 1000).toFixed(1);
        return `${thousands}K`;
    } else {
        const millions = (count / 1000000).toFixed(1);
        return `${millions}M`;
    }
}

async function getChannelInfo(channelName) {
    let newUrl = `https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channelName}`;
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
    let newUrl = `https://oreumi.appspot.com/channel/getChannelVideo?video_channel=${channelName}`;
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
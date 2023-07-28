

const channelInfoApi = 'http://oreumi.appspot.com/channel/getChannelInfo?video_channel=oreumi';

async function getChannelInfo() {
    try {
        const response = await fetch(channelInfoApi, {
            method: 'POST'
        });
        const data = await response.json();
        return data;
    } catch(error) {
        console.error('API 호출에 실패했습니다:', error);
    }
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
}

function formatSubscribersCount(subscribers) {
    if (subscribers < 1000) {
        return subscribers.toString();
    } else if(subscribers < 1000000) {
        const thousands = (subscribers / 1000).toFixed(1);
        return `${thousands}K`;
    } else {
        const millions = (subscribers / 1000000).toFixed(1);
        return `${millions}M`;
    }
}
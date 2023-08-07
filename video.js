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

async function getVideoList() {
  try {
      const response = await fetch(videoListApi);
      const videoInfo = await response.json();
      return videoInfo;
  } catch (error) {
      console.error('API 호출에 실패하였습니다.:', error.message);
  }
}

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

function parseSubscribers(subscriberString) {
  const units = {
    K: 1000,
    M: 1000000,
    B: 1000000000
  };

  const regex = /^(\d+\.?\d*)([KMB])$/i;
  const match = subscriberString.match(regex);

  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    if (units[unit]) {
      return value * units[unit];
    }
  }

  return subscriberString;
}

function formatSubscribersCount(subscribers) {
  if (subscribers < 1000) {
      return `${subscribers.toString()}`;
  } else if (subscribers < 1000000) {
      const thousands = (subscribers / 1000).toFixed(1);
      return `${thousands}K`;
  } else {
      const millions = (subscribers / 1000000).toFixed(1);
      return `${millions}M`;
  }
}

function toggleLike(liked) {
  const likeCountElement = liked.nextElementSibling;
  let likeCount = parseInt(likeCountElement.textContent);
  const commentId = liked.id;

  if (liked.classList.contains('liked')) {
      liked.style.fontVariationSettings = "'FILL' 0";
      liked.classList.remove('liked');
      likeCount--;
  } else {
      liked.style.fontVariationSettings = "'FILL' 1";
      liked.classList.add('liked');
      likeCount++;
    } 
    likeCountElement.textContent = likeCount;
    saveCommentLike(commentId, likeCount);
}

function toggleDisLike(disliked) {
  const disLikeCountElement = disliked.nextElementSibling;
  let disLikeCount = parseInt(disLikeCountElement.textContent);
  const commentId = disliked.id;
  
  if (disliked.classList.contains('disliked')) {
      disliked.style.fontVariationSettings = "'FILL' 0";
      disliked.classList.remove('disliked');
      disLikeCount--;
  } else {
      disliked.style.fontVariationSettings = "'FILL' 1";
      disliked.classList.add('disliked');
      disLikeCount++;
  } 
  disLikeCountElement.textContent = disLikeCount;
  saveCommentDisLike(commentId, disLikeCount);
}

function saveCommentLike(commentId, count) {
  let localStorageItem = JSON.parse(localStorage.getItem('comment')) || [];
  localStorageItem.forEach((comment) => {
    if (comment.commentId === commentId) {
      comment.like = count;
    }
  });
  localStorage.setItem('comment', JSON.stringify(localStorageItem));
}

function saveCommentDisLike(commentId, count) {
  let localStorageItem = JSON.parse(localStorage.getItem('comment')) || [];
  localStorageItem.forEach((comment) => {
    if (comment.commentId === commentId) {
      comment.disLike = count;
    }
  });
  localStorage.setItem('comment', JSON.stringify(localStorageItem));
}

function fillLikeButtonOnClick() {
  const like = document.querySelector(".video-like span");
  let likeCount = document.querySelector(".video-like > p");
  let count = likeCount.innerHTML;
  count = parseSubscribers(count);
  
  const currentFillValue = window.getComputedStyle(like).fontVariationSettings;
  
  if(currentFillValue == "\"FILL\" 1") {
      like.style.fontVariationSettings = "'FILL' 0";
      likeCount.innerHTML = formatSubscribersCount(count - 1);
  } else {
      like.style.fontVariationSettings = "'FILL' 1";
      likeCount.innerHTML = formatSubscribersCount(count + 1);
  }
}

function fillDislikeButtonOnClick() {
    const dislike = document.querySelector(".video-dislike span");
    let dislikeCount = document.querySelector(".video-dislike > p");
    let count = dislikeCount.innerHTML;
    count = parseSubscribers(count);
    
    const currentFillValue = window.getComputedStyle(dislike).fontVariationSettings;
    
    if(currentFillValue == "\"FILL\" 1") {
        dislike.style.fontVariationSettings = "'FILL' 0";
        dislikeCount.innerHTML = formatSubscribersCount(count - 1);
    } else {
        dislike.style.fontVariationSettings = "'FILL' 1";
        dislikeCount.innerHTML = formatSubscribersCount(count + 1);
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
                  <video class="secondary-video-play played" onclick="${videoURL}" controls alt="${videoInfo.video_title}" title="${videoInfo.video_title}" style='display:none;'></video>
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
const videoTopMenuTags = document.querySelectorAll('.video-top-menu li');

videoTopMenuTags.forEach(tag => {
    tag.addEventListener('click', function (event) {
        const clickedTag = event.target;
        if (clickedTag.textContent == 'ALL') {
            displayVideoItem([]);
        } else {
            searchVideoTag(clickedTag.textContent);
        }
    });
});

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

function updateCommentList() {
  const currentUrl = window.location.href;
  let idx = currentUrl.indexOf('?');
  let id = -1;
  if (idx !== -1) {
    id = currentUrl.substring(idx + 4);
  }

  const commentList = document.querySelector(".comments");
  commentList.innerHTML = '';

  let inputData = document.querySelector(".comment-inputBox > input");

  // 저장된 댓글 목록 가져오기
  const comment = JSON.parse(localStorage.getItem('comment')) || [];

  // 각 댓글을 리스트 아이템으로 만들어 목록에 추가
  comment.forEach((comment) => {
    if (comment.id === id) {
      let createComment = document.createElement("div");
      createComment.setAttribute('class', 'comment');
      let innerHtml = `
        <div class="profile-pic">
          <img
            src="${comment.userProfile}"
            class="user-avatar" alt="${comment.userProfile} avatar"
          />
        </div>
        <div class="comment-header">
          <div class="comment-top">
            <span class="comment-name">${comment.userName}</span>
            <span class="published-date">${timeForToday(comment.time)}</span>
          </div>
          <div class="comment-text">
            <p>${comment.comment}</p>
          </div>
          <div class="comment-toolbar">
            <div class="comment-like">
              <span id="${comment.commentId}" class="material-symbols-outlined" title="좋아요" onclick="toggleLike(this)">thumb_up</span>
              <span>${comment.like}</span>
            </div>
            <div class="comment-dislike">
              <span id="${comment.commentId}" class="material-symbols-outlined" title="싫어요" onclick="toggleDisLike(this)">thumb_down</span>
              <span>${comment.disLike}</span>
            </div>
            <div class="reply">
              <span>REPLY</span>
            </div>
          </div>
        </div>
      `;
  
      createComment.innerHTML = innerHtml;
      commentList.prepend(createComment);
      inputData.value = '';
    }
  });

  let commentsCount = document.querySelector(".comments-count");
  let cnt = comment.filter((comment) => { return comment.id == id});
  commentsCount.innerHTML = cnt.length;
}

function addComment() {
  const currentUrl = window.location.href;
  let idx = currentUrl.indexOf('?');
  let id = -1;
  if (idx !== -1) {
    id = currentUrl.substring(idx + 4);
  }

  let inputData = document.querySelector(".comment-inputBox > input");
  let currentTime = new Date();

  let userData = getUserProfile();
  let localStorageItem = JSON.parse(localStorage.getItem('comment')) || [];
  let commentId = 'video' + id + 'commentId' + localStorageItem.length;

  let commentData = {
    id: id,
    commentId: commentId,
    userName: userData.get('userName'),
    userProfile: userData.get('userProfile'),
    time: currentTime,
    comment: inputData.value,
    like: 0,
    disLike: 0
  };

  localStorageItem.push(commentData);
  localStorage.setItem('comment', JSON.stringify(localStorageItem));

  updateCommentList();
}

const like = document.querySelector(".video-like");
like.addEventListener("click", fillLikeButtonOnClick); 

const dislike = document.querySelector(".video-dislike");
dislike.addEventListener("click", fillDislikeButtonOnClick); 

const commentInput = document.querySelector('.comment-inputBox > input');
commentInput.addEventListener('keyup', function(event) {
  if(event.key == 'Enter') {
    addComment();
  }
});

window.onload = updateCommentList();

let isSubscribed = false;
function subscribe() {
  const subscribeBtn = document.querySelector('.subscribes-btn > button');
  let subscribers = document.querySelector('.subscribers > span');
  let count = parseSubscribers(subscribers.innerHTML);

  isSubscribed = !isSubscribed;
  if (isSubscribed) {
    subscribeBtn.textContent = 'subscribed'.toUpperCase();
    subscribeBtn.style.opacity = 0.75;
    count++;
  } else {
    subscribeBtn.textContent = 'subscribes'.toUpperCase();
    subscribeBtn.style.opacity = 1;
    count--;
  }
  
  subscribers.innerHTML = formatSubscribersCount(count);
}

const subscribeBtn = document.querySelector('.subscribes-btn');
subscribeBtn.addEventListener("click", subscribe);

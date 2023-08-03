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
            src="../images/sidebar_user_avatar.png"
            class="user-avatar" alt="user avatar"
          />
        </div>
        <div class="comment-header">
          <div class="comment-top">
            <span class="comment-name">James Gouse</span>
            <span class="published-date">${timeForToday(comment.time)}</span>
          </div>
          <div class="comment-text">
            <p>${comment.comment}</p>
          </div>
          <div class="comment-toolbar">
            <div class="comment-like">
              <span class="material-symbols-outlined" title="좋아요">thumb_up</span>
              <span></span>
            </div>
            <div class="comment-dislike">
              <span class="material-symbols-outlined" title="싫어요">thumb_down</span>
              <span></span>
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

  let commentData = {
    id: id,
    time: currentTime,
    comment: inputData.value
  };

  let localStorageItem = JSON.parse(localStorage.getItem('comment')) || [];
  localStorageItem.push(commentData);
  localStorage.setItem('comment', JSON.stringify(localStorageItem));

  updateCommentList();
}

const like = document.querySelector(".video-like");
like.addEventListener("click", fillLikeButtonOnClick); 

const dislike = document.querySelector(".video-dislike");
dislike.addEventListener("click", fillDislikeButtonOnClick); 

const commentInput = document.querySelector('.comment-inputBox input');
commentInput.addEventListener('keyup', function(event) {
  if(event.key == 'Enter') {
    addComment();
  }
});

window.onload = updateCommentList;

let isSubscribed = false;
function subscribe() {
  const subscribeBtn = document.querySelector('.subscribes-btn > button');
  let subscribers = document.querySelector('.subscribers');
  let count = parseInt(subscribers.innerHTML.replace(/,/g, ''));

  isSubscribed = !isSubscribed;
  if (isSubscribed) {
    subscribeBtn.textContent = 'cancle subscribes'.toUpperCase();
    subscribeBtn.style.opacity = 0.75;
    count++;
  } else {
    subscribeBtn.textContent = 'subscribes'.toUpperCase();
    subscribeBtn.style.opacity = 1;
    count--;
  }
  
  subscribers.innerHTML = count.toLocaleString();
}

const subscribeBtn = document.querySelector('.subscribes-btn');
subscribeBtn.addEventListener("click", subscribe);
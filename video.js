function fillLikeButtonOnClick() {
    const like = document.querySelector(".video-like span");
    let likeCount = document.querySelector(".video-like > p");
    
    if (likeCount.contains('K')) {

    }
    
    const currentFillValue = window.getComputedStyle(like).fontVariationSettings;
    
    if(currentFillValue == "\"FILL\" 1") {
        like.style.fontVariationSettings = "'FILL' 0";
        likeCount.innerHTML = parseInt(likeCount.innerHTML) - 1;
    } else {
        like.style.fontVariationSettings = "'FILL' 1";
        likeCount.innerHTML = parseInt(likeCount.innerHTML) + 1;
    }
}

function fillDislikeButtonOnClick() {
    const dislike = document.querySelector(".video-dislike span");
    let dislikeCount = document.querySelector(".video-dislike > p");
    
    const currentFillValue = window.getComputedStyle(dislike).fontVariationSettings;
    
    if(currentFillValue == "\"FILL\" 1") {
        dislike.style.fontVariationSettings = "'FILL' 0";
        dislikeCount.innerHTML = parseInt(dislikeCount.innerHTML) - 1;
    } else {
        dislike.style.fontVariationSettings = "'FILL' 1";
        dislikeCount.innerHTML = parseInt(dislikeCount.innerHTML) + 1;
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

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
}

function addComment() {

    const comments = document.querySelector(".comments");
    let innerHtml = '';

    let inputData = document.querySelector(".comment-inputBox > input");
    let currentTime = new Date();
    let formatTime = timeForToday(currentTime);

    innerHtml = `
            <div class="comment">
              <div class="profile-pic">
                <img
                  src="../images/sidebar_user_avatar.png"
                  class="user-avatar" alt="user avatar"
                />
              </div>
              <div class="comment-header">
                <div class="comment-top">
                  <span class="comment-name">James Gouse</span>
                  <span class="published-date">${formatTime}</span>
                </div>
                <div class="comment-text">
                  <p>${inputData.value}</p>
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
            </div>`;

    comments.innerHTML += innerHtml;
    inputData.value = '';
}

const like = document.querySelector(".video-like");
like.addEventListener("click", fillLikeButtonOnClick); 

const dislike = document.querySelector(".video-dislike");
dislike.addEventListener("click", fillDislikeButtonOnClick); 

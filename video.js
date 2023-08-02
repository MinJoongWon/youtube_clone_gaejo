function fillLikeButtonOnClick() {
    const like = document.querySelector(".video-like span");
    let likeCount = document.querySelector(".video-like > p");
    
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

const like = document.querySelector(".video-like");
like.addEventListener("click", fillLikeButtonOnClick); 

const dislike = document.querySelector(".video-dislike");
dislike.addEventListener("click", fillDislikeButtonOnClick); 
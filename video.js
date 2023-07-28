function fillLikeButtonOnClick() {
    const like = document.querySelector(".video-like span");
    
    const currentFillValue = window.getComputedStyle(like).fontVariationSettings;
    
    if(currentFillValue == "\"FILL\" 1") {
        like.style.fontVariationSettings = "'FILL' 0";
    } else {
        like.style.fontVariationSettings = "'FILL' 1";
    }
}

function fillDislikeButtonOnClick() {
    const dislike = document.querySelector(".video-dislike span");
    
    const currentFillValue = window.getComputedStyle(dislike).fontVariationSettings;
    
    if(currentFillValue == "\"FILL\" 1") {
        dislike.style.fontVariationSettings = "'FILL' 0";
    } else {
        dislike.style.fontVariationSettings = "'FILL' 1";
    }
}

const like = document.querySelector(".video-like span");
like.addEventListener("click", fillLikeButtonOnClick); 

const dislike = document.querySelector(".video-dislike span");
dislike.addEventListener("click", fillDislikeButtonOnClick); 
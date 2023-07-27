//upload_date
//video_detail
//video_id
//video_tag
//video_title
//views
//위의 6개의 데이터를 가져와서 화면에 뿌려주는 함수를 만들어보자

function youtubeData() {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        if (data.Response === "False") {
          alert("정보를 가져오는데 실패했습니다.");
        } else {
          let movieInfo = "";
          movieInfo += "<p><strong>장르:</strong>" + data.upload_date + "</p>";
          movieInfo += "<p><strong>장르:</strong>" + data.video_chnnel + "</p>";
          movieInfo += "<p><strong>장르:</strong>" + data.video_detail + "</p>";
          movieInfo += "<p><strong>장르:</strong>" + data.video_id + "</p>";
          movieInfo += "<p><strong>감독:</strong>" + data.video_tag + "</p>";
          movieInfo += "<p><strong>배우:</strong>" + data.title + "</p>";
          movieInfo += "<p><strong>줄거리:</strong>" + data.views + "</p>";

          document.getElementById("movieInfo").innerHTML = movieInfo;
        }
      } else {
        alert("영화 정보를 가져오는데 실패했습니다.");
      }
    }
  };
  xhr.open(
    "GET",
    "http://oreumi.appspot.com/video/getVideoList" +
      encodeURIComponent(movieTitle),
    true
  );
  xhr.send();
}
youtubeData();


// api 주소
// http://oreumi.appspot.com/api-docs
// api Request URL
// http://oreumi.appspot.com/video/getVideoList

//GPT API 불러보기..
// API 엔드포인트 URL
const apiUrl = 'http://oreumi.appspot.com/video/getVideoList';

// Fetch API를 사용하여 API 데이터를 가져오는 함수
async function fetchDataFromApi() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('API 호출이 실패하였습니다.');
        }
        const data = await response.json();
        console.log('API 데이터:', data);
        // 여기서 API 데이터를 활용하는 코드 작성
    } catch (error) {
        console.error('오류:', error.message);
    }
}
// fetchDataFromApi 함수 호출
fetchDataFromApi();
// video id 0~19 20개 영상

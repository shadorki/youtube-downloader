const axios = require('axios');

let selectedVideo = null;

const searchForm = document.querySelector('.youtube-search-form');
const thumbnailImage = document.querySelector('.thumbnail');
const thumbnailText = document.querySelector('.thumbnail-text');
searchForm.addEventListener('submit', searchVideo);

function searchVideo (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const {1: url} = formData.get('url').split('?');
  axios.get(`http://localhost:3001/video-info`, {
    params: {
      video: url
    }
  })
  .then(displayThumbnail)
  .catch(err => console.error(err))
}

function displayThumbnail(response) {
  selectedVideo = response.data;
  const {title, thumbnail} = selectedVideo;
  thumbnailImage.src = thumbnail;
  thumbnailText.textContent = title;
}

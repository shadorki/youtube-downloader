const axios = require('axios');

const searchForm = document.querySelector('.youtube-search-form');
searchForm.addEventListener('submit', searchVideo);

function searchVideo (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const {1: url} = formData.get('url').split('?');
  console.log(url)
  axios.get(`http://localhost:3001/video-info`, {
    params: {
      video: url
    }
  })
  .then(displayThumbnail)
  .catch(err => console.error(err))
}

function displayThumbnail(data) {
  console.log(data);
}

const { ipcRenderer } = require('electron');
const youtubedl = require('youtube-dl');

let selectedVideo = null;

const searchForm = document.querySelector('.youtube-search-form');
const thumbnailImage = document.querySelector('.thumbnail');
const thumbnailText = document.querySelector('.thumbnail-text');
const searchButton = document.querySelector('.search-button');
const resetButton = document.querySelector('.reset-button');

searchForm.addEventListener('submit', searchVideo);
resetButton.addEventListener('submit', reset);

function searchVideo (event) {
  event.preventDefault();
  setButtonToLoadingMode(searchButton);
  const formData = new FormData(event.target);
  const url = formData.get('url');
  youtubedl.getInfo(url, null, (err, info) => {
    if(err) console.error(err);
    displayThumbnail(info);
  } )
}

function downloadVideo(event) {
  event.preventDefault();
  console.log('we downloadin boi')
  ipcRenderer.send('download-video', (event, selectedVideo))
}

function displayThumbnail(response) {
  selectedVideo = response;
  console.log(selectedVideo);
  const {title, thumbnail} = selectedVideo;
  thumbnailImage.src = thumbnail;
  thumbnailText.textContent = title;
  switchMode(true);
}
function reset(event) {
  event.preventDefault();
  switchMode(false);
}

function switchMode(isDownloading) {
  if(isDownloading) {
    searchForm.removeEventListener('submit', searchVideo);
    searchForm.addEventListener('submit', downloadVideo);
    searchButton.textContent = 'Download';
    searchButton.classList.remove('disabled');
    resetButton.classList.remove('hidden');
  } else {
    thumbnailImage.src = "./assets/images/logo-youtube.png";
    thumbnailText.textContent = '';
    selectedVideo = null;
    searchButton.textContent = 'Test Video';
    resetButton.classList.add('hidden')
    searchForm.removeEventListener('submit', downloadVideo);
    searchButton.classList.remove('disabled');
    searchForm.addEventListener('submit', searchVideo);
  }
}

function setButtonToLoadingMode(element) {
  const spinnerElement = document.createElement('i');
  spinnerElement.classList.add('spinner');
  element.textContent = '';
  element.disabled = true;
  element.classList.add('disabled')
  element.append(spinnerElement);
}

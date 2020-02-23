const { ipcRenderer } = require('electron');
const youtubedl = require('youtube-dl');

let selectedVideo = null;

const searchForm = document.querySelector('.youtube-search-form');
const thumbnailImage = document.querySelector('.thumbnail');
const thumbnailText = document.querySelector('.thumbnail-text');
const urlInput = document.querySelector('.url-input');
const searchButton = document.querySelector('.search-button');
const resetButton = document.querySelector('.reset-button');
const loadingBarPercentage = document.querySelector('.loading-bar-percentage');
const loadingBar = document.querySelector('.loading-bar');
searchForm.addEventListener('submit', searchVideo);
resetButton.addEventListener('click', reset);

ipcRenderer.on('update-percentage', (event, arg) => {
  updateProgress(arg)
})

ipcRenderer.on('download-completed', downloadCompleted);

ipcRenderer.on('directory-not-selected', resetDownload);

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
  resetButton.classList.add('hidden');
  setButtonToLoadingMode(searchButton);
  ipcRenderer.send('download-video', (event, selectedVideo))
}

function displayThumbnail(response) {
  selectedVideo = response;
  urlInput.disabled = true;
  const {title, thumbnail} = selectedVideo;
  thumbnailImage.src = thumbnail;
  thumbnailText.textContent = title;
  switchMode();
}
function reset(event) {
  event.preventDefault();
  urlInput.disabled = false;
  thumbnailImage.src = "./assets/images/logo-youtube.png";
  thumbnailText.textContent = '';
  loadingBarPercentage.textContent = '';
  loadingBar.style.width = '0%';
  selectedVideo = null;
  searchButton.textContent = 'Test Video';
  resetButton.classList.add('hidden');
  resetButton.textContent = 'Reset'
  searchButton.classList.remove('hidden');
  searchForm.removeEventListener('submit', downloadVideo);
  searchButton.disabled = false;
  searchButton.classList.remove('disabled');
  searchForm.addEventListener('submit', searchVideo);
}

function switchMode() {
  searchForm.removeEventListener('submit', searchVideo);
  searchForm.addEventListener('submit', downloadVideo);
  searchButton.textContent = 'Download';
  searchButton.disabled = false;
  searchButton.classList.remove('disabled');
  resetButton.classList.remove('hidden');
}

function setButtonToLoadingMode(element) {
  const spinnerElement = document.createElement('i');
  spinnerElement.classList.add('spinner');
  element.textContent = '';
  element.disabled = true;
  element.classList.add('disabled')
  element.append(spinnerElement);
}

function resetDownload() {
  resetButton.classList.remove('hidden');
  searchButton.textContent = 'Download';
  searchButton.disabled = false;
  searchButton.classList.remove('disabled');
}

function updateProgress(percentage) {
  const percent = percentage + '%';
  loadingBarPercentage.textContent = percent;
  loadingBar.style.width = percent;
}

function downloadCompleted() {
  resetButton.textContent = "Download Again?";
  searchButton.classList.add('hidden');
  resetButton.classList.remove('hidden');
}

const { ipcRenderer } = require('electron');

let selectedVideo = null;

let videoQuality = null;

const searchForm = document.querySelector('.youtube-search-form');
const thumbnailImage = document.querySelector('.thumbnail');
const thumbnailText = document.querySelector('.thumbnail-text');
const urlInput = document.querySelector('.url-input');
const searchButton = document.querySelector('.search-button');
const resetButton = document.querySelector('.reset-button');
const loadingBarPercentage = document.querySelector('.loading-bar-percentage');
const loadingBar = document.querySelector('.loading-bar');
const optionsDropdown = document.querySelector('.options-container');

searchForm.addEventListener('submit', searchVideo);
resetButton.addEventListener('click', reset);

ipcRenderer.on('update-percentage', (event, arg) => {
  updateProgress(arg)
})

ipcRenderer.on('download-completed', downloadCompleted);

ipcRenderer.on('directory-not-selected', resetDownload);

ipcRenderer.on('bad-video-link', badLink);

ipcRenderer.on('good-video-link', displayThumbnail);

function searchVideo (event) {
  event.preventDefault();
  setButtonToLoadingMode(searchButton);
  const formData = new FormData(event.target);
  const url = formData.get('url');
  videoQuality = formData.get('options');
  ipcRenderer.send('get-video-info', url);
}
function badLink(event, error) {
  console.log(error.stack)
  thumbnailImage.src = "./assets/images/confused-logo-youtube.png";
  searchButton.disabled = false;
  urlInput.disabled = false;
  searchButton.disabled = false;
  searchButton.textContent = 'Test Video';
  searchButton.classList.remove('disabled');
  if(error.stack.includes('3221225781')) {
    thumbnailText.innerHTML = `ERROR: Your computer is missing a dependency. <br>
    Please click Troubleshooting > Windows > Error Code: 3221225781 <br>
    After installing the dependency please restart this application.`;
  } else {
    thumbnailText.textContent = 'The link you provided was invalid, please try again.';
  }
}
function downloadVideo(event) {
  event.preventDefault();
  resetButton.classList.add('hidden');
  setButtonToLoadingMode(searchButton);
  let eventToSend = null;
  switch(videoQuality) {
    case "high":
      eventToSend = 'download-high-quality-video'
      break;
    case "normal":
      eventToSend = 'download-video';
      break;
    case "audio":
      eventToSend = 'download-audio-only';
      break;
  }
  ipcRenderer.send(eventToSend, (event, selectedVideo))
}

function displayThumbnail(event, response) {
  optionsDropdown.classList.add('hidden')
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

const searchForm = document.querySelector('.youtube-search-form');
searchForm.addEventListener('submit', searchVideo);

function searchVideo (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const url = formData.get('url');
}

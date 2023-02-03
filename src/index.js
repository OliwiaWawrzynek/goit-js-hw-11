import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

var API_KEY = '33350035-46e713c814e68264b0e5c361b';

const searchBtn = document.querySelector('button[type="submit"]');
const searchInput = document.querySelector('input[name="searchQuery"]');
const loadBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let pageNo = 1;

const lightbox = new SimpleLightbox('.gallery a');

function galleryRender(image) {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${image.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${image.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${image.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${image.downloads}
      </p>
    </div>
  </div>`
  );
}

async function getImages(pageNo) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: searchInput.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNo,
        per_page: 40,
      },
    });
    const imagesData = response.data.hits;
    let numberOfpages = Math.ceil(response.data.totalHits / 40);
    if (searchInput.value === '') {
      Notify.warning('Please enter the phrase you are looking for.');
      return;
    }
    if (response.data.totalHits === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    if (response.data.totalHits > 0 && pageNo === 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    }
    if (response.data.totalHits > 0) {
      imagesData.forEach(image => {
        galleryRender(image);
      });
      lightbox.refresh();
      loadBtn.classList.remove('is-hidden');
    }
    if (pageNo === numberOfpages) {
      Notify.warning("We're sorry, but you've reached the end of search results.");
      loadBtn.classList.add('is-hidden');
    }
    if (pageNo > 1) {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 6,
        behavior: 'smooth',
      });
    }
    } catch (error) {
    console.error(error);
    };
};

searchBtn.addEventListener('click', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  getImages(pageNo);
});

loadBtn.addEventListener('click', e => {
  e.preventDefault();
  pageNo++;
  getImages(pageNo);
});

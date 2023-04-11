import NewApiService from './api-servis';
import modalTemplate from '../templates/modalTemplate.hbs';

const newApiService = new NewApiService();

const refs = {
  bodyEl: document.querySelector('body'),
  containerEl: document.querySelector('.main-content'),
  backdropEl: document.querySelector('.backdrop.cardModal'),
  modalEl: document.querySelector('.backdrop.cardModal .modal-content'),
  closeBtn: document.querySelector('.modal-button'),
};

refs.containerEl.addEventListener('click', onClick);

let idValue = 0;

function onClick(evt) {
  const target = evt.target.nodeName;

  if (target !== 'IMG' && target !== 'P') {
    return;
  }

  const idDatas = evt.target.closest('.card-item');
  idValue = idDatas.dataset.action;

  openModal();
}

async function fetchMovieDetails(id) {
  const BASE_URL = `https://api.themoviedb.org/3`;
  const KEY = `0d7a3e0f2906a3f05e73804ba320517e`;
  const url = `${BASE_URL}/movie/${id}?api_key=${KEY}`;

  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  return result;
}

function openModal() {
  fetchMovieDetails(idValue).then(results => {
    const markup = modalTemplate(results);

    refs.modalEl.innerHTML = markup;
    refs.backdropEl.classList.remove('is-hidden');

    refs.bodyEl.addEventListener('click', onBackdrop);
    refs.bodyEl.addEventListener('keydown', onEscBtn);
    refs.closeBtn.addEventListener('click', closeModal);
  });
}

function onBackdrop(e) {
  if (e.target.classList.contains('backdrop')) {
    closeModal();
    refs.bodyEl.removeEventListener('click', onBackdrop);
  }
}

function onEscBtn(e) {
  if (e.code === 'Escape') {
    closeModal();

    refs.bodyEl.removeEventListener('keydown', onEscBtn);
  }
  console.log(1);
}

function closeModal() {
  refs.backdropEl.classList.add('is-hidden');
  refs.bodyEl.style.overflow = 'visible';
}

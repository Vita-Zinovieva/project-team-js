import NewApiService from './api-servis';
import modalTemplate from '../templates/modalTemplate.hbs';
import { storageKeys, load, save } from './localStorage';
import * as addingToStorage from './addToStorage';

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
  //console.log(result);
  return result;
}

function openModal() {
  fetchMovieDetails(idValue).then(results => {
    const { poster_path, original_title, vote_count, popularity, overview, genres, name } =
      results;
    const votes_average = Math.round(results.vote_average * 10) / 10;
    const markup = modalTemplate({
      poster_path,
      original_title,
      vote_count,
      votes_average,
      popularity,
      overview,
      genres,
      name,
    });

    refs.modalEl.innerHTML = markup;
    refs.backdropEl.classList.remove('is-hidden');

    refs.bodyEl.addEventListener('click', onBackdrop);
    refs.bodyEl.addEventListener('keydown', onEscBtn);
    refs.closeBtn.addEventListener('click', closeModal);

    refs.bodyEl.style.overflow = 'hidden';

    const addToWatchedBtn = document.querySelector('.modal-button__primary');
    const addToQueueBtn = document.querySelector('.modal-button__secondary');

    //buttons
    const watchedStorage = load(storageKeys.WATCHED) || [];
    const queueStorage = load(storageKeys.QUEUE) || [];
    
    if (watchedStorage.find(film => film.id === Number(idValue))) {
      addToWatchedBtn.innerText = 'REMOVE FROM WATCHED';
    } 
    else {
      addToWatchedBtn.innerText = 'ADD TO WATCHED';
    }

    if (queueStorage.find(film => film.id === Number(idValue))) {
      addToQueueBtn.innerText = 'REMOVE FROM QUEUE';
    } else {
      addToQueueBtn.innerText = 'ADD TO QUEUE';
    }
    //buttons

    addToWatchedBtn.addEventListener('click', evt => {
      saveDataMovie(evt, results);
    });

    addToQueueBtn.addEventListener('click', evt => {
      saveDataMovie(evt, results);
    });
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

function saveDataMovie(evt, movie) {
  localStorage.setItem('modalMovieData', JSON.stringify(movie));
  addingToStorage.onBtnAddToLibrary(evt);
}

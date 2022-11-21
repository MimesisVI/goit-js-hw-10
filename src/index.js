import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  let inputValue = event.target.value.trim();

  if (!inputValue) {
    clearMarkup();
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        clearMarkup();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length >= 2 && countries.length <= 10) {
        clearMarkup();
        createCountriesList(countries);
      }
      if (countries.length === 1) {
        clearMarkup();
        createCountriesCard(countries);
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createCountriesList(countries) {
  const countryList = countries
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" width="30">${name.official}</li>`;
    })
    .join('');

  listEl.insertAdjacentHTML('beforeEnd', countryList);
}

function createCountriesCard(countries) {
  const contryCard = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<h1><img src="${flags.svg}" width="30"> ${name.official}</h1>
      <div>Capital: ${capital}</div>
      <div>Population: ${population}</div>
      <div>Languages: ${Object.values(languages).join(', ')}</div>`;
    })
    .join('');

  infoEl.insertAdjacentHTML('beforeEnd', contryCard);
}

function clearMarkup() {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
  return;
}

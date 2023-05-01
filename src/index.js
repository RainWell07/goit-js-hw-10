import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY)); 

function onSearch(event) {
  const searchQuery = event.target.value.trim();
  if (!searchQuery) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  
fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
      }

      if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
        countryInfo.innerHTML = '';
        return;
      }

      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        countryList.innerHTML = '';
        return;
      }

      Notiflix.Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    })
    .catch(error => {
      if (error.resp && error.resp.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (error.message) {
        Notiflix.Notify.failure('Something went wrong. Please try again later.');
      }
      console.log(error);
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
        <li class="country-item">
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" class="country-flag">
        <p class="country-name">${country.name.official}</p>
        </li>`;
    }).join('');

  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function renderCountryInfo(country) {
  const languages = Object.values(country.languages).join(', ');

  const markup = 
  ` <div class = "country-name-flex">
    <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" class="country-flag">
    <h2 class="country-name-big">${country.name.official}</h2>
    </div>
    <p><span class="title">Capital:</span> ${country.capital}</p>
    <p><span class="title">Population:</span> ${country.population}</p>
    <p><span class="title">Languages:</span> ${languages}</p>
  `;

  countryList.innerHTML = '';
  countryInfo.innerHTML = markup;
}

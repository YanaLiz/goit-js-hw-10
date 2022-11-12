import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';
import fetchCountries from "../src/fetchCountries";

const DEBOUNCE_DELAY = 300;

const refs = {
cardContainer: document.querySelector('.country-info'),
searchForm: document.querySelector('#search-box'),
countryInfo: document.querySelector('.country-info'),
countryList: document.querySelector('.country-list'),
};

refs.searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
function onSearch(event) {
    event.preventDefault();

    const inputValue = event.target.value.trim();
    if (!inputValue) {
    clearInput();
    return;
    }

fetchCountries(inputValue)
    .then(data => renderCountry(data))
    .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
function renderCountry(data) {
    clearInput();
    if (data.length === 1) {
    
    refs.cardContainer.insertAdjacentHTML('beforeend', cards(data));
    }
    if (data.length >= 2 && data.length <= 10) {
        
        refs.countryList.insertAdjacentHTML('beforeend', cardCountry(data));
    
    console.log('cards');
    }
if (data.length > 10) {
    Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
    );
    }
}

function clearInput() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function cards(country) {
return country
    .map(({ name, capital, population, flags, languages }) => {
        return `<img class="country_flag" src="${
        flags.svg
        }" alt="flag" width="200">
            <p class="country_name">${name.official}</p>
            <p class="options">Capital: <span class="value">${capital}</span></p>
            <p class="options">Population: <span class="value">${population}</span></p>
            <p class="options"> Languages: <span class="value">${Object.values(
            languages
        ).join(', ')}</span>
        </p>`;
    })
    .join('');
}

function cardCountry(card) {
    return card
        .map(({ name, flags }) => {
            return `<li>
  <img src="${flags.svg}" alt="flag" width="100" />
  <h2>${name.official}</h2>
</li>`
        }).join('');
}


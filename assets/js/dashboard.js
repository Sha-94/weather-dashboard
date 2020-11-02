const searchHistoryListEl = document.querySelector('#history-list');
const overviewCardEl = document.querySelector('#overview-section');
const forecastSectionEl = document.querySelector('#forecast-section');
const searchButtonEl = document.querySelector('#search-button');
const searchInputEl = document.querySelector('#search-input');

const TEMPERATURE_PROPERTY = 'temp';
const HUMIDITY_PROPERTY = 'humid';
const PRESSURE_PROPERY = 'pressure';
const API_KEY = 'f2a6e7696c66de5d201dd8ea3223451c';

searchButtonEl.addEventListener('click', fetchWeather);
displaySearchHistory();


function fetchWeather(event) {
  event.preventDefault();

  let location = event.target.textContent ? event.target.textContent : searchInputEl.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&cnt=6&units=imperial&APPID=${API_KEY}`;

  fetch(apiUrl).then(response => {
    if (response.ok) {
      response.json().then(data => {
        searchInputEl.value = '';
        updateSearchHistory(data.name);
        displayOverview(data);
        fetchForecast(data.coord.lat, data.coord.lon);
      })
    } else {
      alert('Please use a valid city');
    }
  })
}

function clearNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function getSearchHistory() {
  return JSON.parse(localStorage.getItem('searchHistory')) || [];
}
function updateSearchHistory(city) {
  let searchHistory = getSearchHistory();
  if(!searchHistory.includes(city)){
    searchHistory.push(city);
  }

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  displaySearchHistory();

}

function displaySearchHistory() {
  clearNodes(searchHistoryListEl);

  let searchHistory = getSearchHistory();
  searchHistory.forEach(item => {
    let listItemEl = document.createElement('li');
    listItemEl.classList = "list-group-item";
    listItemEl.textContent = item;
    listItemEl.addEventListener('mouseover', activate);
    listItemEl.addEventListener('mouseout', deactivate);
    listItemEl.addEventListener('click', fetchWeather);
    searchHistoryListEl.appendChild(listItemEl);
  });
}

function displayOverview(data) {
  const cardHeaderEl = document.createElement('h3');
  const cardBodyEl = document.createElement('div');

  clearNodes(overviewCardEl);
  overviewCardEl.classList= '';
  cardHeaderEl.classList = 'card-header';
  cardHeaderEl.innerHTML = `${data.name} (${getLocalDate(data.dt)}) <img src= "${getIconUrl(data.weather[0].icon)}">`;

  cardBodyEl.classList = 'card-body';
  cardBodyEl.appendChild(generateCardBodyElement(TEMPERATURE_PROPERTY, data.main.temp));
  cardBodyEl.appendChild(generateCardBodyElement(HUMIDITY_PROPERTY, data.main.humidity));
  cardBodyEl.appendChild(generateCardBodyElement(PRESSURE_PROPERY, data.main.pressure));

  overviewCardEl.classList='card'
  overviewCardEl.appendChild(cardHeaderEl);
  overviewCardEl.appendChild(cardBodyEl);

}

function generateCardBodyElement(property, value) {
  const divEl = document.createElement('div');
  const paragraphEl = document.createElement('p');

  switch (property) {
    case TEMPERATURE_PROPERTY: paragraphEl.textContent = `Temperature: ${value}º`;
      break;
    case HUMIDITY_PROPERTY: paragraphEl.textContent = `Humidity: ${value}%`;
      break;
    case PRESSURE_PROPERY: paragraphEl.textContent = `Pressure: ${value}`;
  }

  divEl.appendChild(paragraphEl);
  return divEl;
}

function displayForecast(data) {
  const forecastHeaderEl = document.createElement('h3');
  const forecastsDivEl = document.createElement('div');

  clearNodes(forecastSectionEl);

  forecastHeaderEl.textContent = '5-Day Forecast: ';
  forecastsDivEl.setAttribute('id', 'forecasts');

  for (let i = 1; i <= 5; i++) {
    forecastsDivEl.appendChild(generateForecastCard(data.daily[i]));
  }

  forecastSectionEl.appendChild(forecastHeaderEl);
  forecastSectionEl.appendChild(forecastsDivEl);
}

function generateForecastCard(forecast) {
  const divCardEl = document.createElement('div');
  const imgEl = document.createElement('img');
  const cardHeaderEl = document.createElement('h5');
  const cardBodyEl = document.createElement('div');

  divCardEl.classList = 'card';
  cardHeaderEl.classList = 'card-header text-centered';
  cardBodyEl.classList = 'card-body';

  imgEl.setAttribute('src', getIconUrl(forecast.weather[0].icon))
  cardHeaderEl.textContent = getLocalDate(forecast.dt);

  cardBodyEl.appendChild(imgEl);
  cardBodyEl.appendChild(generateCardBodyElement(TEMPERATURE_PROPERTY, forecast.temp.day));
  cardBodyEl.appendChild(generateCardBodyElement(HUMIDITY_PROPERTY, forecast.humidity));

  divCardEl.appendChild(cardHeaderEl);
  divCardEl.appendChild(cardBodyEl);

  return divCardEl;
}

function fetchForecast(lat, lon) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${API_KEY}`

  fetch(apiUrl).then(response => {
    if (response.ok) {
      response.json().then(data => {
        displayForecast(data);
      })
    }
  })
}

function getLocalDate(utc) {
  return new Date(utc * 1000).toLocaleDateString();
}

function getIconUrl(icon){
  return `https://openweathermap.org/img/w/${icon}.png`
}

function activate(event) {
  let element = event.target;
  element.classList.add('active');

}

function deactivate(event) {
  let element = event.target;
  element.classList.remove('active');
}

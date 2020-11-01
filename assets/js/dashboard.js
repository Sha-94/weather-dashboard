const searchHistoryListEl = document.querySelector('#history-list');
const overviewCardEl = document.querySelector('#overview-section');
const forecastSectionEl = document.querySelector('#forecast-section');

const TEMPERATURE_PROPERTY = 'temp';
const HUMIDITY_PROPERTY = 'humid';
const UV_INDEX_PROPERTY = 'uv'

var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

const mockData = {
  city: 'Atlanta',
  date: '8/19/2020',
  temperature: '99ºF',
  humidity: '70%',
  uvIndex: '9.49',
  fiveDayForecast: [
    {
      date: '8/19/2020',
      temperature: '99ºF',
      humidity: '70%'
    },
    {
      date: '8/20/2020',
      temperature: '94ºF',
      humidity: '72%'
    },
    {
      date: '8/21/2020',
      temperature: '99ºF',
      humidity: '75%'
    },
    {
      date: '8/22/2020',
      temperature: '93ºF',
      humidity: '12%'
    },
    {
      date: '8/23/2020',
      temperature: '97ºF',
      humidity: '67%'
    },
  ]
}

function clearNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function displaySearchHistory() {
  searchHistory.forEach(item => {
    let listItemEl = document.createElement('li');
    listItemEl.classList = "list-group-item";
    listItemEl.textContent = item;
    searchHistoryListEl.appendChild(listItemEl);
  });

  displayOverview(mockData);
  displayForecast(mockData);
}

function displayOverview(data) {
  const cardHeaderEl = document.createElement('h3');
  const cardBodyEl = document.createElement('div');

  clearNodes(overviewCardEl);

  cardHeaderEl.classList = 'card-header';
  cardHeaderEl.textContent = data.city;

  cardBodyEl.classList = 'card-body';
  cardBodyEl.appendChild(generateCardBodyElement(TEMPERATURE_PROPERTY, data.temperature));
  cardBodyEl.appendChild(generateCardBodyElement(HUMIDITY_PROPERTY, data.humidity));
  cardBodyEl.appendChild(generateCardBodyElement(UV_INDEX_PROPERTY, data.uvIndex));

  overviewCardEl.appendChild(cardHeaderEl);
  overviewCardEl.appendChild(cardBodyEl);
   
}

function generateCardBodyElement(property, value) {
  const divEl = document.createElement('div');
  const paragraphEl = document.createElement('p');

  switch(property) {
    case TEMPERATURE_PROPERTY: paragraphEl.textContent = `Temperature: ${value}`;
    break;
    case HUMIDITY_PROPERTY: paragraphEl.textContent = `Humidity: ${value}`;
    break;
    case UV_INDEX_PROPERTY: paragraphEl.textContent = `UV Index: ${value}`;
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

  data.fiveDayForecast.forEach(forecast => {
    forecastsDivEl.appendChild(generateForecastCard(forecast));
  })

  forecastSectionEl.appendChild(forecastHeaderEl);
  forecastSectionEl.appendChild(forecastsDivEl);
}

function generateForecastCard(forecast) {
  const divCardEl = document.createElement('div');
  const cardHeaderEl = document.createElement('h5');
  const cardBodyEl = document.createElement('div');

  divCardEl.classList = 'card';
  cardHeaderEl.classList = 'card-header text-centered';
  cardBodyEl.classList = 'card-body';

  cardHeaderEl.textContent = forecast.date;
  cardBodyEl.appendChild(generateCardBodyElement(TEMPERATURE_PROPERTY, forecast.temperature));
  cardBodyEl.appendChild(generateCardBodyElement(HUMIDITY_PROPERTY, forecast.humidity));

  divCardEl.appendChild(cardHeaderEl);
  divCardEl.appendChild(cardBodyEl);

  return divCardEl;
}

var array = ["Austin", "Houston", "Dallas", "San Antonio"];
localStorage.setItem('searchHistory', JSON.stringify(array));
displaySearchHistory();
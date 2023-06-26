const form = document.getElementById('form');
const search = document.getElementById('search');
const country = document.getElementById('country');
const degree = document.getElementById('degree');
const feels = document.getElementById('feels');
const img = document.getElementById('image');
const humidity = document.getElementById('humidity');
const speed = document.getElementById('speed');
const direction = document.getElementById('direction');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const weatherTitle = document.getElementById('weatherTitle');
const time = document.getElementById('time');
const visibility = document.getElementById('visibility');
const switchBtn = document.querySelector('.switch');
const metric = document.getElementById('metric');
const ms = document.getElementById('ms');
const km = document.getElementById('km');
const riseTime = document.querySelectorAll('.riseTime');


const weather = async (city,unit) => {
  try {
    const url = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bfd0148b33115682f5dd67eaad4292b1&units=${unit}`);
    const data = await url.json();

    if(data.cod === '404') {
      search.value = 'City Not Found';
      search.style.color = "red";
      setTimeout(() => {
        search.value = '';
        search.style.color = "";
      }, 1000);
      return;
    }

    country.textContent = data.sys.country ? `${data.name}, ${data.sys.country}` : data.name;
    degree.textContent = `${data.main.temp.toFixed()}°${unit === 'metric' ? 'C' : 'F'}`;
    feels.textContent = `Feels like ${data.main.feels_like.toFixed()}°${unit === 'metric' ? 'C' : 'F'}`;
    humidity.textContent = data.main.humidity;
    speed.textContent = data.wind.speed;
    const compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
    direction.textContent = compassSector[(data.wind.deg / 22.5).toFixed(0)];
    ms.textContent = unit === 'metric' ? 'm/s' : 'm/h';
    km.textContent = unit === 'metric' ? 'km' : 'miles';
    riseTime.forEach(i => {unit === 'metric' ? i.style.display = 'none' : i.style.display = 'block'})

    visibility.textContent = unit === 'metric' ? (data.visibility / 1000).toFixed(1) : (data.visibility / 1609.34).toFixed(1);


    //sunset and sunrise --------------
    const formatTime = (timestamp) => {
      const time = new Date(timestamp * 1000 + data.timezone * 1000);
      const hours = time.getUTCHours().toString().padStart(2, '0');
      const minutes = time.getUTCMinutes().toString().padStart(2, '0');
      return `${hours.replace(/^0/, '')}:${minutes}`;
    };

    function HourFormat(time) {
      const [hours, minutes] = time.split(':');
      let formattedHours = (parseInt(hours) % 12 || 12).toString();
      return `${formattedHours}:${minutes}`;
    }
    const sundown = formatTime(data.sys.sunset);
    sunrise.textContent = formatTime(data.sys.sunrise);
    sunset.textContent = unit === 'metric' ? sundown : HourFormat(sundown);;
    // --------------------------

    weatherTitle.textContent = data.weather[0].description;

    // data time --------------------------
    function dateTimeSwtch(boolean) {
      const date = new Date((data.dt + data.timezone) * 1000);
      const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: boolean, timeZone: 'UTC' };
      const dateTime = date.toLocaleString(undefined, options)
      time.textContent = dateTime;
    }
    unit === 'metric' ? dateTimeSwtch(false) : dateTimeSwtch(true);
    //      -----------------------------

    img.src = `assets/${data.weather[0].icon}.svg`;

    switchBtn.childNodes.forEach(i => i.addEventListener('click', switcher));


  } catch (error) {
    console.log(error);
  }
}

weather("tbilisi",'metric');

// change metric and imperial -----------
function switcher(event) {
  switchBtn.childNodes.forEach(child => {
    if (child.tagName === "P") {
      child.style.color = "black";
    }
  });
  event.target.style.color = "green";
  const bool = metric.style.color === 'black' ? "imperial" : "metric";
  weather(country.textContent,bool);
}
// also color --------------------

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = search.value.trim();
  if (!city) return;
  const bool = metric.style.color === 'black' ? "imperial" : "metric";
  weather(city,bool);
  search.value = '';
});
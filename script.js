// Walidacja formularza rejestracji

const userName = document.querySelector('input#name');
const email = document.querySelector('input#email');
const pass1 = document.querySelector('input#password1');
const pass2 = document.querySelector('input#password2');
const form = document.querySelector('form');
const resetBtn = document.querySelector('input#reset');
const submitBtn = document.querySelector('input#submit');
const terms = document.querySelector('input#terms');

function showOrHideErrorMessage(input, text) {
    const box = input.parentElement; 
    const errorMessage = box.querySelector('p.err_mess');
    errorMessage.textContent = text;
}

function checkIputsLength(input, minLength) {
    if (input.value.length < minLength) {
        showOrHideErrorMessage(input, `Pole ${input.previousElementSibling.textContent.toLowerCase().replace('*', '').replace(':', '').trim()} 
        powinno zawierać minimum ${minLength} znaków.`);
    } else {
        showOrHideErrorMessage(input, '');
    }
}

function checkEmail() {
    const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!(re.test(email.value))) {
        showOrHideErrorMessage(email, 'Adres email jest niepoprawny.');
    } else {
        showOrHideErrorMessage(email, '');
    }
}

function checkPasswordsValue() {
    if (pass1.value !== pass2.value) {
        showOrHideErrorMessage(pass2, 'Hasła są różne.');
    } else {
    showOrHideErrorMessage(pass2, '');
    }
};

function checkPasswordLengthAndValue() {
    const letterCount = (pass1.value.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (pass1.value.match(/[0-9]/g) || []).length;
    const specialCount = (pass1.value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;

    if (pass1.value.length < 8) {
        showOrHideErrorMessage(pass1, 'Hasło powinno zawierać minimum 8 znaków.');
    } else if (letterCount < 2 || numberCount < 2 || specialCount < 1) {
        showOrHideErrorMessage(pass1, 'Hasło musi zawierać minimum: 2 litery, 2 cyfry i 1 znak specjalny.');
    } else {
        showOrHideErrorMessage(pass1, '');
    }
}

function checkTerms() {
    if (!terms.checked) {
        showOrHideErrorMessage(terms, 'Akceptacja regulaminu jest wymagana.');
    } else {
        showOrHideErrorMessage(terms, '');
    }
}

submitBtn.addEventListener('click', e => {
    e.preventDefault(); 
    checkIputsLength(userName, 5);
    checkEmail();
    checkPasswordsValue(); 
    checkPasswordLengthAndValue();
    checkTerms();

    const errors = form.querySelectorAll('p.err_mess');
    errors.forEach(p => console.log('err_mess:', JSON.stringify(p.textContent)));
    const errorCount = [...errors].filter(p => p.textContent !== '').length;
    console.log('errorCount:', errorCount);

      if (errorCount === 0) {
        alert('Formularz rejestracji wypełniono prawidłowo!');
        form.reset();
        document.querySelectorAll('p.err_mess').forEach(p => p.textContent = '');
    } else {
        alert('Formularz zawiera błędy. Popraw je przed wysłaniem.');
    }
});


resetBtn.addEventListener('click', () => {
    document.querySelectorAll('p.err_mess').forEach(p => p.textContent = '');
});

userName.addEventListener('blur', () => checkIputsLength(userName, 5));
email.addEventListener('blur', checkEmail);
pass1.addEventListener('blur', checkPasswordLengthAndValue);
pass2.addEventListener('blur', checkPasswordsValue);
terms.addEventListener('change', checkTerms);

userName.addEventListener('input', () => {
    if (userName.value === '') showOrHideErrorMessage(userName, '');
});

email.addEventListener('input', () => {
    if (email.value === '') showOrHideErrorMessage(email, '');
});

pass1.addEventListener('input', () => {
    if (pass1.value === '') showOrHideErrorMessage(pass1, '');
});

pass2.addEventListener('input', () => {
    if (pass2.value === '') showOrHideErrorMessage(pass2, '');
});

// Aplikacja pogodowa

const cityNameEl = document.querySelector('.city-name');
const weatherInput = document.querySelector('#pogoda .input-group input[type="text"]');
const dateEl = document.querySelector('.date');
const isDayEl = document.querySelector('.is-day');
const tempEl = document.querySelector('.temp');
const descriptionEl = document.querySelector('.description');
const feelsLikeEl = document.querySelector('.feels-like');
const tempMinMaxEl = document.querySelector('.temp-minmax');
const windSpeedEl = document.querySelector('.wind-speed');
const windDirectionEl = document.querySelector('.wind-direction');
const windGustsEl = document.querySelector('.wind-gusts');
const pressureEl = document.querySelector('.pressure');
const humidityEl = document.querySelector('.humidity');
const cloudsEl = document.querySelector('.clouds');
const rainEl = document.querySelector('.rain');
const uvIndexEl = document.querySelector('.uv-index');
const sunriseEl = document.querySelector('.sunrise');
const sunsetEl = document.querySelector('.sunset');
const sunshineEl = document.querySelector('.sunshine');
const daylightEl = document.querySelector('.daylight');
const forecastDaysEl = document.getElementById('forecast-days');
const errorMsgEl = document.querySelector('p.error-message');
const searchIcon = document.querySelector('.input-group .btn');

const WMO_CODES = {
    0: 'Bezchmurnie',
    1: 'Głównie bezchmurnie', 2: 'Częściowe zachmurzenie', 3: 'Pochmurno',
    45: 'Mgła', 48: 'Mgła z szadzią',
    51: 'Mżawka lekka', 53: 'Mżawka umiarkowana', 55: 'Mżawka gęsta',
    56: 'Marznąca mżawka lekka', 57: 'Marznąca mżawka gęsta',
    61: 'Deszcz lekki', 63: 'Deszcz umiarkowany', 65: 'Deszcz intensywny',
    66: 'Marznący deszcz lekki', 67: 'Marznący deszcz intensywny',
    71: 'Opady śniegu lekkie', 73: 'Opady śniegu umiarkowane', 75: 'Opady śniegu intensywne',
    77: 'Ziarna śniegu',
    80: 'Przelotny deszcz lekki', 81: 'Przelotny deszcz umiarkowany', 82: 'Przelotny deszcz gwałtowny',
    85: 'Przelotne opady śniegu lekkie', 86: 'Przelotne opady śniegu intensywne',
    95: 'Burza', 96: 'Burza z małym gradem', 99: 'Burza z dużym gradem',
};

async function getWeather() {
    const city = weatherInput.value.trim();
    if (!city) return;

    errorMsgEl.textContent = '';

    try {
        const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: { name: city, count: 1, language: 'pl', format: 'json' }
        });

        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            errorMsgEl.textContent = 'Nie znaleziono miasta. Sprawdź nazwę i spróbuj ponownie.';
            return;
        }

        const { latitude, longitude, name, country } = geoResponse.data.results[0];
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude,
                longitude,
                timezone,
                current: [
                    'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
                    'is_day', 'precipitation', 'rain', 'wind_speed_10m',
                    'wind_direction_10m', 'wind_gusts_10m', 'cloud_cover', 'pressure_msl'
                ].join(','),
                daily: [
                    'weather_code', 'temperature_2m_max', 'temperature_2m_min',
                    'apparent_temperature_max', 'apparent_temperature_min',
                    'sunrise', 'sunset', 'daylight_duration', 'sunshine_duration',
                    'uv_index_max', 'rain_sum', 'showers_sum', 'snowfall_sum',
                    'precipitation_sum', 'precipitation_hours',
                    'wind_speed_10m_max', 'wind_direction_10m_dominant'
                ].join(','),
                wind_speed_unit: 'ms',
            }
        });

        displayWeatherData(weatherResponse.data, name, country);
        weatherInput.value = '';

    } catch (error) {
        console.error(error);
        errorMsgEl.textContent = 'Wystąpił błąd podczas pobierania danych pogodowych.';
        [cityNameEl, dateEl, tempEl, descriptionEl, feelsLikeEl, humidityEl, windSpeedEl, cloudsEl, rainEl].forEach(el => {
            if (el) el.textContent = '';
        });
    }
}

function displayWeatherData(data, name, country) {
    const current = data.current;
    const daily = data.daily;
    const todayCode = daily?.weather_code?.[0];

    cityNameEl.textContent = `${name}, ${country}`;

    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('pl-PL', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    isDayEl.textContent = current.is_day ? '☀️ Dzień' : '🌙 Noc';

    tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
    feelsLikeEl.textContent = `Odczuwalna: ${Math.round(current.apparent_temperature)}°C`;
    descriptionEl.textContent = WMO_CODES[todayCode] ?? '';
    tempMinMaxEl.textContent = `↑ ${Math.round(daily.temperature_2m_max[0])}°C  ↓ ${Math.round(daily.temperature_2m_min[0])}°C`;

    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    pressureEl.textContent = `${Math.round(current.pressure_msl)} hPa`;
    windSpeedEl.textContent = `${current.wind_speed_10m} m/s`;
    windDirectionEl.textContent = degreesToDirection(current.wind_direction_10m);
    windGustsEl.textContent = `${current.wind_gusts_10m} m/s`;
    cloudsEl.textContent = `${current.cloud_cover}%`;
    rainEl.textContent = `${current.rain ?? 0} mm`;
    uvIndexEl.textContent = daily.uv_index_max[0];

    const sunriseTime = new Date(daily.sunrise[0]);
    const sunsetTime = new Date(daily.sunset[0]);
    sunriseEl.textContent = sunriseTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    sunsetEl.textContent = sunsetTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    const sunshineMin = Math.round(daily.sunshine_duration[0] / 60);
    sunshineEl.textContent = `${Math.floor(sunshineMin / 60)}h ${sunshineMin % 60}min`;

    const daylightMin = Math.round(daily.daylight_duration[0] / 60);
    daylightEl.textContent = `${Math.floor(daylightMin / 60)}h ${daylightMin % 60}min`;

    setWeatherBackground(todayCode, current.is_day);

    // 7-dniowa prognoza
    forecastDaysEl.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(daily.time[i]);
        const dayName = dayDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'numeric' });
        const code = daily.weather_code[i];
        const tMax = Math.round(daily.temperature_2m_max[i]);
        const tMin = Math.round(daily.temperature_2m_min[i]);
        const feelsMax = Math.round(daily.apparent_temperature_max[i]);
        const feelsMin = Math.round(daily.apparent_temperature_min[i]);
        const precip = daily.precipitation_sum[i].toFixed(1);
        const windMax = daily.wind_speed_10m_max[i];
        const windDir = degreesToDirection(daily.wind_direction_10m_dominant[i]);
        const uv = daily.uv_index_max[i];
        const sunriseT = new Date(daily.sunrise[i]).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        const sunsetT = new Date(daily.sunset[i]).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        const sunshineMin = Math.round(daily.sunshine_duration[i] / 60);
        const sunshineStr = `${Math.floor(sunshineMin / 60)}h ${sunshineMin % 60}min`;
        const daylightMin = Math.round(daily.daylight_duration[i] / 60);
        const daylightStr = `${Math.floor(daylightMin / 60)}h ${daylightMin % 60}min`;

        const div = document.createElement('div');
        div.className = 'col-12 col-md-6 mb-3';
        div.innerHTML = `
            <div class="card h-100">
                <div class="card-header fw-bold text-capitalize">${dayName}</div>
                <div class="card-body p-2">
                    <p class="text-center fw-bold mb-1">${WMO_CODES[code] ?? ''}</p>
                    <p class="text-center display-6 mb-1">↑${tMax}°C / ↓${tMin}°C</p>
                    <p class="text-center text-muted small mb-2">Odczuwalna: ↑${feelsMax}°C / ↓${feelsMin}°C</p>
                    <div class="row row-cols-2 g-1 text-center small">
                        <div class="col"><div class="border rounded p-1"><div class="text-muted">Prędkość wiatru</div><strong>${windMax} m/s</strong></div></div>
                        <div class="col"><div class="border rounded p-1"><div class="text-muted">Kierunek wiatru</div><strong>${windDir}</strong></div></div>
                        <div class="col"><div class="border rounded p-1"><div class="text-muted">Opady</div><strong>${precip} mm</strong></div></div>
                        <div class="col"><div class="border rounded p-1"><div class="text-muted">UV Index (max)</div><strong>${uv}</strong></div></div>
                        <div class="col"><div class="border rounded p-1"><div class="text-muted">Wschód słońca</div><strong>${sunriseT}</strong></div></div>
                        <div class="col"><div class="border rounded p-1"><div class="text-muted">Zachód słońca</div><strong>${sunsetT}</strong></div></div>
                        <div class="col"><div class="border rounded p-1"><div class="text-muted">Nasłonecznienie</div><strong>${sunshineStr}</strong></div></div>
                        <div class="col"><div class="border rounded p-1"><div class="text-muted">Długość dnia</div><strong>${daylightStr}</strong></div></div>
                    </div>
                </div>
            </div>
        `;
        forecastDaysEl.appendChild(div);
    }
}

function degreesToDirection(deg) {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
}

function setWeatherBackground(code, isDay) {
    const backgrounds = {
        night:     'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
        sunny:     'linear-gradient(to bottom, #56ccf2, #2f80ed)',
        partcloud: 'linear-gradient(to bottom, #74b9ff, #a29bfe)',
        cloudy:    'linear-gradient(to bottom, #636e72, #b2bec3)',
        foggy:     'linear-gradient(to bottom, #b8c6db, #f5f7fa)',
        rainy:     'linear-gradient(to bottom, #373b44, #4286f4)',
        snowy:     'linear-gradient(to bottom, #e0eafc, #cfdef3)',
        storm:     'linear-gradient(to bottom, #200122, #6f0000)',
    };

    let key;
    if (!isDay)          key = 'night';
    else if (code === 0) key = 'sunny';
    else if (code <= 2)  key = 'partcloud';
    else if (code === 3) key = 'cloudy';
    else if (code <= 48) key = 'foggy';
    else if (code <= 82) key = 'rainy';
    else if (code <= 86) key = 'snowy';
    else                 key = 'storm';

    document.body.style.backgroundImage = backgrounds[key];
}

weatherInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});

searchIcon.addEventListener('click', getWeather);

window.onerror = function(message, source, lineno, colno) {
    fetch('/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            source,
            line: lineno,
            col: colno,
            time: new Date().toLocaleString('pl-PL')
        })
    });
};
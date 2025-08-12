// Create map
const map = L.map('map').setView([20, 0], 2);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch capitals from REST Countries API
fetch('https://restcountries.com/v3.1/all')
    .then(res => res.json())
    .then(countries => {
        countries.forEach(country => {
            if (country.capitalInfo && country.capitalInfo.latlng) {
                const [lat, lon] = country.capitalInfo.latlng;
                const capital = country.capital ? country.capital[0] : 'N/A';
                const countryName = country.name.common;

                // Create marker
                const marker = L.marker([lat, lon]).addTo(map);

                // On click, fetch Wikipedia image + weather
                marker.on('click', () => {
                    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${capital}`)
                        .then(r => r.json())
                        .then(data => {
                            const image = data.thumbnail ? `<img src="${data.thumbnail.source}" width="200">` : '';
                            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                                .then(r => r.json())
                                .then(weather => {
                                    const temp = weather.current_weather.temperature;
                                    const desc = weather.current_weather.weathercode;
                                    marker.bindPopup(`
                                        <b>${capital}, ${countryName}</b><br>
                                        ${image}<br>
                                        ${data.extract || 'No info'}<br>
                                        🌡️ Temp: ${temp}°C, Code: ${desc}
                                    `).openPopup();
                                });
                        });
                });
            }
        });
    })
    .catch(err => console.error('Error fetching countries:', err));

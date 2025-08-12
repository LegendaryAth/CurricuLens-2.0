// script.js

// Initialize map
const map = L.map('map', { zoomControl: true }).setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const markersLayer = L.layerGroup().addTo(map);

// DOM Elements
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const details = document.getElementById('details');
const intro = document.getElementById('intro');
const titleName = document.getElementById('titleName');
const subtitle = document.getElementById('subtitle');
const flagImg = document.getElementById('flagImg');
const thumbnail = document.getElementById('thumbnail');
const populationBadge = document.getElementById('populationBadge');
const areaBadge = document.getElementById('areaBadge');
const timezoneBadge = document.getElementById('timezoneBadge');
const factsList = document.getElementById('factsList');
const historyText = document.getElementById('historyText');
const wikiFull = document.getElementById('wikiFull');
const countryMap = document.getElementById('countryMap');
const searchBox = document.getElementById('searchBox');
const locateBtn = document.getElementById('locateBtn');

closeSidebar.addEventListener('click', () => sidebar.classList.add('closed'));
map.on('click', () => sidebar.classList.add('closed'));

function showSidebar() {
  sidebar.classList.remove('closed');
  details.classList.remove('hidden');
  intro.classList.add('hidden');
}
function hideSidebar() {
  sidebar.classList.add('closed');
}
function clearDetails() {
  titleName.textContent = '';
  subtitle.textContent = '';
  flagImg.src = '';
  flagImg.alt = '';
  thumbnail.src = '';
  thumbnail.classList.add('hidden');
  populationBadge.textContent = 'Population —';
  areaBadge.textContent = 'Area —';
  timezoneBadge.textContent = 'Timezone —';
  factsList.innerHTML = '';
  historyText.textContent = '';
  wikiFull.href = '#';
  countryMap.href = '#';
}

// Number formatter
function n(x) {
  return x ? x.toLocaleString() : '—';
}

// Load CSV and place markers
Papa.parse('capitals.csv', {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function (results) {
    window.capitals = results.data.filter(
      (r) => r.Capital && r.Latitude && r.Longitude
    );
    placeMarkers(window.capitals);
    buildSearchIndex(window.capitals);
  },
  error: function (e) {
    console.error('CSV load error', e);
    alert('Could not load capitals.csv — run via http server.');
  },
});

function placeMarkers(list) {
  markersLayer.clearLayers();
  console.log('placeMarkers() -> placing', list.length, 'markers');

  list.forEach((row) => {
    const lat = parseFloat(row.Latitude || row.lat);
    const lon = parseFloat(row.Longitude || row.lon);
    const country = row.Country || row.country;
    const capital = row.Capital || row.capital;

    if (isNaN(lat) || isNaN(lon)) {
      console.warn('Skipping row with bad coords:', row);
      return;
    }

    // Create marker
    const marker = L.circleMarker([lat, lon], {
      radius: 6,
      fillOpacity: 0.95,
      color: '#6EE7B7',
      weight: 1,
    }).addTo(markersLayer);

    marker.bindTooltip(`<strong>${capital}</strong><br/><small>${country}</small>`);

    // Marker click
    marker.on('click', function (e) {
      L.DomEvent.stopPropagation(e); // prevent map click
      showSidebar();
      clearDetails();

      titleName.textContent = `${capital}, ${country}`;
      subtitle.textContent = `Coords: ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
      wikiFull.textContent = 'Open Wikipedia';
      countryMap.textContent = 'Open Country on OSM';

      try {
        map.flyTo([lat, lon], 5, { duration: 0.9 });
      } catch (e) {}

      // Fetch REST Countries & Wikipedia summary parallel
      const capitalEnc = encodeURIComponent(capital);
      const countryEnc = encodeURIComponent(country);
      const restUrl = `https://restcountries.com/v3.1/capital/${capitalEnc}`;
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${capitalEnc}`;

      Promise.all([
        fetch(restUrl).then((r) => (r.ok ? r.json() : Promise.reject('no country'))),
        fetch(wikiUrl).then((r) => (r.ok ? r.json() : Promise.resolve({}))),
      ])
        .then(([rResp, wResp]) => {
          const c = Array.isArray(rResp) ? rResp[0] : rResp;

          titleName.textContent = `${capital}, ${country} · ${c.name?.common || ''}`;
          subtitle.textContent = `${c.region || '—'} · ${c.subregion || '—'} · ${
            c.timezones ? c.timezones[0] : '—'
          }`;
          flagImg.src = c.flags?.svg || c.flags?.png || '';
          flagImg.alt = `${country} flag`;

          if (wResp && wResp.thumbnail && wResp.thumbnail.source) {
            thumbnail.src = wResp.thumbnail.source;
            thumbnail.classList.remove('hidden');
          }

          populationBadge.textContent = `Population ${n(c.population)}`;
          areaBadge.textContent = `Area ${n(c.area)} km²`;
          timezoneBadge.textContent = `Timezones: ${
            c.timezones ? c.timezones.join(', ') : '—'
          }`;

          const languages = c.languages
            ? Object.values(c.languages).join(', ')
            : '—';
          const currencies = c.currencies
            ? Object.values(c.currencies)
                .map((x) => x.name + (x.symbol ? ` (${x.symbol})` : ''))
                .join(', ')
            : '—';
          const borders = c.borders ? c.borders.join(', ') : 'None';
          const driving = c.car?.side || '—';
          const startWeek = c.startOfWeek || '—';

          factsList.innerHTML = `
            <li><strong>Official name:</strong> ${c.name?.official || '—'}</li>
            <li><strong>Languages:</strong> ${languages}</li>
            <li><strong>Currencies:</strong> ${currencies}</li>
            <li><strong>Borders:</strong> ${borders}</li>
            <li><strong>Driving side:</strong> ${driving}</li>
            <li><strong>Start of week:</strong> ${startWeek}</li>
          `;

          historyText.innerHTML =
            wResp.extract_html ||
            (wResp.extract
              ? `<p>${wResp.extract}</p>`
              : '<p class="muted">No wiki summary available for the capital — try the country page.</p>');

          wikiFull.href =
            wResp.content_urls?.desktop?.page ||
            `https://en.wikipedia.org/wiki/${capitalEnc}`;
          countryMap.href = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
            country
          )}`;
        })
        .catch(async (err) => {
          console.warn('primary fetch failed', err);
          // fallback: fetch by country name
          try {
            const rc = await fetch(
              `https://restcountries.com/v3.1/name/${countryEnc}`
            ).then((r) => (r.ok ? r.json() : Promise.reject('no country by name')));
            const c = Array.isArray(rc) ? rc[0] : rc;
            flagImg.src = c.flags?.svg || c.flags?.png || '';
            populationBadge.textContent = `Population ${n(c.population)}`;
            areaBadge.textContent = `Area ${n(c.area)} km²`;
            factsList.innerHTML = `
              <li><strong>Official name:</strong> ${c.name?.official || '—'}</li>
              <li><strong>Region:</strong> ${c.region || '—'}</li>`;
            historyText.innerHTML =
              '<p class="muted">Could not fetch capital-specific wiki. Showing country info.</p>';
            wikiFull.href = `https://en.wikipedia.org/wiki/${countryEnc}`;
            countryMap.href = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
              country
            )}`;
          } catch (e2) {
            console.error('fallback failed', e2);
            historyText.innerHTML = `<p class="muted">No extra info available.</p>`;
          }
        });
    });
  });
}

// Search index & filter
let searchIndex = [];

function buildSearchIndex(list) {
  searchIndex = list.map((r) => ({
    q: `${(r.Capital || '').toLowerCase()} ${(r.Country || '').toLowerCase()}`,
    row: r,
  }));
}

searchBox.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) {
    placeMarkers(window.capitals);
    return;
  }
  const results = searchIndex
    .filter((item) => item.q.includes(q))
    .slice(0, 500)
    .map((it) => it.row);
  placeMarkers(results);
  if (results.length > 0) {
    try {
      map.flyTo(
        [parseFloat(results[0].Latitude), parseFloat(results[0].Longitude)],
        4
      );
    } catch (e) {}
  }
});

// Geolocation button
locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation not available');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      map.flyTo([pos.coords.latitude, pos.coords.longitude], 6);
    },
    (err) => alert('Could not get location: ' + err.message)
  );
});

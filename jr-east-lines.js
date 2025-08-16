// JR East lines page JS
const container = document.getElementById('station-list');
const filtersDiv = document.getElementById('filters');
const urlParams = new URLSearchParams(window.location.search);
const lineName = urlParams.get('line');
let stationData = [];

fetch('stations.json')
  .then(res => res.json())
  .then(data => {
    stationData = data.filter(entry => entry.company === "JR東日本" && entry.line === lineName);
    setupFilters(stationData);
    render(stationData);
  });

function setupFilters(data) {
  filtersDiv.innerHTML = `
    <label for="station-filter">駅名：</label>
    <select id="station-filter"><option value="">すべて</option></select>
    <label for="melody-filter">メロディ名：</label>
    <select id="melody-filter"><option value="">すべて</option></select>
  `;
  const stationFilter = document.getElementById('station-filter');
  const melodyFilter = document.getElementById('melody-filter');

  fillSelectOrdered(stationFilter, getUniqueOrdered(data, "station"));
  fillSelectOrdered(melodyFilter, getUniqueOrdered(data, "melody"));

  [stationFilter, melodyFilter].forEach(select => {
    select.addEventListener('change', () => {
      filterAndRender(data, stationFilter.value, melodyFilter.value);
    });
  });
}

function getUniqueOrdered(data, key) {
  const seen = new Set();
  return data
    .map(item => item[key])
    .filter(x => {
      if (seen.has(x)) return false;
      seen.add(x);
      return true;
    });
}

function fillSelectOrdered(select, items) {
  while (select.options.length > 1) select.remove(1);
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function filterAndRender(data, stationVal, melodyVal) {
  const filtered = data.filter(entry =>
    (!stationVal || entry.station === stationVal) &&
    (!melodyVal || entry.melody === melodyVal)
  );
  render(filtered);
}

function render(data) {
  container.innerHTML = '';
  if (data.length === 0) {
    container.innerHTML = '<p>該当する結果がありません。</p>';
    return;
  }

  data.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'station';

    const stationLink = `<a href="/dokodemo-ekimero/stations/${encodeURIComponent(entry.station)}.html" style="color:#1976d2;text-decoration:underline;font-weight:700;">${entry.station}</a>`;
    
    div.innerHTML = `
      <strong>${stationLink}</strong><br>
      <em>${entry.melody}</em><br>
      <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">
        <label style="font-size:0.85em; display:flex; align-items:center; gap:4px; cursor:pointer;">
          <input type="checkbox" class="loop-checkbox" checked>
          ループ
        </label>
        <audio controls controlsList="nodownload" src="${entry.file}" class="station-audio"></audio>
      </div>
    `;

    container.appendChild(div);
  });

  // ✅ Set loop for all audios on page load
  container.querySelectorAll('.station').forEach(stationDiv => {
    const checkbox = stationDiv.querySelector('.loop-checkbox');
    const audio = stationDiv.querySelector('.station-audio');
    if (checkbox && audio) {
      audio.loop = checkbox.checked; // loop ON if checked by default
      checkbox.addEventListener('change', () => {
        audio.loop = checkbox.checked;
      });
    }
  });
}

// Optional: global play counter
function incrementGlobalPlayCount() {
  if (!window.db) return; // db not initialized yet?
  const counterRef = window.db.ref("totalPlays");
  counterRef.transaction(current => (current || 0) + 1);
}

// Toei lines page JS
const container = document.getElementById('station-list');
const filtersDiv = document.getElementById('filters');
const urlParams = new URLSearchParams(window.location.search);
const lineName = urlParams.get('line');

fetch('stations.json')
  .then(res => res.json())
  .then(data => {
    // Filter for 都営地下鉄 and selected line
    const filtered = data.filter(entry => entry.company === "都営地下鉄" && entry.line === lineName);
    render(filtered);
  });

function render(data) {
  container.innerHTML = '';
  if (data.length === 0) {
    container.innerHTML = '<p>該当する結果がありません。</p>';
    return;
  }
  data.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'station';
    // Make station name clickable, linking to /stations/[station].html
    const stationLink = `<a href="/stations/${encodeURIComponent(entry.station)}.html" style="color:#1976d2;text-decoration:underline;font-weight:700;">${entry.station}</a>`;
    div.innerHTML = `
      <strong>${stationLink}</strong><br>
      <em>${entry.melody}</em><br>
      <audio controls src="${entry.file}"></audio>
    `;
    container.appendChild(div);
  });
}

// Tokyo Metro lines page JS
const container = document.getElementById('station-list');
const filtersDiv = document.getElementById('filters');
const urlParams = new URLSearchParams(window.location.search);
const lineName = urlParams.get('line');

fetch('stations.json')
  .then(res => res.json())
  .then(data => {
    // Filter for 東京メトロ and selected line
    const filtered = data.filter(entry => entry.company === "東京メトロ" && entry.line === lineName);
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
    div.innerHTML = `
      <strong>${entry.station}</strong><br>
      <em>${entry.melody}</em><br>
      <audio controls src="${entry.file}"></audio>
    `;
    container.appendChild(div);
  });
}

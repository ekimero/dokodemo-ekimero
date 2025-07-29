let stationData = [];

const companyFilter = document.getElementById('company-filter');
const lineFilter = document.getElementById('line-filter');
const stationFilter = document.getElementById('station-filter');
const melodyFilter = document.getElementById('melody-filter');
const container = document.getElementById('station-list');

fetch('stations.json')
  .then(res => res.json())
  .then(data => {
    stationData = data;
    populateFilters(data);
    render(data);
  })
  .catch(err => {
    container.innerHTML = '<p>データの読み込み中にエラーが発生しました。</p>';
    console.error(err);
  });

function populateFilters(data) {
  // Fill filters with initial options, in order found in data
  fillSelectOrdered(companyFilter, getUniqueOrdered(data, "company"));
  fillSelectOrdered(lineFilter, getUniqueOrdered(data, "line"));
  fillSelectOrdered(stationFilter, getUniqueOrdered(data, "station"));
  fillSelectOrdered(melodyFilter, getUniqueOrdered(data, "melody"));

  [companyFilter, lineFilter, stationFilter, melodyFilter].forEach(select => {
    select.addEventListener('change', filterAndRender);
  });
}

// Get unique values preserving order
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

// Fill a select element with options in order
function fillSelectOrdered(select, items) {
  // Clear except first option ("すべて")
  while (select.options.length > 1) {
    select.remove(1);
  }
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function filterAndRender() {
  // Current selections
  const companyVal = companyFilter.value;
  const lineVal = lineFilter.value;
  const stationVal = stationFilter.value;
  const melodyVal = melodyFilter.value;

  // Filter data by all selected filters
  const filteredData = stationData.filter(entry => {
    return (!companyVal || entry.company === companyVal) &&
           (!lineVal || entry.line === lineVal) &&
           (!stationVal || entry.station === stationVal) &&
           (!melodyVal || entry.melody === melodyVal);
  });

  // Update filter options based on current filteredData & current selections
  updateFilters(filteredData, {companyVal, lineVal, stationVal, melodyVal});

  // Render stations in original order but filtered
  render(filteredData);
}

function updateFilters(filteredData, currentVals) {
  // For each filter, update its options so only matching ones appear

  // Companies in filtered data
  const companies = getUniqueOrdered(filteredData, "company");
  // Lines in filtered data
  const lines = getUniqueOrdered(filteredData, "line");
  // Stations in filtered data
  const stations = getUniqueOrdered(filteredData, "station");
  // Melodies in filtered data
  const melodies = getUniqueOrdered(filteredData, "melody");

  // Update each select, keeping current selection if still valid,
  // otherwise reset to ""

  updateSelectOptions(companyFilter, companies, currentVals.companyVal);
  updateSelectOptions(lineFilter, lines, currentVals.lineVal);
  updateSelectOptions(stationFilter, stations, currentVals.stationVal);
  updateSelectOptions(melodyFilter, melodies, currentVals.melodyVal);
}

// Helper to update a select element options (except first "すべて")
// and keep selection if still valid, else reset to ""
function updateSelectOptions(select, items, currentVal) {
  while (select.options.length > 1) {
    select.remove(1);
  }
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });

  if (currentVal && items.includes(currentVal)) {
    select.value = currentVal;
  } else {
    select.value = "";
  }
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
    div.innerHTML = `
      <strong>${entry.station}</strong>（${entry.line}、${entry.company}）<br>
      <em>${entry.melody}</em><br>
      <audio controls src="${entry.file}"></audio>
    `;
    container.appendChild(div);
  });
}

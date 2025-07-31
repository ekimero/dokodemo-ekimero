const fs = require('fs');
const path = require('path');

// Load template
const template = fs.readFileSync('station-template.html', 'utf8');
// Load station data
const stations = JSON.parse(fs.readFileSync('stations.json', 'utf8'));

// Get unique station names
const stationNames = [...new Set(stations.map(st => st.station))];

// Generate a page for each station
const outputDir = path.join(__dirname, 'stations');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}
stationNames.forEach(station => {
  // Replace {{station}} in template
  const html = template.replace(/\{\{station\}\}/g, station);
  // Save as stations/[station].html (e.g., stations/東京.html)
  const filename = path.join(outputDir, `${station}.html`);
  fs.writeFileSync(filename, html, 'utf8');
  console.log(`Generated: ${filename}`);
});
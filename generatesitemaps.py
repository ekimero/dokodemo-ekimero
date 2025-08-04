import json
import xml.etree.ElementTree as ET
from xml.dom import minidom
from datetime import datetime

# Load the JSON data
with open("stations.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Create the root <urlset> element
urlset = ET.Element("urlset", {
    "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
    "xsi:schemaLocation": "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
})

# Add homepage entry
home_url = ET.SubElement(urlset, "url")
ET.SubElement(home_url, "loc").text = "https://ekimero.github.io/dokodemo-ekimero/"
ET.SubElement(home_url, "lastmod").text = datetime.utcnow().isoformat() + "Z"
ET.SubElement(home_url, "priority").text = "1.00"

# Collect unique stations
station_names = sorted(set(entry["station"] for entry in data))

# Add station URLs
for station in station_names:
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = f"https://ekimero.github.io/dokodemo-ekimero/stations/{station}.html"
    ET.SubElement(url, "lastmod").text = datetime.utcnow().isoformat() + "Z"
    ET.SubElement(url, "priority").text = "0.80"

# Pretty-print the XML
rough_string = ET.tostring(urlset, 'utf-8')
reparsed = minidom.parseString(rough_string)
pretty_xml = reparsed.toprettyxml(indent="  ", encoding="utf-8")

# Write to file
with open("sitemapnew.xml", "wb") as f:
    f.write(pretty_xml)

print("✅ Pretty sitemap.xml generated.")

import json
import unicodedata

# Load your JSON file
with open("stations.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Decompose only the "file" fields
for entry in data:
    if "file" in entry:
        entry["file"] = unicodedata.normalize("NFD", entry["file"])

# Save back to file or a new file
with open("stations_decomposed.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

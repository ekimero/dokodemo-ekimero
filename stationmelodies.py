import json

def get_unique_melody_files(json_file):
    # Load the JSON data
    with open(json_file, 'r', encoding='utf-8') as f:
        stations = json.load(f)
    
    # Extract all unique melody files
    unique_files = set()
    
    for station in stations:
        if 'file' in station:
            # Extract just the filename without path and extension
            filename = station['file'].replace('audio/', '').replace('.mp3', '')
            unique_files.add(filename)
    
    return sorted(unique_files)

# Example usage
if __name__ == "__main__":
    required_files = get_unique_melody_files('stations.json')
    
    print(f"Total unique melody files needed: {len(required_files)}")
    print("List of required files:")
    for file in required_files:
        print(f"- {file}.mp3")
    
    # Optionally save to a text file
    with open('required_melodies.txt', 'w', encoding='utf-8') as f:
        f.write("\n".join([f"{file}.mp3" for file in required_files]))
    
    print("\nList has also been saved to 'required_melodies.txt'")
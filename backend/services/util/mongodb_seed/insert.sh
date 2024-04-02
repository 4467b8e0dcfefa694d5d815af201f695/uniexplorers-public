#!/bin/bash

# Function to split and import large JSON file
split_and_import() {
    local file=$1
    local collection=$2
    local chunk_size=16000  # Size in kilobytes; adjust if needed

    # Splitting the JSON file into smaller chunks
    jq -c '.[]' $file | split -l $chunk_size - ${file}_part_

    # Import each chunk into MongoDB
    for chunk in ${file}_part_*; do
        echo "Importing $chunk into collection $collection..."
        mongoimport --host $MONGO_HOST --port $MONGO_PORT --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --db $MONGO_INITDB_DATABASE --collection $collection --file $chunk
        rm $chunk
    done
}

# Define your files and corresponding collections
declare -A files_collections=(
    ["json/city_geocode_data.json"]="CityGeocode"
    ["json/city_nearby_data.json"]="CityNearby"
    ["json/uni_geocode_data.json"]="UniGeocode"
    ["json/uni_nearby_data.json"]="UniNearby"
    ["json/course_mapping.json"]="CourseMapping"
)

# Main loop to process each file
for file in "${!files_collections[@]}"; do
    collection=${files_collections[$file]}
    echo "Processing $file for collection $collection..."

    # Check if file size is greater than 16MB (16384 kilobytes)
    if [[ $(stat -c%s "$file") -gt 16384000 ]]; then
        echo "$file is larger than 16MB, splitting..."
        split_and_import $file $collection
    else
        echo "Importing $file into collection $collection..."
        mongoimport --host $MONGO_HOST --port $MONGO_PORT --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --db $MONGO_INITDB_DATABASE --collection $collection --file $file --jsonArray
    fi
done

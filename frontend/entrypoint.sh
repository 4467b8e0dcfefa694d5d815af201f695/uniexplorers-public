#!/bin/sh

# ROOT_DIR=/usr/share/nginx/html
ROOT_DIR=/app

# Replace env vars in JavaScript files
echo "Replacing env constants in JS"

# Probably better if it could just read whatever env variables were set BUT WTV
keys="VITE_CLERK_PUBLISHABLE_KEY
VITE_USER_BACKEND
VITE_UNI_BACKEND
VITE_FORUM_BACKEND
VITE_IMAGE_BACKEND
VITE_RECOMMENDER_BACKEND
VITE_GOOGLE_BACKEND
VITE_SIMILARITY_BACKEND
VITE_NOTIF_GRPC
VITE_NOTIF_WS
VITE_CHAT_BACKEND
VITE_AUTH_BACKEND
VITE_API_GATEWAY
VITE_BACKEND"

for file in $ROOT_DIR/assets/index*.js* $ROOT_DIR/assets/*.js* ;
do
    echo "Processing $file ...";

    for key in $keys
    do
        value=$(eval echo \$$key)
        echo "replace $key by $value"
        sed -i 's#'"$key"'#'"$value"'#g' $file
    done

done

echo "Starting Nginx"
nginx -g 'daemon off;'
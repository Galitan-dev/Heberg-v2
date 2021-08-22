#!/bin/bash

echo "Heberg v2"
echo From $(whoami)

echo $(which node)
echo Using node $(node -v)
echo Using npm $(npm -v)
echo Using yarn $(yarn -v)

echo "Cleaning old code..."
rm -rf ~/heberg/app
echo "Clean!"

echo "Downloading code from github..."
git clone https://galitan-dev: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@github.com/galitan-dev/heberg-v2 ~/heberg/app
echo "Downloaded!"

echo "Preparing scripts..."
chmod -R u+x ~/heberg/app/scripts
echo "Scripts are ready!"

echo "Installing dependencies..."
cd ~/heberg/app
yarn install --production
echo "Installed!"

echo "Preparing environment"

echo "Injecting PORT"
unset port
export PORT=4000

echo "Injecting MONGO_URI"
unset MONGO_URI
export MONGO_URI="mongodb://localhost:27017/heberg"

echo "Done!"
echo "Launching server..."
node ~/heberg/app/server.js
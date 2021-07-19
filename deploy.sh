#!/bin/bash

echo "Heberg v2"
echo From $(whoami)

echo $(which node)
echo Using node $(node -v)
echo Using npm $(/home/ethan/.nvm/versions/node/v14.17.0/bin/npm -v)
echo Using yarn $(/home/ethan/.nvm/versions/node/v14.17.0/bin/yarn -v)

echo "Cleaning old code..."
rm -rf ~/heberg/app
echo "Clean!"

echo "Downloading code from github..."
git clone https://galitan-dev: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@github.com/galitan-dev/heberg-v2 ~/heberg/app
echo "Downloaded!"

echo "Installing dependencies..."
cd ~/heberg/app
/home/ethan/.nvm/versions/node/v14.17.0/bin/yarn install --production
echo "Installed!"

echo "Preparing environment"

echo "Injecting PORT"
unset port
export PORT=4000

echo "Injecting MONGO_URI"
unset MONGO_URI
export MONGO_URI="mongodb://localhost:27017"

echo "Done!"
echo "Launching server..."
/home/ethan/.nvm/versions/node/v14.17.0/bin/node ~/heberg/app/server.js
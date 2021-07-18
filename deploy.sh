#!/bin/bash

echo "Cleaning old code..."
rm -rf ~/heberg/app
echo "Clean!"

echo "Downloading code from github..."
git clone https://galitan-dev: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@github.com/galitan-dev/heberg-v2 ~/heberg/app
echo "Downloaded!"

echo "Installing dependencies..."
cd ~/heberg/app
/home/ethan/.nvm/versions/node/v16.3.0/bin/yarn install --production
echo "Installed!"

echo "Preparing environment"
echo "Injecting PORT"
unset port
export PORT=4000

echo "Done!"
echo "Launching server..."
/bin/node ~/heberg/app/server.js
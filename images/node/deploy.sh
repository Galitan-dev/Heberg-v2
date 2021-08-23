#!/bin/bash

rm $HOME/stdout.log $HOME/stderr.log
touch $HOME/stdout.log
touch $HOME/stderr.log
exec > "stdout.log" 2> "stderr.log"

eval "$(jq -r '.env | keys[] as $k | "export \($k)=\(.[$k]) &&"' package.json) cd ."

cd ./app

yarn install --production
npm start

exec 1>&- 2>&-
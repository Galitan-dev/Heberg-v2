#!/bin/bash

rm sysout.log syserr.log
touch stdout.log
touch stderr.log
exec > "stdout.log" 2> "stderr.log"

eval "$(jq -r '.env | keys[] as $k | "export \($k)=\(.[$k]) &&"' package.json) cd ."

yarn install --production
npm start

exec 1>&- 2>&-
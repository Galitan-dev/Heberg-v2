#!/bin/bash

exec > "sysout.log" 2> "syserr.log"

eval "$(jq -r '.env | keys[] as $k | "export \($k)=\(.[$k]) &&"' package.json) cd ."

yarn install --production
npm start

exec 1>&- 2>&-
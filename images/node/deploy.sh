#!/bin/bash

STDOUT="/run/stdout.log"
STDERR="/run/stderr.log"

rm "$STDOUT" && touch "$STDOUT"
rm "$STDERR" && touch "$STDERR"
exec > "$STDOUT" 2> "$STDERR"

eval "$(jq -r '.env | keys[] as $k | "export \($k)=\(.[$k]) &&"' package.json) cd ."

cd /app

yarn install --production
npm start

exec 1>&- 2>&-
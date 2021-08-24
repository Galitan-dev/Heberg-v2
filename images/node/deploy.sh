#!/bin/sh

exit_script() {
    exec 1>&- 2>&-
    trap - SIGINT SIGTERM
    kill -- -$$
}

trap exit_script SIGINT SIGTERM

LOGS_FILE="/run/out.log"

rm "$LOGS_FILE" && touch "$LOGS_FILE"
exec > "$LOGS_FILE" 2>&1

cd /run/app

eval "$(jq -r '.env | keys[] as $k | "export \"\($k)=\(.[$k])\" &&"' package.json) cd ."

yarn install --production
npm start
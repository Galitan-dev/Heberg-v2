#!/bin/bash

NAME=$1
CWD=$(dirname "$(readlink -f "$0")")

$CWD/stop.sh $NAME
docker build -t $NAME:latest --build-arg path=$HOME/hosts/$NAME $HOME/heberg/app/images/node/

mongo heberg --eval "db.hebergs.updateOne({ name: '$NAME' }, { $set: { containerId: null  } })" --quiet
$CWD/start.sh $NAME
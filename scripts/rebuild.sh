#!/bin/bash

NAME=$1
CWD=$(dirname "$(readlink -f "$0")")

$CWD/stop.sh $NAME
$CWD/build.sh $NAME

mongo heberg --eval "db.hebergs.updateOne({name:'$NAME'},{\$set:{containerId: null}})" --quiet
$CWD/start.sh $NAME
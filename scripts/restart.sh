#!/bin/bash

NAME=$1
CWD=$(dirname "$(readlink -f "$0")")

$CWD/stop.sh $NAME
$CWD/start.sh $NAME
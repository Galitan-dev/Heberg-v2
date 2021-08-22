#!/bin/bash

NAME=$1
CWD=$(dirname "$(readlink -f "$0")")

$CWD/start.sh $NAME
$CWD/stop.sh $NAME
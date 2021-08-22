#!/bin/bash

NAME=$1
ID=$(mongo heberg --eval "db.hebergs.findOne({name:'$NAME'}).containerId" --quiet)

docker stop $ID
docker run -d $NAME:latest
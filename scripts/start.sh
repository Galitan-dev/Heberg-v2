#!/bin/bash

NAME=$1
ID=$(mongo heberg --eval "db.hebergs.findOne({name:'$NAME'}).containerId" --quiet)

if [ "$ID" == "null" ]; then
    ID=$(docker run -d heberg-node)
    $(mongo heberg --eval "db.hebergs.updateOne({name:'$NAME'},{\$set:{containerId:'$ID'}})" --quiet)
else
    docker start $ID
fi
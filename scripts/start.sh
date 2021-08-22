#!/bin/bash

NAME=$1

ID=$(docker run -d $NAME:latest)

mongo heberg --eval "db.hebergs.updateOne({name:'$NAME'},{\$set:{containerId:'$ID'}})" --quiet
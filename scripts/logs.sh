#!/bin/bash

NAME=$1
ID=$(mongo heberg --eval "db.hebergs.findOne({name:'$NAME'}).containerId" --quiet)

tail -f "/var/lib/docker/containers/$ID/$ID-json.log"
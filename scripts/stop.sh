#!/bin/bash

ID=$(mongo heberg --eval "db.hebergs.findOne({name:'$NAME'}).containerId" --quiet)

docker stop $ID
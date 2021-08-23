#!/bin/bash

NAME=$1
HEBERG=$(mongo heberg --eval "JSON.stringify(db.hebergs.findOne({name:'$NAME'}))" --quiet)
ID=$(jq -r .containerId <<< $HEBERG)
USER=$(jq -r .repository.user <<< $HEBERG)
TOKEN=$(mongo heberg --eval "db.tokens.findOne({user:'$USER'}).value" --quiet)
REPOSITORY="$USER/$(jq -r .repository.name <<< $HEBERG)"

rm -fr $HOME/hosts/$NAME/app
git clone "https://$USER:$TOKEN@github.com/$REPOSITORY" $HOME/hosts/$NAME/app

if [ "$ID" == "null" ]; then
    ID=$(docker run -d -v $HOME/hosts/$NAME:/run $NAME:latest)
    mongo heberg --eval "db.hebergs.updateOne({name:'$NAME'},{\$set:{containerId:'$ID'}})" --quiet
else
    docker start $ID
fi
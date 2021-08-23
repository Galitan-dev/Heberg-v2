#!/bin/bash

NAME=$1

docker build -t $NAME:latest --build-arg path=$HOME/hosts/$NAME $HOME/hosts/$NAME
#!/bin/bash

NAME=$1

docker build -t $NAME:latest $HOME/hosts/$NAME
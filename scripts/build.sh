#!/bin/bash

NAME=$1

docker build -t $NAME:latest -v $HOME/hosts/$NAME:/$NAME --build-arg name=$NAME $HOME/hosts/$NAME
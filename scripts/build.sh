#!/bin/bash

NAME=$1

docker build -t $NAME:latest --build-arg name=$NAME $HOME/hosts/$NAME
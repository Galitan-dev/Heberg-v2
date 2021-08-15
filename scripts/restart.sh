#!/bin/bash

docker stop $2
docker run -d $1:latest
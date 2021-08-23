FROM node:16-alpine
LABEL Name="heberg-node"
LABEL Version="1.0"
ARG name
USER root
RUN ["apk", "add", "jq"]
USER node
WORKDIR /home/node
COPY "/home/ethan/hosts/$name/deploy.sh" .
RUN ["chmod", "+x", "./deploy.sh"]
ENTRYPOINT ["./deploy.sh"]
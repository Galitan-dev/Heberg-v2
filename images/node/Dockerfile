FROM node:16-alpine
LABEL Name="heberg-node"
LABEL Version="1.0"
USER node
WORKDIR /home/node
RUN ["apk", "add", "jq"] \
    ["chmod", "+x", "deploy.sh"]
ENTRYPOINT ["./deploy.sh"]
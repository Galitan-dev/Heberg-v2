FROM node:16-alpine
LABEL Name="heberg-node"
LABEL Version="1.0"
ARG name
USER root
RUN ["apk", "add", "jq"]
COPY ./deploy.sh /run
RUN ["chmod", "755", "/run/deploy.sh"]
USER node
ENTRYPOINT ["/run/deploy.sh"]
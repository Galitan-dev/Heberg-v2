FROM node:16-alpine
LABEL Name="heberg-node"
LABEL Version="1.0"
ARG name
USER root
RUN ["apk", "add", "jq"]
USER node
COPY ./deploy.sh /run
RUN ["chmod", "+x", "/run/deploy.sh"]
ENTRYPOINT ["/run/deploy.sh"]
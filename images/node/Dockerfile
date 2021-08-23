FROM node:16-alpine
LABEL Name="heberg-node"
LABEL Version="1.0"
ARG name
RUN mkdir /$name
WORKDIR /$name
ENV PORT=8080
EXPOSE 8080
RUN ["apk", "add", "jq"]
RUN ["chmod", "+x" "./launch.sh"]
RUN ["ls", "-al"]
ENTRYPOINT ["./launch.sh"]
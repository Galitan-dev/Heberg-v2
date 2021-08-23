FROM node:16-alpine
LABEL Name="heberg-node"
LABEL Version="1.0"
ARG path
WORKDIR $path
VOLUME $path
RUN rm out.log && touch out.log
RUN yarn install --production | tee out.log
ENV PORT=8080
EXPOSE 8080
CMD [ "./launch.sh" ]
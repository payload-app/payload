FROM node:9.3.0-alpine

RUN adduser -D sandbox

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY . /usr/src/app
RUN npm install

CMD npm start

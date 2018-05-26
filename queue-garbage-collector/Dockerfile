FROM node:9.3.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY . /usr/src/app
RUN npm install

CMD npm start

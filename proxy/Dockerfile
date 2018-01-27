FROM node:9.3.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE 80

RUN npm install -g @hharnisc/micro-proxy@1.2.1

CMD micro-proxy -r rules.json -p 80 -H 0.0.0.0

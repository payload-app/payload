FROM node:8.11.3-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE 5000

RUN npm install -g serve nodemon

CMD nodemon -x serve -e html,js,json

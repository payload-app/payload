FROM node:8.11.2-alpine as builder
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV production
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

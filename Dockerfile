FROM node:24-alpine

MAINTAINER Dev

RUN mkdir /app
WORKDIR /app

COPY ./backend/package.json .

RUN npm i
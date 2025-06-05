FROM node:20-alpine

MAINTAINER Dev

RUN mkdir /app
WORKDIR /app

COPY ./backend/package.json .

RUN npm i
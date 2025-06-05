# NodeJS Api clinic application

Available *mode* options:

- `production`
- `development`
- `test`

You need to create .env.${mode} and respectively configure them, looking up to .env.example

## Running App in Docker

Install [Docker](https://docs.docker.com/)


To build an image use this command<br/>
`docker compose build`

Then you can start the container<br/>
`docker compose up`

Also you can use single command to build and run the container</br>
`docker compose up --build`

## Running App locally

Install [NodeJS](https://nodejs.org/en) <br/>
Install Mongo dababase locally [MongoDB Compass](https://www.mongodb.com/products/tools/compass) <br/>
cd ./backend

Install packages `npm i`

- `npm run dev` starts app on localhost `PORT` using database `MONGO_URI`

- `npm run test` running integration tests using database `MONGO_URI`
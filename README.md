# NodeJS API Clinic application

Backend application using NodeJS, Express, MongoDB

## Running App in Docker

- Install [Docker](https://docs.docker.com/)
- Provide `.env.production` environment variables by example `.env.example`
- Run `docker compose up --build`

## Running App locally

- Install [NodeJS](https://nodejs.org/en)
- Install MongoDB locally [MongoDB Compass](https://www.mongodb.com/products/tools/compass) <br/>
- Go to app folder `cd ./backend`
- Install packages `npm i`
- Provide `.env.dev` environment variables by example `.env.example`
- `npm run dev` starts app on localhost `PORT` using database `MONGO_URI`

### Running tests
- Provide `.env.test` environment variables by example `.env.example`
- `npm run test` running integration tests using database `MONGO_URI`
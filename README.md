# Northcoders Games API - Backend Portfolio Project

## Project Details:

This project is an API for a boardgames review website. It was made as a backend portfolio piece as part of the Northcoders Coding Bootcamp.

The hosted version can be found here:
https://ncgames-adamtai.cyclic.app/api

<br>

## How to set up

### Setup environment variables:

In order to connect to the necessary test and developer databases, you must first add the required environment variables.

To do this, create the following files:

- `.env.devlopment - inside the file: PGDATABASE=nc_games`

- `.env.test - inside the file: PGDATABASE=nc_games_test`

These files should be automatically added to `.gitignore`

If you are unsure, there is a file called `.env-example` which gives an example of how your files should look.

This will ensure you are connecting to the correct database and be done via the script in the JSON file:
`"setup-dbs": "psql -f ./db/setup.sql"`

<br>

## Setup Instructions:

Install dependencies - `npm install`

Seed development data - `npm run seed`

Run test suites - `npm test`

Run unit testing only - `npm test utils.test.js`

Run integration tests only - `npm test app.test.js`

<br>

## Minimum Requirements:

Node.js : v18.4.0

Postgres : v14

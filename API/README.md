# Code Challenge 8 API Project

This project is the API (back end server) component of the SEISM web application.

## Pre-requisites

* MongoDB 3.4
* Robo3T 1.2 (optionally) - to manage database
* Node.js 8.12.0 (run `node -v` to verify)
* npm 6.4.1 (run `npm -v` to verify)
* Yarn 1.10.1 or greater (run `yarn -v` to verify)

### How to set up the database component

1. Install MongoDB 3.4
2. Install Robo3T 1.2 (optional - to manage the db)
4. Open a BASH shell.
5. Create the following folders if they don't already exist:
    1. `/c/data/db/`
    1. `/c/data/log/`
6. Change directories to the MongoDB bin folder. The default installation folder is `/c/Program Files/MongoDB/Server/3.4/bin`.
7. Run MongoDB by executing **mongod.exe**

The default connection is `localhost:20717`.

## Fork, build and run

Note that MongoDB must be running first.

1. After installing the pre-requisites, you can fork or straight download a copy of this application to start your own app.
2. Open a BASH shell.
3. Change to this project's directory, eg:
    - `cd /c/My\ Repos/CodeChallenge8-repo2/API/`.
4. Download all the dependencies with `yarn install`.
5. Run `npm start` to start the webpack server to run the application on port **3000**.
The API creates the initial database, if needed.
6. Seed the local database.
    1. Open a BASH shell.
    1. Change directories to the folder containing the file to import, eg:
        - ```cd /c/Users/severin/Desktop/```
    1. Run the following command to import the 'species' collection:
        - ```/c/Program\ Files/MongoDB/Server/3.4/bin/mongoimport.exe -h localhost:27017 -d seism --drop --collection species species.json```

## How to look at the Swagger OpenAPI documentation

1. Run the API as above.
2. Check the Swagger UI at http://localhost:3000/api/docs/.

Note that the Swagger UI allows you to 'try out' most of the API operations (if you are not using Keycloak).

## Running tests

### Unit Testing

This project uses [jest](http://jestjs.io/) as a testing framework. You can run tests with
`yarn test` or `jest`. Running either command with the `--watch` flag will re-run the tests every time a file is changed.

To run the tests in one file, simply pass the path of the file name eg:
 - `jest api/test/search.test.js --watch`.

To run only one test in that file, chain the `.only` command eg:
 - `test.only("Search returns results", () => {})`.

The most important thing to know about this project's test environment is the router setup. At the time of writing this, it wasn't possible to get [swagger-tools](https://github.com/apigee-127/swagger-tools) router working in the test environment. As a result, all tests completely bypass the real-life swagger-tools router. Instead, a middleware router called [supertest](https://github.com/visionmedia/supertest) is used to map routes to controller actions.

### Test database

The tests run on an in-memory MongoDB server, using the [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) package. The setup can be viewed at [test_helper.js](api/test/test_helper.js), and additional config in [config/mongoose_options.js]. It is currently configured to wipe out the database after each test run to prevent database pollution.

[Factory-Girl](https://github.com/aexmachina/factory-girl) is used to easily create models (persisted to db) for testing purposes.

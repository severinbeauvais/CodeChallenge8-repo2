# Code Challenge 8 API Project

This project is the API (back end server) component of the SEISM web application.

## Pre-requisites

- MongoDB 3.4
- Robo3T 1.2 (optionally) - to manage database
- Node.js 8.12.0 (run `node -v` to verify)
- npm 6.4.1 (run `npm -v` to verify)
- Yarn 1.10.1 or greater (run `yarn -v` to verify)

## How to set up the database component

Download MongoDB 3.4.

Download Robo3T 1.2.

Run MongoDB from the shell by executing **mongod.exe** 

(Default installation folder: c:\Program Files\MongoDB\Server\3.4\bin\mongod.exe)

Launch Robo3T, setting up a local connection with address **localhost : 27017**. Press **Connect**.

## How to run the API

**See also Initial Setup below.**

1) Open a BASH shell.

2) Change to this project's directory, eg `cd /c/My\ Repos/CodeChallenge8-repo2/API/.

3) Start the server by entering `npm start`.

## How to look at the Swagger OpenAPI documentation and test the API

1) Run the API

2) Check the swagger-ui at http://localhost:3000/api/docs/.

3) POST `http://localhost:3000/api/login/token` with the following body
``{
"username": #{username},
"password": #{password}
}`` and take the token that you get in the response.
 
4) GET `http://localhost:3000/api/species` again with the following header
``Authorization: Bearer _TOKEN_``, replacing `_TOKEN_ ` with the value you got from that request.

## Initial Setup

1) Start server and create initial database by running `npm start` in root folder.

2) Add Admin user to 'users' collection:

    ``
    db.users.insert({  "username": #{username}, "password": #{password}, roles: [['sysadmin'],['public']] })
    ``

3) Seed local database as described in [seed README](seed/README.md).

## Unit Testing

This project is using [jest](http://jestjs.io/) as a testing framework. You can run tests with
`yarn test` or `jest`. Running either command with the `--watch` flag will re-run the tests every time a file is changed.

To run the tests in one file, simply pass the path of the file name e.g. `jest api/test/search.test.js --watch`. To run only one test in that file, chain the `.only` command e.g. `test.only("Search returns results", () => {})`.

The **_MOST IMPORTANT_** thing to know about this project's test environment is the router setup. At the time of writing this, it wasn't possible to get [swagger-tools](https://github.com/apigee-127/swagger-tools) router working in the test environment. As a result, all tests **_COMPLETELY bypass_ the real life swagger-tools router**. Instead, a middleware router called [supertest](https://github.com/visionmedia/supertest) is used to map routes to controller actions. In each controller test, you will need to add code like the following:

```javascript
const test_helper = require('./test_helper');
const app = test_helper.app;
const featureController = require('../controllers/feature.js');
const fieldNames = ['tags', 'properties', 'applicationID'];

app.get('/api/feature/:id', function(req, res) {
  let params = test_helper.buildParams({'featureId': req.params.id});
  let paramsWithFeatureId = test_helper.createPublicSwaggerParams(fieldNames, params);
  return featureController.protectedGet(paramsWithFeatureId, res);
});

test("GET /api/feature/:id  returns 200", done => {
  request(app)
    .get('/api/feature/AAABBB')
    .expect(200)
    .then(done)
});
```

This code will stand in for the swagger-tools router, and help build the objects that swagger-tools magically generates when HTTP calls go through it's router. The above code will send an object like below to the `api/controllers/feature.js` controller `protectedGet` function as the first parameter (typically called `args`).

```javascript
{
  swagger: {
    params: {
      auth_payload: {
        scopes: ['sysadmin', 'public'],
        userID: null
      }, 
      fields: {
        value: ['tags', 'properties', 'applicationID']
      }, 
      featureId: {
        value: 'AAABBB'
      }
    }
  }
}
```

Unfortunately, this results in a lot of boilerplate code in each of the controller tests. There are some helpers to reduce the amount you need to write, but you will still need to check the parameter field names sent by your middleware router match what the controller(and swagger router) expect. However, this method results in  pretty effective integration tests as they exercise the controller code and save objects in the database. 


## Test Database
The tests run on an in-memory MongoDB server, using the [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) package. The setup can be viewed at [test_helper.js](api/test/test_helper.js), and additional config in [config/mongoose_options.js]. It is currently configured to wipe out the database after each test run to prevent database pollution. 

[Factory-Girl](https://github.com/aexmachina/factory-girl) is used to easily create models (persisted to db) for testing purposes. 

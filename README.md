# CodeChallenge8-repo2
This is the SEISM Code Challenge private repository.

## What you'll find here...

This repository contains the following documentation:
* This file (README.md)
* The [Apache License 2.0](LICENSE) file
* The original [Code Challenge Notice, Instructions & Rules](docs/CODE-CHALLENGE.md) file
* [A user flow diagram](docs/user-flow.pdf)
* [A test document](docs/SEISM-test-scripts.xlsx)
* [UI component documentation](UI/README.md)
* [API component documentation](API/README.md)
* [Database seeding documentation](API/seed/README.md)
* [Docker Keycloak documentation](docker/README.md)

(Note that, when the API is running, its Swagger UI page is at http://localhost:3000/api/docs/.)

This repository contains the following software components:
1. [API code project](API) - this is the API (back end server) component of the application
2. [UI code project](UI) - this is the UI (front end) component of the application
3. [Keycloak](docker/keycloak) - Docker image to run Keycloak locally

# How to install, build and run

### This application can be run in multiple modes:

#### 1. Keycloak environment

1. Run MongoDB - see [API documentation](API/README.md) for details
2. Run Keycloak - see [Docker documentation](docker/README.md) for details
3. Build and run the API component - see [API documentation](API/README.md) for details
4. Build and run the UI component - see [UI documentation](UI/README.md) for details

#### 2. Dev environment (Keycloak disabled)

1. Set a system environment variable `KeycloakEnabled` to `false`.
2. Run MongoDB - see [API documentation](API/README.md) for details
3. Build and run the API component - see [API documentation](API/README.md) for details
4. Build and run the UI component - see [UI documentation](UI/README.md) for details
    - Note: At step 5 of "Fork, build and run", instead of `npm start` use `npm run start-noauth`

#### 3. Prod environment

This is for deployment to a cloud host and requires access to a Keycloak service (eg, provided by DevExchange group).

# Architecture and design

This code challenge solution uses the [MEAN](http://mean.io) software stack, namely:
* MongoDB (database)
* Express.js (to serve the API)
* Angular (web application)
* Node.js (to run the API)

In addition, [Keycloak](http://www.keycloak.org/) is used to provide straightforward OAuth functionality and role mapping. (It can also be configured to provide IDIR federated login.)

The architecture is based on the Angular tutorial, 'Tour of Heroes'.

The code is based on a previous, open-source government project, PRC (https://github.com/bcgov/nrts-prc-admin and https://github.com/bcgov/nrts-prc-api).

## How everything fits together...

The typical user flow through the system is:
1. user navigates to the app root URL
2. app redirects user to Keycloak site
3. user selects authentication using GitHub credentials (or user can enter a Keycloak username and password)
4. if user has not previously registered, Keycloak adds a default user profile (with role=**siesm_user**)
5. Keycloak redirects user to the app
6. app front end (UI) displays species list page
    1. UI makes REST call to back end (API) to get data (note: bearer token is automatically added to request)
    2. API saves user profile to database
    3. API verifies bearer token (JWT)
    4. API retrieves species data from database
    5. API returns data to UI
    6. UI displays data
7. UI makes additional REST calls to create/read/update/delete species data (if user has role=**seism_admin**)

 See [this page](docker/README.md) to configure admin role.

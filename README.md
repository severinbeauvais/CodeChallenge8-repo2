# CodeChallenge8-repo2
This is the SEISM Code Challenge private repository.

## What you'll find here...

This repository contains the following documentation:
* This file (README.md)
* The Apache License 2.0 [file](LICENSE)
* The original Code Challenge Notice, Instructions & Rules [file](docs/CODE_CHALLENGE.md)
* Kirsten's user flow diagram (docs/TBD)
* An architecture diagram and explanation (docs/TBD)
* A test scripts file (docs/TBD)
* [UI documentation](UI/README.md)
* [API documentation](API/README.md)
* [Database seeding documentation](API/seed/README.md)
* [Docker documentation](docker/README.md)

Note that, when the API is running, its Swagger UI page is at http://localhost:3000/api/docs/.

This repository contains the following components:
1. [API code project](API) - this is the API (back end server) component of the application
2. [UI code project](UI) - this is the UI (front end) component of the application
3. [Keycloak](docker/keycloak) - Docker image to run Keycloak locally

## How to install, build and run

In order to run this application, you need to perform the following steps:
1. Run MongoDB - see [API documentation](API/README.md) for details
2. Run Keycloak (optional) - see [Docker documentation](docker/README.md) for details
3. Build and run the API component - see [API documentation](API/README.md) for details
4. Build and run the UI component - see [UI documentation](UI/README.md) for details

### This application can be run in 3 modes:

#### 1. Default environment

- Mode: Dev
- Keycloak: Disabled

Not production and Keycloak not enabled.

This is basically a local 'develop' environment and all users are treated as __admin__ users.

To run the application in Keycloak environment:
1.  Run `npm start`

#### 2. Keycloak environment

- Mode: Dev
- Keycloak: Enabled

Not production but uses Keycloak.

This can be used locally when the Keycloak Docker container is running.

To run the application in Keycloak environment:
1. Set a system environment variable `KeycloakEnabled` to `false`.

2. Either set the `environment.ts` variable `KeycloakEnabled` to `false` __OR__ run `npm run start-keycloak`.

#### 3. Prod environment

- Mode: Prod
- Keycloak: Enabled

Production code (fewer and smaller bundles) and uses Keycloak.

__This is for deployment to a cloud host and requires access to a Keycloak service (eg, provided by DevExchange group).__

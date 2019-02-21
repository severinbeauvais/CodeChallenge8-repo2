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

Note that, when the API is running, the API documentation is available at http://localhost:3000/api/docs/.

This repository contains the following components:
1. [API code project](API) - this is the API (back end server) component of the application
2. [UI code project](UI) - this is the UI (front end) component of the application
3. [Keycloak](docker/keycloak) - Docker image to run Keycloak locally

## How to install, build and run

In order to run this application, you need to do the following:
1. Run MongoDB - see [API documentation](API/README.md) for details
2. Run Keycloak (optional) - see [Docker documentation](docker/README.md) for details
3. Build and run the API component - see [API documentation](API/README.md) for details
4. Build and run the UI component - see [UI documentation](UI/README.md) for details

This application can run in 3 modes:

### Default environment

Not production and Keycloak not enabled. This is basically a local 'develop' environment (and is 'admin' user).

### 'Keycloak' environment

Not production but uses Keycloak. This can be used locally when the Keycloak Docker image is loaded.

Before starting the API project, set a system environment variable `KeycloakEnabled` to `false`.

Before starting the UI project, set environment.ts variable `KeycloakEnabled: false`.

### 'Prod' environment

Production code (fewer and smaller bundles) and uses Keycloak. This is for deployment to a cloud host and requires access to a Keycloak service (eg, provided by DevExchange group).

Before starting the API project, set a system environment variable `KeycloakEnabled` to `false`.

Before starting the UI project, set environment.ts variable `KeycloakEnabled: false`.

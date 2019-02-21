# CodeChallenge8-repo2
This is the SEISM Code Challenge private repository.

## What you'll find here...

This repository contains the following documentation:
* This file (README.md)
* The Apache License 2.0 file (LICENSE)
* The original Code Challenge Notice, Instructions & Rules file (docs/CODE_CHALLENGE.md)
* Kirsten's user flow diagram (docs/TBD)
* An architecture diagram and explanation (docs/TBD)
* A test scripts file (docs/TBD)
* TBD...

Also, when the API is running, the API documentation is available at http://localhost:3000/api/docs/.

This repository contains the following components:
1. [API](API) code project - this is the API (back end server) component of the application.
1. [UI](UI) code project - this is the UI (front end) component of the application.
1. [Keycloak](docker/keycloak) - Docker image to run Keycloak locally.

## How to install, build and run

In order to run this application, you need to launch the following:
1. MongoDB (see API documentation for details)
1. API component
1. UI component
1. Keycloak (optional)

There are 3 modes that this web application can be run:

### Default environment

Not production and Keycloak not enabled. This is basically a local 'develop' environment (and is 'admin' user).

### 'Keycloak' environment

Not production but uses Keycloak. This can be used locally when the Keycloak Docker image is loaded.

Before starting the API project, set a system environment variable `KeycloakEnabled` to `false`.

Before starting the UI project, set environment.ts variable `KeycloakEnabled: false`.

### 'Prod' environment

Production code and uses Keycloak. This is for deployment to a cloud host and requires access to a Keycloak service (eg, provided by DevExchange group).

Before starting the API project, set a system environment variable `KeycloakEnabled` to `false`.

Before starting the UI project, set environment.ts variable `KeycloakEnabled: false`.

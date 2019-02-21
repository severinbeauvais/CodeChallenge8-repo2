# CodeChallenge8-repo2
This is the SEISM Code Challenge private repository.

## What you'll find here...

This repository contains the following documentation:
* This file (README.md)
* The Apache License 2.0 file (LICENSE)
* The original Code Challenge Notice, Instructions & Rules file (CODE_CHALLENGE.md)
* Kirsten's user flow diagram
* An architecture diagram and explanation
* A test scripts file
* etc..

Also, when the API is running, the API documentation is available at http://localhost:3000/api/docs/.

This repository contains 2 code projects:
1. [API](API) - this is the API (back end server) component of the application
2. [UI](UI) - this is the UI (front end) component of the application

## How to install, build and run

In order to run this application, you need to launch the following:
1. MongoDB (see API documentation for details)
2. API component
3. UI component
4. Keycloak

## Run without Keycloak

## API
  Set a system environment variable `KeycloakEnabled` to `false`.

## UI
  Set environment.ts variable `KeycloakEnabled: false`.
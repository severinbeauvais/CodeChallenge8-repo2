# Code Challenge 8 UI Project

This project is the UI (front end) component of the SEISM web application.

## Pre-requisites

* Node.js 8.12.0 (run `node -v` to verify)
* npm 6.4.1 (run `npm -v` to verify)
* Angular CLI 6.2.1 (run `npm ls -g @angular/cli --depth=0` to verify)
* Yarn 1.10.1 or greater (run `yarn -v` to verify)
* TypeScript 2.3.4 (for webpack) (run `npm ls -g typescript --depth=0` to verify)
* TSLint 5.11.0 or greater  (run `tslint -v` to verify)

### Uninstall older node (if needed)

1. Uninstall all global packages: `npm uninstall -g <package>`
2. Uninstall Node.js
3. Delete `C:\Users\{user}\AppData\Roaming\npm`
4. Delete `C:\Users\{user}\AppData\Roaming\npm-cache`
5. Delete `C:\Users\{user}\AppData\Local\Temp\npm-*`
6. Reboot

### Install [Node.js](https://nodejs.org/)

Includes npm... Just use default settings.

### Install packages

1. Install [Angular CLI](https://angular.io/): `npm i -g @angular/cli@6.2.1`
2. Install [Yarn](https://yarnpkg.com/): `npm i -g yarn`
3. Install [TypeScript](https://www.npmjs.com/package/typescript) (needed for Webpack): `npm i -g typescript@2.3.4`
4. Install [TSLint](https://palantir.github.io/tslint/): `npm i -g tslint`


### Verify the installation

```
npm ls -g --depth=0
```

## Fork, build and run

Note that the API must be running first.

1. After installing the pre-requisites, you can fork or straight download a copy of this application to start your own app.
2. Open a BASH shell.
3. Change to this project's directory, eg `cd /c/My\ Repos/CodeChallenge8-repo2/UI/`.
4. Download all the dependencies with `yarn install`.
5. Run `npm start` to start the webpack server to run the application on port **4200**.

    Go to http://localhost:4200 to verify that the application is running.

    :bulb: To change the default port, open `.angular-cli.json`, change the value on `defaults.serve.port`.

    Note: when running without keycloak enabled instead of `npm start` use `npm run start-noauth`.

## Running tests

1. Run `npm run test` to execute the Jasmine unit tests via [Karma](https://karma-runner.github.io).

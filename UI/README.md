# Code Challenge 8 UI Project

This project is the UI (front end) component of the applications.

## Pre-requisites

- Node.js 8.12.0 (run `node -v` to verify)
- npm 6.4.1 (run `npm -v` to verify)
- Angular CLI 6.2.1 (run `npm ls -g @angular/cli --depth=0` to verify)
- Yarn 1.10.1 or greater (run `yarn -v` to verify)
- TSLint 5.11.0 or greater  (run `tslint -v` to verify)
- TypeScript 2.3.4 (for webpack) (run `npm ls -g typescript --depth=0` to verify)

### Uninstall Older Node (if needed)

1. Uninstall all global packages: `npm uninstall -g <package>`
1. Uninstall Node.js
1. Delete `C:\Users\{user}\AppData\Roaming\npm`
1. Delete `C:\Users\{user}\AppData\Roaming\npm-cache`
1. Delete `C:\Users\{user}\AppData\Local\Temp\npm-*`
1. Reboot

### Install [Node.js](https://nodejs.org/)

Includes npm... Just use default settings.

### Install Packages

1. Install [Angular CLI](https://angular.io/): `npm i -g @angular/cli@6.2.1`
1. Install [Yarn](https://yarnpkg.com/): `npm i -g yarn`
1. Install [TSLint](https://palantir.github.io/tslint/): `npm i -g tslint`
1. Install [TypeScript](https://www.npmjs.com/package/typescript) (needed for Webpack): `npm i -g typescript@'>=2.1.0 <2.4.0'`


### Verify the Installation

```
npm ls -g --depth=0
```

### Fork, Build and Run

1. After installing Node and Yarn, you can fork or straight download a copy of this application to start your own app.
1. First download all the dependencies with `yarn install`.
1. Run `npm start` to start the webpack server to run the application on port 4200.

    Go to http://localhost:4200 to verify that the application is running.

    :bulb: To change the default port, open `.angular-cli.json`, change the value on `defaults.serve.port`.
    
1. Run `npm run build` to just build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build, like so: `ng serve --prod` to run in production mode.
1. Run `npm run lint` to just lint your app code using TSLint.

## Running Tests

### Unit tests
  
Set up via Karma, Jasmine:
1. Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### End-to-end tests

Set up with Protractor:
1. Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
1. Before running the tests make sure you are serving the app via `ng serve`.

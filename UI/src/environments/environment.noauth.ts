// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { KeycloakConfig } from 'keycloak-angular';

let keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:8888/auth/',
  realm: 'master',
  clientId: 'seism-admin-console'
};

export const environment = {
  production: false,
  keycloak: keycloakConfig,
  KeycloakEnabled: false
};


# Docker Keycloak

## Installing Docker
See https://www.docker.com/get-started and install the latest version for your machine.

## Running local keycloak

Starts and seeds a standalone local keycloak instance running on localhost:8888.

Run:
```
docker-compose up
```

Keycloak admin user:
- username: admin
- password: admin

## Adding/removing user roles

With keycloak running, access the admin console at `localhost:8888/auth` and login as the admin user specified above.

### Supported roles:
- `seism_user` (the default role given to all authenticated users)
- `seism_admin` (the admin role that allows creating/editing/deleting species records)

### To grant a user the __seism_admin__ role:
1. Click on the `Users` item in the left nav menu.
2. Search for the user and/or click `View all users`.
3. Click the user.
4. Click the `Role Mappings` tab
    - From here you will see 2 boxes: `Available Roles` and `Assigned Roles`
5. Add or remove the `seism_admin` role by selecting the role from the appropriate box, and clicking the corresponding `Add Selected` or `Remove Selected` button.

## Exporting new realm config
Open a shell in the keycloak docker container:
```
docker exec -it docker_keycloak_1 sh
```
And run:
```
bin/standalone.sh -Dkeycloak.migration.action=export -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=<FILE_NAME.json> -Djboss.http.port=8888 -Djboss.https.port=9999 -Djboss.management.http.port=7777
```
Finally, if desired, copy the _<FILE_NAME>.json_ to your local machine, replacing the existing _realm.json_.
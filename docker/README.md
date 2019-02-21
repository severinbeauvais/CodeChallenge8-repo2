
# Docker Keycloak

## Running local keycloak

Starts and seeds a standalone local keycloak instance running on localhost:8888.

Keycloak admin user:
- username: admin
- password: admin

Run:
```
docker-compose up
```

## Adding/removing User Roles

With keycloak running, access the admin console at `localhost:8888/auth` and login as the admin user specified above.

### Supported Roles:
- `seism_user` (the default role given to all authenticated users)
- `seism_admin` (the admin role that allows creating/editing/deleting species records)

### To grant a user the __seism_admin__ role:
1. click on the `Users` item in the left nav menu.
2. Search for the user and/or click `View all users`.
3. Click the user.
4. Click the `Role Mappings` tab
    - From here you will see 2 boxes: `Available Roles` and `Assigned Roles`
5. Add or remove the `seism_admin` role by selecting the role from the appropriate box, and clicking the corresponding `Add Selected` or `Remove Selected` button.

## Export new realm config
From the docker container, run:
```
bin/standalone.sh -Dkeycloak.migration.action=export -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=<FILE_NAME.json> -Djboss.http.port=8888 -Djboss.https.port=9999 -Djboss.management.http.port=7777
```
And copy the _<FILE_NAME>.json_ to your local machine, replacing the existing _realm.json_ if desired.
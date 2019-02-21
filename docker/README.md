
# Docker Keycloak

### Running local keycloak

Starts and seeds a standalone local keycloak instance running on localhost:8888.

Run:
```
docker-compose up
```

### Export new realm config
From the docker container, run:
```
bin/standalone.sh -Dkeycloak.migration.action=export -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=<FILE_NAME.json> -Djboss.http.port=8888 -Djboss.https.port=9999 -Djboss.management.http.port=7777
```
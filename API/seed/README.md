# How to seed local database

1. Start with an empty database named 'seism'.
1. Import the seed JSON files according to the instructions below.

## How to Mongo Export

1. Change to folder to export the files to, eg
``cd /c/Users/severin/Desktop/``
1. Export the 'species' collection:
``/c/Program\ Files/MongoDB/Server/3.4/bin/mongoexport -h localhost:27017 -d seism --collection species --out species.json``
1. Export the 'users' collection:
``/c/Program\ Files/MongoDB/Server/3.4/bin/mongoexport -h localhost:27017 -d seism --collection users --out users.json``

## How to Mongo Import

1. Change to folder to import the files from, eg
``cd /c/Users/severin/Desktop/``
1. Import the 'species' collection:
``/c/Program\ Files/MongoDB/Server/3.4/bin/mongoimport.exe -h localhost:27017 -d nrts-dev --drop --collection species species.json``
1. Import the 'users' collection:
``/c/Program\ Files/MongoDB/Server/3.4/bin/mongoimport.exe -h localhost:27017 -d nrts-dev --drop --collection users users.json``

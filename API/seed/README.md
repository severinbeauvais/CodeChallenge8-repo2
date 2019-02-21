# How to seed local database

1. Start with an empty database named 'seism'.
1. Import the seed JSON files according to the instructions below.

## How to Mongo Export

1. Open a BASH shell.
1. Change directories to the folder to export the files to, eg
``cd /c/Users/severin/Desktop/``
1. Export the 'species' collection:
``/c/Program\ Files/MongoDB/Server/3.4/bin/mongoexport -h localhost:27017 -d seism --collection species --out species.json``

## How to Mongo Import

1. Open a BASH shell.
1. Change directories to the folder where the files to be imported are stored, eg
``cd /c/Users/severin/Desktop/``
1. Run the following command to import the 'species' collection:
``/c/Program\ Files/MongoDB/Server/3.4/bin/mongoimport.exe -h localhost:27017 -d seism --drop --collection species species.json``

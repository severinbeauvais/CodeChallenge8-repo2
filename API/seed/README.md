# How to seed your local database

1. Import the 'species' JSON file according to the instructions below.

## How to export a Mongo collection

1. Open a BASH shell.
1. Change directories to the folder to export the file to, eg
``cd /c/Users/severin/Desktop/``
1. Run the following command to export the 'species' collection:
``/c/Program\ Files/MongoDB/Server/3.4/bin/mongoexport -h localhost:27017 -d seism --collection species --out species.json``

## How to import a Mongo collection

1. Open a BASH shell.
1. Change directories to the folder containing the file to import, eg
``cd /c/Users/severin/Desktop/``
1. Run the following command to import the 'species' collection:
``/c/Program\ Files/MongoDB/Server/3.4/bin/mongoimport.exe -h localhost:27017 -d seism --drop --collection species species.json``

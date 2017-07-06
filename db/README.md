#This files contains the db failes for Locales

### Create a MongoDB

lltranslation

### json import 
## These are the table for lltranslation
1. locales.json
2. pages.json
3. translations.json

### to import it run the command:

mongoimport --db lltranslation -c locales --type csv --file locales.json
mongoimport --db lltranslation -c pages --type csv --file pages.json
mongoimport --db lltranslation -c translations --type csv --file translations.json


### csv import of translations
## There are to main .csv files to be imported in mongodb

1. ll-locale - en-US.csv
2. ll-locale - zh-CN.csv

### to import it run the command:

mongoimport --db lltranslation -c translations --type csv --file ll-locale - en-US.csv --headerline
mongoimport --db lltranslation -c translations --type csv --file ll-locale - zh-CN.csv --headerline


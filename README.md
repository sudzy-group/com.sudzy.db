# Sudzy Database
This module allows to access the data of the Sudzy POS.

[![Build Status](https://travis-ci.org/sudzy-group/com.sudzy.db.svg?branch=master)](https://travis-ci.org/sudzy-group/com.sudzy.db)
[![Coverage Status](https://coveralls.io/repos/github/sudzy-group/com.sudzy.db/badge.svg)](https://coveralls.io/github/sudzy-group/com.sudzy.db)


# Contributin to sudzy-db

`npm run generate` to generate the documentation

`npm run test` to run tests 

`npm run cover` to run the coverage 

Compile typescript:
tsc 

# Using this module in other modules
- To use the `sudzy-db` classes in a TypeScript file -

```ts
let db = new PouchDB("default");
const customers = new Customers(db, Customer);
customers.insert({ mobile : "6465490561" }).then((c) => {
    console.log(c.mobile)
}).catch(_.noop);
```

# Configure mySQL
1. One time: in MySQL workbench click file - run script etl/tables.sql - refresh all to create tables
2. One time. Change config.numMocks if you want and uncomment deleteMocks if you want: tsc etl/mocks.ts
3. One time: node etl/mocks.js
4. tsc etl/script.ts
5. node etl/script.js

# Installing CouchDB
see http://docs.couchdb.org/en/master/install/unix.html
```
apt-get install apt-transport-https ca-certificates
echo "deb https://apache.bintray.com/couchdb-deb stretch main"  | sudo tee -a /etc/apt/sources.list
curl -L https://couchdb.apache.org/repo/bintray-pubkey.asc | sudo apt-key add -
sudo apt-get update && sudo apt-get install couchdb
```
select 0.0.0.0 (or update in /opt/couchdb/etc/local.ini the binding ip)


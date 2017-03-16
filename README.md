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

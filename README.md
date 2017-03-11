# Sudzy Database
This module allows to access the data of the Sudzy POS.

# Using this module in other modules
- To use the `sudzy-db` classes in a TypeScript file -

```ts
let db = new PouchDB("default");
const customers = new Customers(db, Customer);
customers.insert({ mobile : "6465490561" }).then((c) => {
    console.log(c.mobile)
}).catch(_.noop);
```
# Customer
| Field Name   | Field Type | Group   | Description                                   | Comments  |
| ------------ | ---------- | ------- | --------------------------------------------- | --------- |
| mobile       |            | default | Customer's mobile phone                       | Validated |
| autocomplete |            | address | Full address as captured by Google Places API |           |
| street_num   |            | address | Street number                                 |           |
| street_route |            | address | Street name                                   |           |
| apartment    |            | address | Apartment                                     |           |
| city         |            | address | City                                          |           |
| state        |            | address | State                                         |           |
| zip          |            | address | Zip code                                      |           |
| lat          |            | address | Latitude                                      |           |
| lng          |            | address | Longtitude                                    |           |

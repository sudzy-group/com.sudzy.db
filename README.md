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
| id           | `string`   | default | Entity id                                     |           |
| created_at   | `number`   | default | Creation time                                 |           |
| mobile       | `string`   | default | Customer's mobile phone                       | Validated |
| autocomplete | `string`   | address | Full address as captured by Google Places API |           |
| street_num   | `string`   | address | Street number                                 |           |
| street_route | `string`   | address | Street name                                   |           |
| apartment    | `string`   | address | Apartment                                     |           |
| city         | `string`   | address | City                                          |           |
| state        | `string`   | address | State                                         |           |
| zip          | `string`   | address | Zip code                                      |           |
| lat          | `string`   | address | Latitude                                      |           |
| lng          | `string`   | address | Longtitude                                    |           |

# Customer
| Field Name             | Field Type | Group   | Description                                   | Comments              |
| ---------------------- | ---------- | ------- | --------------------------------------------- | --------------------- |
| id                     | `string`   | default | Entity id                                     | Auto-generated        |
| created_at             | `number`   | default | Creation datetime (unix)                      | Auto-generated        |
| mobile                 | `string`   | default | Customer's mobile phone                       | Validated, Searchable |
| name                   | `string`   | name    | Customer's name                               | Searchable            |
| email                  | `string`   | email   | Customer's email                              | Validated             |
| autocomplete           | `string`   | address | Full address as captured by Google Places API |                       |
| street_num             | `string`   | address | Street number                                 |                       |
| street_route           | `string`   | address | Street name                                   |                       |
| apartment              | `string`   | address | Apartment                                     |                       |
| city                   | `string`   | address | City                                          |                       |
| state                  | `string`   | address | State                                         |                       |
| zip                    | `string`   | address | Zip code                                      |                       |
| lat                    | `string`   | address | Latitude                                      |                       |
| lng                    | `string`   | address | Longtitude                                    |                       |
| is_doorman             | `boolean`  | address | Whether building has doorman                  |                       |
| delivery_notes         | `string`   | address | Delivery Notes                                |                       |
| cleaning_notes         | `string`   | notes   | Cleaning Notes                                |                       |
| payment_customer_token | `string`   | payment | Payment customer token                        |                       |
| payment_customer_id    | `string`   | payment | Payment customer id                           |                       |
# CustomerCard
| Field Name  | Field Type | Group    | Description              | Comments       |
| ----------- | ---------- | -------- | ------------------------ | -------------- |
| id          | `string`   | default  | Entity id                | Auto-generated |
| created_at  | `number`   | default  | Creation datetime (unix) | Auto-generated |
| customer_id | `string`   | default  | Customer id              | Searchable     |
| card_id     | `string`   | default  | Card id                  |                |
| brand       | `string`   | default  | Card brand               |                |
| last4       | `string`   | default  | Last 4 digits of card    | Validated      |
| is_default  | `boolean`  | settings | Whether card is default  |                |
# Order
| Field Name          | Field Type | Group    | Description                         | Comments       |
| ------------------- | ---------- | -------- | ----------------------------------- | -------------- |
| id                  | `string`   | default  | Entity id                           | Auto-generated |
| created_at          | `number`   | default  | Creation datetime (unix)            | Auto-generated |
| customer_id         | `string`   | default  | Customer id                         | Searchable     |
| order_id            | `string`   | default  | Order id                            | Searchable     |
| due_datetime        | `string`   | due      | Date order due                      |                |
| rack                | `string`   | rack     | Rack number                         |                |
| notes               | `string`   | notes    | Order notes                         |                |
| tax                 | `number`   | payment  | Tax                                 |                |
| tip                 | `number`   | payment  | Tip                                 |                |
| discount_percent    | `number`   | payment  | Discount percent                    |                |
| discount_fixed      | `number`   | payment  | Discount in dollar amount           |                |
| balance             | `number`   | balance  | Balance remaining                   | Searchable     |
| all_ready           | `boolean`  | status   | Whether order is ready              |                |
| all_pickedup        | `boolean`  | status   | Whether order is back with customer |                |
| delivery_pickup_id  | `string`   | delivery | Delivery pickup id                  |                |
| delivery_dropoff_id | `string`   | delivery | Delivery dropoff id                 |                |
# OrderItem
| Field Name      | Field Type | Group       | Description                 | Comments       |
| --------------- | ---------- | ----------- | --------------------------- | -------------- |
| id              | `string`   | default     | Entity id                   | Auto-generated |
| created_at      | `number`   | default     | Creation datetime (unix)    | Auto-generated |
| order_id        | `string`   | default     | Order id                    | Searchable     |
| item_id         | `string`   | default     | Item id                     |                |
| name            | `string`   | default     | Item name                   |                |
| total_price     | `number`   | pricing     | Total price                 |                |
| quantity        | `number`   | pricing     | Quantity of item            |                |
| notes           | `string`   | notes       | Order notes                 |                |
| separate        | `boolean`  | description | Separate whites from colors |                |
| wash            | `boolean`  | description | Whether washfold            |                |
| dry             | `boolean`  | description | Whether drycleaning         |                |
| detergent       | `string`   | description | Detergent                   |                |
| color           | `string`   | description | Color                       |                |
| pattern         | `string`   | description | Pattern                     |                |
| brand           | `string`   | description | Brand                       |                |
| fabric          | `string`   | description | Fabric                      |                |
| alteration_type | `string`   | description | Alteration type             |                |
# OrderTag
| Field Name | Field Type | Group   | Description              | Comments       |
| ---------- | ---------- | ------- | ------------------------ | -------------- |
| id         | `string`   | default | Entity id                | Auto-generated |
| created_at | `number`   | default | Creation datetime (unix) | Auto-generated |
| order_id   | `string`   | default | Order id                 | Searchable     |
| tag_number | `number`   | default | Tag number               |                |
# OrderCharge
| Field Name      | Field Type | Group   | Description                                    | Comments       |
| --------------- | ---------- | ------- | ---------------------------------------------- | -------------- |
| id              | `string`   | default | Entity id                                      | Auto-generated |
| created_at      | `number`   | default | Creation datetime (unix)                       | Auto-generated |
| order_id        | `string`   | default | Order id                                       | Searchable     |
| card_id         | `string`   | default | Card id                                        |                |
| amount          | `number`   | default | Amount charged                                 |                |
| charge_id       | `string`   | default | Charge id                                      |                |
| charge_type     | `string`   | default | Charge type of cash, credit, other             |                |
| date_cash       | `string`   | default | Get all cash deposited today in drawer if cash |                |
| refund_id       | `string`   | refund  | Refund id                                      |                |
| amount_refunded | `number`   | refund  | Amount refunded                                |                |
# Delivery
| Field Name      | Field Type | Group   | Description                      | Comments       |
| --------------- | ---------- | ------- | -------------------------------- | -------------- |
| id              | `string`   | default | Entity id                        | Auto-generated |
| created_at      | `number`   | default | Creation datetime (unix)         | Auto-generated |
| customer_id     | `string`   | default | Customer id                      |                |
| is_pickup       | `boolean`  | default | Whether delivery is pickup       |                |
| delivery_time   | `string`   | default | Delivery time                    | Searchable     |
| delivery_person | `string`   | person  | Delivery person                  |                |
| is_confirmed    | `boolean`  | status  | Whether store confirmed delivery |                |
| express_id      | `string`   | express | Express id                       |                |

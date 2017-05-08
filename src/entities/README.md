# Customer
| Field Name          | Field Type | Group     | Description                                          | Comments              |
| ------------------- | ---------- | --------- | ---------------------------------------------------- | --------------------- |
| id                  | `string`   | default   | Entity id                                            | Auto-generated        |
| created_at          | `number`   | default   | Creation datetime (unix)                             | Auto-generated        |
| mobile              | `string`   | default   | Customer's mobile phone                              | Validated, Searchable |
| allow_notifications | `string`   | default   | Customer's consent to get email / sms  notifications |                       |
| formatted_mobile    | `string`   | formatted | Customer's mobile phone (formatted)                  |                       |
| name                | `string`   | name      | Customer's name                                      | Validated, Searchable |
| email               | `string`   | email     | Customer's email                                     | Validated             |
| autocomplete        | `string`   | address   | Full address as captured by Google Places API        | Validated             |
| street_num          | `string`   | address   | Street number                                        |                       |
| street_route        | `string`   | address   | Street name                                          | Validated             |
| apartment           | `string`   | address   | Apartment                                            |                       |
| city                | `string`   | address   | City                                                 | Validated             |
| state               | `string`   | address   | State                                                | Validated             |
| zip                 | `string`   | address   | Zip code                                             | Validated             |
| lat                 | `string`   | address   | Latitude                                             | Validated             |
| lng                 | `string`   | address   | Longtitude                                           | Validated             |
| is_doorman          | `boolean`  | address   | Whether building has doorman                         |                       |
| delivery_notes      | `string`   | address   | Delivery Notes                                       |                       |
| cleaning_notes      | `string`   | notes     | Cleaning Notes                                       |                       |
| payment_customer_id | `string`   | payment   | Payment customer id                                  | Validated             |
# CustomerCard
| Field Name   | Field Type | Group    | Description              | Comments       |
| ------------ | ---------- | -------- | ------------------------ | -------------- |
| id           | `string`   | default  | Entity id                | Auto-generated |
| created_at   | `number`   | default  | Creation datetime (unix) | Auto-generated |
| customer_id  | `string`   | default  | Customer id              | Searchable     |
| card_id      | `string`   | default  | Card id                  | Validated      |
| brand        | `string`   | default  | Card brand               | Validated      |
| last4        | `string`   | default  | Last 4 digits of card    | Validated      |
| exp_month    | `string`   | default  | Expiration month         | Validated      |
| exp_year     | `string`   | default  | Expiration year          | Validated      |
| is_default   | `boolean`  | settings | Whether card is default  |                |
| is_forgotten | `boolean`  | settings | Whether card is hidden   |                |
# Order
| Field Name          | Field Type | Group    | Description                         | Comments              |
| ------------------- | ---------- | -------- | ----------------------------------- | --------------------- |
| id                  | `string`   | default  | Entity id                           | Auto-generated        |
| created_at          | `number`   | default  | Creation datetime (unix)            | Auto-generated        |
| customer_id         | `string`   | default  | Customer id                         | Searchable            |
| readable_id         | `string`   | default  | Human readable id                   | Validated, Searchable |
| due_datetime        | `string`   | due      | Date order due                      |                       |
| rack                | `string`   | rack     | Rack number                         |                       |
| notes               | `string`   | notes    | Order notes                         |                       |
| tax                 | `number`   | payment  | Tax                                 |                       |
| tip                 | `number`   | payment  | Tip                                 |                       |
| discount_percent    | `number`   | payment  | Discount percent                    |                       |
| discount_fixed      | `number`   | payment  | Discount in dollar amount           |                       |
| balance             | `number`   | balance  | Balance remaining                   | Validated, Searchable |
| all_ready           | `boolean`  | status   | Whether order is ready              |                       |
| all_pickedup        | `boolean`  | status   | Whether order is back with customer |                       |
| delivery_pickup_id  | `string`   | delivery | Delivery pickup id                  | Validated             |
| delivery_dropoff_id | `string`   | delivery | Delivery dropoff id                 | Validated             |
# OrderItem
| Field Name     | Field Type | Group       | Description                 | Comments       |
| -------------- | ---------- | ----------- | --------------------------- | -------------- |
| id             | `string`   | default     | Entity id                   | Auto-generated |
| created_at     | `number`   | default     | Creation datetime (unix)    | Auto-generated |
| order_id       | `string`   | default     | Order id                    | Searchable     |
| isbn           | `string`   | default     | isbn                        | Validated      |
| type           | `string`   | default     | type                        |                |
| name           | `string`   | default     | Item name                   |                |
| quantity       | `number`   | pricing     | Quantity of item            | Validated      |
| price          | `number`   | pricing     | Total price                 |                |
| separate       | `boolean`  | description | Separate whites from colors |                |
| detergent      | `string`   | description | Detergent                   |                |
| preferred_wash | `string`   | description | Preferred wash method       |                |
| preferred_dry  | `string`   | description | Preferred dry method        |                |
| color          | `string`   | description | Color                       |                |
| pattern        | `string`   | description | Pattern                     |                |
| brand          | `string`   | description | Brand                       |                |
| fabric         | `string`   | description | Fabric                      |                |
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
| amount          | `number`   | default | Amount charged                                 |                |
| charge_type     | `string`   | default | Charge type of cash, credit, other             |                |
| charge_id       | `string`   | card    | Charge id                                      | Validated      |
| card_id         | `string`   | card    | Card id                                        | Validated      |
| date_cash       | `string`   | cash    | Get all cash deposited today in drawer if cash |                |
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
| delivery_person | `string`   | person  | Delivery person                  | Validated      |
| delivery_notes  | `string`   | notes   | Delivery notes                   |                |
| is_confirmed    | `boolean`  | status  | Whether store confirmed delivery | Searchable     |
| is_canceled     | `boolean`  | status  | Whether delivery is canceled     |                |
| express_id      | `string`   | express | Express id                       | Validated      |

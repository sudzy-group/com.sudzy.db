
USE `pouch`;

CREATE TABLE `customers` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `mobile` varchar(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL, 
  `email` varchar(254) DEFAULT NULL,
  `autocomplete` varchar(100) DEFAULT NULL,
  `street_num` varchar(12) DEFAULT NULL,
  `street_route` varchar(50) DEFAULT NULL,
  `apartment` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(3) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `lat` varchar(100) DEFAULT NULL,
  `lng` varchar(100) DEFAULT NULL,
  `doorman` tinyint(1) DEFAULT NULL,
  `delivery_notes` varchar(254) DEFAULT NULL,
  `cleaning_notes` varchar(254) DEFAULT NULL,
  `payment_customer_token` varchar(28) DEFAULT NULL,
  `payment_customer_id` varchar(28) DEFAULT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`),
   UNIQUE KEY `mobile_UNIQUE` (`mobile`)
)





-- # Customer
-- | Field Name             | Field Type | Group   | Description                                   | Comments              |
-- | ---------------------- | ---------- | ------- | --------------------------------------------- | --------------------- |
-- | id                     | `string`   | default | Entity id                                     | Auto-generated        |
-- | created_at             | `number`   | default | Creation datetime (unix)                      | Auto-generated        |
-- | mobile                 | `string`   | default | Customer's mobile phone                       | Validated, Searchable |
-- | name                   | `string`   | name    | Customer's name                               | Validated, Searchable |
-- | email                  | `string`   | email   | Customer's email                              | Validated             |
-- | autocomplete           | `string`   | address | Full address as captured by Google Places API | Validated             |
-- | street_num             | `string`   | address | Street number                                 |                       |
-- | street_route           | `string`   | address | Street name                                   | Validated             |
-- | apartment              | `string`   | address | Apartment                                     |                       |
-- | city                   | `string`   | address | City                                          | Validated             |
-- | state                  | `string`   | address | State                                         | Validated             |
-- | zip                    | `string`   | address | Zip code                                      | Validated             |
-- | lat                    | `string`   | address | Latitude                                      | Validated             |
-- | lng                    | `string`   | address | Longtitude                                    | Validated             |
-- | is_doorman             | `boolean`  | address | Whether building has doorman                  |                       |
-- | delivery_notes         | `string`   | address | Delivery Notes                                |                       |
-- | cleaning_notes         | `string`   | notes   | Cleaning Notes                                |                       |
-- | payment_customer_token | `string`   | payment | Payment customer token                        | Validated             |
-- | payment_customer_id    | `string`   | payment | Payment customer id                           | Validated             |


-- # CustomerCard
-- | Field Name  | Field Type | Group    | Description              | Comments       |
-- | ----------- | ---------- | -------- | ------------------------ | -------------- |
-- | id          | `string`   | default  | Entity id                | Auto-generated |
-- | created_at  | `number`   | default  | Creation datetime (unix) | Auto-generated |
-- | customer_id | `string`   | default  | Customer id              | Searchable     |
-- | card_id     | `string`   | default  | Card id                  | Validated      |
-- | brand       | `string`   | default  | Card brand               | Validated      |
-- | last4       | `string`   | default  | Last 4 digits of card    | Validated      |
-- | is_default  | `boolean`  | settings | Whether card is default  |                |
-- # Order
-- | Field Name          | Field Type | Group    | Description                         | Comments              |
-- | ------------------- | ---------- | -------- | ----------------------------------- | --------------------- |
-- | id                  | `string`   | default  | Entity id                           | Auto-generated        |
-- | created_at          | `number`   | default  | Creation datetime (unix)            | Auto-generated        |
-- | customer_id         | `string`   | default  | Customer id                         | Searchable            |
-- | readable_id         | `string`   | default  | Human readable id                   | Validated, Searchable |
-- | due_datetime        | `string`   | due      | Date order due                      |                       |
-- | rack                | `string`   | rack     | Rack number                         |                       |
-- | notes               | `string`   | notes    | Order notes                         |                       |
-- | tax                 | `number`   | payment  | Tax                                 |                       |
-- | tip                 | `number`   | payment  | Tip                                 |                       |
-- | discount_percent    | `number`   | payment  | Discount percent                    |                       |
-- | discount_fixed      | `number`   | payment  | Discount in dollar amount           |                       |
-- | balance             | `number`   | balance  | Balance remaining                   | Validated, Searchable |
-- | all_ready           | `boolean`  | status   | Whether order is ready              |                       |
-- | all_pickedup        | `boolean`  | status   | Whether order is back with customer |                       |
-- | delivery_pickup_id  | `string`   | delivery | Delivery pickup id                  | Validated             |
-- | delivery_dropoff_id | `string`   | delivery | Delivery dropoff id                 | Validated             |
-- # OrderItem
-- | Field Name      | Field Type | Group       | Description                 | Comments       |
-- | --------------- | ---------- | ----------- | --------------------------- | -------------- |
-- | id              | `string`   | default     | Entity id                   | Auto-generated |
-- | created_at      | `number`   | default     | Creation datetime (unix)    | Auto-generated |
-- | order_id        | `string`   | default     | Order id                    | Searchable     |
-- | item_id         | `string`   | default     | Item id                     | Validated      |
-- | name            | `string`   | default     | Item name                   |                |
-- | total_price     | `number`   | pricing     | Total price                 |                |
-- | quantity        | `number`   | pricing     | Quantity of item            | Validated      |
-- | notes           | `string`   | notes       | Order notes                 |                |
-- | separate        | `boolean`  | description | Separate whites from colors |                |
-- | wash            | `boolean`  | description | Whether washfold            |                |
-- | dry             | `boolean`  | description | Whether drycleaning         |                |
-- | detergent       | `string`   | description | Detergent                   |                |
-- | color           | `string`   | description | Color                       |                |
-- | pattern         | `string`   | description | Pattern                     |                |
-- | brand           | `string`   | description | Brand                       |                |
-- | fabric          | `string`   | description | Fabric                      |                |
-- | alteration_type | `string`   | description | Alteration type             |                |
-- # OrderTag
-- | Field Name | Field Type | Group   | Description              | Comments       |
-- | ---------- | ---------- | ------- | ------------------------ | -------------- |
-- | id         | `string`   | default | Entity id                | Auto-generated |
-- | created_at | `number`   | default | Creation datetime (unix) | Auto-generated |
-- | order_id   | `string`   | default | Order id                 | Searchable     |
-- | tag_number | `number`   | default | Tag number               |                |
-- # OrderCharge
-- | Field Name      | Field Type | Group   | Description                                    | Comments       |
-- | --------------- | ---------- | ------- | ---------------------------------------------- | -------------- |
-- | id              | `string`   | default | Entity id                                      | Auto-generated |
-- | created_at      | `number`   | default | Creation datetime (unix)                       | Auto-generated |
-- | order_id        | `string`   | default | Order id                                       | Searchable     |
-- | amount          | `number`   | default | Amount charged                                 |                |
-- | charge_type     | `string`   | default | Charge type of cash, credit, other             |                |
-- | charge_id       | `string`   | card    | Charge id                                      | Validated      |
-- | card_id         | `string`   | card    | Card id                                        | Validated      |
-- | date_cash       | `string`   | cash    | Get all cash deposited today in drawer if cash |                |
-- | refund_id       | `string`   | refund  | Refund id                                      |                |
-- | amount_refunded | `number`   | refund  | Amount refunded                                |                |
-- # Delivery
-- | Field Name      | Field Type | Group   | Description                      | Comments       |
-- | --------------- | ---------- | ------- | -------------------------------- | -------------- |
-- | id              | `string`   | default | Entity id                        | Auto-generated |
-- | created_at      | `number`   | default | Creation datetime (unix)         | Auto-generated |
-- | customer_id     | `string`   | default | Customer id                      |                |
-- | is_pickup       | `boolean`  | default | Whether delivery is pickup       |                |
-- | delivery_time   | `string`   | default | Delivery time                    | Searchable     |
-- | delivery_person | `string`   | person  | Delivery person                  | Validated      |
-- | is_confirmed    | `boolean`  | status  | Whether store confirmed delivery |                |
-- | is_canceled     | `boolean`  | status  | Whether delivery is canceled     |                |
| express_id      | `string`   | express | Express id
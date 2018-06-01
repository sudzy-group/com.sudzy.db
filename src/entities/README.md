# Customer
| Field Name          | Field Type | Group         | Description                                          | Comments              |
| ------------------- | ---------- | ------------- | ---------------------------------------------------- | --------------------- |
| id                  | `string`   | default       | Entity id                                            | Auto-generated        |
| created_at          | `number`   | default       | Creation datetime (unix)                             | Auto-generated        |
| mobile              | `string`   | default       | Customer's mobile phone                              | Validated, Searchable |
| allow_notifications | `string`   | default       | Customer's consent to get email / sms  notifications |                       |
| formatted_mobile    | `string`   | formatted     | Customer's mobile phone (formatted)                  |                       |
| extra_mobile        | `string`   | extra         | Customer's extra mobile phone                        | Searchable            |
| is_extra_default    | `boolean`  | extra         | Customer's extra mobile is default                   |                       |
| name                | `string`   | name          | Customer's name                                      | Validated, Searchable |
| email               | `string`   | email         | Customer's email                                     | Validated, Searchable |
| pricing_group       | `string`   | pricing_group | Customer's pricing_group                             |                       |
| autocomplete        | `string`   | address       | Full address as captured by Google Places API        |                       |
| street_num          | `string`   | address       | Street number                                        |                       |
| street_route        | `string`   | address       | Street name                                          | Validated             |
| apartment           | `string`   | address       | Apartment                                            |                       |
| city                | `string`   | address       | City                                                 |                       |
| state               | `string`   | address       | State                                                |                       |
| zip                 | `string`   | address       | Zip code                                             | Validated             |
| lat                 | `string`   | address       | Latitude                                             | Validated             |
| lng                 | `string`   | address       | Longtitude                                           | Validated             |
| is_doorman          | `boolean`  | address       | Whether building has doorman                         |                       |
| delivery_notes      | `string`   | address       | Delivery Notes                                       |                       |
| cleaning_notes      | `string`   | notes         | Cleaning Notes                                       |                       |
| payment_customer_id | `string`   | payment       | Payment customer id                                  | Validated             |
| route_id            | `string`   | route         | Route id of the customer                             | Searchable            |
# CustomerCard
| Field Name   | Field Type | Group    | Description                                  | Comments       |
| ------------ | ---------- | -------- | -------------------------------------------- | -------------- |
| id           | `string`   | default  | Entity id                                    | Auto-generated |
| created_at   | `number`   | default  | Creation datetime (unix)                     | Auto-generated |
| customer_id  | `string`   | default  | Customer id                                  | Searchable     |
| card_id      | `string`   | default  | Card id                                      | Validated      |
| brand        | `string`   | default  | Card brand                                   | Validated      |
| last4        | `string`   | default  | Last 4 digits of card                        | Validated      |
| exp_month    | `string`   | default  | Expiration month                             |                |
| exp_year     | `string`   | default  | Expiration year                              | Validated      |
| is_default   | `boolean`  | settings | Whether card is default                      |                |
| is_forgotten | `boolean`  | settings | Whether card is hidden                       |                |
| in_stripe    | `boolean`  | settings | Whether card is stored in stripe             |                |
| stripe_token | `string`   | settings | Stripe token before it is turned into a card |                |
# CustomerCredit
| Field Name     | Field Type | Group   | Description                                                              | Comments       |
| -------------- | ---------- | ------- | ------------------------------------------------------------------------ | -------------- |
| id             | `string`   | default | Entity id                                                                | Auto-generated |
| created_at     | `number`   | default | Creation datetime (unix)                                                 | Auto-generated |
| customer_id    | `string`   | default | Customer id                                                              | Searchable     |
| original       | `number`   | default | Original credit                                                          |                |
| reason         | `number`   | default | Reason: 1-Missing item 2-Damaged 3-Gift card 4-Promotion 5-Billing error |                |
| description    | `string`   | default | Description of this credit                                               |                |
| employee_id    | `string`   | default | Employee id that created this credit                                     |                |
| payment_method | `string`   | default | Payment description of this credit                                       |                |
| payment_id     | `string`   | default | Payment id of this credit (usually the transaction id)                   |                |
| balance        | `number`   | balance | Balance of the credit                                                    |                |
# CustomerCoupon
| Field Name  | Field Type | Group   | Description                  | Comments       |
| ----------- | ---------- | ------- | ---------------------------- | -------------- |
| id          | `string`   | default | Entity id                    | Auto-generated |
| created_at  | `number`   | default | Creation datetime (unix)     | Auto-generated |
| customer_id | `string`   | default | Customer id                  | Searchable     |
| coupon_id   | `number`   | default | Coupon id used in this order |                |
| order_id    | `string`   | default | Order id using the coupon    |                |
# Order
| Field Name          | Field Type | Group     | Description                              | Comments              |
| ------------------- | ---------- | --------- | ---------------------------------------- | --------------------- |
| id                  | `string`   | default   | Entity id                                | Auto-generated        |
| created_at          | `number`   | default   | Creation datetime (unix)                 | Auto-generated        |
| customer_id         | `string`   | default   | Customer id                              | Searchable            |
| readable_id         | `string`   | default   | Human readable id                        | Validated, Searchable |
| due_datetime        | `string`   | due       | Date order due                           | Searchable            |
| rack                | `string`   | rack      | Rack number                              |                       |
| notes               | `string`   | notes     | Order notes                              |                       |
| tax                 | `number`   | payment   | Tax                                      |                       |
| tip                 | `number`   | payment   | Tip                                      |                       |
| discount_fixed      | `number`   | payment   | Discount in dollar amount                |                       |
| discount_id         | `number`   | payment   | Discount id applied                      |                       |
| paid_in             | `string`   | paid_in   | Indicates the order id of the paid order |                       |
| balance             | `number`   | balance   | Balance remaining                        | Validated, Searchable |
| all_ready           | `boolean`  | status    | Whether order is ready                   |                       |
| all_pickedup        | `boolean`  | status    | Whether order is back with customer      |                       |
| checkpoint          | `string`   | cp        | Free text checkpoint                     | Searchable            |
| delivery_pickup_id  | `string`   | delivery  | Delivery pickup id                       | Validated             |
| delivery_dropoff_id | `string`   | delivery  | Delivery dropoff id                      | Validated             |
| original_id         | `string`   | wholesale | Original ticket id for wholesale order   | Searchable            |
# OrderItem
| Field Name        | Field Type | Group       | Description                              | Comments       |
| ----------------- | ---------- | ----------- | ---------------------------------------- | -------------- |
| id                | `string`   | default     | Entity id                                | Auto-generated |
| created_at        | `number`   | default     | Creation datetime (unix)                 | Auto-generated |
| order_id          | `string`   | default     | Order id                                 | Searchable     |
| isbn              | `string`   | default     | isbn                                     | Validated      |
| type              | `string`   | default     | type                                     |                |
| name              | `string`   | default     | Item name                                |                |
| quantity          | `number`   | pricing     | Quantity of item                         | Validated      |
| price             | `number`   | pricing     | Total price                              |                |
| is_manual_pricing | `boolean`  | pricing     | User selected manual pricing             |                |
| notes             | `string[]` | notes       | Specific notes about this item           |                |
| ready             | `boolean`  | status      | Specific ready status about this item    |                |
| pickedup          | `boolean`  | status      | Specific pickedup status about this item |                |
| extra             | `any[]`    | extra       | extra description and upcharges for item |                |
| manual_name       | `string`   | manual_name | Item manual name                         |                |
# OrderTag
| Field Name | Field Type | Group   | Description                                  | Comments       |
| ---------- | ---------- | ------- | -------------------------------------------- | -------------- |
| id         | `string`   | default | Entity id                                    | Auto-generated |
| created_at | `number`   | default | Creation datetime (unix)                     | Auto-generated |
| order_id   | `string`   | default | Order id                                     | Searchable     |
| tag_number | `string`   | default | Tag number                                   | Searchable     |
| is_rack    | `string`   | rack    | True if this tag holds the rack of the items |                |
# OrderCharge
| Field Name      | Field Type | Group   | Description                        | Comments       |
| --------------- | ---------- | ------- | ---------------------------------- | -------------- |
| id              | `string`   | default | Entity id                          | Auto-generated |
| created_at      | `number`   | default | Creation datetime (unix)           | Auto-generated |
| order_id        | `string`   | default | Order id                           | Searchable     |
| amount          | `number`   | default | Amount charged                     |                |
| charge_type     | `string`   | default | Charge type of cash, credit, other |                |
| charge_id       | `string`   | card    | Charge id                          | Validated      |
| card_id         | `string`   | card    | Card id                            | Validated      |
| date_cash       | `string`   | cash    | date of cash receieved             | Searchable     |
| refund_id       | `string`   | refund  | Refund id                          |                |
| amount_refunded | `number`   | refund  | Amount refunded                    |                |
| parent_id       | `string`   | parent  | The parent payment of this payment | Searchable     |
# Delivery
| Field Name      | Field Type | Group    | Description                      | Comments       |
| --------------- | ---------- | -------- | -------------------------------- | -------------- |
| id              | `string`   | default  | Entity id                        | Auto-generated |
| created_at      | `number`   | default  | Creation datetime (unix)         | Auto-generated |
| customer_id     | `string`   | default  | Customer id                      |                |
| is_pickup       | `boolean`  | default  | Whether delivery is pickup       |                |
| delivery_time   | `string`   | default  | Delivery time                    | Searchable     |
| delivery_person | `string`   | person   | Delivery person                  | Validated      |
| delivery_notes  | `string`   | notes    | Delivery notes                   |                |
| is_confirmed    | `boolean`  | status   | Whether store confirmed delivery | Searchable     |
| is_canceled     | `boolean`  | status   | Whether delivery is canceled     |                |
| express_id      | `string`   | express  | Express id                       | Validated      |
| external_id     | `string`   | external | Order id (eg. dcom or sudzy)     | Searchable     |
# Timesheet
| Field Name  | Field Type | Group   | Description              | Comments       |
| ----------- | ---------- | ------- | ------------------------ | -------------- |
| id          | `string`   | default | Entity id                | Auto-generated |
| created_at  | `number`   | default | Creation datetime (unix) | Auto-generated |
| employee_id | `string`   | default | Employee ID              | Searchable     |
| is_clockin  | `boolean`  | default | Is clock in              |                |
| event_time  | `string`   | default | Time of the event        | Searchable     |
| comment     | `string`   | comment | Optional comment         |                |
# Timeline
| Field Name  | Field Type | Group   | Description                       | Comments       |
| ----------- | ---------- | ------- | --------------------------------- | -------------- |
| id          | `string`   | default | Entity id                         | Auto-generated |
| created_at  | `number`   | default | Creation datetime (unix)          | Auto-generated |
| employee_id | `string`   | default | Employee ID                       |                |
| operation   | `number`   | default | Operation code                    |                |
| order_id    | `string`   | default | Order id related to the operation | Searchable     |
| text        | `string`   | default | Text of the event                 |                |
# Product
| Field Name     | Field Type | Group          | Description              | Comments       |
| -------------- | ---------- | -------------- | ------------------------ | -------------- |
| id             | `string`   | default        | Entity id                | Auto-generated |
| created_at     | `number`   | default        | Creation datetime (unix) | Auto-generated |
| name           | `string`   | default        | Product's name           | Validated      |
| sku            | `string`   | default        | Product's SKU            | Searchable     |
| image          | `string`   | default        | Product's image          |                |
| price          | `number`   | price          | Product's price          |                |
| goods_in_stock | `number`   | goods_in_stock | Goods in stock           |                |
# Purchase
| Field Name   | Field Type | Group   | Description                   | Comments       |
| ------------ | ---------- | ------- | ----------------------------- | -------------- |
| id           | `string`   | default | Entity id                     | Auto-generated |
| created_at   | `number`   | default | Creation datetime (unix)      | Auto-generated |
| readable_id  | `string`   | default | Payment's readable id         |                |
| product_ids  | `string[]` | default | List of products purchased    |                |
| total_price  | `number`   | default | Purchase total price          |                |
| tax          | `number`   | default | Purchase tax                  |                |
| payment_type | `string`   | default | Payment's type (cash or card) |                |
| payment_id   | `string`   | default | Payment's id                  | Searchable     |
| refund_id    | `string`   | refund  | Refund's id                   |                |
# Task
| Field Name    | Field Type | Group   | Description                                           | Comments       |
| ------------- | ---------- | ------- | ----------------------------------------------------- | -------------- |
| id            | `string`   | default | Entity id                                             | Auto-generated |
| created_at    | `number`   | default | Creation datetime (unix)                              | Auto-generated |
| shift_id      | `string`   | default | This task's shift id                                  | Searchable     |
| employee_id   | `number`   | default | Employee id                                           |                |
| readable_id   | `string`   | base    | Task readable id                                      |                |
| customer_name | `string`   | base    | Customer name                                         |                |
| group         | `string`   | base    | Group name                                            |                |
| completed_at  | `number`   | time    | The time this task has been marked as done            |                |
| duration      | `number`   | time    | The time duration this task has been taken to process |                |
# TaskData
| Field Name | Field Type | Group   | Description              | Comments       |
| ---------- | ---------- | ------- | ------------------------ | -------------- |
| id         | `string`   | default | Entity id                | Auto-generated |
| created_at | `number`   | default | Creation datetime (unix) | Auto-generated |
| task_id    | `string`   | default | Task id                  | Searchable     |
| field_id   | `string`   | default | Task Field id            |                |
| value      | `any`      | value   | The data value           |                |
# Message
| Field Name | Field Type | Group   | Description                       | Comments       |
| ---------- | ---------- | ------- | --------------------------------- | -------------- |
| id         | `string`   | default | Entity id                         | Auto-generated |
| created_at | `number`   | default | Creation datetime (unix)          | Auto-generated |
| group_id   | `string`   | default | Group ID, customer's phone number | Searchable     |
| group_name | `string`   | default | Group name, customer's name       |                |
| sender     | `string`   | default | Sender's mobile number            |                |
| body       | `string`   | default | Message body                      |                |
| is_me      | `boolean`  | default | Is me (business)                  |                |
| is_unread  | `boolean`  | unread  | Is message unread                 | Searchable     |

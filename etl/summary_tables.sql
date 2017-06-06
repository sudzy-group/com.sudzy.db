########################
# New customers count
########################
DROP TABLE IF EXISTS `{{store_id}}_customers_count`;

CREATE TABLE `{{store_id}}_customers_count` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` date NOT NULL,
  `customers_count` INT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_customers_count` (day, customers_count)
SELECT date(created_at) as day, count(date(created_at)) as customers_count FROM `{{store_id}}_customers` group by date(created_at);

########################
# Orders count
########################
DROP TABLE IF EXISTS `{{store_id}}_orders_count`;

CREATE TABLE `{{store_id}}_orders_count` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` date NOT NULL,
  `orders_count` INT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_orders_count` (day, orders_count)
SELECT date(created_at) as day, count(date(created_at)) as orders_count FROM `{{store_id}}_orders` group by date(created_at);

########################
# Orders pricing
########################
DROP TABLE IF EXISTS `{{store_id}}_orders_pricing`;

CREATE TABLE `{{store_id}}_orders_pricing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` VARCHAR(20) NULL,
  `day` date NOT NULL,
  `items_count` INT NULL,
  `total_order_price` DOUBLE NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_orders_pricing` (order_id, day, items_count, total_order_price)
SELECT order_id, date(MIN(created_at)) as day, count(id) as items_count, sum(price) as total_order_price FROM `{{store_id}}_order_items` group by order_id;


########################
# Orders summary
########################
DROP TABLE IF EXISTS `{{store_id}}_orders_summary`;

CREATE TABLE `{{store_id}}_orders_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` VARCHAR(20) NULL,
  `created_at` datetime NOT NULL,
  `all_ready` int(1) NULL,
  `all_pickedup` int(1) NULL,
  `total_order_price` DOUBLE NULL,
  `readable_id` VARCHAR(20) NULL,
  `formatted_mobile` VARCHAR(20) NULL,
  `name` VARCHAR(100) NULL,
  `balance` VARCHAR(255) NULL,
  `autocomplete` VARCHAR(255) NULL,
  `notes` VARCHAR(255) NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_orders_summary` (order_id, created_at, balance, all_ready, all_pickedup, total_order_price, readable_id, formatted_mobile, name, autocomplete, notes)
SELECT `{{store_id}}_orders`.`original_id`, `{{store_id}}_orders`.`created_at`, `balance`, `all_ready`, `all_pickedup`, `total_order_price`, `readable_id`, `formatted_mobile`, `name`, `autocomplete`, `notes` FROM `{{store_id}}_orders` LEFT JOIN `{{store_id}}_customers` ON {{store_id}}_orders.customer_id = {{store_id}}_customers.original_id LEFT JOIN {{store_id}}_orders_pricing ON {{store_id}}_orders_pricing.order_id = {{store_id}}_orders.original_id;

########################
# Payments summary
########################
DROP TABLE IF EXISTS `{{store_id}}_payments_summary`;

CREATE TABLE `{{store_id}}_payments_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` date NOT NULL,
  `counts` INT NULL,
  `sums` DOUBLE NULL,
  `avgs` DOUBLE NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_payments_summary` (day, counts, sums, avgs)
SELECT date(created_at) as day, count(date(created_at)) as counts, sum(amount) as sums, avg(amount) as avgs FROM `{{store_id}}_order_charges` group by date(created_at);

########################
# Payments
########################
DROP TABLE IF EXISTS `{{store_id}}_payments`;

CREATE TABLE `{{store_id}}_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NULL,
  `readable_id` varchar(10) NULL,
  `name` varchar(100) DEFAULT NULL,
  `method` varchar(30) NULL,
  `amount` DOUBLE NULL,
  `charge_id` varchar(250) NULL,
  `refund_id` varchar(250) NULL,
  `coupon_code` varchar(10) NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_payments` (created_at, readable_id, name, method, amount, charge_id, refund_id, coupon_code)
SELECT `{{store_id}}_order_charges`.`created_at`, `{{store_id}}_orders`.`readable_id`, `name`, `charge_type` as method, `amount`, `charge_id`, `refund_id`, `{{store_id}}_orders`.`coupon_code` FROM `{{store_id}}_order_charges` LEFT JOIN `{{store_id}}_orders` ON `{{store_id}}_orders`.`original_id` = `{{store_id}}_order_charges`.`order_id` LEFT JOIN `{{store_id}}_customers` ON `{{store_id}}_orders`.`customer_id` = `{{store_id}}_customers`.`original_id`;

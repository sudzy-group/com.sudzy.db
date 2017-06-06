########################
# New customers count
########################
DROP TABLE IF EXISTS `aa0c19ba_customers_count`;

CREATE TABLE `aa0c19ba_customers_count` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` date NOT NULL,
  `customers_count` INT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `aa0c19ba_customers_count` (day, customers_count)
SELECT date(created_at) as day, count(date(created_at)) as customers_count FROM `aa0c19ba_customers` group by date(created_at);

########################
# Orders count
########################
DROP TABLE IF EXISTS `aa0c19ba_orders_count`;

CREATE TABLE `aa0c19ba_orders_count` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` date NOT NULL,
  `orders_count` INT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `aa0c19ba_orders_count` (day, orders_count)
SELECT date(created_at) as day, count(date(created_at)) as orders_count FROM `aa0c19ba_orders` group by date(created_at);

########################
# Orders pricing
########################
DROP TABLE IF EXISTS `aa0c19ba_orders_pricing`;

CREATE TABLE `aa0c19ba_orders_pricing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` VARCHAR(20) NULL,
  `day` date NOT NULL,
  `items_count` INT NULL,
  `total_order_price` DOUBLE NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `aa0c19ba_orders_pricing` (order_id, day, items_count, total_order_price)
SELECT order_id, date(MIN(created_at)) as day, count(id) as items_count, sum(price) as total_order_price FROM `aa0c19ba_order_items` group by order_id;


########################
# Orders summary
########################
DROP TABLE IF EXISTS `aa0c19ba_orders_summary`;

CREATE TABLE `aa0c19ba_orders_summary` (
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

INSERT INTO `aa0c19ba_orders_summary` (order_id, created_at, balance, all_ready, all_pickedup, total_order_price, readable_id, formatted_mobile, name, autocomplete, notes)
SELECT `aa0c19ba_orders`.`original_id`, `aa0c19ba_orders`.`created_at`, `balance`, `all_ready`, `all_pickedup`, `total_order_price`, `readable_id`, `formatted_mobile`, `name`, `autocomplete`, `notes` FROM `aa0c19ba_orders` LEFT JOIN `aa0c19ba_customers` ON aa0c19ba_orders.customer_id = aa0c19ba_customers.original_id LEFT JOIN aa0c19ba_orders_pricing ON aa0c19ba_orders_pricing.order_id = aa0c19ba_orders.original_id;

########################
# Payments summary
########################
DROP TABLE IF EXISTS `aa0c19ba_payments_summary`;

CREATE TABLE `aa0c19ba_payments_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` date NOT NULL,
  `counts` INT NULL,
  `sums` DOUBLE NULL,
  `avgs` DOUBLE NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `aa0c19ba_payments_summary` (day, counts, sums, avgs)
SELECT date(created_at) as day, count(date(created_at)) as counts, sum(amount) as sums, avg(amount) as avgs FROM `aa0c19ba_order_charges` group by date(created_at);

########################
# Payments
########################
DROP TABLE IF EXISTS `aa0c19ba_payments`;

CREATE TABLE `aa0c19ba_payments` (
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

INSERT INTO `aa0c19ba_payments` (created_at, readable_id, name, method, amount, charge_id, refund_id, coupon_code)
SELECT `aa0c19ba_order_charges`.`created_at`, `aa0c19ba_orders`.`readable_id`, `name`, `charge_type` as method, `amount`, `charge_id`, `refund_id`, `aa0c19ba_orders`.`coupon_code` FROM `aa0c19ba_order_charges` LEFT JOIN `aa0c19ba_orders` ON `aa0c19ba_orders`.`original_id` = `aa0c19ba_order_charges`.`order_id` LEFT JOIN `aa0c19ba_customers` ON `aa0c19ba_orders`.`customer_id` = `aa0c19ba_customers`.`original_id`;

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
SELECT date(FROM_UNIXTIME(created_at/1000)) as day, count(date(FROM_UNIXTIME(created_at/1000))) as customers_count FROM `{{store_id}}_customers` GROUP BY DATE(CONVERT_TZ(FROM_UNIXTIME(created_at/1000),'+00:00','-04:00'));

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
SELECT DATE(CONVERT_TZ(FROM_UNIXTIME(MIN(created_at)/1000),'+00:00','-04:00')) as day, count(date(FROM_UNIXTIME(created_at/1000))) as orders_count FROM `{{store_id}}_orders` GROUP BY DATE(CONVERT_TZ(FROM_UNIXTIME(created_at/1000),'+00:00','-04:00'));

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

SELECT order_id, DATE(CONVERT_TZ(FROM_UNIXTIME(MIN(created_at)/1000),'+00:00','-04:00')) as day, count(id) as items_count, sum(price) as total_order_price FROM `{{store_id}}_order_items` group by order_id;


########################
# Orders summary
########################
DROP TABLE IF EXISTS `{{store_id}}_orders_summary`;

CREATE TABLE `{{store_id}}_orders_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` VARCHAR(20) NULL,
  `created_at` BIGINT NOT NULL,
  `all_ready` int(1) NULL,
  `all_pickedup` int(1) NULL,
  `total_order_price` DOUBLE NULL,
  `readable_id` VARCHAR(20) NULL,
  `customer_id` VARCHAR(100) NULL,
  `formatted_mobile` VARCHAR(20) NULL,
  `name` VARCHAR(100) NULL,
  `balance` VARCHAR(255) NULL,
  `autocomplete` VARCHAR(255) NULL,
  `notes` VARCHAR(255) NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_orders_summary` (order_id, created_at, balance, all_ready, all_pickedup, total_order_price, readable_id, customer_id, formatted_mobile, name, autocomplete, notes)
SELECT `{{store_id}}_orders`.`original_id`, `{{store_id}}_orders`.`created_at`, `balance`, `all_ready`, `all_pickedup`, `total_order_price`, `readable_id`, `customer_id`, `formatted_mobile`, `name`, `autocomplete`, `notes` FROM `{{store_id}}_orders` LEFT JOIN `{{store_id}}_customers` ON {{store_id}}_orders.customer_id = {{store_id}}_customers.original_id LEFT JOIN {{store_id}}_orders_pricing ON {{store_id}}_orders_pricing.order_id = {{store_id}}_orders.original_id;

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
SELECT DATE(CONVERT_TZ(FROM_UNIXTIME(MIN(created_at)/1000),'+00:00','-04:00')) as day, count(date(FROM_UNIXTIME(created_at/1000))) as counts, sum(amount) as sums, avg(amount) as avgs FROM `{{store_id}}_order_charges` WHERE refund_id is null GROUP BY DATE(CONVERT_TZ(FROM_UNIXTIME(created_at/1000),'+00:00','-04:00'));

########################
# Payments
########################
DROP TABLE IF EXISTS `{{store_id}}_payments`;

CREATE TABLE `{{store_id}}_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` BIGINT NULL,
  `readable_id` varchar(10) NULL,
  `name` varchar(100) DEFAULT NULL,
  `method` varchar(30) NULL,
  `amount` DOUBLE NULL,
  `charge_id` varchar(250) NULL,
  `refund_id` varchar(250) NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_payments` (created_at, readable_id, name, method, amount, charge_id, refund_id)
SELECT `{{store_id}}_order_charges`.`created_at`, `{{store_id}}_orders`.`readable_id`, `name`, `charge_type` as method, `amount`, `charge_id`, `refund_id` FROM `{{store_id}}_order_charges` LEFT JOIN `{{store_id}}_orders` ON `{{store_id}}_orders`.`original_id` = `{{store_id}}_order_charges`.`order_id` LEFT JOIN `{{store_id}}_customers` ON `{{store_id}}_orders`.`customer_id` = `{{store_id}}_customers`.`original_id`;

########################
# Timesheets
########################
DROP TABLE IF EXISTS `{{store_id}}_timesheets_summary`;

CREATE TABLE `{{store_id}}_timesheets_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(100) NOT NULL,
  `day` date NULL,
  `min` BIGINT NULL,
  `max` BIGINT NULL,
  `list` varchar(200) DEFAULT NULL,
  `count` DOUBLE NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_timesheets_summary` (employee_id, day, min, max, list, count)
SELECT MIN(employee_id) employee_id, DATE(CONVERT_TZ(FROM_UNIXTIME(MIN(event_time)/1000),'+00:00','-04:00')) as day, MIN(event_time) as min, MAX(event_time) as max, GROUP_CONCAT(event_time) as list, COUNT(event_time) as count from `{{store_id}}_timesheets` GROUP BY DATE(CONVERT_TZ(FROM_UNIXTIME(event_time/1000),'+00:00','-04:00')), employee_id;

########################
# Customers
########################
DROP TABLE IF EXISTS `{{store_id}}_customers_info`;

CREATE TABLE `{{store_id}}_customers_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile` varchar(15) NULL,
  `address` varchar(100) NULL,
  `min` BIGINT NULL,
  `max` BIGINT NULL,
  `orders` INT NULL,
  `days_since_last_order` INT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_customers_info` (customer_id, name, mobile, address, min, max, orders, days_since_last_order)
SELECT `{{store_id}}_customers`.original_id, name, formatted_mobile, autocomplete, min(`{{store_id}}_orders`.created_at) as min , max(`{{store_id}}_orders`.created_at) as max, count(`{{store_id}}_orders`.created_at) as orders, CEILING( (UNIX_TIMESTAMP() * 1000 - max(`{{store_id}}_orders`.created_at))/86400000) as days_since_last_order FROM `{{store_id}}_customers` left join `{{store_id}}_orders` on `{{store_id}}_customers`.original_id = `{{store_id}}_orders`.customer_id group by `{{store_id}}_customers`.original_id;

########################
# Coupons
########################
DROP TABLE IF EXISTS `{{store_id}}_coupons`;

CREATE TABLE `{{store_id}}_coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coupon_id` INT NOT NULL,
  `customers_count` INT NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_coupons` (coupon_id, customers_count)
SELECT min(`{{store_id}}_customer_coupons`.coupon_id), count(`{{store_id}}_customer_coupons`.created_at) as customers_count FROM `{{store_id}}_customer_coupons` group by `{{store_id}}_customer_coupons`.coupon_id;

########################
# Credits Summary
########################
DROP TABLE IF EXISTS `{{store_id}}_credits_summary`;

CREATE TABLE `{{store_id}}_credits_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` BIGINT NOT NULL,
  `name` VARCHAR(100) NULL,
  `original` INT NOT NULL,
  `balance` INT DEFAULT 0,
  `employee_id` varchar(10) NOT NULL,
  `reason` INT NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `payment_method` varchar(50) NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_credits_summary` (created_at, `name`, original, balance, employee_id, reason, `description`, payment_method)
SELECT `{{store_id}}_customer_credits`.`created_at`, `name`, `original`, `balance`, `employee_id`, `reason`, `description`, `payment_method` FROM `{{store_id}}_customer_credits` LEFT JOIN `{{store_id}}_customers` ON {{store_id}}_customer_credits.customer_id = {{store_id}}_customers.original_id;


########################
# Rack report
########################
DROP TABLE IF EXISTS `{{store_id}}_rack_report`;

CREATE TABLE `{{store_id}}_rack_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` BIGINT NOT NULL,
  `readable_id` VARCHAR(20) NULL,
  `tag_number` int(10) NULL,
  `formatted_mobile` VARCHAR(20) NULL,
  `name` VARCHAR(100) NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_rack_report` (`created_at`, `readable_id`, `tag_number`, `formatted_mobile`, `name`)
SELECT `{{store_id}}_orders`.created_at, `{{store_id}}_orders`.readable_id, `{{store_id}}_order_tags`.tag_number, `{{store_id}}_customers`.formatted_mobile, `{{store_id}}_customers`.name FROM `{{store_id}}_orders` left join `{{store_id}}_order_tags` ON (`{{store_id}}_orders`.original_id = `{{store_id}}_order_tags`.order_id AND `{{store_id}}_order_tags`.is_rack = 1) LEFT JOIN `{{store_id}}_customers` ON (`{{store_id}}_orders`.customer_id = `{{store_id}}_customers`.original_id) where `{{store_id}}_orders`.all_pickedup = 0 and `{{store_id}}_order_tags`.tag_number <> 0;

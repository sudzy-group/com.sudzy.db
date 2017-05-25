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
  `original_id` VARCHAR(20) NULL,
  `day` date NOT NULL,
  `items_count` INT NULL,
  `total_order_price` DOUBLE NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_orders_pricing` (original_id, day, items_count, total_order_price) 
SELECT original_id, date(created_at) as day, count(id) as items_count, sum(price) as total_order_price FROM `{{store_id}}_order_items` group by order_id;

########################
# Payments count
########################

DROP TABLE IF EXISTS `{{store_id}}_payments`;

CREATE TABLE `{{store_id}}_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` date NOT NULL,
  `counts` INT NULL,
  `sums` DOUBLE NULL,
  `avgs` DOUBLE NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_payments` (day, counts, sums, avgs) 
SELECT date(created_at) as day, count(date(created_at)) as counts, sum(amount) as sums, avg(amount) as avgs FROM `{{store_id}}_order_charges` group by date(created_at);

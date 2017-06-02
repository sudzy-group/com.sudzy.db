DROP TABLE IF EXISTS `{{store_id}}_customers`;
DROP TABLE IF EXISTS `{{store_id}}_customer_cards`;
DROP TABLE IF EXISTS `{{store_id}}_orders`;
DROP TABLE IF EXISTS `{{store_id}}_order_items`;
DROP TABLE IF EXISTS `{{store_id}}_order_tags`;
DROP TABLE IF EXISTS `{{store_id}}_order_charges`;
DROP TABLE IF EXISTS `{{store_id}}_deliveries`;

CREATE TABLE `{{store_id}}_customers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `mobile` varchar(15) NULL,
  `allow_notifications` tinyint(1) DEFAULT NULL,
  `formatted_mobile` varchar(20) NULL,
  `name` varchar(100) DEFAULT NULL,
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
  `is_doorman` tinyint(1) DEFAULT NULL,
  `delivery_notes` varchar(254) DEFAULT NULL,
  `cleaning_notes` varchar(254) DEFAULT NULL,
  `payment_customer_id` varchar(250) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `{{store_id}}_customer_cards` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `customer_id` varchar(250) NOT NULL,
  `card_id` varchar(250) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `last4` varchar(4) NOT NULL,
  `exp_month` varchar(2) NOT NULL,
  `exp_year` varchar(4) NOT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
  `is_forgotten` tinyint(1) DEFAULT NULL,
  `in_stripe` tinyint(1) DEFAULT NULL,
  `stripe_token` varchar(250) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `{{store_id}}_orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `customer_id` varchar(250) NOT NULL,
  `readable_id` varchar(12) NULL,
  `due_datetime` datetime DEFAULT NULL,
  `rack` varchar(20) DEFAULT NULL,
  `notes` varchar(250) DEFAULT NULL,
  `tax` DECIMAL(10,2)  DEFAULT NULL,
  `tip` DECIMAL(10,2) DEFAULT NULL,
  `discount_percent` int(3) DEFAULT NULL,
  `discount_fixed` DECIMAL(10,2) DEFAULT NULL,
  `balance` DECIMAL(10,2) DEFAULT NULL,
  `coupon_code` VARCHAR(10) DEFAULT NULL,
  `all_ready` tinyint(1) DEFAULT NULL,
  `all_pickedup` tinyint(1) DEFAULT NULL,
  `delivery_pickup_id` varchar(250) NULL,
  `delivery_dropoff_id` varchar(250) NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `{{store_id}}_order_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `order_id` varchar(250) NOT NULL,
  `isbn` varchar(250) NULL,
  `type` varchar(100) NULL,
  `name` varchar(100) NULL,
  `quantity` int(5) DEFAULT NULL,
  `price` DECIMAL(10,2)  DEFAULT NULL,
  `notes` varchar(500) NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `{{store_id}}_order_tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `order_id` varchar(250) NOT NULL,
  `tag_number` int(10) NULL,
  `is_rack` int(1) NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `{{store_id}}_order_charges` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `order_id` varchar(250) NOT NULL,
  `amount` DECIMAL(10,2)  NULL,
  `charge_type` varchar(30) NULL,
  `charge_id` varchar(250) DEFAULT NULL,
  `card_id` varchar(250) DEFAULT NULL,
  `date_cash` datetime DEFAULT NULL,
  `refund_id` varchar(250) DEFAULT NULL,
  `amount_refunded` DECIMAL(10,2) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `{{store_id}}_deliveries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `customer_id` varchar(250) NOT NULL,
  `is_pickup` tinyint(1) NULL,
  `delivery_time` datetime NULL,
  `delivery_person` varchar(100) DEFAULT NULL,
  `is_confirmed` tinyint(1) DEFAULT NULL,
  `is_canceled` tinyint(1) DEFAULT NULL,
  `express_id` varchar(250) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

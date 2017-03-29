USE `pouch`;

DROP DATABASE `pouch`;
CREATE DATABASE `pouch`;

USE `pouch`;

CREATE TABLE `etl_customers` (
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
  `is_doorman` tinyint(1) DEFAULT NULL,
  `delivery_notes` varchar(254) DEFAULT NULL,
  `cleaning_notes` varchar(254) DEFAULT NULL,
  `payment_customer_token` varchar(250) DEFAULT NULL,
  `payment_customer_id` varchar(250) DEFAULT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`),
   UNIQUE KEY `mobile_UNIQUE` (`mobile`)
);

CREATE TABLE `etl_customer_cards` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `customer_id` varchar(250) NOT NULL,
  `card_id` varchar(250) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `last4` varchar(4) NOT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`)
);


CREATE TABLE `etl_orders` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `customer_id` varchar(250) NOT NULL,
  `readable_id` varchar(250) NOT NULL,
  `due_datetime` datetime DEFAULT NULL,
  `rack` varchar(20) DEFAULT NULL,
  `notes` varchar(250) DEFAULT NULL,
  `tax` DECIMAL(10,2)  DEFAULT NULL,
  `tip` DECIMAL(10,2) DEFAULT NULL,
  `discount_percent` int(3) DEFAULT NULL,
  `discount_fixed` DECIMAL(10,2) DEFAULT NULL,
  `balance` DECIMAL(10,2) DEFAULT NULL,
  `all_ready` tinyint(1) DEFAULT NULL,
  `all_pickedup` tinyint(1) DEFAULT NULL,
  `delivery_pickup_id` varchar(250) NOT NULL,
  `delivery_dropoff_id` varchar(250) NOT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`)
);


CREATE TABLE `etl_order_items` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `order_id` varchar(250) NOT NULL,
  `item_id` varchar(250) NOT NULL,
  `name` varchar(100) NOT NULL,
  `total_price` DECIMAL(10,2)  DEFAULT NULL,
  `quantity` int(5) DEFAULT NULL,
  `notes` varchar(250) DEFAULT NULL,
  `separate` tinyint(1) DEFAULT NULL,
  `wash` tinyint(1) DEFAULT NULL,
  `dry` tinyint(1) DEFAULT NULL,
  `detergent` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `pattern` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `fabric` varchar(100) DEFAULT NULL,
  `alteration_type` varchar(100) DEFAULT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`)
);


CREATE TABLE `etl_order_tags` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `order_id` varchar(250) NOT NULL,
  `tag_number` int(10) NOT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`)
);


CREATE TABLE `etl_order_charges` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `order_id` varchar(250) NOT NULL,
  `amount` DECIMAL(10,2)  NOT NULL,
  `charge_type` varchar(30) NOT NULL,
  `charge_id` varchar(250) DEFAULT NULL,
  `card_id` varchar(250) DEFAULT NULL,
  `date_cash` datetime DEFAULT NULL,
  `refund_id` varchar(250) DEFAULT NULL,
  `amount_refunded` DECIMAL(10,2) DEFAULT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`)
);


CREATE TABLE `etl_deliveries` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `customer_id` varchar(250) NOT NULL,
  `is_pickup` tinyint(1) NOT NULL,
  `delivery_time` datetime NOT NULL,
  `delivery_person` varchar(100) DEFAULT NULL,
  `is_confirmed` tinyint(1) DEFAULT NULL,
  `is_canceled` tinyint(1) DEFAULT NULL,
  `express_id` varchar(250) DEFAULT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`)
);
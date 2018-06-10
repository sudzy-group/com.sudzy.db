DROP TABLE IF EXISTS `{{store_id}}_customers`;
CREATE TABLE `{{store_id}}_customers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `mobile` varchar(15) NULL,
  `allow_notifications` tinyint(1) DEFAULT NULL,
  `formatted_mobile` varchar(20) NULL,
  `name` varchar(100) DEFAULT NULL,
  `capital_name` varchar(100) DEFAULT NULL,
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

DROP TABLE IF EXISTS `{{store_id}}_customer_cards`;
CREATE TABLE `{{store_id}}_customer_cards` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
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

DROP TABLE IF EXISTS `{{store_id}}_customer_credits`;
CREATE TABLE `{{store_id}}_customer_credits` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `customer_id` varchar(36) NOT NULL,
  `original` INT NOT NULL,
  `balance` INT DEFAULT 0,
  `employee_id` varchar(10) NOT NULL,
  `reason` INT NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `payment_method` varchar(50) NULL,
  `payment_id` varchar(50) NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_orders`;
CREATE TABLE `{{store_id}}_orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `customer_id` varchar(250) NOT NULL,
  `readable_id` varchar(12) NULL,
  `due_datetime` varchar(12) NULL,
  `rack` varchar(20) DEFAULT NULL,
  `notes` varchar(250) DEFAULT NULL,
  `tax` DECIMAL(10,2)  DEFAULT NULL,
  `tip` DECIMAL(10,2) DEFAULT NULL,
  `discount_fixed` DECIMAL(10,2) DEFAULT NULL,
  `discount_id` INT DEFAULT NULL,
  `balance` DECIMAL(10,2) DEFAULT NULL,
  `all_ready` tinyint(1) DEFAULT NULL,
  `all_pickedup` tinyint(1) DEFAULT NULL,
  `delivery_pickup_id` varchar(250) NULL,
  `delivery_dropoff_id` varchar(250) NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_order_items`;
CREATE TABLE `{{store_id}}_order_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `order_id` varchar(250) NOT NULL,
  `isbn` varchar(250) NULL,
  `type` varchar(100) NULL,
  `name` varchar(100) NULL,
  `quantity` int(5) DEFAULT NULL,
  `price` DECIMAL(10,2)  DEFAULT NULL,
  `notes` varchar(500) NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_order_tags`;
CREATE TABLE `{{store_id}}_order_tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `order_id` varchar(250) NOT NULL,
  `tag_number` int(10) NULL,
  `is_rack` int(1) NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_order_charges`;
CREATE TABLE `{{store_id}}_order_charges` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `order_id` varchar(250) NOT NULL,
  `amount` DECIMAL(10,2)  NULL,
  `charge_type` varchar(30) NULL,
  `charge_id` varchar(250) DEFAULT NULL,
  `card_id` varchar(250) DEFAULT NULL,
  `date_cash` INT DEFAULT NULL,
  `refund_id` varchar(250) DEFAULT NULL,
  `amount_refunded` DECIMAL(10,2) DEFAULT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_deliveries`;
CREATE TABLE `{{store_id}}_deliveries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `customer_id` varchar(250) NOT NULL,
  `is_pickup` tinyint(1) NULL,
  `delivery_time` BIGINT NULL,
  `delivery_person` varchar(100) DEFAULT NULL,
  `is_confirmed` tinyint(1) DEFAULT NULL,
  `is_canceled` tinyint(1) DEFAULT NULL,
  `express_id` varchar(250) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_timesheets`;
CREATE TABLE `{{store_id}}_timesheets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `employee_id` varchar(100) NOT NULL,
  `is_clockin` tinyint(1) NULL,
  `event_time` BIGINT NULL,
  `comment` varchar(200) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_timelines`;
CREATE TABLE `{{store_id}}_timelines` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `employee_id` varchar(100) NOT NULL,
  `order_id` varchar(250) NOT NULL,
  `operation` varchar(30) NULL,
  `text` varchar(500) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_products`;
CREATE TABLE `{{store_id}}_products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `price` DECIMAL(10,2) DEFAULT NULL,
  `goods_in_stock` int(3) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_purchases`;
CREATE TABLE `{{store_id}}_purchases` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `readable_id` varchar(15)  NULL,
  `total_price` DECIMAL(10,2)  NULL,
  `tax` DECIMAL(10,2) NULL,
  `payment_type` varchar(15)  NULL,
  `payment_id` varchar(100)  NULL,
  `refund_id` varchar(100)  NULL,
  `product_ids` VARCHAR(2000)  NULL,
  `number_of_items` int(3)  NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_customer_coupons`;
CREATE TABLE `{{store_id}}_customer_coupons` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `customer_id` varchar(36)  NULL,
  `order_id` varchar(36)  NULL,
  `coupon_id` INT  NULL,
   PRIMARY KEY (`id`)
);

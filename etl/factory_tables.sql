DROP TABLE IF EXISTS `{{store_id}}_tasks`;
CREATE TABLE `{{store_id}}_tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `shift_id` BIGINT NOT NULL,
  `employee_id` varchar(30) NOT NULL,
  `readable_id` varchar(15) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_group` varchar(100)  DEFAULT NULL,
  `completed_at` BIGINT DEFAULT NULL,
  `duration` BIGINT DEFAULT NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{{store_id}}_task_datas`;
CREATE TABLE `{{store_id}}_task_datas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_id` varchar(36) NOT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `task_id` varchar(36) NOT NULL,
  `field_id` INT NOT NULL,
  `value` varchar(50) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

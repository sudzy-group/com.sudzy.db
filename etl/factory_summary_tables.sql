########################
# Tasks
########################
DROP TABLE IF EXISTS `{{store_id}}_tasks_summary`;

CREATE TABLE `{{store_id}}_tasks_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shift_id` BIGINT NOT NULL,
  `employee_id` varchar(30) NOT NULL,
  `shift_count` INT NOT NULL,
  `total_duration` INT NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{{store_id}}_tasks_summary` (shift_id, employee_id, shift_count, total_duration)
SELECT shift_id, employee_id, count(shift_id) as shift_count, SUM(duration) as total_duration FROM `{{store_id}}_tasks` group by shift_id,employee_id;

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

########################
# Timesheets
########################
INSERT INTO `{{store_id}}_timesheets_summary` (employee_id, day, min, max, list, count)
SELECT MIN(employee_id) employee_id, DATE(CONVERT_TZ(FROM_UNIXTIME(MIN(event_time)/1000),'+00:00','-05:00')) as day, MIN(event_time) as min, MAX(event_time) as max, GROUP_CONCAT(event_time) as list, COUNT(event_time) as count from `{{store_id}}_factory_timesheets` GROUP BY DATE(CONVERT_TZ(FROM_UNIXTIME(event_time/1000),'+00:00','-05:00')), employee_id;

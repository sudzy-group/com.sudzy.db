import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a Time sheet event
 */
export class Timesheet extends Entity {
	
	@EntityField({
        group: "default",
        name: "employee_id",
        mandatory: true,
        description: "Employee ID",
        search_by: [ identity ] 
    })
    public employee_id: string;

    @EntityField({
        group: "default",
        name: "is_clockin",
        mandatory: true,
        description: "Is clock in",
    })
    public is_clockin: boolean;

    @EntityField({
        group: "default",
        name: "event_time",
        description: "Time of the event",
        search_by: [ identity ] 
    })
    public event_time: string;

    @EntityField({
        group: "comment",
        name: "comment",
        description: "Optional comment"
    })
    public comment: string;
	
}
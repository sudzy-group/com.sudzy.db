import { Entity, EntityField } from "pouchable";
import { identity } from "lodash";

/**
 * Represent a task entity
 */
export class Task extends Entity {
	
	@EntityField({
		group: "default",
		mandatory: true,
		name: "shift_id",
		search_by: [identity],
		description: "This task's shift id"
	})
	public shift_id: string;	

	@EntityField({
		group: "default",
		mandatory: true,
		name: "employee_id",
		description: "Employee id"
	})
	public employee_id: number;

	@EntityField({
		group: "base",
		name: "readable_id",
		description: "Task readable id"
	})
	public readable_id: string;

	@EntityField({
		group: "base",
		name: "customer_name",
		description: "Customer name"
	})
	public customer_name: string;

	@EntityField({
		group: "base",
		name: "group",
		description: "Group name"
	})
	public group: string;

	@EntityField({
		group: "time",
		name: "completed_at",
		description: "The time this task has been marked as done"
	})
	public completed_at: number;

	@EntityField({
		group: "time",
		name: "duration",
		description: "The time duration this task has been taken to process"
	})
	public duration: number;
}

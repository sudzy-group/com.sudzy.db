import { Entity, EntityField } from "pouchable";
import { identity } from "lodash";

/**
 * Represent a task data entity
 */
export class TaskData extends Entity {
  
	@EntityField({
		group: "default",
		mandatory: true,
		name: "task_id",
		search_by: [identity],
		description: "Task id"
	})
	public task_id: string;

	@EntityField({
		group: "default",
		mandatory: true,
		name: "field_id",
		description: "Task Field id"
	})
	public field_id: string;


	@EntityField({
		group: "value",
		name: "value",
		description: "The data value"
	})
	public value: any;

}

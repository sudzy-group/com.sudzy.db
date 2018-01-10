import { Collection } from "pouchable";
import { TaskData } from "../entities/TaskData";

/**
 * Represents the Task collection
 */
export class TaskDatas extends Collection<TaskData> {
  
	public getPrefix() {
		return "tdata";
	}

	public findByTaskId(taskId: string, options?): Promise<TaskData[]> {
		return this.find("task_id", taskId, options);
	}
}

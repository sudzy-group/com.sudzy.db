import { Collection } from "pouchable";
import { Task } from "../entities/Task";

/**
 * Represents the Task collection
 */
export class Tasks extends Collection<Task> {
    
	public getPrefix() {
		return "task";
	}

	public findByShiftIt(shiftId: string, options?): Promise<Task[]> {
		return this.find("shift_id", shiftId, options);
	}
}

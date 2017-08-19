import { Collection } from "pouchable";
import { Timesheet } from "../entities/Timesheet";

/**
 * Represents the Timesheets collection
 */
export class Timesheets extends Collection<Timesheet> {

    public getPrefix() {
        return "ts";
    }

}

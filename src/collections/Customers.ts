import { Collection } from "pouchable";
import { Customer } from "../entities/Customer";

/**
 * Represents the Customers collection
 */
export class Customers extends Collection<Customer> {

    public constructor(db, ctor) {
        super(db, ctor);
    }

    public getPrefix() {
        return "customer";
    }

}

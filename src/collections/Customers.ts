import { Collection } from "pouchable";
import { Customer } from "../entities/Customer";

/**
 * Represents the Customers collection
 */
export class Customers extends Collection<Customer> {

    public getPrefix() {
        return "customer";
    }

}

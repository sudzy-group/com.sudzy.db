import { Collection } from "pouchable";
import { Customer } from "../entities/Customer";
import * as metaphone from 'metaphone';

/**
 * Represents the Customers collection
 */
export class Customers extends Collection<Customer> {

    public getPrefix() {
        return "customer";
    }

    public findByName(name: string, options?) : Promise<Customer[]> {
        return this.find('name', metaphone(name), options);
    }

}

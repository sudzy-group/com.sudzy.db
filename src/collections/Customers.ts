import { Collection } from "pouchable";
import { Customer } from "../entities/Customer";
import * as metaphone from 'metaphone';
import { Promise } from 'ts-promise';

/**
 * Represents the Customers collection
 */
export class Customers extends Collection<Customer> {

    public insert(data)  {
        data.allow_notifications = data.allow_notifications || true;
        return super.insert(data);
    }

    public getPrefix() {
        return "customer";
    }

    public findByName(name: string, options?) : Promise<Customer[]> {
        return this.find('name', metaphone(name), options);
    }

}

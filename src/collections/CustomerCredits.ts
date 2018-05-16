import { Collection } from "pouchable";
import { CustomerCredit } from "../entities/CustomerCredit";
import { Promise } from 'ts-promise';

/**
 * Represents the Customer Credits collection
 */
export class CustomerCredits extends Collection<CustomerCredit> {

    public getPrefix() {
        return "credit";
    }

    public getCredits(customerId: string, limit?) {
        return this.find('customer_id', customerId, { limit: limit || 5, descending: true });
    }
}

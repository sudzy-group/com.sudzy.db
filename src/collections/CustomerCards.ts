import { Collection } from "pouchable";
import { CustomerCard } from "../entities/CustomerCard";

/**
 * Represents the CustomerCards collection
 */
export class CustomerCards extends Collection<CustomerCard> {

    public getPrefix() {
        return "customer-card";
    }

}

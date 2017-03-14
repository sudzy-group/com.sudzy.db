import { Collection } from "pouchable";
import { Delivery } from "../entities/Delivery";

/**
 * Represents the Deliveries collection
 */
export class Deliveries extends Collection<Delivery> {

    public getPrefix() {
        return "delivery";
    }

}

import { Collection } from "pouchable";
import { Order } from "../entities/Order";

/**
 * Represents the Orders collection
 */
export class Orders extends Collection<Order> {

    public getPrefix() {
        return "order";
    }

}

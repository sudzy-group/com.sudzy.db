import { Collection } from "pouchable";
import { OrderItem } from "../entities/OrderItem";

/**
 * Represents the OrderItems collection
 */
export class OrderItems extends Collection<OrderItem> {

    public getPrefix() {
        return "order-item";
    }

}

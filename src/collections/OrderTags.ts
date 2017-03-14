import { Collection } from "pouchable";
import { OrderTag } from "../entities/OrderTag";

/**
 * Represents the OrderTags collection
 */
export class OrderTags extends Collection<OrderTag> {

    public getPrefix() {
        return "order-tag";
    }

}

import { Collection } from "pouchable";
import { OrderCharge } from "../entities/OrderCharge";

/**
 * Represents the OrderCharges collection
 */
export class OrderCharges extends Collection<OrderCharge> {

    public getPrefix() {
        return "order-charge";
    }

}

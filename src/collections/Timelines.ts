import { Collection } from "pouchable";
import { Timeline } from '../entities/Timeline';

/**
 * Represents the Timeline collection
 */
export class Timelines extends Collection<Timeline> {

    public getPrefix() {
        return "tl";
    }

    public findByOrderId(orderId: string, options?) : Promise<Timeline[]> {
        return this.find('order_id', orderId, options);
    }
    
}

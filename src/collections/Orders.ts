import { Collection } from "pouchable";
import { Order } from "../entities/Order";
import Promise from 'ts-promise';
import { map, sum } from 'lodash';

/**
 * Represents the Orders collection
 */
export class Orders extends Collection<Order> {

    public getPrefix() {
        return "order";
    }

    /**
     * Get summary of all unsubmitted payments 
     */
    public getUnsubmittedPayments() {
        return new Promise((resolved, rejected) => {
            this.findIds('balance', '', {startsWith : true}).then((items) => {
                let vs = map(items, (i) => parseFloat(i.value));
                let s = sum(vs);
                return resolved({ sum: s, ids: map(items, 'id') });
            }).catch((m)=> rejected(m));
        })
    }

}

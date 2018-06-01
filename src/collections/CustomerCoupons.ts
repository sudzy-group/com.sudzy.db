import { Collection } from "pouchable";
import { CustomerCoupon } from "../entities/CustomerCoupon";
import { Promise } from 'ts-promise';
import { find } from 'lodash';

/**
 * Represents the CustomerCoupons collection
 */
export class CustomerCoupons extends Collection<CustomerCoupon> {

    public getPrefix() {
        return "coupon";
    }

    public getCoupons(customerId: string) {
        return this.find('customer_id', customerId);
    }

    public getCouponUsed(customerId: string, couponId : number): Promise<any> {
        let t = this;
        return new Promise((resolve, reject) => {
            t.getCoupons(customerId).then((ccs) => {
                let used = find(ccs, ['coupon_id', couponId])
                resolve(used);
            }).catch(reject);
        })
    }

}

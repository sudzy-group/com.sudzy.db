import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';
/**
 * Represent a used coupon by Customer
 */
export class CustomerCoupon extends Entity {

	@EntityField({
        group: "default",
        name: "customer_id",
        mandatory: true,
        description: "Customer id",
        search_by: [ identity ] 
    })
    public customer_id: string;

    @EntityField({
        group: "default",
        name: "coupon_id",
        mandatory: true,
        description: "Coupon id used in this order"
    })
    public coupon_id: number; 

	@EntityField({
        group: "default",
        name: "order_id",
        mandatory: true,
        description: "Order id using the coupon"
    })
    public order_id: string;
}
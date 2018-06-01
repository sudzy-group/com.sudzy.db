import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';
import { amount0OrGreater } from '../validators/amount0OrGreater';
import { noWhitespace } from '../validators/noWhitespace';
import { lengthGreater1 } from "../validators/lengthGreater1";
/**
 * Represent a Order entity
 */
export class Order extends Entity {
	
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
        name: "readable_id",
        mandatory: true,
        validate: noWhitespace,
        description: "Human readable id",
        search_by: [ identity ] 
    })
    public readable_id: string;

    @EntityField({
        group: "due",
        name: "due_datetime",
        description: "Date order due",
        search_by: [ identity ] 
    })
    public due_datetime: string;

    @EntityField({
        group: "rack",
        name: "rack",
        description: "Rack number"
    })
    public rack: string;

    @EntityField({
        group: "notes",
        name: "notes",
        description: "Order notes"
    })
    public notes: string;

    @EntityField({
        group: "payment",
        name: "tax",
        description: "Tax"
    })
    public tax: number;

    @EntityField({
        group: "payment",
        name: "tip",
        description: "Tip"
    })
    public tip: number;

    @EntityField({
        group: "payment",
        name: "discount_fixed",
        description: "Discount in dollar amount"
    })
    public discount_fixed: number;

    @EntityField({
        group: "payment",
        name: "discount_id",
        description: "Discount id applied"
    })
    public discount_id: number;

    @EntityField({
        group: "paid_in",
        name: "paid_in",
        description: "Indicates the order id of the paid order"
    })
    public paid_in: string;    

    @EntityField({
        group: "balance",
        name: "balance",
        description: "Balance remaining",
        validate: amount0OrGreater,
        search_by: [ "existingBalance" ]
    })
    public balance: number;

    @EntityField({
        group: "status",
        name: "all_ready",
        description: "Whether order is ready"
    })
    public all_ready: boolean;

    @EntityField({
        group: "status",
        name: "all_pickedup",
        description: "Whether order is back with customer"
    })
    public all_pickedup: boolean;

    @EntityField({
        group: "cp",
        name: "checkpoint",
        description: "Free text checkpoint",
        search_by: [ identity ] 
    })
    public checkpoint: string;

    @EntityField({
        group: "delivery",
        name: "delivery_pickup_id",
        validate: noWhitespace,
        description: "Delivery pickup id"
    })
    public delivery_pickup_id: string;

    @EntityField({
        group: "delivery",
        name: "delivery_dropoff_id",
        validate: noWhitespace,
        description: "Delivery dropoff id"
    })
    public delivery_dropoff_id: string;

    @EntityField({
        group: "wholesale",
        name: "original_id",
        description: "Original ticket id for wholesale order",
        search_by: [ identity ] 
    })
    public original_id: string;

    protected existingBalance(balance) {
        if (balance > 0) {
            return balance;
        } else {
            return undefined;
        }
    }
	
}
import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

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
        description: "Human readable id",
        search_by: [ identity ] 
    })
    public readable_id: string;

    @EntityField({
        group: "due",
        name: "due_datetime",
        description: "Date order due"
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
        name: "discount_percent",
        description: "Discount percent"
    })
    public discount_percent: number;

    @EntityField({
        group: "payment",
        name: "discount_fixed",
        description: "Discount in dollar amount"
    })
    public discount_fixed: number;

    @EntityField({
        group: "balance",
        name: "balance",
        description: "Balance remaining",
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
        group: "delivery",
        name: "delivery_pickup_id",
        description: "Delivery pickup id"
    })
    public delivery_pickup_id: string;

    @EntityField({
        group: "delivery",
        name: "delivery_dropoff_id",
        description: "Delivery dropoff id"
    })
    public delivery_dropoff_id: string;

    protected existingBalance(balance) {
        if (balance > 0) {
            return balance;
        } else {
            return undefined;
        }
    }
	
}
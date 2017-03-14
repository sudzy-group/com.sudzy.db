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
        name: "order_id",
        mandatory: true,
        description: "Order id",
        search_by: [ identity ] 
    })
    public order_id: string;

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
    public tax: string;

    @EntityField({
        group: "payment",
        name: "tip",
        description: "Tip"
    })
    public tip: string;

    @EntityField({
        group: "payment",
        name: "discount_percent",
        description: "Discount percent"
    })
    public discount_percent: string;

    @EntityField({
        group: "payment",
        name: "discount_fixed",
        description: "Discount in dollar amount"
    })
    public discount_fixed: string;

    @EntityField({
        group: "balance",
        name: "balance",
        description: "Balance remaining"
    })
    public balance: string;

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
	
}
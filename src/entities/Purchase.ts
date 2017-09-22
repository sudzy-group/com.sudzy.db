import { Entity, EntityField } from "pouchable";
import { identity } from "lodash";

/**
 * Represent a product entity
 */
export class Purchase extends Entity { 

    @EntityField({
        group: "default",
        mandatory: true,
        name: "readable_id",
        description: "Payment's readable id"
    })
    public readable_id: string;

    @EntityField({
        group: "default",
        mandatory: true,
        name: "product_ids",
        description: "List of products purchased"
    })
    public product_ids: string[];

    @EntityField({
        group: "default",
        mandatory: true,
        name: "total_price",
        description: "Purchase total price"
    })
    public total_price: number;

    @EntityField({
        group: "default",
        mandatory: true,
        name: "tax",
        description: "Purchase tax"
    })
    public tax: number;

    @EntityField({
        group: "default",
        mandatory: true,
        name: "payment_type",
        description: "Payment's type (cash or card)"
    })
    public payment_type: string;

    @EntityField({
        group: "default",
        mandatory: true,
        name: "payment_id",
        search_by: [identity],
        description: "Payment's id"
    })
    public payment_id: string;

    @EntityField({
        group: "refund",
        name: "refund_id",
        description: "Refund's id"
    })
    public refund_id: string;
}

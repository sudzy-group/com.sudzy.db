import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';
import { noWhitespace } from '../validators/noWhitespace';
/**
 * Represent a OrderCharge entity
 */
export class OrderCharge extends Entity {

    @EntityField({
        group: "default",
        name: "order_id",
        mandatory: true,
        description: "Order id",
        search_by: [identity]
    })
    public order_id: string;


    @EntityField({
        group: "default",
        name: "amount",
        mandatory: true,
        description: "Amount charged"
    })
    public amount: number;

    @EntityField({
        group: "default",
        name: "charge_type",
        mandatory: true,
        description: "Charge type of cash, credit, other"
    })
    public charge_type: string;

    @EntityField({
        group: "card",
        name: "charge_id",
        validate: noWhitespace,
        description: "Charge id"
    })
    public charge_id: string;

    @EntityField({
        group: "card",
        name: "card_id",
        validate: noWhitespace,
        description: "Card id"
    })
    public card_id: string;


    @EntityField({
        group: "cash",
        name: "date_cash",
        search_by: [identity],
        description: "date of cash receieved"
    })
    public date_cash: string;

    @EntityField({
        group: "refund",
        name: "refund_id",
        description: "Refund id"
    })
    public refund_id: string;

    @EntityField({
        group: "refund",
        name: "amount_refunded",
        description: "Amount refunded"
    })
    public amount_refunded: number;

    @EntityField({
        group: "parent",
        name: "parent_id",
        description: "The parent payment of this payment",
        search_by: [identity]       
    })
    public parent_id: string;   
}
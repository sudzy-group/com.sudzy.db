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
        search_by: [ identity ] 
    })
    public order_id: string;

    @EntityField({
        group: "default",
        name: "card_id",
        mandatory: true,
        validate: noWhitespace,
        description: "Card id"
    })
    public card_id: string;

    @EntityField({
        group: "default",
        name: "amount",
        mandatory: true,
        description: "Amount charged"
    })
    public amount: number;

    @EntityField({
        group: "default",
        name: "charge_id",
        mandatory: true,
        validate: noWhitespace,
        description: "Charge id"
    })
    public charge_id: string;

    @EntityField({
        group: "default",
        name: "charge_type",
        description: "Charge type of cash, credit, other"
    })
    public charge_type: string;

    @EntityField({
        group: "default",
        name: "date_cash",
        description: "Get all cash deposited today in drawer if cash"
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
}
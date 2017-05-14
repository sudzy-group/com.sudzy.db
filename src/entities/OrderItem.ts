import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';
import { noWhitespace } from '../validators/noWhitespace';
import { amount0OrGreater } from '../validators/amount0OrGreater';

/**
 * Represent a OrderItem entity
 */
export class OrderItem extends Entity {
	
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
        name: "isbn",
        mandatory: true,
        validate: noWhitespace,
        description: "isbn" 
    })
    public isbn: string;

    @EntityField({
        group: "default",
        name: "type",
        mandatory: true,
        description: "type" 
    })
    public type: string;    

    @EntityField({
        group: "default",
        name: "name",
        mandatory: true,
        description: "Item name" 
    })
    public name: string;

    @EntityField({
        group: "pricing",
        name: "quantity",
        validate: amount0OrGreater,
        description: "Quantity of item" 
    })
    public quantity: number;

    @EntityField({
        group: "pricing",
        name: "price",
        description: "Total price" 
    })
    public price: number;

    @EntityField({
        group: "notes",
        name: "notes",
        description: "Specific notes about this item" 
    })
    public notes: string[];
}
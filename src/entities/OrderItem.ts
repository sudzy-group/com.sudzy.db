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
        group: "pricing",
        name: "is_manual_pricing",
        description: "User selected manual pricing" 
    })
    public is_manual_pricing: boolean;

    @EntityField({
        group: "notes",
        name: "notes",
        description: "Specific notes about this item" 
    })
    public notes: string[];

    @EntityField({
        group: "status",
        name: "ready",
        description: "Specific ready status about this item" 
    })
    public ready: boolean;

    @EntityField({
        group: "status",
        name: "pickedup",
        description: "Specific pickedup status about this item" 
    })
    public pickedup: boolean;

    @EntityField({
        group: "extra",
        name: "extra",
        description: "extra description and upcharges for item" 
    })
    public extra: any[];

    @EntityField({
        group: "manual_name",
        name: "manual_name",
        description: "Item manual name" 
    })
    public manual_name: string;
    
}
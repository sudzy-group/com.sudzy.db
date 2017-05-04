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
        group: "description",
        name: "separate",
        description: "Separate whites from colors" 
    })
    public separate: boolean;

    @EntityField({
        group: "description",
        name: "detergent",
        description: "Detergent" 
    })
    public detergent: string;

    @EntityField({
        group: "description",
        name: "preferred_wash",
        description: "Preferred wash method" 
    })
    public preferred_wash: string;    

   @EntityField({
        group: "description",
        name: "preferred_dry",
        description: "Preferred dry method" 
    })
    public preferred_dry: string;      

    @EntityField({
        group: "description",
        name: "color",
        description: "Color" 
    })
    public color: string;

    @EntityField({
        group: "description",
        name: "pattern",
        description: "Pattern" 
    })
    public pattern: string;

    @EntityField({
        group: "description",
        name: "brand",
        description: "Brand" 
    })
    public brand: string;

    @EntityField({
        group: "description",
        name: "fabric",
        description: "Fabric" 
    })
    public fabric: string;
}
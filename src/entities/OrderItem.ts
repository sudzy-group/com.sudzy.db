import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

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
        name: "item_id",
        mandatory: true,
        description: "Item id" 
    })
    public item_id: string;

    @EntityField({
        group: "pricing",
        name: "total_price",
        description: "Total price" 
    })
    public total_price: number;

    @EntityField({
        group: "pricing",
        name: "quantity",
        description: "Quantity of item" 
    })
    public quantity: number;

    @EntityField({
        group: "notes",
        name: "notes",
        description: "Order notes" 
    })
    public notes: string;

    @EntityField({
        group: "description",
        name: "separate",
        description: "Separate whites from colors" 
    })
    public separate: boolean;

    @EntityField({
        group: "description",
        name: "wash",
        description: "Whether washfold" 
    })
    public wash: boolean;

    @EntityField({
        group: "description",
        name: "dry",
        description: "Whether drycleaning" 
    })
    public dry: boolean;

    @EntityField({
        group: "description",
        name: "detergent",
        description: "Detergent" 
    })
    public detergent: string;

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

    @EntityField({
        group: "description",
        name: "alteration_type",
        description: "Alteration type" 
    })
    public alteration_type: string;
}
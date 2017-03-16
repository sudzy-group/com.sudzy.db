import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a OrderTag entity
 */
export class OrderTag extends Entity {
	@EntityField({
        group: "default",
        name: "order_id",
        description: "Order id",
        search_by: [ identity ] 
    })
    public order_id: string;

    @EntityField({
        group: "default",
        name: "tag_number",
        description: "Tag number" 
    })
    public tag_number: number;
	
}
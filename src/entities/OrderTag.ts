import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a OrderTag entity
 */
export class OrderTag extends Entity {
	@EntityField({
        group: "default",
        mandatory: true,
        name: "order_id",
        description: "Order id",
        search_by: [ identity ] 
    })
    public order_id: string;

    @EntityField({
        group: "default",
        mandatory: true,
        name: "tag_number",
        description: "Tag number",
        search_by: [ identity ] 
    })
    public tag_number: string;

    @EntityField({
        group: "rack",
        name: "is_rack",
        description: "True if this tag holds the rack of the items" 
    })
    public is_rack: string;
}
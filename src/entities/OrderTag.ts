import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a OrderTag entity
 */
export class OrderTag extends Entity {
	@EntityField({
        group: "default",
        name: "test",
        mandatory: true,
        description: "test"
    })
    public test: string;
	
}
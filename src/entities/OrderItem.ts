import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a OrderItem entity
 */
export class OrderItem extends Entity {
	@EntityField({
        group: "default",
        name: "test",
        mandatory: true,
        description: "test"
    })
    public test: string;
	
}
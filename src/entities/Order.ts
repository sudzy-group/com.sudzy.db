import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a Order entity
 */
export class Order extends Entity {
	@EntityField({
        group: "default",
        name: "test",
        mandatory: true,
        description: "test"
    })
    public test: string;
	
}
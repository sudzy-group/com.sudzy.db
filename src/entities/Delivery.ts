import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a Delivery entity
 */
export class Delivery extends Entity {
	@EntityField({
        group: "default",
        name: "test",
        mandatory: true,
        description: "test"
    })
    public test: string;
	
}
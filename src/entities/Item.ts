import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a Item entity
 */
export class Item extends Entity {
	@EntityField({
        group: "default",
        name: "test",
        mandatory: true,
        description: "test"
    })
    public test: string;
	
}
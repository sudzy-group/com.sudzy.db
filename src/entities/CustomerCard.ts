import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a CustomerCard entity
 */
export class CustomerCard extends Entity {
	@EntityField({
        group: "default",
        name: "card_id",
        mandatory: true,
        description: "Card id"
    })
    public card_id: string;

}
import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';
import { cardDigits } from "../validators/last4";

/**
 * Represent a CustomerCard entity
 */
export class CustomerCard extends Entity {

	@EntityField({
        group: "default",
        name: "customer_id",
        mandatory: true,
        description: "Customer id",
        search_by: [ identity ] 
    })
    public customer_id: string;

	@EntityField({
        group: "default",
        name: "card_id",
        mandatory: true,
        description: "Card id"
    })
    public card_id: string;

    @EntityField({
        group: "default",
        name: "brand",
        mandatory: true,
        description: "Card brand"
    })
    public brand: string;

    @EntityField({
        group: "default",
        name: "last4",
        validate: cardDigits,
        mandatory: true,
        description: "Last 4 digits of card"
    })
    public last4: string;

    @EntityField({
        group: "settings",
        name: "is_default",
        description: "Whether card is default"
    })
    public is_default: boolean;

}
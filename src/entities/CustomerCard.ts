import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';
import { fourDigitsLong } from "../validators/fourDigitsLong";
import { twoDigitsLong } from "../validators/twoDigitsLong";
import { lengthGreater1 } from "../validators/lengthGreater1";
import { noWhitespace } from '../validators/noWhitespace';
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
        validate: noWhitespace,
        description: "Card id"
    })
    public card_id: string;

    @EntityField({
        group: "default",
        name: "brand",
        mandatory: true,
        validate: lengthGreater1,
        description: "Card brand"
    })
    public brand: string;

    @EntityField({
        group: "default",
        name: "last4",
        validate: fourDigitsLong,
        mandatory: true,
        description: "Last 4 digits of card"
    })
    public last4: string;

    @EntityField({
        group: "default",
        name: "exp_month",
        validate: twoDigitsLong,
        description: "Expiration month"
    })
    public exp_month: string;    

    @EntityField({
        group: "default",
        name: "exp_year",
        validate: twoDigitsLong,
        description: "Expiration year"
    })
    public exp_year: string;    

    @EntityField({
        group: "settings",
        name: "is_default",
        description: "Whether card is default"
    })
    public is_default: boolean;

    @EntityField({
        group: "settings",
        name: "is_forgotten",
        description: "Whether card is hidden"
    })
    public is_forgotten: boolean;    

}
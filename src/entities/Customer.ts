import { Entity, EntityField } from "pouchable";
import { mobile } from "../validators/mobile";

/**
 * Represent a customer entity
 */
export class Customer extends Entity {

    @EntityField({
        group: "default",
        name: "mobile",
        validate: mobile,
    })
    public mobile: string;

}

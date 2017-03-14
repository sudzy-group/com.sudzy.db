import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';

/**
 * Represent a Delivery entity
 */
export class Delivery extends Entity {
	
	@EntityField({
        group: "default",
        name: "customer_id",
        mandatory: true,
        description: "Customer id"
    })
    public customer_id: string;

    @EntityField({
        group: "default",
        name: "is_pickup",
        mandatory: true,
        description: "Whether delivery is pickup",
        search_by: [ "bool" ] 
    })
    public is_pickup: boolean;

    @EntityField({
        group: "time",
        name: "delivery_time",
        mandatory: true,
        description: "Delivery time"
    })
    public delivery_time: string;

    @EntityField({
        group: "person",
        name: "delivery_person",
        description: "Delivery person"
    })
    public delivery_person: string;

    @EntityField({
        group: "status",
        name: "is_confirmed",
        description: "Whether store confirmed delivery"
    })
    public is_confirmed: boolean;

    @EntityField({
        group: "express",
        name: "express_id",
        description: "Express id"
    })
    public express_id: string;

    protected bool(is_pickup) {
        //TODO boolean function
        return true;
    }
}
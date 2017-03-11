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
        description: "Customer's mobile phone"
    })
    public mobile: string;

    @EntityField({
        group: "address",
        name: "autocomplete",
        description: "Full address as captured by Google Places API"
    })
    public autocomplete: string;
    
    @EntityField({
        group: "address",
        name: "street_num",
        description: "Street number"
    })
    public street_num: string;

    @EntityField({
        group: "address",
        name: "street_route",
        description: "Street name"
    })
    public street_route: string;

    @EntityField({
        group: "address",
        name: "apartment",
        description: "Apartment"
    })
    public apartment: string;

    @EntityField({
        group: "address",
        name: "city",
        description: "City"
    })
    public city: string;

    @EntityField({
        group: "address",
        name: "state",
        description: "State"
    })
    public state: string;

    @EntityField({
        group: "address",
        name: "zip",
        description: "Zip code"
    })
    public zip: string;

    @EntityField({
        group: "address",
        name: "lat",
        description: "Latitude"
    })
    public lat: string;

    @EntityField({
        group: "address",
        name: "lng",
        description: "Longtitude"
    })
    public lng: string;

}

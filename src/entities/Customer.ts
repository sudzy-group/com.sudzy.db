import { Entity, EntityField } from "pouchable";
import { mobile } from "../validators/mobile";
import { identity } from 'lodash';

/**
 * Represent a customer entity
 */
export class Customer extends Entity {

    @EntityField({
        group: "name",
        name: "name",
        mandatory: true,
        description: "Customer's name",
        search_by: [ "metaphone", identity ] 
    })
    public name: string;

    @EntityField({
        group: "default",
        name: "mobile",
        validate: mobile,
        mandatory: true,
        description: "Customer's mobile phone",
        search_by: [ "last4", identity ] 
    })
    public mobile: string;

    @EntityField({
        group: "email",
        name: "email",
        description: "Customer's email"
    })
    public email: string;

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

    @EntityField({
        group: "address",
        name: "is_doorman",
        description: "Whether building has doorman"
    })
    public is_doorman: boolean;

    @EntityField({
        group: "address",
        name: "delivery_notes",
        description: "Delivery Notes"
    })
    public delivery_notes: string;

    @EntityField({
        group: "notes",
        name: "cleaning_notes",
        description: "Cleaning Notes"
    })
    public cleaning_notes: string;

    @EntityField({
        group: "payment",
        name: "payment_token",
        description: "Payment token"
    })
    public payment_token: string;


    protected metaphone(name) {
        //TODO metaphone function
        return true;
    }

    protected last4(mobile) {
        return mobile.substr(-4);
    }
}

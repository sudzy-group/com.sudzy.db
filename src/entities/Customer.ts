import { Entity, EntityField } from "pouchable";
import { mobile } from "../validators/mobile";
import { lengthGreater1 } from "../validators/lengthGreater1";
import { email } from "../validators/email";
import { autocomplete } from '../validators/autocomplete';
import { zip } from '../validators/zip';
import { latitude } from '../validators/latitude';
import { longitude } from '../validators/longitude';
import { noWhitespace } from '../validators/noWhitespace';
import { identity } from 'lodash';
import * as metaphone from 'metaphone';

/**
 * Represent a customer entity
 */
export class Customer extends Entity {
    
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
        group: "name",
        name: "name",
        description: "Customer's name",
        validate: lengthGreater1,
        search_by: [ metaphone, identity ] 
    })
    public name: string;

    @EntityField({
        group: "email",
        name: "email",
        validate: email,
        description: "Customer's email"
    })
    public email: string;

    @EntityField({
        group: "address",
        name: "autocomplete",
        validate: autocomplete,
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
        validate: zip,
        description: "Zip code"
    })
    public zip: string;

    @EntityField({
        group: "address",
        name: "lat",
        validate: latitude,
        description: "Latitude"
    })
    public lat: string;

    @EntityField({
        group: "address",
        name: "lng",
        validate: longitude,
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
        name: "payment_customer_token",
        description: "Payment customer token",
        validate: noWhitespace
    })
    public payment_customer_token: string;

    @EntityField({
        group: "payment",
        name: "payment_customer_id",
        validate: noWhitespace,
        description: "Payment customer id"
    })
    public payment_customer_id: string;

    protected last4(mobile) {
        return mobile.substr(-4);
    }
}

import { Entity, EntityField } from "pouchable";
import { mobile } from "../validators/mobile";
import { lengthGreater1 } from "../validators/lengthGreater1";
import { email } from "../validators/email";
import { zip } from '../validators/zip';
import { latitude } from '../validators/latitude';
import { longitude } from '../validators/longitude';
import { noWhitespace } from '../validators/noWhitespace';
import { identity, toLower, trim } from 'lodash';
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
        group: "default",
        name: "allow_notifications",
        mandatory: true,
        description: "Customer's consent to get email / sms  notifications"
    })
    public allow_notifications: string;

    @EntityField({
        group: "formatted",
        name: "formatted_mobile",
        description: "Customer's mobile phone (formatted)"
    })
    public formatted_mobile: string;    

    @EntityField({
        group: "extra",
        name: "extra_mobile",
        description: "Customer's extra mobile phone",
        search_by: [ "last4", identity ]        
    })
    public extra_mobile: string;    

    @EntityField({
        group: "extra",
        name: "is_extra_default",
        description: "Customer's extra mobile is default"
    })
    public is_extra_default: boolean;

    @EntityField({
        group: "name",
        name: "name",
        description: "Customer's name",
        validate: lengthGreater1,
        search_by: [ metaphone, identity, 'lastName' ] 
    })
    public name: string;

    @EntityField({
        group: "email",
        name: "email",
        validate: email,
        search_by: toLower,
        description: "Customer's email"
    })
    public email: string;

    @EntityField({
        group: "pricing_group",
        name: "pricing_group",
        description: "Customer's pricing_group"
    })
    public pricing_group: string;

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
        validate: lengthGreater1,
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
        name: "payment_customer_id",
        validate: noWhitespace,
        description: "Payment customer id"
    })
    public payment_customer_id: string;

    @EntityField({
        group: "route",
        name: "route_id",
        search_by: [ identity ],
        description: "Route id of the customer"
    })
    public route_id: string;

    protected last4(mobile) {
        return mobile.substr(-4);
    }

    public lastName(name) {
        name = trim(name);
        let index = name.indexOf(' ');
        if (index == -1) {
            return null;
        }
        index++;
        let lastIndex = name.indexOf(' ', index);
        let last = lastIndex == -1 ? name.substr(index) : name.substr(index, lastIndex - index);
        return metaphone(last);
    }

}

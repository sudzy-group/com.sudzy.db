"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var pouchable_1 = require("pouchable");
var mobile_1 = require("../validators/mobile");
var lengthGreater1_1 = require("../validators/lengthGreater1");
var email_1 = require("../validators/email");
var autocomplete_1 = require("../validators/autocomplete");
var zip_1 = require("../validators/zip");
var latitude_1 = require("../validators/latitude");
var longitude_1 = require("../validators/longitude");
var noWhitespace_1 = require("../validators/noWhitespace");
var lodash_1 = require("lodash");
var metaphone = require("metaphone");
/**
 * Represent a customer entity
 */
var Customer = (function (_super) {
    __extends(Customer, _super);
    function Customer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Customer.prototype.last4 = function (mobile) {
        return mobile.substr(-4);
    };
    return Customer;
}(pouchable_1.Entity));
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "mobile",
        validate: mobile_1.mobile,
        mandatory: true,
        description: "Customer's mobile phone",
        search_by: ["last4", lodash_1.identity]
    })
], Customer.prototype, "mobile");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "allow_notifications",
        mandatory: true,
        description: "Customer's consent to get email / sms  notifications"
    })
], Customer.prototype, "allow_notifications");
__decorate([
    pouchable_1.EntityField({
        group: "formatted",
        name: "formatted_mobile",
        description: "Customer's mobile phone (formatted)"
    })
], Customer.prototype, "formatted_mobile");
__decorate([
    pouchable_1.EntityField({
        group: "name",
        name: "name",
        description: "Customer's name",
        validate: lengthGreater1_1.lengthGreater1,
        search_by: [metaphone, lodash_1.identity]
    })
], Customer.prototype, "name");
__decorate([
    pouchable_1.EntityField({
        group: "email",
        name: "email",
        validate: email_1.email,
        description: "Customer's email"
    })
], Customer.prototype, "email");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "autocomplete",
        validate: autocomplete_1.autocomplete,
        description: "Full address as captured by Google Places API"
    })
], Customer.prototype, "autocomplete");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "street_num",
        description: "Street number"
    })
], Customer.prototype, "street_num");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "street_route",
        validate: lengthGreater1_1.lengthGreater1,
        description: "Street name"
    })
], Customer.prototype, "street_route");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "apartment",
        description: "Apartment"
    })
], Customer.prototype, "apartment");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "city",
        validate: lengthGreater1_1.lengthGreater1,
        description: "City"
    })
], Customer.prototype, "city");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "state",
        validate: lengthGreater1_1.lengthGreater1,
        description: "State"
    })
], Customer.prototype, "state");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "zip",
        validate: zip_1.zip,
        description: "Zip code"
    })
], Customer.prototype, "zip");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "lat",
        validate: latitude_1.latitude,
        description: "Latitude"
    })
], Customer.prototype, "lat");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "lng",
        validate: longitude_1.longitude,
        description: "Longtitude"
    })
], Customer.prototype, "lng");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "is_doorman",
        description: "Whether building has doorman"
    })
], Customer.prototype, "is_doorman");
__decorate([
    pouchable_1.EntityField({
        group: "address",
        name: "delivery_notes",
        description: "Delivery Notes"
    })
], Customer.prototype, "delivery_notes");
__decorate([
    pouchable_1.EntityField({
        group: "notes",
        name: "cleaning_notes",
        description: "Cleaning Notes"
    })
], Customer.prototype, "cleaning_notes");
__decorate([
    pouchable_1.EntityField({
        group: "payment",
        name: "payment_customer_id",
        validate: noWhitespace_1.noWhitespace,
        description: "Payment customer id"
    })
], Customer.prototype, "payment_customer_id");
exports.Customer = Customer;

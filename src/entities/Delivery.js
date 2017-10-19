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
var lodash_1 = require("lodash");
var lengthGreater1_1 = require("../validators/lengthGreater1");
var noWhitespace_1 = require("../validators/noWhitespace");
/**
 * Represent a Delivery entity
 */
var Delivery = (function (_super) {
    __extends(Delivery, _super);
    function Delivery() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Delivery;
}(pouchable_1.Entity));
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "customer_id",
        mandatory: true,
        description: "Customer id"
    })
], Delivery.prototype, "customer_id");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "is_pickup",
        mandatory: true,
        description: "Whether delivery is pickup"
    })
], Delivery.prototype, "is_pickup");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "delivery_time",
        mandatory: true,
        description: "Delivery time",
        search_by: [lodash_1.identity]
    })
], Delivery.prototype, "delivery_time");
__decorate([
    pouchable_1.EntityField({
        group: "person",
        name: "delivery_person",
        validate: lengthGreater1_1.lengthGreater1,
        description: "Delivery person"
    })
], Delivery.prototype, "delivery_person");
__decorate([
    pouchable_1.EntityField({
        group: "notes",
        name: "delivery_notes",
        description: "Delivery notes"
    })
], Delivery.prototype, "delivery_notes");
__decorate([
    pouchable_1.EntityField({
        group: "status",
        name: "is_confirmed",
        search_by: [lodash_1.identity],
        description: "Whether store confirmed delivery"
    })
], Delivery.prototype, "is_confirmed");
__decorate([
    pouchable_1.EntityField({
        group: "status",
        name: "is_canceled",
        description: "Whether delivery is canceled"
    })
], Delivery.prototype, "is_canceled");
__decorate([
    pouchable_1.EntityField({
        group: "express",
        name: "express_id",
        validate: noWhitespace_1.noWhitespace,
        description: "Express id"
    })
], Delivery.prototype, "express_id");
exports.Delivery = Delivery;

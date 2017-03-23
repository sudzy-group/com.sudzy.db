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
var fourDigitsLong_1 = require("../validators/fourDigitsLong");
var lengthGreater1_1 = require("../validators/lengthGreater1");
var noWhitespace_1 = require("../validators/noWhitespace");
/**
 * Represent a CustomerCard entity
 */
var CustomerCard = (function (_super) {
    __extends(CustomerCard, _super);
    function CustomerCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CustomerCard;
}(pouchable_1.Entity));
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "customer_id",
        mandatory: true,
        description: "Customer id",
        search_by: [lodash_1.identity]
    })
], CustomerCard.prototype, "customer_id");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "card_id",
        mandatory: true,
        validate: noWhitespace_1.noWhitespace,
        description: "Card id"
    })
], CustomerCard.prototype, "card_id");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "brand",
        mandatory: true,
        validate: lengthGreater1_1.lengthGreater1,
        description: "Card brand"
    })
], CustomerCard.prototype, "brand");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "last4",
        validate: fourDigitsLong_1.fourDigitsLong,
        mandatory: true,
        description: "Last 4 digits of card"
    })
], CustomerCard.prototype, "last4");
__decorate([
    pouchable_1.EntityField({
        group: "settings",
        name: "is_default",
        description: "Whether card is default"
    })
], CustomerCard.prototype, "is_default");
exports.CustomerCard = CustomerCard;

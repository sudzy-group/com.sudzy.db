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
var amount0OrGreater_1 = require("../validators/amount0OrGreater");
var noWhitespace_1 = require("../validators/noWhitespace");
/**
 * Represent a Order entity
 */
var Order = (function (_super) {
    __extends(Order, _super);
    function Order() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Order.prototype.existingBalance = function (balance) {
        if (balance > 0) {
            return balance;
        }
        else {
            return undefined;
        }
    };
    return Order;
}(pouchable_1.Entity));
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "customer_id",
        mandatory: true,
        description: "Customer id",
        search_by: [lodash_1.identity]
    })
], Order.prototype, "customer_id");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "readable_id",
        mandatory: true,
        validate: noWhitespace_1.noWhitespace,
        description: "Human readable id",
        search_by: [lodash_1.identity]
    })
], Order.prototype, "readable_id");
__decorate([
    pouchable_1.EntityField({
        group: "due",
        name: "due_datetime",
        description: "Date order due"
    })
], Order.prototype, "due_datetime");
__decorate([
    pouchable_1.EntityField({
        group: "rack",
        name: "rack",
        description: "Rack number"
    })
], Order.prototype, "rack");
__decorate([
    pouchable_1.EntityField({
        group: "notes",
        name: "notes",
        description: "Order notes"
    })
], Order.prototype, "notes");
__decorate([
    pouchable_1.EntityField({
        group: "payment",
        name: "tax",
        description: "Tax"
    })
], Order.prototype, "tax");
__decorate([
    pouchable_1.EntityField({
        group: "payment",
        name: "tip",
        description: "Tip"
    })
], Order.prototype, "tip");
__decorate([
    pouchable_1.EntityField({
        group: "payment",
        name: "discount_percent",
        description: "Discount percent"
    })
], Order.prototype, "discount_percent");
__decorate([
    pouchable_1.EntityField({
        group: "payment",
        name: "discount_fixed",
        description: "Discount in dollar amount"
    })
], Order.prototype, "discount_fixed");
__decorate([
    pouchable_1.EntityField({
        group: "balance",
        name: "balance",
        description: "Balance remaining",
        validate: amount0OrGreater_1.amount0OrGreater,
        search_by: ["existingBalance"]
    })
], Order.prototype, "balance");
__decorate([
    pouchable_1.EntityField({
        group: "status",
        name: "all_ready",
        description: "Whether order is ready"
    })
], Order.prototype, "all_ready");
__decorate([
    pouchable_1.EntityField({
        group: "status",
        name: "all_pickedup",
        description: "Whether order is back with customer"
    })
], Order.prototype, "all_pickedup");
__decorate([
    pouchable_1.EntityField({
        group: "delivery",
        name: "delivery_pickup_id",
        validate: noWhitespace_1.noWhitespace,
        description: "Delivery pickup id"
    })
], Order.prototype, "delivery_pickup_id");
__decorate([
    pouchable_1.EntityField({
        group: "delivery",
        name: "delivery_dropoff_id",
        validate: noWhitespace_1.noWhitespace,
        description: "Delivery dropoff id"
    })
], Order.prototype, "delivery_dropoff_id");
exports.Order = Order;

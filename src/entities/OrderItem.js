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
var noWhitespace_1 = require("../validators/noWhitespace");
var amount0OrGreater_1 = require("../validators/amount0OrGreater");
/**
 * Represent a OrderItem entity
 */
var OrderItem = (function (_super) {
    __extends(OrderItem, _super);
    function OrderItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OrderItem;
}(pouchable_1.Entity));
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "order_id",
        mandatory: true,
        description: "Order id",
        search_by: [lodash_1.identity]
    })
], OrderItem.prototype, "order_id");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "isbn",
        mandatory: true,
        validate: noWhitespace_1.noWhitespace,
        description: "isbn"
    })
], OrderItem.prototype, "isbn");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "type",
        mandatory: true,
        description: "type"
    })
], OrderItem.prototype, "type");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "name",
        mandatory: true,
        description: "Item name"
    })
], OrderItem.prototype, "name");
__decorate([
    pouchable_1.EntityField({
        group: "pricing",
        name: "quantity",
        validate: amount0OrGreater_1.amount0OrGreater,
        description: "Quantity of item"
    })
], OrderItem.prototype, "quantity");
__decorate([
    pouchable_1.EntityField({
        group: "pricing",
        name: "price",
        description: "Total price"
    })
], OrderItem.prototype, "price");
__decorate([
    pouchable_1.EntityField({
        group: "description",
        name: "separate",
        description: "Separate whites from colors"
    })
], OrderItem.prototype, "separate");
__decorate([
    pouchable_1.EntityField({
        group: "description",
        name: "detergent",
        description: "Detergent"
    })
], OrderItem.prototype, "detergent");
__decorate([
    pouchable_1.EntityField({
        group: "description",
        name: "preferred_wash",
        description: "Preferred wash method"
    })
], OrderItem.prototype, "preferred_wash");
__decorate([
    pouchable_1.EntityField({
        group: "description",
        name: "preferred_dry",
        description: "Preferred dry method"
    })
], OrderItem.prototype, "preferred_dry");
__decorate([
    pouchable_1.EntityField({
        group: "description",
        name: "color",
        description: "Color"
    })
], OrderItem.prototype, "color");
__decorate([
    pouchable_1.EntityField({
        group: "description",
        name: "pattern",
        description: "Pattern"
    })
], OrderItem.prototype, "pattern");
__decorate([
    pouchable_1.EntityField({
        group: "description",
        name: "brand",
        description: "Brand"
    })
], OrderItem.prototype, "brand");
__decorate([
    pouchable_1.EntityField({
        group: "description",
        name: "fabric",
        description: "Fabric"
    })
], OrderItem.prototype, "fabric");
exports.OrderItem = OrderItem;

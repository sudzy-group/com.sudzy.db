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
/**
 * Represent a OrderCharge entity
 */
var OrderCharge = (function (_super) {
    __extends(OrderCharge, _super);
    function OrderCharge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OrderCharge;
}(pouchable_1.Entity));
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "order_id",
        mandatory: true,
        description: "Order id",
        search_by: [lodash_1.identity]
    })
], OrderCharge.prototype, "order_id");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "amount",
        mandatory: true,
        description: "Amount charged"
    })
], OrderCharge.prototype, "amount");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "charge_type",
        description: "Charge type of cash, credit, other"
    })
], OrderCharge.prototype, "charge_type");
__decorate([
    pouchable_1.EntityField({
        group: "card",
        name: "charge_id",
        validate: noWhitespace_1.noWhitespace,
        description: "Charge id"
    })
], OrderCharge.prototype, "charge_id");
__decorate([
    pouchable_1.EntityField({
        group: "card",
        name: "card_id",
        validate: noWhitespace_1.noWhitespace,
        description: "Card id"
    })
], OrderCharge.prototype, "card_id");
__decorate([
    pouchable_1.EntityField({
        group: "cash",
        name: "date_cash",
        description: "Get all cash deposited today in drawer if cash"
    })
], OrderCharge.prototype, "date_cash");
__decorate([
    pouchable_1.EntityField({
        group: "refund",
        name: "refund_id",
        description: "Refund id"
    })
], OrderCharge.prototype, "refund_id");
__decorate([
    pouchable_1.EntityField({
        group: "refund",
        name: "amount_refunded",
        description: "Amount refunded"
    })
], OrderCharge.prototype, "amount_refunded");
exports.OrderCharge = OrderCharge;

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
exports.__esModule = true;
var pouchable_1 = require("pouchable");
/**
 * Represents the OrderCharges collection
 */
var OrderCharges = (function (_super) {
    __extends(OrderCharges, _super);
    function OrderCharges() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrderCharges.prototype.getPrefix = function () {
        return "order-charge";
    };
    return OrderCharges;
}(pouchable_1.Collection));
exports.OrderCharges = OrderCharges;

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
 * Represents the OrderTags collection
 */
var OrderTags = (function (_super) {
    __extends(OrderTags, _super);
    function OrderTags() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrderTags.prototype.getPrefix = function () {
        return "order-tag";
    };
    return OrderTags;
}(pouchable_1.Collection));
exports.OrderTags = OrderTags;

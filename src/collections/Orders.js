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
var ts_promise_1 = require("ts-promise");
var lodash_1 = require("lodash");
/**
 * Represents the Orders collection
 */
var Orders = (function (_super) {
    __extends(Orders, _super);
    function Orders() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Orders.prototype.getPrefix = function () {
        return "order";
    };
    /**
     * Get summary of all unsubmitted payments
     */
    Orders.prototype.getUnsubmittedPayments = function () {
        var _this = this;
        return new ts_promise_1["default"](function (resolved, rejected) {
            _this.findIds('balance', '', { startsWith: true }).then(function (items) {
                var vs = lodash_1.map(items, function (i) { return parseFloat(i.value); });
                var s = lodash_1.sum(vs);
                return resolved({ sum: s, ids: lodash_1.map(items, 'id') });
            })["catch"](function (m) { return rejected(m); });
        });
    };
    return Orders;
}(pouchable_1.Collection));
exports.Orders = Orders;

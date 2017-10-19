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
 * Represents the Deliveries collection
 */
var Deliveries = (function (_super) {
    __extends(Deliveries, _super);
    function Deliveries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Deliveries.prototype.getPrefix = function () {
        return "delivery";
    };
    return Deliveries;
}(pouchable_1.Collection));
exports.Deliveries = Deliveries;

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
var metaphone = require("metaphone");
/**
 * Represents the Customers collection
 */
var Customers = (function (_super) {
    __extends(Customers, _super);
    function Customers() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Customers.prototype.insert = function (data) {
        data.allow_notifications = data.allow_notifications || true;
        return _super.prototype.insert.call(this, data);
    };
    Customers.prototype.getPrefix = function () {
        return "customer";
    };
    Customers.prototype.findByName = function (name, options) {
        return this.find('name', metaphone(name), options);
    };
    return Customers;
}(pouchable_1.Collection));
exports.Customers = Customers;

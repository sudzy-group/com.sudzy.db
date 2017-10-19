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
/**
 * Represent a OrderTag entity
 */
var OrderTag = (function (_super) {
    __extends(OrderTag, _super);
    function OrderTag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OrderTag;
}(pouchable_1.Entity));
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "order_id",
        description: "Order id",
        search_by: [lodash_1.identity]
    })
], OrderTag.prototype, "order_id");
__decorate([
    pouchable_1.EntityField({
        group: "default",
        name: "tag_number",
        description: "Tag number"
    })
], OrderTag.prototype, "tag_number");
exports.OrderTag = OrderTag;

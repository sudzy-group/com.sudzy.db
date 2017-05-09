"use strict";
exports.__esModule = true;
function latitude(input) {
    return parseInt(input) >= -90 && parseInt(input) <= 90;
}
exports.latitude = latitude;

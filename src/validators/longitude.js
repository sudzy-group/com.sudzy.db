"use strict";
exports.__esModule = true;
function longitude(input) {
    return parseInt(input) >= -180 && parseInt(input) <= 180;
}
exports.longitude = longitude;

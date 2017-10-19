"use strict";
exports.__esModule = true;
function zip(input) {
    var zipRegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
    return zipRegex.test(input);
}
exports.zip = zip;

"use strict";
exports.__esModule = true;
function mobile(input) {
    var phoneRegex = /^[0-9]{9,14}$/;
    return phoneRegex.test(input);
}
exports.mobile = mobile;

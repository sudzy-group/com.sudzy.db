"use strict";
exports.__esModule = true;
function email(input) {
    var emailRegex = /^[A-Za-z0-9._]*\@[A-Za-z]*\.[A-Za-z]{2,5}$/;
    return emailRegex.test(input);
}
exports.email = email;

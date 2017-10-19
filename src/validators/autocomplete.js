"use strict";
exports.__esModule = true;
function autocomplete(input) {
    var autocompleteRegex = /^[0-9]/;
    return autocompleteRegex.test(input);
}
exports.autocomplete = autocomplete;
